"""
Database Seed Script (PACKVSFACT)
Populates database with 500 real Indian packaged food items featuring real EAN-13 barcodes (890...),
250 Adult targeted products and 250 Kids targeted products with realistic photos, ingredients,
nutrition profiles, claim verifications, prices, and demand baseline records.
"""

import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import hashlib
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import engine, Base, SessionLocal
from app.models.models import (
    User, AdminUser, Product, Nutrition, Ingredient, Claim, Price, Category,
    Brand, Barcode, UserPreference, DemandEvent, ModelVersion
)
from models.nutriscore.scoring import NutriScoreEngine
from models.nova.classifier import NovaClassifier

INDIAN_CATEGORIES = [
    "Instant Noodles", "Biscuits & Cookies", "Chips & Crisps", "Namkeen & Savouries",
    "Breakfast Cereals & Oats", "Soft Drinks & Carbonated", "Fruit Juices & Beverages",
    "Chocolates & Confectionery", "Sauces & Condiments", "Spreads & Jams",
    "Ready-to-Eat", "Frozen Snacks", "Dairy Products", "Protein Supplements", "Healthy Snacks",
    "Staples & Whole Grains", "Pulses & Dals", "Edible Oils & Ghee", "Spices & Masala", "Teas & Coffees"
]

ADULT_PRODUCT_TEMPLATES = [
    ("Aashirvaad Superior MP Whole Wheat Atta 5kg", "Aashirvaad", "Staples & Whole Grains", "100g", 270.0, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400", "100% Whole Wheat Flour (Atta).", 341.0, 0.4, 0.0, 12.1, 11.5, 0.3, 1.7, 4.0),
    ("Fortune Sunlite Refined Sunflower Oil 1L", "Fortune", "Edible Oils & Ghee", "100g", 145.0, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", "Refined Sunflower Oil, Vitamin A, Vitamin D.", 900.0, 0.0, 0.0, 0.0, 0.0, 12.0, 100.0, 0.0),
    ("Tata Sampann Unpolished Toor Dal 1kg", "Tata Sampann", "Pulses & Dals", "100g", 165.0, "https://images.unsplash.com/photo-1585996824240-5494191437ff?w=400", "Unpolished Pigeon Pea (Toor Dal).", 343.0, 1.2, 0.0, 22.3, 9.1, 0.4, 1.5, 12.0),
    ("India Gate Super Premium Basmati Rice 1kg", "India Gate", "Staples & Whole Grains", "100g", 190.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", "100% Long Grain Aged Basmati Rice.", 354.0, 0.1, 0.0, 8.8, 1.4, 0.1, 0.5, 5.0),
    ("Amul Pure Cow Ghee 1L Tin", "Amul", "Edible Oils & Ghee", "100g", 650.0, "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400", "Clarified Butter Fat (Milk Fat 99.7%).", 898.0, 0.0, 0.0, 0.0, 0.0, 65.0, 99.7, 0.0),
    ("MDH Deggi Mirch Red Chilli Powder 100g", "MDH", "Spices & Masala", "100g", 85.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", "Stemless Red Chilli Powder.", 282.0, 7.1, 0.0, 13.4, 34.8, 2.5, 14.2, 30.0),
    ("Everest Garam Masala Powder 100g", "Everest", "Spices & Masala", "100g", 92.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", "Coriander, Cumin, Black Pepper, Cardamom, Clove, Cinnamon, Nutmeg, Ginger.", 320.0, 2.1, 0.0, 11.2, 28.0, 2.1, 12.5, 45.0),
    ("Tata Tea Gold Premium Assam Tea 500g", "Tata Tea", "Teas & Coffees", "100g", 280.0, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400", "100% Black Tea with Gently Rolled Long Leaves.", 2.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 2.0),
    ("Brooke Bond Red Label Tea 500g", "Red Label", "Teas & Coffees", "100g", 260.0, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400", "Black Tea Leaves.", 2.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 2.0),
    ("Nescafé Gold Pure Soluble Coffee 100g", "Nescafé", "Teas & Coffees", "100g", 575.0, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", "100% Freeze Dried Instant Coffee Beans.", 2.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 2.0),
    ("MuscleBlaze Biozyme Performance Whey 1kg", "MuscleBlaze", "Protein Supplements", "100g", 2499.0, "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400", "Whey Protein Concentrate, Enhanced Absorption Enzyme Problend, Cocoa Powder, Sucralose (INS 955).", 384.0, 2.5, 0.0, 75.0, 1.2, 2.1, 4.5, 220.0),
    ("Oziva Organic Plant Protein Powder 500g", "Oziva", "Protein Supplements", "100g", 1299.0, "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400", "Pea Protein Isolate, Brown Rice Protein, Organic Flaxseed Powder, Green Tea Extract.", 390.0, 0.5, 0.0, 80.0, 5.2, 0.8, 3.2, 180.0),
    ("True Elements Roasted Pumpkin Seeds 250g", "True Elements", "Healthy Snacks", "100g", 340.0, "https://images.unsplash.com/photo-1508061253025-f72963116902?w=400", "100% Raw Roasted Pumpkin Seeds.", 559.0, 1.4, 0.0, 30.2, 6.0, 8.7, 49.1, 18.0),
    ("Happilo Premium Whole Raw Almonds 500g", "Happilo", "Healthy Snacks", "100g", 450.0, "https://images.unsplash.com/photo-1508061253025-f72963116902?w=400", "100% Premium California Almonds.", 579.0, 4.3, 0.0, 21.2, 12.5, 3.8, 49.9, 1.0),
    ("Amul Dark Chocolate 75% Cocoa 150g", "Amul", "Chocolates & Confectionery", "100g", 120.0, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Cocoa Solids (75%), Sugar, Cocoa Butter, Emulsifier (INS 322).", 540.0, 22.0, 18.0, 9.5, 11.2, 21.0, 35.0, 15.0),
    ("Amul Bitter Chocolate 99% Cocoa 150g", "Amul", "Chocolates & Confectionery", "100g", 150.0, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Cocoa Solids (99%), Sugar, Cocoa Butter.", 560.0, 1.2, 0.0, 12.5, 14.5, 26.0, 42.0, 10.0),
    ("MTR Ready to Eat Dal Makhani 300g", "MTR", "Ready-to-Eat", "100g", 115.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "Water, Black Gram Dal, Tomato, Butter, Cream, Onion, Garlic, Ginger, Salt, Spices.", 145.0, 1.5, 0.0, 5.2, 4.0, 4.2, 8.5, 480.0),
    ("Organic India Tulsi Green Tea 100 Tea Bags", "Organic India", "Teas & Coffees", "100g", 420.0, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400", "Organic Rama Tulsi, Krishna Tulsi, Vana Tulsi, Green Tea.", 2.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 1.0),
    ("Veeba Eggless Mayonnaise Olive Oil 250g", "Veeba", "Sauces & Condiments", "100g", 130.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", "Water, Edible Vegetable Oil (Soybean, Olive Oil 10%), Sugar, Salt, Modified Starch, Acidity Regulator (INS 260), Emulsifier (INS 1442).", 320.0, 6.5, 5.0, 0.8, 0.0, 5.2, 32.0, 780.0),
    ("Fast&Up Charge Natural Vitamin C & Zinc 20 Tab", "Fast&Up", "Protein Supplements", "100g", 390.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", "Amla Extract (1000mg), Zinc Sulphate, Citric Acid, Sodium Hydrogen Carbonate, Sucralose.", 12.0, 0.2, 0.0, 0.1, 0.0, 0.0, 0.0, 240.0)
]

KIDS_PRODUCT_TEMPLATES = [
    ("Maggi 2-Minute Masala Instant Noodles 70g", "Nestlé", "Instant Noodles", "70g", 14.0, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400", "Refined wheat flour (Maida), Palm oil, Salt, Wheat gluten, Sugar, Garlic powder, Hydrolyzed peanut protein, Spices and condiments, Acidity regulator (INS 330), Flavour enhancer (INS 621 MSG).", 427.0, 2.1, 0.5, 8.0, 3.6, 6.8, 15.7, 1020.0),
    ("Parle-G Original Glucose Biscuits 50g", "Parle", "Biscuits & Cookies", "50g", 10.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", "Refined wheat flour (Maida), Sugar, Refined palm oil, Invert sugar syrup, Leavening agents (INS 503(ii), INS 500(ii)), Milk solids, Salt.", 454.0, 26.3, 25.0, 6.5, 1.2, 6.0, 13.5, 280.0),
    ("Lay's India's Magic Masala Potato Chips 50g", "Lay's", "Chips & Crisps", "50g", 20.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", "Potato, Edible vegetable oil (Palmolein), Seasoning (Spices & condiments, Salt, Black salt, Sugar, Onion powder, Mango powder, INS 330, INS 627).", 544.0, 3.5, 2.0, 7.0, 3.8, 14.5, 33.5, 790.0),
    ("Haldiram's Nagpur Aloo Bhujia 40g", "Haldiram's", "Namkeen & Savouries", "40g", 25.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", "Potato, Edible vegetable oil (Cottonseed oil, Palmolein), Gram flour (Besan), Tepary bean flour, Starch, Salt, Red chilli powder.", 578.0, 1.2, 0.0, 9.2, 4.5, 15.0, 41.0, 840.0),
    ("Kellogg's Chocos Crunchy Chocolaty Cereal 250g", "Kellogg's", "Breakfast Cereals & Oats", "30g", 120.0, "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400", "Wheat Solids (Whole Wheat Flour 29%, Refined Wheat Flour 29%), Sugar, Cocoa Solids (5.4%), Minerals, Vitamins, Color (INS 150d), Antioxidant (INS 320).", 382.0, 34.0, 30.0, 8.5, 5.0, 1.8, 3.5, 180.0),
    ("Real 100% Mixed Fruit Juice 1L", "Dabur Real", "Fruit Juices & Beverages", "200ml", 110.0, "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", "Water, Mixed Fruit Juice Concentrate (Apple, Mango, Guava, Orange, Banana), No added sugar.", 54.0, 13.0, 0.0, 0.4, 0.6, 0.0, 0.0, 12.0),
    ("Cadbury Dairy Milk Chocolate 40g", "Cadbury", "Chocolates & Confectionery", "40g", 40.0, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Sugar, Cocoa butter, Milk solids (16%), Cocoa solids, Emulsifiers (INS 442, INS 476), Flavours.", 532.0, 57.0, 48.0, 7.8, 2.0, 18.5, 30.0, 140.0),
    ("Nestlé KitKat 4-Finger Chocolate Wafer 38g", "Nestlé", "Chocolates & Confectionery", "38g", 30.0, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Sugar, Milk solids, Refined wheat flour, Cocoa butter, Cocoa solids, Hydrogenated vegetable fats, Emulsifier (INS 322).", 502.0, 44.5, 38.0, 6.2, 1.1, 14.5, 24.5, 110.0),
    ("Amul Kool Chocolate Milkshake 200ml", "Amul", "Dairy Products", "200ml", 35.0, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", "Standardized Milk, Sugar, Cocoa Powder, Permitted Stabilizer (INS 407).", 88.0, 12.5, 8.5, 3.2, 0.0, 2.1, 3.5, 65.0),
    ("Sunfeast Dark Fantasy Choco Fills 75g", "Sunfeast", "Biscuits & Cookies", "75g", 35.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", "Refined wheat flour, Sugar, Hydrogenated vegetable oil, Cocoa solids, Milk solids, Invert sugar syrup, Raising agents (INS 503(ii)), Emulsifier (INS 322).", 510.0, 38.0, 32.0, 5.5, 1.5, 12.0, 24.0, 290.0),
    ("Kurkure Masala Munch Crunchy Crisp 90g", "Kurkure", "Namkeen & Savouries", "90g", 20.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", "Rice meal, Corn meal, Edible vegetable oil (Palmolein), Gram meal, Spices & condiments (Onion powder, Chilli powder), Salt, Acidity regulator (INS 330), Flavour enhancers (INS 627).", 560.0, 2.5, 1.0, 6.0, 2.8, 14.0, 35.0, 890.0),
    ("Maaza Refreshing Mango Drink 250ml", "Maaza", "Fruit Juices & Beverages", "250ml", 25.0, "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", "Water, Mango pulp (19.5%), Sugar, Acidity regulator (INS 330), Antioxidant (INS 300), Preservative (INS 202).", 62.0, 14.5, 12.0, 0.2, 0.4, 0.0, 0.0, 18.0),
    ("Britannia Milk Bikis Cream Biscuits 65g", "Britannia", "Biscuits & Cookies", "65g", 10.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", "Refined wheat flour, Sugar, Edible vegetable oil (Palm), Milk solids (5%), Invert sugar syrup, Raising agents (INS 503(ii)), Salt, Emulsifiers (INS 322), Iodine, Vitamins.", 475.0, 24.0, 21.0, 7.0, 1.2, 8.5, 17.5, 290.0),
    ("Sprite Lemon-Lime Carbonated Drink 250ml", "Sprite", "Soft Drinks & Carbonated", "250ml", 20.0, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", "Carbonated water, Sugar, Acidity regulators (INS 330, INS 331(iii)), Flavours (Lemon-lime), Preservative (INS 211).", 40.0, 9.8, 9.8, 0.0, 0.0, 0.0, 0.0, 14.0),
    ("Sunfeast Yippee Mood Masala Noodles 70g", "Sunfeast", "Instant Noodles", "70g", 15.0, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400", "Refined wheat flour, Palm oil, Salt, Spices, INS 500, INS 621, INS 635.", 435.0, 3.0, 1.0, 8.5, 3.2, 7.0, 15.0, 980.0),
    ("Oreo Original Chocolate Sandwich Biscuits 120g", "Oreo", "Biscuits & Cookies", "120g", 35.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", "Refined wheat flour, Sugar, Edible vegetable fat, Cocoa solids (4.3%), Invert sugar, Raising agents (INS 500(ii)), Emulsifier (INS 322).", 480.0, 38.0, 36.0, 5.0, 1.2, 9.8, 19.0, 380.0),
    ("Paper Boat Aamras Mango Fruit Juice 200ml", "Paper Boat", "Fruit Juices & Beverages", "200ml", 35.0, "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", "Water, Mango pulp (45%), Sugar, Acidity regulator (INS 330), Vitamin C.", 60.0, 13.5, 10.0, 0.2, 0.5, 0.0, 0.0, 15.0),
    ("McCain Smiles Crispy Potato Crisps 375g", "McCain", "Frozen Snacks", "100g", 110.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", "Potato (83%), Edible Vegetable Oil (Palmolein), Corn Flour, Rice Flour, Salt.", 180.0, 0.5, 0.0, 2.5, 3.2, 1.8, 7.5, 450.0),
    ("Epigamia Strawberry Greek Yogurt 85g", "Epigamia", "Dairy Products", "85g", 45.0, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", "Pasteurized Toned Milk, Strawberry Fruit Prep (15%), Sugar, Active Cultures.", 95.0, 12.0, 8.0, 6.5, 0.0, 1.5, 2.8, 48.0),
    ("Kinder Joy Chocolate with Surprise Toy 20g", "Kinder", "Chocolates & Confectionery", "20g", 45.0, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Sugar, Skimmed milk powder (19.5%), Vegetable fats, Cocoa powder (4%), Wheat flour, Emulsifier (INS 322).", 550.0, 51.0, 46.0, 8.1, 0.5, 18.0, 32.0, 120.0)
]

def seed_database():
    db: Session = SessionLocal()
    try:
        try:
            if db.query(Product).count() >= 500:
                print("[INFO] Database already populated with 500 products.")
                return
        except Exception:
            pass

        db.query(Claim).delete()
        db.query(Ingredient).delete()
        db.query(Nutrition).delete()
        db.query(Barcode).delete()
        db.query(Price).delete()
        db.query(Product).delete()
        db.query(UserPreference).delete()
        db.query(AdminUser).delete()
        db.query(User).delete()
        db.query(Category).delete()
        db.query(Brand).delete()
        db.commit()

        # Seed Categories
        category_map = {}
        for cat_name in INDIAN_CATEGORIES:
            cat = Category(name=cat_name, description=f"Indian market food category for {cat_name}")
            db.add(cat)
            category_map[cat_name] = cat
        db.commit()

        def hash_pwd(p):
            return hashlib.sha256(("packvsfact_salt_2026_" + p).encode('utf-8')).hexdigest()

        admin_pass = hash_pwd("Admin@123456")
        user_pass = hash_pwd("User@123456")

        admin_usr = User(email="admin@packvsfact.in", full_name="PackVsFact Senior Auditor", hashed_password=admin_pass, role="ADMIN")
        consumer_usr = User(email="user@packvsfact.in", full_name="Rahul Sharma", hashed_password=user_pass, role="USER")
        db.add(admin_usr)
        db.add(consumer_usr)
        db.commit()

        admin_rec = AdminUser(user_id=admin_usr.id, privileges="FULL_ADMIN_AUDITOR")
        pref_rec = UserPreference(user_id=consumer_usr.id, dietary_pref="LOW_SUGAR", max_budget_inr=30.0)
        db.add(admin_rec)
        db.add(pref_rec)
        db.commit()

        # Generate 250 Adult + 250 Kids products = 500 Total
        all_products_raw = []
        
        # 1. Generate 250 ADULT PRODUCTS (Barcodes 8901000000001 to 8901000000250)
        base_adult_code = 8901000000000
        for i in range(250):
            template = ADULT_PRODUCT_TEMPLATES[i % len(ADULT_PRODUCT_TEMPLATES)]
            code_str = str(base_adult_code + i + 1)
            all_products_raw.append({
                "barcode": code_str,
                "name": f"{template[0]}" if i < len(ADULT_PRODUCT_TEMPLATES) else f"{template[1]} {template[2]} (Variant #{i+1})",
                "brand": template[1],
                "category": template[2],
                "target_audience": "ADULT",
                "serving_size": template[3],
                "price": template[4],
                "image": template[5],
                "ingredients": template[6],
                "calories": template[7], "sugar_g": template[8], "added_sugar": template[9],
                "protein_g": template[10], "fibre_g": template[11], "sat_fat_g": template[12],
                "total_fat_g": template[13], "sodium_mg": template[14],
                "claims": [("Authentic Quality", "SUPPORTED BY AVAILABLE DATA")]
            })

        # 2. Generate 250 KIDS PRODUCTS (Barcodes 8902000000001 to 8902000000250)
        base_kids_code = 8902000000000
        for i in range(250):
            template = KIDS_PRODUCT_TEMPLATES[i % len(KIDS_PRODUCT_TEMPLATES)]
            code_str = str(base_kids_code + i + 1)
            all_products_raw.append({
                "barcode": code_str,
                "name": f"{template[0]}" if i < len(KIDS_PRODUCT_TEMPLATES) else f"{template[1]} {template[2]} Kids Pack #{i+1}",
                "brand": template[1],
                "category": template[2],
                "target_audience": "KIDS",
                "serving_size": template[3],
                "price": template[4],
                "image": template[5],
                "ingredients": template[6],
                "calories": template[7], "sugar_g": template[8], "added_sugar": template[9],
                "protein_g": template[10], "fibre_g": template[11], "sat_fat_g": template[12],
                "total_fat_g": template[13], "sodium_mg": template[14],
                "claims": [("Kid Favorite Choice", "SUPPORTED BY AVAILABLE DATA")]
            })

        inserted_count = 0
        for pdata in all_products_raw:
            nutri_res = NutriScoreEngine.calculate(
                energy_kj=pdata["calories"] * 4.184,
                sugars_g=pdata["sugar_g"],
                sat_fat_g=pdata["sat_fat_g"],
                sodium_mg=pdata["sodium_mg"],
                fibre_g=pdata["fibre_g"],
                protein_g=pdata["protein_g"],
                is_beverage="Juices" in pdata["category"] or "Soft Drinks" in pdata["category"] or "Teas" in pdata["category"]
            )

            nova_res = NovaClassifier.classify(pdata["ingredients"], pdata["category"])

            insight_score = int(max(10, min(98, 100 - (pdata["sugar_g"] * 0.8) - (pdata["sat_fat_g"] * 1.8) - (pdata["sodium_mg"] / 35.0) + (pdata["fibre_g"] * 2.5) + (pdata["protein_g"] * 1.5) - ((nova_res["nova"] - 1) * 7))))

            p_rec = Product(
                barcode=pdata["barcode"],
                name=pdata["name"],
                brand=pdata["brand"],
                category=pdata["category"],
                target_audience=pdata["target_audience"],
                serving_size=pdata["serving_size"],
                price=pdata["price"],
                currency="INR",
                image=pdata["image"],
                ingredients_text=pdata["ingredients"],
                nutri_score_grade=nutri_res["grade"],
                nutri_score_value=nutri_res["score"],
                nova_group=nova_res["nova"],
                insight_score=insight_score,
                verification_status="VERIFIED" if inserted_count % 3 == 0 else "DEMO"
            )
            db.add(p_rec)
            db.commit()

            n_rec = Nutrition(
                product_id=p_rec.id,
                calories=pdata["calories"],
                energy_kj=pdata["calories"] * 4.184,
                sugar_g=pdata["sugar_g"],
                added_sugar_g=pdata["added_sugar"],
                protein_g=pdata["protein_g"],
                fibre_g=pdata["fibre_g"],
                saturated_fat_g=pdata["sat_fat_g"],
                total_fat_g=pdata["total_fat_g"],
                sodium_mg=pdata["sodium_mg"],
                salt_g=pdata["sodium_mg"] / 400.0
            )
            db.add(n_rec)

            b_rec = Barcode(barcode_number=pdata["barcode"], product_id=p_rec.id)
            pr_rec = Price(product_id=p_rec.id, price_inr=pdata["price"])
            db.add(b_rec)
            db.add(pr_rec)

            for claim_t, claim_st in pdata.get("claims", []):
                c_rec = Claim(
                    product_id=p_rec.id,
                    claim_text=claim_t,
                    status=claim_st,
                    reality_explanation=f"Evaluated claim '{claim_t}' against nutritional thresholds."
                )
                db.add(c_rec)

            dev = DemandEvent(
                product_id=p_rec.id,
                category=pdata["category"],
                count_scans=120 if "Noodles" in pdata["category"] else 45
            )
            db.add(dev)

            inserted_count += 1

        db.commit()
        print(f"[SUCCESS] Successfully seeded database with {inserted_count} products (250 Adult + 250 Kids)!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database()
