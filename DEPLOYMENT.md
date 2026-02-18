# 🚀 Deployment Guide

This guide covers deploying the AI-DocuMind Assistant to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Deployment](#local-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)

## Prerequisites

- Python 3.8+
- Node.js 14+
- At least 2GB RAM (4GB recommended)
- 2GB free disk space (for models and documents)

## Local Deployment

### Quick Start

Use the provided setup scripts:

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

Then start both services as described in the README.

## Production Deployment

### Backend (FastAPI)

#### Option 1: Using systemd (Linux)

Create `/etc/systemd/system/documind-backend.service`:
```ini
[Unit]
Description=AI-DocuMind Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ai-documind-assistant/backend
Environment="PATH=/var/www/ai-documind-assistant/backend/venv/bin"
ExecStart=/var/www/ai-documind-assistant/backend/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable documind-backend
sudo systemctl start documind-backend
```

#### Option 2: Using Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Option 3: Using Nginx Reverse Proxy

Nginx configuration (`/etc/nginx/sites-available/documind`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /var/www/ai-documind-assistant/frontend/build;
        try_files $uri /index.html;
    }
}
```

### Frontend (React)

#### Build for Production

```bash
cd frontend
npm run build
```

The optimized build will be in `frontend/build/`

#### Serve with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/ai-documind-assistant/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

## Docker Deployment

### Create Dockerfile for Backend

`backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads chroma_db

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
```

### Create Dockerfile for Frontend

`frontend/Dockerfile`:
```dockerfile
FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/chroma_db:/app/chroma_db
      - ./backend/document_metadata.json:/app/document_metadata.json
    environment:
      - PYTHONUNBUFFERED=1
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

Build and run:
```bash
docker-compose up -d
```

## Environment Variables

### Backend

Create `backend/.env`:
```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Settings (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

# Model Configuration
EMBEDDING_MODEL=all-MiniLM-L6-v2

# Storage
UPLOAD_DIR=uploads
CHROMA_DB_DIR=chroma_db

# Logging
LOG_LEVEL=INFO
```

### Frontend

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-domain.com/api
```

## Security Considerations

### 1. File Upload Security

- Limit file size (add in `backend/main.py`):
```python
from fastapi import File, UploadFile
from starlette.datastructures import UploadFile as StarletteUploadFile

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    # ... rest of code
```

- Validate file types strictly
- Scan uploaded files for malware if needed

### 2. API Rate Limiting

Install and configure rate limiting:
```bash
pip install slowapi
```

In `backend/main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/upload")
@limiter.limit("5/minute")
async def upload_document(request: Request, file: UploadFile = File(...)):
    # ... existing code
```

### 3. HTTPS/SSL

Use Let's Encrypt with Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. Secure Headers

Add security headers in Nginx:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 5. Database Backup

Backup ChromaDB and metadata regularly:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_${DATE}.tar.gz backend/chroma_db backend/document_metadata.json backend/uploads
```

### 6. User Authentication (Optional)

For multi-user deployment, add authentication:
```bash
pip install fastapi-users[sqlalchemy]
```

## Monitoring

### Health Check Endpoint

Add to `backend/main.py`:
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }
```

### Logging

Configure structured logging:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
```

## Performance Optimization

### 1. Model Caching

The embedding model is loaded once at startup. For multiple instances, consider using a model server.

### 2. Database Optimization

- Use SSD storage for ChromaDB
- Regularly optimize the database
- Consider adding an index limit for large deployments

### 3. CDN for Frontend

Use a CDN (Cloudflare, etc.) to serve static frontend files.

### 4. Caching

Add Redis caching for frequent queries:
```bash
pip install redis
```

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy) for multiple backend instances
- Share ChromaDB volume across instances or use a distributed vector database
- Use shared storage (NFS, S3) for uploaded files

### Vertical Scaling

- Increase RAM for better model performance
- Use GPU for faster embeddings (if available)
- Increase CPU cores for parallel processing

## Backup and Recovery

### Automated Backup

```bash
# /etc/cron.daily/documind-backup
#!/bin/bash
/var/www/ai-documind-assistant/backup.sh
# Upload to S3 or other storage
```

### Recovery

```bash
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz
# Restart services
sudo systemctl restart documind-backend
```

## Maintenance

### Updates

```bash
# Backend
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm update
npm run build
```

### Cleaning Up

```bash
# Remove old backups (keep last 7 days)
find /backups -name "backup_*.tar.gz" -mtime +7 -delete

# Clean temporary files
rm -rf backend/uploads/*.tmp
```

---

For additional help, see the TROUBLESHOOTING.md file or open an issue on GitHub.
