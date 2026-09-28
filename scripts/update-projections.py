#!/usr/bin/env python3
"""Build a browser-safe NFL player-prop cache from SportsGameOdds."""
import json
import os
import statistics
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API_URL = "https://api.sportsgameodds.com/v2/events"
OUTPUT = Path(__file__).resolve().parents[1] / "weekly-projections.json"
STATS = {
    "passing_yards", "passing_touchdowns", "passing_interceptions",
    "rushing_yards", "rushing_touchdowns", "receiving_yards",
    "receptions", "receiving_receptions", "receiving_touchdowns", "touchdowns",
}

TOUCHDOWN_STATS = {"touchdowns", "rushing_touchdowns", "receiving_touchdowns"}

# Broad sanity limits. These do not choose the projection; they only prevent a
# different derivative market (longest reception, first-quarter yards, etc.)
# from being mistaken for a full-game player total when a provider labels it
# with the same stat ID.
LINE_RANGES = {
    "passing_yards": (75, 450),
    "passing_touchdowns": (0.5, 4.5),
    "passing_interceptions": (0.5, 3.5),
    "rushing_yards": (5, 250),
    "receiving_yards": (5, 250),
    "receptions": (0.5, 20),
    "receiving_receptions": (0.5, 20),
}

def player_name(player_id):
    parts = str(player_id).split("_")
    if len(parts) > 2 and parts[-2].isdigit():
        parts = parts[:-2]
    small = {"jr": "Jr.", "sr": "Sr.", "ii": "II", "iii": "III", "iv": "IV"}
    return " ".join(small.get(p.lower(), p.capitalize()) for p in parts)

