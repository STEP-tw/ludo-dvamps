#!/bin/bash
npm install
git config --local commit.template bin/commit.txt
cp bin/pre-commit.sh .git/hooks/pre-commit
cp bin/pre-push.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
