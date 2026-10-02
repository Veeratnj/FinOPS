#!/bin/bash
# ==============================================================================
# FinOPS EC2 Native Deployment Setup Script
# Architecture: 2 vCPU | 4 GB RAM | 8 GB Disk (No Docker, No Redis, Native PSQL)
# ==============================================================================

set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CURRENT_USER=$(whoami)

echo "=========================================================="
echo "🚀 Setting up FinOPS on EC2 natively at: $APP_DIR"
echo "👤 User: $CURRENT_USER"
echo "=========================================================="

# 1. Update OS and install minimal system dependencies
echo "📦 Updating packages and installing Python & Nginx..."
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv nginx curl git

# Clean apt cache immediately to save disk on 8GB root volume
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

# 2. Check that local PostgreSQL service is running
echo "🐘 Verifying PostgreSQL status..."
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL is active and running."
else
    echo "⚠️ PostgreSQL is installed but not running. Attempting to start it..."
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
fi

# 3. Setup Python Virtual Environment for Backend
echo "🐍 Setting up Backend virtual environment..."
cd "$APP_DIR/API"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install --upgrade pip --no-cache-dir
pip install --no-cache-dir -r requirements.txt

# Ensure .env exists in API directory
if [ ! -f ".env" ]; then
    if [ -f "$APP_DIR/.env" ]; then
        cp "$APP_DIR/.env" .env
    elif [ -f "$APP_DIR/.env.example" ]; then
        cp "$APP_DIR/.env.example" .env
    fi
    echo "ℹ️ Copied .env file. Please check database credentials in $APP_DIR/API/.env"
fi

# 4. Run database migrations or initial table creation
echo "🗄️ Initializing database tables..."
python3 -c "from app.models import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)" || echo "⚠️ Check PostgreSQL credentials if table creation failed."

# 5. Build Frontend (React / Vite)
echo "⚛️ Building Frontend assets..."
cd "$APP_DIR/App"

# Check if Node is installed, if not install Node 20 LTS via NodeSource
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Ensure .env exists in App directory
if [ ! -f ".env" ]; then
    if [ -f "$APP_DIR/App/.env.example" ]; then
        cp "$APP_DIR/App/.env.example" .env
    elif [ -f "$APP_DIR/.env" ]; then
        cp "$APP_DIR/.env" .env
    fi
fi

# Install dependencies and build
npm ci || npm install
npm run build

# Crucial for 8GB disk: Clean npm cache
npm cache clean --force

# 6. Configure Systemd Service
echo "⚙️ Configuring systemd service for FinOPS Backend..."
SERVICE_FILE="/etc/systemd/system/finops-backend.service"

sudo cp "$APP_DIR/deploy/finops-backend.service" "$SERVICE_FILE"
# Replace paths with current user and location
sudo sed -i "s|/home/ubuntu/FinOPS|$APP_DIR|g" "$SERVICE_FILE"
sudo sed -i "s|User=ubuntu|User=$CURRENT_USER|g" "$SERVICE_FILE"
sudo sed -i "s|Group=ubuntu|Group=$CURRENT_USER|g" "$SERVICE_FILE"

sudo systemctl daemon-reload
sudo systemctl enable finops-backend
sudo systemctl restart finops-backend

# 7. Configure Nginx
echo "🌐 Configuring Nginx reverse proxy..."
NGINX_CONF="/etc/nginx/sites-available/finops"
sudo cp "$APP_DIR/deploy/nginx-finops.conf" "$NGINX_CONF"
sudo sed -i "s|/home/ubuntu/FinOPS|$APP_DIR|g" "$NGINX_CONF"

# Enable site
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/finops
# Remove default nginx welcome page if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl restart nginx

echo "=========================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "Backend: systemctl status finops-backend"
echo "Nginx:   systemctl status nginx"
echo "Public:  Open http://<YOUR_EC2_PUBLIC_IP> in your browser"
echo "=========================================================="
