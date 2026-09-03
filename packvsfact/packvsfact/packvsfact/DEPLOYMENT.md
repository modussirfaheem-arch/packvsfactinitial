# PACKVSFACT Production Deployment Guide

## Production Requirements
- **OS**: Linux (Ubuntu 22.04 LTS / Debian) or Windows Server
- **Python**: 3.11+
- **Node.js**: 20+
- **System Dependencies**: Tesseract OCR binary (`tesseract-ocr`, `libgl1`)

## Deployment Steps
1. **Clone Repository & Environment**:
   ```bash
   git clone <repo-url>
   cd packvsfact
   cp .env.example .env
   ```

2. **Backend & Database Setup**:
   ```bash
   python -m venv backend/.venv
   source backend/.venv/bin/activate # Or backend\.venv\Scripts\activate on Windows
   pip install -r backend/requirements.txt scikit-learn numpy pandas joblib pytest pyjwt passlib bcrypt pytesseract opencv-python-headless
   python ml/train_all_models.py
   python backend/app/seed_db.py
   ```

3. **Frontend Build**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. **Docker Container Deployment**:
   ```bash
   docker-compose up -d --build
   ```

5. **Reverse Proxy (Nginx / HTTPS)**:
   Configure SSL certificates with Certbot / Let's Encrypt and proxy `/api` traffic to port 8000 and static frontend to port 80.
