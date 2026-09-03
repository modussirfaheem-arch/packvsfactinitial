"""
OCR Label Scanner Router (PACKVSFACT)
Processes label uploads, extracts text via local OCR, and provides editable user confirmation.
"""

import os
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.ocr_service import OcrService

router = APIRouter(prefix="/api/ocr", tags=["OCR"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/scan-label")
async def scan_label_image(file: UploadFile = File(...)):
    # File validation
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        raise HTTPException(status_code=400, detail="Invalid image file format. Supported: PNG, JPG, JPEG, WEBP")

    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        content = await file.read()
        if len(content) > 10 * 1024 * 1024: # 10MB limit
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

        with open(file_path, "wb") as f:
            f.write(content)

        # Run OCR
        raw_text = OcrService.extract_text_from_image(file_path)
        parsed_res = OcrService.parse_nutrition_and_ingredients(raw_text)

        return {
            "status": "SUCCESS",
            "file_path": file_path,
            "filename": file.filename,
            "ocr_result": parsed_res,
            "user_action_required": "Confirm or edit extracted values before running final intelligence analysis."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
