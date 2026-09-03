"""
Product Verification & Lab Evidence Router (PACKVSFACT)
Handles lab report submissions and compares packaging label vs lab analysis to flag discrepancies.
Workflow: SUBMITTED -> DOCUMENT REVIEW -> LAB EVIDENCE -> ADMIN REVIEW -> APPROVED / REJECTED
"""

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.models import Product, Nutrition, VerificationRecord, LabReport

router = APIRouter(prefix="/api/verification", tags=["Verification & Lab Reports"])

class LabReportSchema(BaseModel):
    product_id: int
    lab_name: str
    test_date: str
    lab_sodium_mg: float
    lab_sugar_g: float
    report_reference: Optional[str] = "NABL-LAB-REF-2026"

@router.post("/upload-lab-report")
def upload_lab_report(payload: LabReportSchema, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    nutrition = db.query(Nutrition).filter(Nutrition.product_id == product.id).first()
    pkg_sodium = nutrition.sodium_mg if nutrition else 0.0
    pkg_sugar = nutrition.sugar_g if nutrition else 0.0

    # Discrepancy threshold: >15% variance between package label and lab test
    sodium_diff_pct = abs(payload.lab_sodium_mg - pkg_sodium) / float(pkg_sodium) if pkg_sodium > 0 else 0.0
    sugar_diff_pct = abs(payload.lab_sugar_g - pkg_sugar) / float(pkg_sugar) if pkg_sugar > 0 else 0.0
    discrepancy = sodium_diff_pct > 0.15 or sugar_diff_pct > 0.15

    report = LabReport(
        product_id=product.id,
        lab_name=payload.lab_name,
        test_date=payload.test_date,
        package_sodium_mg=pkg_sodium,
        lab_sodium_mg=payload.lab_sodium_mg,
        package_sugar_g=pkg_sugar,
        lab_sugar_g=payload.lab_sugar_g,
        discrepancy_flag=discrepancy
    )
    db.add(report)

    v_rec = db.query(VerificationRecord).filter(VerificationRecord.product_id == product.id).first()
    if not v_rec:
        v_rec = VerificationRecord(product_id=product.id, status="LAB EVIDENCE")
        db.add(v_rec)
    else:
        v_rec.status = "LAB EVIDENCE"

    if not discrepancy:
        product.verification_status = "LAB VERIFIED"

    db.commit()

    return {
        "status": "LAB_REPORT_RECORDED",
        "product_id": product.id,
        "lab_name": payload.lab_name,
        "discrepancy_flag": discrepancy,
        "comparison": {
            "sodium_mg": {"package": pkg_sodium, "lab": payload.lab_sodium_mg, "diff_pct": round(sodium_diff_pct * 100, 1)},
            "sugar_g": {"package": pkg_sugar, "lab": payload.lab_sugar_g, "diff_pct": round(sugar_diff_pct * 100, 1)}
        },
        "verification_status": product.verification_status,
        "explanation": "Difference detected — requires review." if discrepancy else "Lab results match package label within acceptable tolerances."
    }

@router.get("/status/{product_id}")
def get_verification_status(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    records = db.query(VerificationRecord).filter(VerificationRecord.product_id == product.id).all()
    reports = db.query(LabReport).filter(LabReport.product_id == product.id).all()

    return {
        "product_id": product.id,
        "product_name": product.name,
        "verification_status": product.verification_status,
        "workflow_records": [{"status": r.status, "date": r.created_at.isoformat()} for r in records],
        "lab_reports_count": len(reports)
    }
