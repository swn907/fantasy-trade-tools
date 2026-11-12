FANTASY TRADE TOOLS — FULL PROJECT REFRESH

Prepared November 12, 2026.

HOW TO INSTALL

1. Open the fantasy-trade-tools repository on GitHub.
2. Choose Add file → Upload files.
3. Drag every file and folder from the PUBLIC download into the repository root.
4. Replace files with matching names.
5. Commit directly to main.
6. Wait for the GitHub Pages deployment to finish, then hard-refresh the website.

WHAT CHANGED

- Reorganized the home page into Trade Lab, Team Management, and Weekly Decisions.
- Added visible ratings and sportsbook-feed freshness indicators across the site.
- Fixed the Trade Generator JavaScript crash that stopped its team selectors from loading.
- Removed the obsolete Monday value override so the November 11 board is the only final rating layer.
- Made Start / Sit reject sportsbook data older than 72 hours instead of presenting it as current.
- Preserved the old Week 7 streamer research as a clearly labeled archive and stopped it from mixing with props from another week.
- Standardized every tool switcher so all nine destinations are available from each supported page.
- Added keyboard skip navigation, visible focus indicators, larger tap targets, programmatic form labels, and live status announcements.
- Remembered the Sleeper league ID locally in the visitor's own browser so it does not need to be retyped on every tool.
- Replaced the browser's mismatched native select styling with one consistent dark control style.
- Reduced the automated projection workflow from ten scheduled runs per week to four targeted lineup windows, which lowers API usage by 60%.
- Added an eight-minute workflow timeout so a GitHub runner outage does not sit open indefinitely.

DATA-SAFETY RULES

- Player ratings: November 11, 2026; 354 QB/RB/WR/TE players.
- Sportsbook feed: considered current for 72 hours.
- If the feed is old or unavailable, Start / Sit uses the player-value model and says so clearly.
- A failed provider response never overwrites the last usable weekly-projections.json file.
- Streamer recommendations are time-sensitive. This package intentionally labels the October 18 Week 7 model as an archive until a new weekly research dataset is built.
- The SportsGameOdds secret stays in GitHub Actions. It is never included in the website files.
- Sleeper league IDs are stored only in local browser storage and are sent only to Sleeper during import.

SPORTSBOOK WORKFLOW SCHEDULE

- Sunday morning: two refreshes before the main slate.
- Monday: one refresh before Monday Night Football.
- Thursday: one refresh before Thursday Night Football.
- A manual Run workflow button remains available at any time.

OWNER FILES

The PUBLIC ZIP intentionally excludes the private rating research JSON. Keep owner-only rankings and audit files outside the GitHub repository.
