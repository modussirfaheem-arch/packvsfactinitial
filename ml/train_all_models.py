"""
Machine Learning Model Training Pipeline (PACKVSFACT)
Trains 6 Scikit-Learn Models:
1. NOVA Classifier (RandomForest + TF-IDF)
2. Food Health Recommender (GradientBoosting Regressor)
3. Alternative Ranking Model (RandomForest Ranker)
4. Ingredient Risk Classifier (TF-IDF + Logistic Regression)
5. Demand Anomaly Model (Isolation Forest)
6. Product Similarity Model (Nearest Neighbors / Cosine Similarity)

Outputs saved model artifacts in ml/saved_models/ and records metrics in database.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

# Enforce UTF-8 stdout encoding for Windows console compatibility
sys.stdout.reconfigure(encoding='utf-8')

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor, IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, mean_squared_error, r2_score

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def train_nova_classifier():
    print("[1/6] Training NOVA Classifier Model...")
    
    data = [
        ("raw oats whole grain flax seeds", 1),
        ("fresh cow milk 100% natural", 1),
        ("roasted chana plain almonds walnuts", 1),
        ("green tea leaves whole", 1),
        ("plain basmati rice wheat flour", 1),
        ("iodised salt refined sugar white", 2),
        ("cold pressed mustard oil virgin coconut oil", 2),
        ("pure cow ghee traditional", 2),
        ("canned green peas salt water", 3),
        ("salted roasted peanuts vegetable oil salt", 3),
        ("artisanal cheese milk culture salt", 3),
        ("refined wheat flour maida palm oil sugar iodised salt ins 500 ins 471 ins 621 msg artificial flavouring nature identical flavour maltodextrin ins 319 tbhq", 4),
        ("sugar hydrogenated vegetable fat cocoa solids emulsifier soy lecithin ins 322 synthetic vanilla flavouring ins 476", 4),
        ("carbonated water high fructose corn syrup acidity regulator ins 330 caffeine caramel color ins 150d artificial sweeteners ins 950 ins 955", 4),
        ("potato edible vegetable oil palmolein seasoning maltodextrin salt chilli powder acidity regulator ins 330 flavour enhancer ins 627 ins 631", 4),
        ("noodles wheat flour palm oil salt wheat gluten guar gum ins 412 sodium tripolyphosphate ins 452 masala mix hydrolyzed peanut protein dehydrated vegetables msg ins 621", 4),
        ("wheat flour sugar palm oil invert sugar syrup ammonium bicarbonate ins 503 sodium bicarbonate ins 500 salt milk solids artificial vanilla flavour", 4),
        ("milk solids sugar mango pulp pectin ins 440 acidity regulator ins 330 nature identical mango flavour", 4)
    ] * 20

    df = pd.DataFrame(data, columns=["ingredients", "nova_group"])
    X_train, X_test, y_train, y_test = train_test_split(df["ingredients"], df["nova_group"], test_size=0.25, random_state=42)

    tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    X_train_vec = tfidf.fit_transform(X_train)
    X_test_vec = tfidf.transform(X_test)

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_vec, y_train)

    preds = clf.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, preds, average="weighted")

    model_payload = {
        "vectorizer": tfidf,
        "model": clf,
        "version": "1.0.0",
        "metrics": {"accuracy": float(acc), "precision": float(precision), "recall": float(recall), "f1": float(f1)}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "nova_classifier.joblib"))
    print(f"   -> Accuracy: {acc:.4f}, F1: {f1:.4f}")
    return model_payload["metrics"]


def train_ingredient_risk_classifier():
    print("[2/6] Training Ingredient Risk Classifier...")
    
    data = [
        ("whole wheat flour", 0), ("oats", 0), ("water", 0), ("turmeric", 0), ("cumin", 0),
        ("sugar", 1), ("salt", 1), ("palm oil", 1), ("citric acid ins 330", 1), ("baking soda ins 500", 1),
        ("partially hydrogenated oil", 2), ("tbhq ins 319", 2), ("msg ins 621", 2), ("tartrazine ins 102", 2), ("sucralose ins 955", 2), ("caramel color ins 150d", 2),
        ("peanuts", 3), ("hydrolyzed peanut protein", 3), ("milk solids", 3), ("soy lecithin", 3), ("wheat gluten", 3), ("tree nuts almonds", 3)
    ] * 25

    df = pd.DataFrame(data, columns=["ingredient", "risk_level"])
    X_train, X_test, y_train, y_test = train_test_split(df["ingredient"], df["risk_level"], test_size=0.2, random_state=42)

    tfidf = TfidfVectorizer(ngram_range=(1, 2))
    X_train_vec = tfidf.fit_transform(X_train)
    X_test_vec = tfidf.transform(X_test)

    clf = LogisticRegression(max_iter=500)
    clf.fit(X_train_vec, y_train)

    preds = clf.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, preds, average="weighted")

    model_payload = {
        "vectorizer": tfidf,
        "model": clf,
        "version": "1.0.0",
        "labels": {0: "LOW CONCERN", 1: "ATTENTION", 2: "HIGH ATTENTION", 3: "ALLERGEN"},
        "metrics": {"accuracy": float(acc), "precision": float(precision), "recall": float(recall), "f1": float(f1)}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "ingredient_risk_classifier.joblib"))
    print(f"   -> Accuracy: {acc:.4f}, F1: {f1:.4f}")
    return model_payload["metrics"]


def train_food_health_recommender():
    print("[3/6] Training Food Health Recommender Model...")
    
    np.random.seed(42)
    N = 500
    sugar = np.random.uniform(0, 55, N)
    sat_fat = np.random.uniform(0, 20, N)
    sodium = np.random.uniform(0, 1500, N)
    fibre = np.random.uniform(0, 12, N)
    protein = np.random.uniform(0, 25, N)
    nova = np.random.choice([1, 2, 3, 4], N, p=[0.2, 0.1, 0.3, 0.4])

    score = (
        100 
        - (sugar * 0.7) 
        - (sat_fat * 1.5) 
        - (sodium / 30.0) 
        + (fibre * 2.5) 
        + (protein * 1.2) 
        - ((nova - 1) * 8) 
        + np.random.normal(0, 3, N)
    )
    score = np.clip(score, 0, 100)

    X = np.column_stack([sugar, sat_fat, sodium, fibre, protein, nova])
    y = score

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    model_payload = {
        "model": model,
        "feature_names": ["sugar_g", "sat_fat_g", "sodium_mg", "fibre_g", "protein_g", "nova_group"],
        "version": "1.0.0",
        "metrics": {"r2_score": float(r2), "rmse": float(np.sqrt(mse))}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "food_health_recommender.joblib"))
    print(f"   -> R2 Score: {r2:.4f}, RMSE: {np.sqrt(mse):.4f}")
    return model_payload["metrics"]


def train_alternative_ranking_model():
    print("[4/6] Training Alternative Ranking Model...")
    
    np.random.seed(42)
    N = 400
    health_diff = np.random.uniform(-30, 40, N)
    price_diff = np.random.uniform(-50, 50, N)
    cat_same = np.random.choice([0, 1], N, p=[0.2, 0.8])
    fibre_diff = np.random.uniform(-2, 10, N)
    sugar_diff = np.random.uniform(-30, 10, N)

    rank_score = (
        (health_diff * 1.5) 
        - (price_diff * 0.8) 
        + (cat_same * 20) 
        + (fibre_diff * 3.0) 
        - (sugar_diff * 1.2)
    )

    X = np.column_stack([health_diff, price_diff, cat_same, fibre_diff, sugar_diff])
    y = rank_score

    model = GradientBoostingRegressor(n_estimators=80, random_state=42)
    model.fit(X, y)

    r2 = model.score(X, y)

    model_payload = {
        "model": model,
        "feature_names": ["health_score_diff", "price_diff_inr", "category_same", "fibre_diff", "sugar_diff"],
        "version": "1.0.0",
        "metrics": {"r2_score": float(r2)}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "alternative_ranking_model.joblib"))
    print(f"   -> R2 Score: {r2:.4f}")
    return model_payload["metrics"]


def train_demand_anomaly_model():
    print("[5/6] Training Demand Anomaly Detector...")
    
    np.random.seed(42)
    normal_scans = np.random.normal(loc=100, scale=15, size=(300, 1))
    normal_growth = np.random.normal(loc=5, scale=10, size=(300, 1))
    normal_hours = np.random.randint(8, 22, size=(300, 1))
    X_normal = np.hstack([normal_scans, normal_growth, normal_hours])

    anom_scans = np.random.uniform(220, 500, size=(30, 1))
    anom_growth = np.random.uniform(80, 300, size=(30, 1))
    anom_hours = np.random.randint(0, 24, size=(30, 1))
    X_anom = np.hstack([anom_scans, anom_growth, anom_hours])

    X = np.vstack([X_normal, X_anom])

    clf = IsolationForest(contamination=0.09, random_state=42)
    clf.fit(X)

    model_payload = {
        "model": clf,
        "version": "1.0.0",
        "metrics": {"contamination": 0.09, "samples_trained": len(X)}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "demand_anomaly_model.joblib"))
    print(f"   -> Isolation Forest Trained on {len(X)} instances.")
    return model_payload["metrics"]


def train_product_similarity_model():
    print("[6/6] Training Product Similarity Nearest Neighbors Model...")
    
    np.random.seed(42)
    X = np.random.uniform(0, 1, size=(100, 6))

    nn = NearestNeighbors(n_neighbors=5, metric="cosine")
    nn.fit(X)

    model_payload = {
        "model": nn,
        "feature_names": ["norm_calories", "norm_sugar", "norm_sat_fat", "norm_sodium", "norm_fibre", "norm_protein"],
        "version": "1.0.0",
        "metrics": {"n_neighbors": 5, "metric": "cosine"}
    }
    joblib.dump(model_payload, os.path.join(SAVED_MODELS_DIR, "product_similarity_model.joblib"))
    print("   -> Nearest Neighbors Cosine Similarity Model Fitted.")
    return model_payload["metrics"]


def run_training_pipeline():
    print("==================================================")
    print("  PACKVSFACT ML TRAINING PIPELINE (SCIKIT-LEARN)")
    print("==================================================")
    m1 = train_nova_classifier()
    m2 = train_ingredient_risk_classifier()
    m3 = train_food_health_recommender()
    m4 = train_alternative_ranking_model()
    m5 = train_demand_anomaly_model()
    m6 = train_product_similarity_model()

    summary = {
        "trained_at": datetime.utcnow().isoformat(),
        "models": {
            "nova_classifier": m1,
            "ingredient_risk_classifier": m2,
            "food_health_recommender": m3,
            "alternative_ranking_model": m4,
            "demand_anomaly_model": m5,
            "product_similarity_model": m6
        }
    }

    summary_file = os.path.join(SAVED_MODELS_DIR, "training_summary.json")
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n[SUCCESS] All 6 Scikit-Learn ML Models Successfully Trained and Saved!")
    print(f"Summary written to: {summary_file}")
    return summary

if __name__ == "__main__":
    run_training_pipeline()
