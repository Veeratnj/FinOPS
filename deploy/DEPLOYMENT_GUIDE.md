# FinOPS EC2 Native Deployment Guide (No Docker, No Redis)

## 🏗️ Architecture Design (Optimized for 2 vCPU / 4 GB RAM / 8 GB Disk)

| Component | Technology | Memory Footprint | Disk Footprint |
| :--- | :--- | :--- | :--- |
| **Reverse Proxy & Web Server** | Nginx | ~15 MB RAM | ~10 MB |
| **Backend API** | FastAPI + Gunicorn (2 workers) + systemd | ~100 MB RAM | ~350 MB (venv) |
| **Frontend UI** | Static React build (`App/dist`) served via Nginx | 0 MB process (served by Nginx) | ~20 MB |
| **Database** | PostgreSQL (native local service on port 5432) | ~80 MB RAM | ~50 MB initial |
| **Total System Utilization** | **Native Linux Services** | **< 300 MB / 4 GB RAM (8% usage)** | **< 500 MB / 8 GB Disk** |

---

## ⚡ Why This Redesign is Best for Your 8 GB Disk / 4 GB RAM EC2

1. **Massive Disk Space Savings (8 GB ROM is tight):**
   - Docker base images (Ubuntu, Node, Python, Postgres, Redis) consume **4–6 GB of disk space**, which would fill an 8 GB EBS volume to 90%+ capacity and trigger `No space left on device` crashes.
   - Native deployment with Python venv and Nginx static serving consumes **< 500 MB**, leaving ~4-5 GB free for PostgreSQL database growth and OS updates.
2. **PostgreSQL handles everything:**
   - PostgreSQL is already running locally inside the EC2 instance.
   - Redis was removed because the application logic does not actively use it; all user, tenant, metrics, and anomaly data are persisted directly in PostgreSQL via SQLAlchemy.
3. **High Performance & Stability:**
   - 2 Gunicorn Uvicorn workers perfectly match your 2 vCPU cores.
   - Nginx handles TLS/SSL, caching, gzip compression, and forwards `/api/`, `/dashboard/`, `/metrics/` requests directly to FastAPI.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Prepare PostgreSQL Database on EC2
Make sure PostgreSQL is running and create the database for the app:
```bash
sudo -u postgres psql
```
Inside the `psql` console, run:
```sql
CREATE DATABASE finops_v2;
CREATE USER finops WITH ENCRYPTED PASSWORD 'finops';
GRANT ALL PRIVILEGES ON DATABASE finops_v2 TO finops;
\q
```

---

### Step 2: Clone or Copy Repository to EC2
Place the project in `/home/ubuntu/FinOPS` (or your user's home directory):
```bash
cd /home/ubuntu
git clone <YOUR_GIT_REPO_URL> FinOPS
cd FinOPS
```

---

### Step 3: Configure Environment Variables
Create or verify `API/.env`:
```bash
cp .env.example API/.env
nano API/.env
```
Ensure your database credentials match:
```ini
POSTGRES_SERVER=localhost
POSTGRES_USER=finops
POSTGRES_PASSWORD=finops
POSTGRES_DB=finops_v2
POSTGRES_PORT=5432

SECRET_KEY=your_secure_random_key_here
ENVIRONMENT=production
ALLOWED_HOSTS=["*"]
```

---

### Step 4: Run the Automated Setup Script
Run the automated installation and system configuration:
```bash
chmod +x deploy/setup_ec2.sh deploy/deploy.sh
./deploy/setup_ec2.sh
```

This script will:
- Install Python 3, venv, Node.js 20, and Nginx.
- Install backend dependencies without caching (saving disk).
- Initialize database tables in PostgreSQL.
- Build the React frontend into static assets in `App/dist`.
- Set up and start the `finops-backend` systemd service.
- Configure Nginx reverse proxy on port 80.

---

### Step 5: Check Service Status
Verify both the backend and Nginx are active:
```bash
# Check Backend API
sudo systemctl status finops-backend

# Check Nginx
sudo systemctl status nginx
```

Test the health check locally:
```bash
curl http://127.0.0.1:8000/health
# Output: {"status":"healthy","version":"1.0.0"}
```

---

## 🔒 AWS EC2 Security Group Configuration
In your AWS EC2 Console, ensure your EC2 Instance's **Security Group** allows the following **Inbound Rules**:
- **HTTP (Port 80):** Source `0.0.0.0/0` (for public web access)
- **HTTPS (Port 443):** Source `0.0.0.0/0` (if using SSL via Certbot)
- **SSH (Port 22):** Source `Your IP` (for terminal access)

---

## 💡 Routine Management Commands

### Viewing Logs
```bash
# Live backend logs
sudo journalctl -u finops-backend -f

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restarting / Updating Services
```bash
# Redeploy latest code
./deploy/deploy.sh

# Or restart backend manually
sudo systemctl restart finops-backend
```

### Disk Space Maintenance for 8 GB Disk
Check available space:
```bash
df -h
```
If space ever runs low:
```bash
sudo apt clean
npm cache clean --force
sudo journalctl --vacuum-size=100M
```
