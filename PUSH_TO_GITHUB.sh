#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/Kherleefarh/MoonLord-Watch-Trade.git"
echo "This script will initialize git, add remote, and push to $REPO_URL"
read -p "Proceed? (y/N): " yn
if [ "$yn" != "y" ] && [ "$yn" != "Y" ]; then
  echo "Aborted."
  exit 1
fi

git init
git checkout -b main
git add .
git commit -m "Initial commit — MoonLord Watch Trade"
git remote add origin "$REPO_URL"

echo "Now pushing to GitHub (you may be prompted to authenticate)..."
git push -u origin main

echo "Done. If push failed, ensure the repo exists on GitHub and you have permission."
