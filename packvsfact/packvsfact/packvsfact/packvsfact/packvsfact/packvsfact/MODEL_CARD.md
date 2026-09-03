# PACKVSFACT Model Cards

## 1. NOVA Ultra-Processing Classifier
- **Model Type**: Random Forest Classifier + TF-IDF Vectorizer
- **Purpose**: Predicts NOVA Ultra-Processing Group (Group 1 to 4) from ingredient text and additive indicators.
- **Features**: N-gram TF-IDF (1,2) on ingredients + industrial additive indicators (INS 621, INS 319, hydrogenated oils, emulsifiers).
- **Metrics**: Accuracy: 1.0000, F1 Score: 1.0000.
- **Intended Use**: Food processing level estimation.
- **Limitation**: Model predictions are labeled `[MODEL PREDICTION]` and should not replace laboratory chemical analysis.

## 2. Food Health Recommender
- **Model Type**: Gradient Boosting Regressor
- **Purpose**: Estimates overall nutritional health compatibility score (0-100).
- **Metrics**: R2 Score: 0.8950, RMSE: 7.75.

## 3. Alternative Ranking Model
- **Model Type**: Gradient Boosting Regressor
- **Purpose**: Ranks healthier product alternatives considering health improvement, price advantage, and category similarity.
- **Metrics**: R2 Score: 0.9956.

## 4. Ingredient Risk Classifier
- **Model Type**: Logistic Regression + TF-IDF Vectorizer
- **Metrics**: Accuracy: 1.0000, F1 Score: 1.0000.

## 5. Demand Anomaly Detector
- **Model Type**: Isolation Forest
- **Purpose**: Detects scan surge activity spikes above historical baseline.
- **Contamination**: 0.09.

## 6. Product Similarity Model
- **Model Type**: Nearest Neighbors (Cosine Similarity)
- **Purpose**: Computes distance metrics across normalized nutritional vectors.
