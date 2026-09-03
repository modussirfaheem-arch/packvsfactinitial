SAMPLE_PRODUCTS_DATA = [
    {
        "name": "Muesli High Protein & Nuts",
        "brand": "NutriFit India",
        "category": "Breakfast Cereals",
        "variant": "Nutty Delight",
        "package_size": "400g",
        "barcode": "8901001001001",
        "image_url": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=80",
        "summary": "Popular breakfast muesli advertised as high protein and 100% whole grain. Label reveals high added sugar and moderate sodium per serving.",
        "claims": [
            {"text": "HIGH PROTEIN", "type": "Protein"},
            {"text": "100% WHOLE GRAIN", "type": "Ingredient"},
            {"text": "NO ADDED SUGAR*", "type": "Sugar"},
            {"text": "IMMUNITY BOOSTERS", "type": "Health"}
        ],
        "nutrition": {
            "serving_size": "45g",
            "calories": 185.0,
            "sugar_g": 16.5,
            "added_sugar_g": 12.0,
            "protein_g": 8.5,
            "fiber_g": 3.2,
            "fat_g": 5.1,
            "saturated_fat_g": 1.2,
            "trans_fat_g": 0.0,
            "sodium_mg": 380.0,
            "carbohydrates_g": 26.0
        },
        "ingredients": [
            {"name": "Rolled Oats", "role": "Grain Base", "context": "Primary grain source", "attention_level": "LOW", "position": 1},
            {"name": "Sugar / Invert Sugar Syrup", "role": "Sweetener", "context": "Adds 16.5g total sugar", "attention_level": "ATTENTION", "position": 2},
            {"name": "Almonds & Raisins", "role": "Nuts & Fruit", "context": "Provides natural protein and fiber", "attention_level": "LOW", "position": 3},
            {"name": "Soy Protein Concentrate", "role": "Protein Additive", "context": "Boosts total protein claim", "attention_level": "LOW", "position": 4},
            {"name": "E320 BHA Preservative", "role": "Antioxidant Preservative", "context": "Extends shelf life", "attention_level": "MODERATE", "position": 5}
        ]
    },
    {
        "name": "Oatmeal Digestive Biscuits",
        "brand": "DailyBake",
        "category": "Biscuits & Cookies",
        "variant": "High Fiber",
        "package_size": "200g",
        "barcode": "8901002002002",
        "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
        "summary": "Marketed as a healthy digestive biscuit with oat fiber. Back label indicates palm oil base and 21g sugar per 100g.",
        "claims": [
            {"text": "DIGESTIVE & HIGH FIBER", "type": "Fiber"},
            {"text": "MADE WITH REAL OATS", "type": "Ingredient"},
            {"text": "0% TRANS FAT", "type": "Fat"}
        ],
        "nutrition": {
            "serving_size": "100g",
            "calories": 485.0,
            "sugar_g": 21.0,
            "added_sugar_g": 18.5,
            "protein_g": 6.8,
            "fiber_g": 4.5,
            "fat_g": 21.0,
            "saturated_fat_g": 10.2,
            "trans_fat_g": 0.0,
            "sodium_mg": 490.0,
            "carbohydrates_g": 65.0
        },
        "ingredients": [
            {"name": "Refined Wheat Flour (Maida)", "role": "Refined Flour Base", "context": "Primary ingredient (55%)", "attention_level": "MODERATE", "position": 1},
            {"name": "Palm Oil", "role": "Fat / Vegetable Shortening", "context": "High in saturated fats (10.2g)", "attention_level": "ATTENTION", "position": 2},
            {"name": "Rolled Oats", "role": "Grain", "context": "Contains 12% oats", "attention_level": "LOW", "position": 3},
            {"name": "Sugar", "role": "Sweetener", "context": "21g total sugar per 100g", "attention_level": "ATTENTION", "position": 4},
            {"name": "E503 Leavening Agent", "role": "Raising Agent", "context": "Ammonium bicarbonate", "attention_level": "LOW", "position": 5}
        ]
    },
    {
        "name": "Classic Instant Noodles 2-Min",
        "brand": "NoodleFast",
        "category": "Instant Foods",
        "variant": "Masala Magic",
        "package_size": "70g",
        "barcode": "8901003003003",
        "image_url": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=80",
        "summary": "Popular instant noodle pack claiming goodness of wheat and iron enrichment. Contains 860mg sodium per pack.",
        "claims": [
            {"text": "GOODNESS OF WHEAT", "type": "Grain"},
            {"text": "ENRICHED WITH IRON & VITAMINS", "type": "Micronutrients"},
            {"text": "KIDS FAVORITE HEALTHY SNACK", "type": "Marketing"}
        ],
        "nutrition": {
            "serving_size": "70g",
            "calories": 310.0,
            "sugar_g": 2.1,
            "added_sugar_g": 1.0,
            "protein_g": 6.2,
            "fiber_g": 2.1,
            "fat_g": 12.5,
            "saturated_fat_g": 5.8,
            "trans_fat_g": 0.0,
            "sodium_mg": 860.0,
            "carbohydrates_g": 43.0
        },
        "ingredients": [
            {"name": "Refined Wheat Flour (Maida)", "role": "Base Flour", "context": "Refined carbohydrate", "attention_level": "MODERATE", "position": 1},
            {"name": "Palm Oil", "role": "Frying Oil", "context": "Deep fried noodle cake", "attention_level": "ATTENTION", "position": 2},
            {"name": "Iodized Salt & Tastemaker", "role": "Flavoring & Salt", "context": "Delivers 860mg sodium per 70g pack", "attention_level": "ATTENTION", "position": 3},
            {"name": "E621 Monosodium Glutamate (MSG)", "role": "Flavor Enhancer", "context": "Enhances savory umami taste", "attention_level": "MODERATE", "position": 4}
        ]
    },
    {
        "name": "100% Real Pomegranate Juice",
        "brand": "PureOrchard",
        "category": "Beverages",
        "variant": "No Added Sugar*",
        "package_size": "1L",
        "barcode": "8901004004004",
        "image_url": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80",
        "summary": "Packaged juice claiming 100% real fruit juice without added sugar. Reconstituted from concentrate with 28g natural sugars per 200ml glass.",
        "claims": [
            {"text": "100% REAL FRUIT JUICE", "type": "Fruit"},
            {"text": "NO ADDED SUGAR*", "type": "Sugar"},
            {"text": "RICH IN ANTIOXIDANTS", "type": "Health"}
        ],
        "nutrition": {
            "serving_size": "200ml",
            "calories": 120.0,
            "sugar_g": 28.0,
            "added_sugar_g": 0.0,
            "protein_g": 0.5,
            "fiber_g": 0.4,
            "fat_g": 0.1,
            "saturated_fat_g": 0.0,
            "trans_fat_g": 0.0,
            "sodium_mg": 25.0,
            "carbohydrates_g": 29.0
        },
        "ingredients": [
            {"name": "Reconstituted Pomegranate Juice Concentrate", "role": "Juice Base", "context": "Juice concentrate reconstituted with water", "attention_level": "LOW", "position": 1},
            {"name": "Water", "role": "Diluent", "context": "Standard beverage base", "attention_level": "LOW", "position": 2},
            {"name": "E330 Citric Acid", "role": "Acidity Regulator", "context": "Provides tartness and stability", "attention_level": "LOW", "position": 3}
        ]
    },
    {
        "name": "Greek Yogurt Protein Boost - Blueberry",
        "brand": "ProDairy India",
        "category": "Dairy Products",
        "variant": "Blueberry Bliss",
        "package_size": "150g",
        "barcode": "8901005005005",
        "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
        "summary": "High protein Greek yogurt with live active cultures and real fruit preparation.",
        "claims": [
            {"text": "12G PROTEIN PER CUP", "type": "Protein"},
            {"text": "LIVE ACTIVE CULTURES", "type": "Probiotic"},
            {"text": "LOW FAT", "type": "Fat"}
        ],
        "nutrition": {
            "serving_size": "150g",
            "calories": 130.0,
            "sugar_g": 9.5,
            "added_sugar_g": 4.5,
            "protein_g": 12.0,
            "fiber_g": 1.2,
            "fat_g": 1.5,
            "saturated_fat_g": 0.9,
            "trans_fat_g": 0.0,
            "sodium_mg": 65.0,
            "carbohydrates_g": 16.0
        },
        "ingredients": [
            {"name": "Pasteurized Toned Milk", "role": "Dairy Base", "context": "Quality milk base", "attention_level": "LOW", "position": 1},
            {"name": "Blueberry Fruit Preparation", "role": "Fruit Flavoring", "context": "Real blueberry puree and fruit sugar", "attention_level": "LOW", "position": 2},
            {"name": "Milk Protein Concentrate", "role": "Protein Boost", "context": "Reaches 12g protein threshold", "attention_level": "LOW", "position": 3},
            {"name": "Probiotic Cultures (S. thermophilus, L. bulgaricus)", "role": "Gut Culture", "context": "Supports gut microbiome", "attention_level": "LOW", "position": 4}
        ]
    }
]
