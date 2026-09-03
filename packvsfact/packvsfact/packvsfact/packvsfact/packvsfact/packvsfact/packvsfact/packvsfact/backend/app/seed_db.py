"""
Database Seed Script (PACKVSFACT)
Populates database with 50+ realistic Indian packaged food items, admin & user accounts,
nutrition profiles, ingredients, claim verifications, prices, and demand baseline records.
"""

import os
import sys

# Add project root and backend folder to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

sys.stdout.reconfigure(encoding='utf-8')

from sqlalchemy.orm import Session
from datetime import datetime
from passlib.context import CryptContext

from app.database import engine, Base, SessionLocal
from app.services.security_service import SecurityService
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
    "Ready-to-Eat", "Frozen Snacks", "Dairy Products", "Protein Supplements", "Healthy Snacks"
]

SAMPLE_PRODUCTS = [
    {
        "barcode": "8901058000108",
        "name": "Maggi 2-Minute Masala Instant Noodles",
        "brand": "Nestlé",
        "category": "Instant Noodles",
        "serving_size": "70g",
        "price": 14.0,
        "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400",
        "ingredients": "Refined wheat flour (Maida), Palm oil, Salt, Wheat gluten, Sugar, Garlic powder, Hydrolyzed peanut protein, Spices and condiments, Acidity regulator (INS 330), Flavour enhancer (INS 621), Thickener (INS 508), Humectant (INS 451(i)).",
        "calories": 427.0, "sugar_g": 2.1, "added_sugar": 0.5, "protein_g": 8.0, "fibre_g": 3.6, "sat_fat_g": 6.8, "total_fat_g": 15.7, "sodium_mg": 1020.0,
        "claims": [("Rich in Iron & Protein", "NOT SUPPORTED BY CURRENT DATA"), ("2-Minute Quick Snack", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901030001234",
        "name": "Parle-G Original Glucose Biscuits",
        "brand": "Parle",
        "category": "Biscuits & Cookies",
        "serving_size": "50g",
        "price": 10.0,
        "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
        "ingredients": "Refined wheat flour (Maida), Sugar, Refined palm oil, Invert sugar syrup, Leavening agents (INS 503(ii), INS 500(ii)), Milk solids, Salt, Dough conditioner (INS 223), Artificial vanilla flavour.",
        "calories": 454.0, "sugar_g": 26.3, "added_sugar": 25.0, "protein_g": 6.5, "fibre_g": 1.2, "sat_fat_g": 6.0, "total_fat_g": 13.5, "sodium_mg": 280.0,
        "claims": [("Glucose Energy", "SUPPORTED BY AVAILABLE DATA"), ("Good Source of Calcium", "NEEDS VERIFICATION")]
    },
    {
        "barcode": "8901491101234",
        "name": "Lay's India's Magic Masala Potato Chips",
        "brand": "Lay's",
        "category": "Chips & Crisps",
        "serving_size": "50g",
        "price": 20.0,
        "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
        "ingredients": "Potato, Edible vegetable oil (Palmolein), Seasoning (Spices & condiments, Salt, Black salt, Sugar, Onion powder, Mango powder, Acidity regulators (INS 330, INS 296), Flavour enhancers (INS 627, INS 631)).",
        "calories": 544.0, "sugar_g": 3.5, "added_sugar": 2.0, "protein_g": 7.0, "fibre_g": 3.8, "sat_fat_g": 14.5, "total_fat_g": 33.5, "sodium_mg": 790.0,
        "claims": [("Made with 100% Quality Potatoes", "SUPPORTED BY AVAILABLE DATA"), ("Trans Fat Free", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901725101001",
        "name": "Haldiram's Nagpur Aloo Bhujia",
        "brand": "Haldiram's",
        "category": "Namkeen & Savouries",
        "serving_size": "40g",
        "price": 25.0,
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        "ingredients": "Potato, Edible vegetable oil (Cottonseed oil, Palmolein), Gram flour (Besan), Tepary bean flour (Moth flour), Starch, Salt, Red chilli powder, Black pepper, Ginger powder, Clove, Acidity regulator (INS 330).",
        "calories": 578.0, "sugar_g": 1.2, "added_sugar": 0.0, "protein_g": 9.2, "fibre_g": 4.5, "sat_fat_g": 15.0, "total_fat_g": 41.0, "sodium_mg": 840.0,
        "claims": [("Traditional Taste", "SUPPORTED BY AVAILABLE DATA"), ("Zero Cholesterol", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901058881234",
        "name": "Quaker Rolled Oats 100% Whole Grain",
        "brand": "Quaker",
        "category": "Breakfast Cereals & Oats",
        "serving_size": "40g",
        "price": 60.0,
        "image": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400",
        "ingredients": "100% Rolled Oats.",
        "calories": 389.0, "sugar_g": 0.8, "added_sugar": 0.0, "protein_g": 11.8, "fibre_g": 10.5, "sat_fat_g": 1.2, "total_fat_g": 6.5, "sodium_mg": 9.0,
        "claims": [("100% Whole Grain", "SUPPORTED BY AVAILABLE DATA"), ("Helps Reduce Cholesterol", "SUPPORTED BY AVAILABLE DATA"), ("High Fibre & Protein", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901058990011",
        "name": "True Elements Whole Oatmeal & Chia",
        "brand": "True Elements",
        "category": "Breakfast Cereals & Oats",
        "serving_size": "40g",
        "price": 30.0,
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        "ingredients": "Rolled Oats (85%), Chia seeds (10%), Raw Almonds (5%). No added sugar.",
        "calories": 395.0, "sugar_g": 1.0, "added_sugar": 0.0, "protein_g": 13.5, "fibre_g": 11.2, "sat_fat_g": 1.1, "total_fat_g": 7.2, "sodium_mg": 12.0,
        "claims": [("High Fibre", "SUPPORTED BY AVAILABLE DATA"), ("Zero Added Sugar", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901765001122",
        "name": "Coca-Cola Original Taste Carbonated Drink",
        "brand": "Coca-Cola",
        "category": "Soft Drinks & Carbonated",
        "serving_size": "250ml",
        "price": 20.0,
        "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
        "ingredients": "Carbonated water, Sugar, Acidity regulator (INS 338), Caramel colour (INS 150d), Flavours (Natural flavouring substances), Caffeine.",
        "calories": 44.0, "sugar_g": 10.6, "added_sugar": 10.6, "protein_g": 0.0, "fibre_g": 0.0, "sat_fat_g": 0.0, "total_fat_g": 0.0, "sodium_mg": 11.0,
        "claims": [("Refreshing Taste", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901765009988",
        "name": "Raw Pressery Cold Pressed Coconut Water",
        "brand": "Raw Pressery",
        "category": "Fruit Juices & Beverages",
        "serving_size": "200ml",
        "price": 50.0,
        "image": "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
        "ingredients": "100% Tender Coconut Water.",
        "calories": 19.0, "sugar_g": 3.8, "added_sugar": 0.0, "protein_g": 0.7, "fibre_g": 0.0, "sat_fat_g": 0.0, "total_fat_g": 0.0, "sodium_mg": 45.0,
        "claims": [("100% Natural", "SUPPORTED BY AVAILABLE DATA"), ("No Added Sugar", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901234005566",
        "name": "Cadbury Dairy Milk Chocolate",
        "brand": "Cadbury",
        "category": "Chocolates & Confectionery",
        "serving_size": "40g",
        "price": 40.0,
        "image": "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
        "ingredients": "Sugar, Cocoa butter, Milk solids (16%), Cocoa solids, Emulsifiers (INS 442, INS 476), Flavours (Natural and Nature Identical Vanilla).",
        "calories": 532.0, "sugar_g": 57.0, "added_sugar": 48.0, "protein_g": 7.8, "fibre_g": 2.0, "sat_fat_g": 18.5, "total_fat_g": 30.0, "sodium_mg": 140.0,
        "claims": [("100% Sustainably Sourced Cocoa", "SUPPORTED BY AVAILABLE DATA")]
    },
    {
        "barcode": "8901000112233",
        "name": "Kissan Fresh Tomato Ketchup",
        "brand": "Kissan",
        "category": "Sauces & Condiments",
        "serving_size": "15g",
        "price": 15.0,
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        "ingredients": "Water, Tomato paste (28%), Sugar, Salt, Acidity regulator (INS 260), Thickening agents (INS 1422, INS 415), Preservative (INS 211), Spices and condiments.",
        "calories": 140.0, "sugar_g": 28.5, "added_sugar": 24.0, "protein_g": 1.2, "fibre_g": 0.8, "sat_fat_g": 0.0, "total_fat_g": 0.1, "sodium_mg": 920.0,
        "claims": [("Made with 100% Real Tomatoes", "SUPPORTED BY AVAILABLE DATA")]
    }
]

CATEGORIES_TEMPLATES = [
    ("Amul Taaza Toned Fresh Milk", "Amul", "Dairy Products", 30.0, 58.0, 4.8, 0.0, 3.2, 0.0, 2.1, 48.0, "Toned Milk, Vitamin A, Vitamin D.", 1, "A"),
    ("Epigamia Greek Yogurt Natural", "Epigamia", "Dairy Products", 45.0, 85.0, 3.5, 0.0, 7.5, 0.0, 1.2, 55.0, "Pasteurized Milk, Active Yogurt Cultures.", 1, "A"),
    ("Saffola Masala Oats Classic", "Saffola", "Breakfast Cereals & Oats", 20.0, 380.0, 5.0, 0.0, 8.5, 7.0, 2.0, 650.0, "Rolled Oats (73%), Dehydrated vegetables, Spices, Salt, Hydrolyzed vegetable protein.", 4, "C"),
    ("Bisk Farm Digestives Wheat Biscuits", "Bisk Farm", "Biscuits & Cookies", 25.0, 440.0, 14.0, 10.0, 7.0, 6.0, 5.5, 340.0, "Whole wheat flour, Wheat bran, Vegetable fat, Sugar, Salt, INS 500.", 3, "B"),
    ("Sunfeast Dark Fantasy Choco Fills", "Sunfeast", "Biscuits & Cookies", 35.0, 510.0, 38.0, 32.0, 5.5, 1.5, 12.0, 290.0, "Refined wheat flour, Sugar, Hydrogenated vegetable oil, Cocoa solids, INS 322.", 4, "E"),
    ("Bingo Mad Angles Achari Masti", "Bingo", "Chips & Crisps", 20.0, 530.0, 4.0, 2.0, 6.0, 3.0, 13.0, 810.0, "Corn meal, Rice meal, Palmolein, Seasoning, Mango powder, INS 330, INS 627.", 4, "D"),
    ("NutriChoice Digestive High Fibre", "Britannia", "Biscuits & Cookies", 30.0, 460.0, 15.0, 12.0, 8.2, 7.5, 6.5, 320.0, "Whole wheat flour (55%), Wheat bran, Vegetable oil, Sugar, Invert syrup, Salt.", 3, "B"),
    ("Paper Boat Aamras Mango Juice", "Paper Boat", "Fruit Juices & Beverages", 35.0, 60.0, 13.5, 10.0, 0.2, 0.5, 0.0, 15.0, "Water, Mango pulp (45%), Sugar, Acidity regulator (INS 330), Vitamin C.", 3, "C"),
    ("Real 100% Mixed Fruit Juice", "Dabur Real", "Fruit Juices & Beverages", 110.0, 52.0, 12.0, 0.0, 0.4, 0.6, 0.0, 10.0, "Mixed fruit juice concentrate (Apple, Mango, Guava, Orange), No added sugar.", 2, "B"),
    ("MTR Ready to Eat Paneer Butter Masala", "MTR", "Ready-to-Eat", 120.0, 180.0, 4.0, 1.0, 6.5, 2.5, 8.0, 580.0, "Paneer (25%), Tomato, Onion, Cashew, Cream, Butter, Spices, Salt.", 3, "C"),
    ("Yippee Mood Masala Noodles", "Sunfeast", "Instant Noodles", 15.0, 435.0, 3.0, 1.0, 8.5, 3.2, 7.0, 980.0, "Refined wheat flour, Palm oil, Salt, Spices, INS 500, INS 621, INS 635.", 4, "D"),
    ("Kurkure Masala Munch Crisp", "Kurkure", "Namkeen & Savouries", 20.0, 560.0, 2.5, 1.0, 6.0, 2.8, 14.0, 890.0, "Rice meal, Corn meal, Palmolein, Gram meal, Spices, Salt, INS 330, INS 627.", 4, "E"),
    ("Tropicana 100% Orange Juice", "Tropicana", "Fruit Juices & Beverages", 95.0, 48.0, 10.5, 0.0, 0.7, 0.4, 0.0, 5.0, "100% Orange juice concentrate, Vitamin C.", 2, "B"),
    ("Catch Sprinklers Chat Masala", "Catch", "Sauces & Condiments", 40.0, 120.0, 2.0, 0.0, 3.0, 4.0, 0.2, 12000.0, "Salt, Black salt, Dry mango, Cumin, Mint, Pomegranate seeds, INS 330.", 2, "C"),
    ("Mother Dairy Classic Dahi", "Mother Dairy", "Dairy Products", 35.0, 60.0, 4.2, 0.0, 3.8, 0.0, 2.0, 50.0, "Pasteurized Toned Milk, Lactic Culture.", 1, "A"),
    ("Amul Dark Chocolate 55% Cocoa", "Amul", "Chocolates & Confectionery", 100.0, 540.0, 42.0, 35.0, 7.0, 6.0, 20.0, 30.0, "Sugar, Cocoa solids, Cocoa butter, Permitted emulsifier (INS 322), Vanilla.", 3, "C"),
    ("Unibic Multigrain Digestive Cookies", "Unibic", "Biscuits & Cookies", 40.0, 470.0, 16.0, 12.0, 7.5, 8.0, 7.0, 310.0, "Whole wheat flour, Oats, Ragi, Bajra, Sesame, Vegetable oil, Sugar, Salt.", 3, "B"),
    ("Nestlé Everyday Dairy Whitener", "Nestlé", "Dairy Products", 220.0, 445.0, 40.0, 32.0, 14.0, 0.0, 10.0, 220.0, "Milk solids, Sugar.", 3, "D"),
    ("Nutrella Soya Chunks High Protein", "Nutrela", "Protein Supplements", 50.0, 345.0, 0.5, 0.0, 52.0, 13.0, 0.2, 20.0, "100% Defatted Soy Flour.", 1, "A"),
    ("Organic Tattva Brown Rice", "Organic Tattva", "Healthy Snacks", 110.0, 360.0, 0.5, 0.0, 7.5, 3.5, 0.8, 5.0, "100% Organic Whole Brown Basmati Rice.", 1, "A"),
    ("Knorr Soupy Noodles Tomato", "Knorr", "Instant Noodles", 15.0, 390.0, 8.0, 5.0, 7.2, 2.5, 5.0, 880.0, "Wheat flour, Palm oil, Tomato paste, Dehydrated veg, Salt, INS 621.", 4, "D"),
    ("Veeba Peanut Butter Crunch", "Veeba", "Spreads & Jams", 150.0, 620.0, 10.0, 6.0, 24.0, 7.0, 10.0, 380.0, "Roasted Peanuts (90%), Sugar, Hydrogenated vegetable oil, Salt.", 3, "B"),
    ("Patanjali Whole Wheat Atta", "Patanjali", "Healthy Snacks", 240.0, 340.0, 1.8, 0.0, 12.0, 11.0, 0.4, 3.0, "100% Whole Wheat Grain Flour.", 1, "A"),
    ("Ching's Secret Schezwan Chutney", "Ching's Secret", "Sauces & Condiments", 85.0, 210.0, 14.0, 10.0, 2.0, 1.5, 8.0, 1450.0, "Water, Chilli, Garlic, Sunflower oil, Salt, Sugar, INS 260, INS 621, INS 211.", 4, "E"),
    ("Saffola Active Edible Oil Blend", "Saffola", "Healthy Snacks", 190.0, 900.0, 0.0, 0.0, 0.0, 0.0, 14.0, 0.0, "Rice Bran Oil (80%), Soyabean Oil (20%), Oryzanol, Vitamin A & D.", 2, "C"),
    ("B Natural Mixed Fruit Beverage", "ITC B Natural", "Fruit Juices & Beverages", 30.0, 56.0, 13.0, 10.0, 0.3, 0.5, 0.0, 12.0, "Water, Fruit pulp (35%), Sugar, Acidity regulator (INS 330), Vitamin C.", 3, "C"),
    ("Act II Golden Sizzle Microwave Popcorn", "Act II", "Namkeen & Savouries", 35.0, 510.0, 1.0, 0.0, 8.0, 9.0, 12.0, 950.0, "Popping Corn, Edible vegetable fat, Salt, Butter flavour, INS 160a.", 3, "D"),
    ("Lipton Green Tea Honey Lemon", "Lipton", "Fruit Juices & Beverages", 160.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, "Green Tea, Nature identical Honey & Lemon flavours.", 1, "A"),
    ("Bournvita Health Drink Chocolate", "Cadbury", "Protein Supplements", 240.0, 385.0, 70.0, 32.0, 7.0, 2.5, 0.8, 180.0, "Malt extract, Sugar, Cocoa solids, Milk solids, Vitamins & Minerals, INS 500.", 3, "C"),
    ("Horlicks Health Drink Classic Malt", "Horlicks", "Protein Supplements", 250.0, 375.0, 58.0, 24.0, 11.0, 3.5, 0.9, 320.0, "Cereal extract, Wheat flour, Malted barley, Milk solids, Sugar, Minerals.", 3, "C"),
    ("Dabur Honey 100% Pure", "Dabur", "Spreads & Jams", 195.0, 320.0, 80.0, 0.0, 0.3, 0.2, 0.0, 15.0, "100% Pure Natural Honey.", 2, "C"),
    ("Hershey's Chocolate Syrup", "Hershey's", "Spreads & Jams", 210.0, 270.0, 60.0, 52.0, 1.0, 2.0, 0.2, 40.0, "High fructose corn syrup, Water, Sugar, Cocoa, INS 202, INS 415.", 4, "E"),
    ("Nescafé Classic Instant Coffee", "Nescafé", "Fruit Juices & Beverages", 175.0, 2.0, 0.0, 0.0, 0.2, 0.0, 0.0, 2.0, "100% Pure Coffee Powder.", 1, "A"),
    ("Tata Tea Gold Premium Black Tea", "Tata Tea", "Fruit Juices & Beverages", 140.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, "100% Indian Black Tea Leaves with Long Leaf orthodoxy.", 1, "A"),
    ("Milky Mist Paneer Fresh", "Milky Mist", "Dairy Products", 110.0, 290.0, 2.0, 0.0, 18.0, 0.0, 14.0, 40.0, "Pasteurized Whole Milk, Citric Acid.", 1, "A"),
    ("McCain French Fries Crispy", "McCain", "Frozen Snacks", 115.0, 160.0, 0.5, 0.0, 2.5, 2.2, 1.8, 120.0, "Potato (92%), Palmolein oil, Salt.", 3, "B"),
    ("Godrej Yummiez Chicken Nuggets", "Godrej Yummiez", "Frozen Snacks", 180.0, 240.0, 1.0, 0.0, 14.0, 1.5, 6.0, 540.0, "Chicken meat (55%), Breadcrumbs, Wheat flour, Palm oil, Spices, INS 451.", 4, "C"),
    ("Slurrp Farm Ragi Millet Pancakes", "Slurrp Farm", "Breakfast Cereals & Oats", 199.0, 370.0, 14.0, 8.0, 9.5, 8.5, 1.5, 180.0, "Ragi flour, Foxtail millet flour, Oats, Jaggery, Cocoa powder, Baking powder.", 2, "A"),
    ("Farmley Roasted Makhana Salt & Pepper", "Farmley", "Healthy Snacks", 149.0, 410.0, 1.0, 0.0, 9.0, 12.0, 2.0, 420.0, "Foxnuts (Makhana 85%), Olive oil, Black pepper, Rock salt.", 2, "A"),
    ("Yoga Bar Protein Bar Chocolate Chunk", "Yoga Bar", "Protein Supplements", 60.0, 410.0, 12.0, 4.0, 20.0, 9.0, 4.5, 150.0, "Whey protein, Almonds, Dates, Cocoa, Honey, Chia seeds.", 2, "A")
]

def seed_database():
    db: Session = SessionLocal()
    try:
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

        category_map = {}
        for cat_name in INDIAN_CATEGORIES:
            cat = Category(name=cat_name, description=f"Indian market food category for {cat_name}")
            db.add(cat)
            category_map[cat_name] = cat
        db.commit()

        admin_pass = SecurityService.hash_password("Admin@123456")
        user_pass = SecurityService.hash_password("User@123456")

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

        inserted_count = 0
        all_products_raw = SAMPLE_PRODUCTS.copy()

        base_code = 8901000990000
        for i, t in enumerate(CATEGORIES_TEMPLATES):
            code_str = str(base_code + i)
            all_products_raw.append({
                "barcode": code_str,
                "name": t[0], "brand": t[1], "category": t[2], "serving_size": "100g",
                "price": t[3], "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "ingredients": t[11],
                "calories": t[4], "sugar_g": t[5], "added_sugar": t[6], "protein_g": t[7], "fibre_g": t[8], "sat_fat_g": t[9], "total_fat_g": t[9]*2, "sodium_mg": t[10],
                "claims": [("Quality Guaranteed", "SUPPORTED BY AVAILABLE DATA")]
            })

        for pdata in all_products_raw:
            nutri_res = NutriScoreEngine.calculate(
                energy_kj=pdata["calories"] * 4.184,
                sugars_g=pdata["sugar_g"],
                sat_fat_g=pdata["sat_fat_g"],
                sodium_mg=pdata["sodium_mg"],
                fibre_g=pdata["fibre_g"],
                protein_g=pdata["protein_g"],
                is_beverage="Juices" in pdata["category"] or "Soft Drinks" in pdata["category"]
            )

            nova_res = NovaClassifier.classify(pdata["ingredients"], pdata["category"])

            insight_score = int(max(10, min(98, 100 - (pdata["sugar_g"] * 0.8) - (pdata["sat_fat_g"] * 1.8) - (pdata["sodium_mg"] / 35.0) + (pdata["fibre_g"] * 2.5) + (pdata["protein_g"] * 1.5) - ((nova_res["nova"] - 1) * 7))))

            p_rec = Product(
                barcode=pdata["barcode"],
                name=pdata["name"],
                brand=pdata["brand"],
                category=pdata["category"],
                serving_size=pdata["serving_size"],
                price=pdata["price"],
                currency="INR",
                image=pdata["image"],
                ingredients_text=pdata["ingredients"],
                nutri_score_grade=nutri_res["grade"],
                nutri_score_value=nutri_res["score"],
                nova_group=nova_res["nova"],
                insight_score=insight_score,
                verification_status="DEMO"
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
        print(f"[SUCCESS] Successfully seeded database with {inserted_count} Indian food products!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database()
