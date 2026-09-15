#!/usr/bin/env python3
"""Build a browser-safe NFL player-prop cache from SportsGameOdds."""
import json
import os
import statistics
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API_URL = "https://api.sportsgameodds.com/v2/events"
OUTPUT = Path(__file__).resolve().parents[1] / "weekly-projections.json"
STATS = {
    "passing_yards", "passing_touchdowns", "passing_interceptions",
    "rushing_yards", "rushing_touchdowns", "receiving_yards",
    "receiving_receptions", "receiving_touchdowns", "touchdowns",
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

def main():
    key = os.environ.get("SPORTSGAMEODDS_API_KEY")
    if not key:
        raise SystemExit("SPORTSGAMEODDS_API_KEY is missing")
    query = urllib.parse.urlencode({
        "leagueID": "NFL", "finalized": "false",
        "oddsAvailable": "true", "limit": 50,
    })
    request = urllib.request.Request(f"{API_URL}?{query}", headers={"x-api-key": key})
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.load(response)
    events = payload.get("data") or []
    players = {}
    for event in events:
        teams = event.get("teams") or {}
        away = ((teams.get("away") or {}).get("names") or {}).get("short") or ((teams.get("away") or {}).get("names") or {}).get("long")
        home = ((teams.get("home") or {}).get("names") or {}).get("short") or ((teams.get("home") or {}).get("names") or {}).get("long")
        starts = (event.get("status") or {}).get("startsAt")
        for odd in (event.get("odds") or {}).values():
            entity = odd.get("statEntityID")
            stat = odd.get("statID")
            if not entity or entity in {"all", "home", "away"} or stat not in STATS:
                continue
            if odd.get("betTypeID") not in {None, "ou"}:
                continue
            # Over and under entries repeat the same threshold; keep one line per book.
            record = players.setdefault(entity, {
                "name": player_name(entity), "eventID": event.get("eventID"),
                "matchup": f"{away or 'Away'} @ {home or 'Home'}", "startsAt": starts,
                "markets": {},
            })
            market = record["markets"].setdefault(stat, {})
            for book, book_data in (odd.get("byBookmaker") or {}).items():
                if not book_data.get("available", True):
                    continue
                line = number(book_data.get("overUnder"))
                if line is not None:
                    market[book] = line
    clean_players = []
    for record in players.values():
        markets = {}
        for stat, by_book in record.pop("markets").items():
            lines = list(by_book.values())
            if lines:
                markets[stat] = {
                    "median": statistics.median(lines), "mean": round(statistics.mean(lines), 2),
                    "min": min(lines), "max": max(lines), "bookCount": len(lines),
                    "books": [{"id": book, "line": line} for book, line in sorted(by_book.items())],
                }
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
