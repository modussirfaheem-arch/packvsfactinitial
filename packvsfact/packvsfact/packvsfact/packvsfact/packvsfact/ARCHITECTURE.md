# PACKVSFACT System Architecture

## Component Overview

```
                      +----------------------------------+
                      |    React + Vite + Tailwind CSS   |
                      |        Frontend Dashboard        |
                      +----------------+-----------------+
                                       |
                                       | HTTP REST APIs / JWT Auth
                                       v
                      +----------------------------------+
                      |         FastAPI Backend          |
                      +-------+------------------+-------+
                              |                  |
            +-----------------+                  +-----------------+
            |                                                      |
            v                                                      v
+-----------------------+                              +-----------------------+
|  Scikit-Learn ML System|                              | Nutri-Score & NOVA    |
| - NOVA Classifier     |                              | Calculation Engines   |
| - Health Recommender  |                              | - 2023/24 EU Update   |
| - Alternative Ranker  |                              | - Additive Rules Engine|
| - Demand Anomaly Model|                              +-----------------------+
| - Similarity Model    |                                          |
+-----------+-----------+                                          |
            |                                                      |
            v                                                      v
+--------------------------------------------------------------------------+
|                       SQLAlchemy ORM + Database                          |
| (products, nutrition, ingredients, claims, verification, prices, users)  |
+--------------------------------------------------------------------------+
```

## Key Architectural Design Choices
1. **Zero External Paid API Lock-In**: Everything executes on self-hosted Python & Scikit-Learn models.
2. **Transparent Score Breakdown**: Nutri-Score and PackVsFact Insight scores provide explicit component itemization instead of black-box outputs.
3. **Data Integrity & Label Verification**: Strict distinction between `[CALCULATED]`, `[MODEL PREDICTION]`, `[VERIFIED]`, and `[DEMO]`.
