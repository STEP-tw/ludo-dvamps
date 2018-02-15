#!/bin/bash
npm install
git config --local commit.template bin/commit.txt
cp bin/pre-push.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
