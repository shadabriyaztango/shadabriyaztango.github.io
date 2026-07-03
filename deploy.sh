#!/usr/bin/env bash
#
# deploy.sh — push this portfolio to your GitHub Pages repo.
#
# HOW TO USE:
#   1. Unzip shadabriyaztango.github.io.zip
#   2. Put this file inside the unzipped folder (next to index.html)
#   3. In a terminal, from inside that folder, run:
#        bash deploy.sh
#
# Git will use whatever GitHub auth you already have set up (SSH key,
# credential manager, or a personal-access-token prompt). This script
# never sees or stores your credentials.

set -e

REPO_URL="https://github.com/shadabriyaztango/shadabriyaztango.github.io.git"
BRANCH="main"
MSG="Redesign: Always Exploring + PWA"

# Safety: make sure we're in the right folder
if [ ! -f "index.html" ]; then
  echo "❌ Run this from inside the unzipped folder (index.html not found here)."
  exit 1
fi

# Init repo if needed
if [ ! -d ".git" ]; then
  git init
  git remote add origin "$REPO_URL"
else
  git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"
fi

git checkout -B "$BRANCH"
git add -A
git commit -m "$MSG" || echo "Nothing new to commit."

echo ""
echo "About to push to: $REPO_URL ($BRANCH)"
echo "This overwrites the repo's $BRANCH with these files."
read -r -p "Continue? [y/N] " ok
case "$ok" in
  [yY]*) git push -u origin "$BRANCH" --force ;;
  *) echo "Aborted. Nothing was pushed."; exit 0 ;;
esac

echo ""
echo "✅ Pushed. Give GitHub Pages a minute, then open:"
echo "   https://shadabriyaztango.github.io"
echo "If Pages isn't on yet: repo Settings -> Pages -> Source: 'main' / root."
