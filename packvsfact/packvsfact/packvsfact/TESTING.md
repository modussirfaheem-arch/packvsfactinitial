# PACKVSFACT Automated Testing & Verification Guide

## Test Architecture
- **Pytest Backend & ML Suite**: Unit tests, integration tests, Nutri-Score calculation verification, NOVA model classification test, security token verification, claim engine validation, and API endpoint integration.
- **Frontend Build Verification**: TypeScript compilation and Vite bundler checks.

## Executing Automated Tests
```bash
# Run backend and ML Pytest suite
pytest tests/test_backend_and_ml.py

# Evaluate ML model metrics
python ml/evaluate_models.py

# Build frontend to verify TypeScript compilation
cd frontend
npm run build
```
