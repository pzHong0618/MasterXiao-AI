#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-}"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-master-xiao-ai}"

if [[ -z "$DEPLOY_PATH" ]]; then
  echo "DEPLOY_PATH is required"
  exit 1
fi

cd "$DEPLOY_PATH"

echo "==> Pull latest code"
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Install dependencies"
npm install

echo "==> Build frontend"
npm run build

echo "==> Restart pm2"
if pm2 list | grep -q "$PM2_APP_NAME"; then
  pm2 reload "$PM2_APP_NAME" --update-env
else
  NODE_ENV=production pm2 start server/index.js --name "$PM2_APP_NAME"
fi

pm2 save
echo "==> Deploy done"
