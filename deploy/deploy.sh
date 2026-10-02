#!/bin/bash
# ==============================================================================
# FinOPS EC2 Quick Update / Redeploy Script
# ==============================================================================

set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔄 Pulling latest code..."
cd "$APP_DIR"
git pull origin main || echo "Git pull skipped or working on local branch."

echo "🐍 Updating backend dependencies & applying database changes..."
cd "$APP_DIR/API"
source .venv/bin/activate
pip install --no-cache-dir -r requirements.txt
python3 -c "from app.models import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"

echo "⚛️ Rebuilding frontend..."
cd "$APP_DIR/App"
npm run build
npm cache clean --force

echo "🚀 Restarting backend service..."
sudo systemctl restart finops-backend
sudo systemctl reload nginx

echo "✅ App updated successfully!"