def number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def american_probability(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    return 100 / (value + 100) if value > 0 else abs(value) / (abs(value) + 100)

def valid_line(stat, line):
    if stat in TOUCHDOWN_STATS:
        # Only 0.5 represents an anytime-TD market. Lines of 1.5/2.5 are
        # multi-touchdown long shots and cannot be used as anytime probability.
        return abs(line - 0.5) < 0.001
    low, high = LINE_RANGES.get(stat, (-float("inf"), float("inf")))
    return low <= line <= high

def price_score(value):
    """Prefer the standard/main line, whose price is normally nearest -110."""
    try:
        price = float(value)
    except (TypeError, ValueError):
        return float("inf")
    return abs(price + 110)

def parse_time(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None

def request_page(key, cursor=None):
    params = {
        "apiKey": key,
        "leagueID": "NFL",
        "oddsAvailable": "true",
        # The Amateur tier permits 10 requests/minute. A page size of 10 avoids
        # oversized responses while two pages cover a normal NFL slate.
        "limit": 10,
    }
    if cursor:
        params["cursor"] = cursor
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "fantasy-trade-tools/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")[:800]
        if exc.code == 403:
            raise RuntimeError(f"SportsGameOdds rejected this subscription (403). Verify that the emailed API key belongs to the active Amateur subscription. Provider response: {body}") from None
        raise RuntimeError(f"SportsGameOdds returned HTTP {exc.code}: {body}") from None

def main():
    key = (os.environ.get("SPORTSGAMEODDS_API_KEY") or "").strip()
    if not key:
        raise SystemExit("SPORTSGAMEODDS_API_KEY is missing")
    events_by_id, cursor, seen_cursors = {}, None, set()
    for _ in range(5):
        payload = request_page(key, cursor)
        page = payload.get("data") or []
        for event in page:
            event_id = event.get("eventID")
            if event_id:
                events_by_id[event_id] = event
        next_cursor = ((payload.get("meta") or {}).get("nextCursor") or payload.get("nextCursor"))
        if not next_cursor or next_cursor == cursor or next_cursor in seen_cursors:
            break
        seen_cursors.add(next_cursor)
        cursor = next_cursor
    events = list(events_by_id.values())
    players = {}
    eligible_event_count = 0
    now = datetime.now(timezone.utc)
    for event in events:
        status = event.get("status") or {}
        starts = status.get("startsAt")
        start_time = parse_time(starts)
        if status.get("started") or status.get("ended") or status.get("finalized"):
            continue
        if start_time and start_time <= now:
            continue
        eligible_event_count += 1
        teams = event.get("teams") or {}
        away = ((teams.get("away") or {}).get("names") or {}).get("short") or ((teams.get("away") or {}).get("names") or {}).get("long")
        home = ((teams.get("home") or {}).get("names") or {}).get("short") or ((teams.get("home") or {}).get("names") or {}).get("long")
        event_players = event.get("players") or {}
        for odd in (event.get("odds") or {}).values():
            entity = odd.get("statEntityID")
            stat = odd.get("statID")
            if not entity or entity in {"all", "home", "away"} or stat not in STATS:
                continue
            if odd.get("periodID") not in {None, "game"}:
                continue
            if odd.get("betTypeID") != "ou" or odd.get("sideID") != "over":
                continue
            player = event_players.get(entity) or {}
            names = player.get("names") or {}
            display_name = names.get("full") or names.get("long") or names.get("short") or player_name(entity)
            # Over and under entries repeat the same threshold; keep one line per book.
            record = players.setdefault(entity, {
                "name": display_name, "eventID": event.get("eventID"),
                "matchup": f"{away or 'Away'} @ {home or 'Home'}", "startsAt": starts,
                "markets": {},
            })
            market = record["markets"].setdefault(stat, {})
            for book, book_data in (odd.get("byBookmaker") or {}).items():
                if not book_data.get("available", True):
                    continue
                line = number(book_data.get("overUnder"))
                if line is None or not valid_line(stat, line):
                    continue
                candidate = {"line": line, "odds": book_data.get("odds")}
                # A provider can expose several same-stat derivatives. Retain
                # the conventional market closest to -110 instead of allowing
                # the final alternate in the response to overwrite it.
                current = market.get(book)
                if current is None or price_score(candidate["odds"]) < price_score(current.get("odds")):
                    market[book] = candidate
    previous_players = {}
    if OUTPUT.exists():
        try:
            previous_players = {
                player.get("name"): player for player in json.loads(OUTPUT.read_text(encoding="utf-8")).get("players", [])
                if player.get("name")
            }
        except (OSError, ValueError, TypeError):
            previous_players = {}
    generated_at = datetime.now(timezone.utc).isoformat()
    clean_players = []
    for record in players.values():
        markets = {}
        for stat, by_book in record.pop("markets").items():
            lines = [item["line"] for item in by_book.values()]
            if lines:
                markets[stat] = {
                    "median": statistics.median(lines), "mean": round(statistics.mean(lines), 2),
                    "min": min(lines), "max": max(lines), "bookCount": len(lines),
                    "books": [{"id": book, **item} for book, item in sorted(by_book.items())],
                }
                if stat in TOUCHDOWN_STATS:
                    probabilities = [american_probability(item.get("odds")) for item in by_book.values()]
                    probabilities = [value for value in probabilities if value is not None]
                    if probabilities:
                        markets[stat]["overProbability"] = round(statistics.median(probabilities) * 100, 1)
        if markets:
            record["markets"] = markets
            snapshot = {
                "generatedAt": generated_at,
                "matchup": record.get("matchup"),
                "markets": {
                    stat: {key: value for key, value in market.items() if key in {"median", "bookCount", "overProbability"}}
                    for stat, market in markets.items()
                },
            }
            old_history = (previous_players.get(record["name"]) or {}).get("history") or []
            record["history"] = (old_history + [snapshot])[-8:]
            clean_players.append(record)
    clean_players.sort(key=lambda item: item["name"])
    output = {
        "generatedAt": generated_at, "source": "SportsGameOdds",
        "league": "NFL", "eventCount": eligible_event_count, "playerCount": len(clean_players),
        "players": clean_players,
    }
    OUTPUT.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(clean_players)} players from {len(events)} NFL events to {OUTPUT}")
    if not events:
        print("No upcoming NFL events currently have odds; an empty valid cache was written.")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Projection update failed: {exc}", file=sys.stderr)
        raise
