# PACKVSFACT API Documentation

## Auth Endpoints
- `POST /api/auth/register`: Register user or admin account.
- `POST /api/auth/login`: Authenticate and receive JWT access token.

## Product & Barcode Endpoints
- `GET /api/products/search?q={query}&category={category}&max_price={price}`: Search products.
- `GET /api/products/barcode/{barcode}`: Lookup product by barcode.
- `GET /api/products/{id}`: Detailed product analysis (Nutri-Score, NOVA, claims, nutrition).
- `POST /api/products/submit`: User product submission.

## OCR & Scanner Endpoints
- `POST /api/ocr/scan-label`: Upload label image and receive OCR extracted fields.

## Multilingual AI Assistant Endpoints
- `POST /api/assistant/ask`: Ask assistant questions in 10 Indian languages.
- `GET /api/assistant/languages`: List supported languages.

## Recommendations & Compare Endpoints
- `GET /api/recommendations/alternatives?product_id={id}&max_budget_inr={budget}`: Get budget healthier alternatives.
- `GET /api/compare/products?ids=1,2,3`: Side-by-side comparison of 2-5 products.

## Admin & Verification Endpoints
- `GET /api/admin/overview`: Admin metrics and ML model status.
- `POST /api/admin/verification/approve`: Approve verification submission.
- `POST /api/admin/verification/reject`: Reject submission.
- `POST /api/admin/train-models`: Trigger retraining of all 6 ML models.
- `POST /api/verification/upload-lab-report`: Upload lab report and check package vs lab discrepancies.
