FANTASY TRADE TOOLS — 2026 WEEK 3 SUNDAY UPDATE

Upload every file in this folder to the root of the GitHub repository. When GitHub asks about duplicate filenames, replacing the existing versions is expected.

This package starts with the complete 242-player Week 2 research update, then adjusts players from the 13 games that were officially final when the Sunday update was built. The active Denver–Los Angeles game and later games were excluded rather than using partial statistics.

The same-day adjustment compares PPR production and position-appropriate opportunities against each player's established tier. Movement is capped at 3.0 points because finalized snap and route participation data was not yet available.

The public tools continue to hide individual player values. The separate private files week2_player_value_research.html and week3_sunday_completed_games_audit.html are for the site owner's review only.

The ZIP contains the complete website, not merely the changed pages. Upload all eight HTML files plus new-tools-nav.js so every tool uses the same values and navigation remains consistent.

New tools included:

1. League Analyzer (league.html)
   - Overall power rankings for every imported team.
   - Separate starter, bench, depth, and positional scores.
   - Select a team to compare its QB, RB, WR, TE, FLEX, and individual starting slots against every league mate.
   - Explain strengths, weaknesses, surplus positions, and trade needs without exposing hidden player values.

2. Start/Sit Assistant (startsit.html)
   - Select both players from complete dropdown lists; manual line entry has been removed.
   - Compare players using role, matchup, and an automatic consensus projection.
   - Automatically fills available NFL lines from the generated weekly-projections.json cache.
   - The full player database remains automatically comparable when a sportsbook market is unavailable by using a clearly labeled internal position/tier estimate.
   - Each successful workflow run retains up to eight prior projection snapshots per player so the page can display projection history.
   - The updater now uses the provider's documented query-parameter authentication, paginates in Amateur-tier-sized batches, supports the current `receptions` market name, and converts available anytime-TD prices into a consensus probability.
   - Projection cleanup rejects games that have already started, de-duplicates paginated events, keeps only full-game over/under props, selects each book's main line instead of an alternate, and uses only 0.5 anytime-touchdown markets.
   - Player matching ignores punctuation and capitalization differences such as D'Andre/Dandre, J.K./Jk, and DeVonta/Devonta.

LATEST INTERFACE AND SCORING UPDATE

- League Analyzer scores now use 82% optimal-starter strength and 18% weighted usable bench depth. Scores span 55–100 instead of clustering in the 90s.
- Position-room rankings weight elite starters most heavily (RB/WR: 50%, 30%, 14%, 6%; QB/TE: 80%, 20%).
- FLEX slots are restricted to RB/WR/TE.
- Trade Analyzer can import a Sleeper league ID and uses roster checkboxes for both sides of a trade.
- Target Finder provides an exact rostered-player dropdown and a multi-select protected-player list.
- Trade Block Finder provides a multi-select protected-player list; checked trade-block players remain mandatory in every generated offer.

SPORTSGAMEODDS AUTOMATIC UPDATE SETUP

The included .github/workflows/update-projections.yml keeps the API key inside GitHub Actions and publishes only non-secret consensus lines. It runs daily, with an extra refresh on Thursday, Sunday, and Monday, and can also be run manually.

After uploading every file (including the hidden .github folder):
1. Open the repository's Actions tab.
2. Select "Update sportsbook projections."
3. Click "Run workflow" and run it from main.
4. Wait for the green check. The workflow will update weekly-projections.json and GitHub Pages will redeploy automatically.

The secret must be named SPORTSGAMEODDS_API_KEY. Repository workflow permissions must allow read and write access. Never put the actual key in an HTML or JavaScript file.

If the workflow reports a 403 error, SportsGameOdds says that means the key does not have permission for the requested data. Confirm that the repository secret contains the API key emailed for the active Amateur subscription—not a billing link, account password, or Stripe identifier. The updated workflow prints the provider's safe error message without exposing the key.
