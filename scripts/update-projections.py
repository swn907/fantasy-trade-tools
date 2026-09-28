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
    events, cursor = [], None
    for _ in range(5):
        payload = request_page(key, cursor)
        events.extend(payload.get("data") or [])
        cursor = ((payload.get("meta") or {}).get("nextCursor") or payload.get("nextCursor"))
        if not cursor:
            break
    players = {}
    for event in events:
        teams = event.get("teams") or {}
        away = ((teams.get("away") or {}).get("names") or {}).get("short") or ((teams.get("away") or {}).get("names") or {}).get("long")
        home = ((teams.get("home") or {}).get("names") or {}).get("short") or ((teams.get("home") or {}).get("names") or {}).get("long")
        starts = (event.get("status") or {}).get("startsAt")
        event_players = event.get("players") or {}
        for odd in (event.get("odds") or {}).values():
            entity = odd.get("statEntityID")
            stat = odd.get("statID")
            if not entity or entity in {"all", "home", "away"} or stat not in STATS:
                continue
            if odd.get("betTypeID") not in {None, "ou"} or odd.get("sideID") not in {None, "over"}:
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
                if line is not None:
                    market[book] = {"line": line, "odds": book_data.get("odds")}
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
                if stat in {"touchdowns", "rushing_touchdowns", "receiving_touchdowns"}:
                    probabilities = [american_probability(item.get("odds")) for item in by_book.values()]
                    probabilities = [value for value in probabilities if value is not None]
                    if probabilities:
                        markets[stat]["overProbability"] = round(statistics.median(probabilities) * 100, 1)
        if markets:
            record["markets"] = markets
            clean_players.append(record)
    clean_players.sort(key=lambda item: item["name"])
    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(), "source": "SportsGameOdds",
        "league": "NFL", "eventCount": len(events), "playerCount": len(clean_players),
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
