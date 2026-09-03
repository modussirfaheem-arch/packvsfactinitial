# PACKVSFACT Data Privacy & Health Communication Policy

## Data Privacy Rights
1. **User Ownership**: Users own their scan history and preference settings.
2. **Data Export**: Users can export full account data in JSON format via `/api/privacy/export/{user_id}`.
3. **Data Erasure**: Users can permanently delete all account records via `/api/privacy/delete-data/{user_id}`.
4. **Local-First Processing**: All ML inferences, OCR extractions, and NLP queries execute locally without sending user data to third-party paid AI APIs.

## Responsible Health Communication Rules
- **No Disease Diagnosis**: PackVsFact does not diagnose, treat, or cure medical conditions.
- **Nutritional Filtering Aid**: Platform output is explicitly communicated as a nutritional filtering aid.
- **Factual Language**: The system never uses alarming phrases like "this food causes disease". It presents relative metrics such as "High sodium relative to category".
