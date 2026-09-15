FANTASY TRADE TOOLS — MONDAY NIGHT UPDATE

Upload every file in this folder to the root of the GitHub repository. When GitHub asks about duplicate filenames, replacing the existing versions is expected.

Updated values used consistently by all five tools:

Kenneth Walker III  94.8
Rashee Rice         85.0
Travis Kelce        67.5
Evan Engram         60.5
Jaylen Waddle       80.5
Courtland Sutton    69.0
J.K. Dobbins        67.0
RJ Harvey           67.5
Bo Nix              60.0 (unchanged at the one-QB replacement floor)

The ZIP contains the complete website, not merely the changed pages. Upload all eight HTML files plus new-tools-nav.js so every tool uses the same values and navigation remains consistent.

New tools included:

1. League Analyzer (league.html)
   - Overall power rankings for every imported team.
   - Separate starter, bench, depth, and positional scores.
   - Select a team to compare its QB, RB, WR, TE, FLEX, and individual starting slots against every league mate.
   - Explain strengths, weaknesses, surplus positions, and trade needs without exposing hidden player values.

2. Start/Sit Assistant (startsit.html)
   - Compare players using role, matchup, injuries, weather, recent usage, and a consensus projection.
   - Enter lines from five or more sportsbooks; it uses the median for each prop before matchup and role adjustments.
   - Automatically fills available NFL lines from the generated weekly-projections.json cache.
   - Manual entry remains available whenever a player or market is not posted.

SPORTSGAMEODDS AUTOMATIC UPDATE SETUP

The included .github/workflows/update-projections.yml keeps the API key inside GitHub Actions and publishes only non-secret consensus lines. It runs daily, with an extra refresh on Thursday, Sunday, and Monday, and can also be run manually.

After uploading every file (including the hidden .github folder):
1. Open the repository's Actions tab.
2. Select "Update sportsbook projections."
3. Click "Run workflow" and run it from main.
4. Wait for the green check. The workflow will update weekly-projections.json and GitHub Pages will redeploy automatically.

The secret must be named SPORTSGAMEODDS_API_KEY. Repository workflow permissions must allow read and write access. Never put the actual key in an HTML or JavaScript file.
