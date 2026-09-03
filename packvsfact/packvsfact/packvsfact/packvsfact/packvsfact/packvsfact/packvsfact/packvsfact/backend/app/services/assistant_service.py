"""
Local Multilingual Food AI Assistant Service (PACKVSFACT)
Answers consumer queries locally in 10 Indian languages without external paid APIs:
English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi.
Uses intent classification, product database retrieval, and rule templates.
"""

from typing import Dict, Any, List

class AssistantService:
    SUPPORTED_LANGUAGES = {
        "en": "English",
        "hi": "Hindi (हिंदी)",
        "mr": "Marathi (मराठी)",
        "ta": "Tamil (தமிழ்)",
        "te": "Telugu (తెలుగు)",
        "bn": "Bengali (বাংলা)",
        "gu": "Gujarati (ગુજરાતી)",
        "kn": "Kannada (કન્નડ)",
        "ml": "Malayalam (മലയാളം)",
        "pa": "Punjabi (ਪੰਜਾਬੀ)"
    }

    @classmethod
    def answer_query(cls, query: str, lang: str = "en", product_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Processes query locally and returns response in requested language.
        """
        query_lower = query.lower()
        
        # Intent 1: What is NOVA / Explanation
        if any(w in query_lower for w in ["nova", "processing", "ultra-processed", "प्रोसेसिंग", "नोवा"]):
            intent = "EXPLAIN_NOVA"
            responses = {
                "en": "NOVA classifies foods into 4 groups: NOVA 1 (Unprocessed/Whole Foods), NOVA 2 (Culinary Ingredients like oil/salt), NOVA 3 (Processed Foods), and NOVA 4 (Ultra-Processed Foods with industrial additives like emulsifiers, INS 621, and palm oil). PackVsFact uses ML models to analyze ingredient lists for ultra-processing markers.",
                "hi": "NOVA खाद्य पदार्थों को 4 श्रेणियों में वर्गीकृत करता है: NOVA 1 (असंस्कृत/प्राकृतिक), NOVA 2 (रसोई सामग्री जैसे तेल/नमक), NOVA 3 (प्रसंस्कृत खाद्य पदार्थ), और NOVA 4 (अल्ट्रा-प्रोसेस खाद्य पदार्थ जिनमें पायसीकारी, INS 621, और पाम ऑयल जैसे औद्योगिक घटक होते हैं)।",
                "mr": "NOVA अन्नाचे ४ गटांमध्ये वर्गीकरण करते: NOVA 1 (अप्रक्रियाकृत), NOVA 2 (स्वयंपाकघरातील घटक), NOVA 3 (प्रक्रिया केलेले अन्न), आणि NOVA 4 (अल्ट्रा-प्रोसेस केलेले अन्न).",
                "ta": "NOVA உணவுகளை 4 குழுக்களாக வகைப்படுத்துகிறது: NOVA 1 (பதப்படுத்தப்படாதவை), NOVA 2 (சமையல் பொருட்கள்), NOVA 3 (பதப்படுத்தப்பட்டவை), NOVA 4 (அல்ட்ரா-பிராஸஸ் செய்யப்பட்டவை).",
                "te": "NOVA ఆహారాన్ని 4 రకాలుగా వర్గీకరిస్తుంది: NOVA 1 (సహజమైనవి), NOVA 2 (వంట పదార్థాలు), NOVA 3 (ప్రాసెస్ చేసినవి), NOVA 4 (అల్ట్రా-ప్రాసెస్ చేసినవి).",
                "bn": "NOVA খাদ্যদ্রব্যকে ৪টি ভাগে ভাগ করে: NOVA ১ (অসংরক্ষিত), NOVA ২ (রান্নার উপাদান), NOVA ৩ (প্রক্রিয়াজাত খাদ্য), এবং NOVA ৪ (অতি-প্রক্রিয়াজাত খাদ্য)।",
                "gu": "NOVA ખોરાકને 4 જૂથોમાં વર્ગીકૃત કરે છે: NOVA 1 (અસંસ્કૃત), NOVA 2 (રસોઈ સામગ્રી), NOVA 3 (પ્રોસેસ્ડ), NOVA 4 (અલ્ટ્રા-પ્રોસેસ્ડ).",
                "kn": "NOVA ಆಹಾರವನ್ನು 4 ಗುಂಪುಗಳಾಗಿ ವಿಂಗಡಿಸುತ್ತದೆ: NOVA 1 (ಸಹಜ), NOVA 2 (ಅಡುಗೆ ಪದಾರ್ಥಗಳು), NOVA 3 (ಸಂಸ್ಕರಿಸಿದ), NOVA 4 (ಅಲ್ಟ್ರಾ-ಸಂಸ್ಕರಿಸಿದ).",
                "ml": "NOVA ഭക്ഷണത്തെ 4 ഗ്രൂപ്പുകളായി തിരിക്കുന്നു: NOVA 1 (സംസ്കരിക്കാത്തവ), NOVA 2 (പാചക ചേരുവകൾ), NOVA 3 (സംസ്കരിച്ചവ), NOVA 4 (അൾട്രാ-പ്രൊസസ്സ് ചെയ്തവ).",
                "pa": "NOVA ਭੋਜਨ ਨੂੰ 4 ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ: NOVA 1 (ਕੁਦਰਤੀ), NOVA 2 (ਰਸੋਈ ਸਮੱਗਰੀ), NOVA 3 (ਪ੍ਰੋਸੈਸਡ), NOVA 4 (ਅਲਟ੍ਰਾ-ਪ੍ਰੋਸੈਸਡ)।"
            }
            answer = responses.get(lang, responses["en"])

        # Intent 2: Nutri-Score Explanation
        elif any(w in query_lower for w in ["nutri-score", "nutriscore", "grade", "न्यूट्रि-स्कोर", "स्कोर"]):
            intent = "EXPLAIN_NUTRISCORE"
            responses = {
                "en": "Nutri-Score is an official European standard (A to E grade) that ranks food nutritional quality per 100g. Grades A and B are high in fibre, protein, and fruits/vegetables. Grades D and E are high in sugars, saturated fat, sodium, or energy density.",
                "hi": "न्यूट्रि-स्कोर (Nutri-Score) प्रति 100 ग्राम पोषण गुणवत्ता का मूल्यांकन करता है (A से E)। A और B ग्रेड बेहतर फाइबर और प्रोटीन दर्शाते हैं, जबकि D और E उच्च चीनी, संतृप्त वसा और सोडियम दर्शाते हैं।",
                "mr": "न्यूट्रि-स्कोर दर १०० ग्रॅम अन्नाची पोषण गुणवत्ता (A ते E) दर्शवतो.",
                "ta": "Nutri-Score என்பது 100 கிராமிற்கு உணவின் ஊட்டச்சத்து தரத்தை (A முதல் E வரை) மதிப்பிடுகிறது.",
                "te": "Nutri-Score ప్రతి 100 గ్రాముల ఆహార పోషక విలువలను (A నుండి E వరకు) లెక్కిస్తుంది.",
                "bn": "Nutri-Score প্রতি ১০০ গ্রামে খাবারের পুষ্টির মান (A থেকে E) নির্দেশ করে।",
                "gu": "Nutri-Score દર 100 ગ્રામ ખોરાકની પોષક ગુણવત્તા (A થી E) માપે છે.",
                "kn": "Nutri-Score ಪ್ರತಿ 100 ಗ್ರಾಂ ಆಹಾರದ ಪೌಷ್ಟಿಕಾಂಶದ ಮೌಲ್ಯವನ್ನು (A ಯಿಂದ E) ಅಳೆಯುತ್ತದೆ.",
                "ml": "Nutri-Score ഓരോ 100 ഗ്രാമിലെയും പോഷക ഗുണനിലവാരം (A മുതൽ E വരെ) അളക്കുന്നു.",
                "pa": "Nutri-Score ਹਰ 100 ਗ੍ਰਾਮ ਭੋਜਨ ਦੀ ਪੋਸ਼ਕ ਗੁਣਵੱਤਾ (A ਤੋਂ E) ਦੱਸਦਾ ਹੈ।"
            }
            answer = responses.get(lang, responses["en"])

        # Intent 3: Alternatives / Cheaper options
        elif any(w in query_lower for w in ["alternative", "cheaper", "substitute", "विकल्प", "સસ્તા", "மலிவான"]):
            intent = "FIND_ALTERNATIVES"
            responses = {
                "en": "PackVsFact can find healthier alternatives under your preferred budget (e.g. ≤ ₹30) by evaluating nutrient improvement, lower sodium/sugar, and lower NOVA processing levels.",
                "hi": "PackVsFact आपके बजट (जैसे ₹30 से कम) के अनुसार स्वस्थ और किफायती विकल्प ढूंढ सकता है, जो कम चीनी, कम सोडियम और बेहतर फाइबर प्रदान करते हैं।",
                "mr": "PackVsFact तुमच्या बजेटनुसार (उदा. ₹30 पेक्षा कमी) आरोग्यदायी पर्याय शोधू शकते.",
                "ta": "PackVsFact உங்கள் பட்ஜெட்டில் (எ.கா. ₹30-க்குள்) ஆரோக்கியமான மாற்றுகளைக் கண்டறியும்.",
                "te": "PackVsFact మీ బడ్జెట్ (ఉదా. ₹30 లోపు) ప్రకారం ఆరోగ్యకరమైన ప్రత్యామ్నాయాలను చూపుతుంది.",
                "bn": "PackVsFact আপনার বাজেটের মধ্যে (যেমন ₹৩০ এর নিচে) স্বাস্থ্যকর বিকল্প খুঁজে দিতে পারে।",
                "gu": "PackVsFact તમારા બજેટમાં (દા.ત. ₹30 ની અંદર) સ્વસ્થ વિકલ્પો શોધી શકે છે.",
                "kn": "PackVsFact ನಿಮ್ಮ ಬಜೆಟ್‌ನಲ್ಲಿ (ಉದಾ. ₹30 ಒಳಗೆ) ಆರೋಗ್ಯಕರ ಪರ್ಯಾಯಗಳನ್ನು ನೀಡುತ್ತದೆ.",
                "ml": "PackVsFact നിങ്ങളുടെ ബഡ്ജറ്റിൽ (ഉദാ. ₹30-ൽ താഴെ) മികച്ച ബദലുകൾ കണ്ടെത്തുന്നു.",
                "pa": "PackVsFact ਤੁਹਾਡੇ ਬਜਟ (ਜਿਵੇਂ ₹30 ਤੋਂ ਘੱਟ) ਵਿੱਚ ਸਿਹਤਮੰਦ ਵਿਕਲਪ ਲੱਭਦਾ ਹੈ।"
            }
            answer = responses.get(lang, responses["en"])

        # Default / General Query
        else:
            intent = "GENERAL_FOOD_ASSISTANT"
            if product_context:
                answer = f"Product Context: {product_context.get('name', 'Packaged Product')}. Nutri-Score: {product_context.get('nutri_score_grade', 'N/A')}, NOVA: Group {product_context.get('nova_group', 'N/A')}. PackVsFact Insight Score: {product_context.get('insight_score', 'N/A')}/100."
            else:
                answer = f"I am PackVsFact's Local AI Assistant running entirely offline. Ask me about Nutri-Score, NOVA groups, ingredient risks, claim verification, or budget-friendly alternatives under ₹30!"

        return {
            "query": query,
            "language": lang,
            "language_name": cls.SUPPORTED_LANGUAGES.get(lang, "English"),
            "intent": intent,
            "answer": answer,
            "execution_mode": "LOCAL_NLP_ENGINE",
            "paid_api_used": False
        }
