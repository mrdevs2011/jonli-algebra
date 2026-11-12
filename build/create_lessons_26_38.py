#!/usr/bin/env python3
"""
create_lessons_26_38.py — 26-darsdan 38-darsgacha bo'lgan barcha qolgan darslarni
to'liq yaratish va build qilish skripti.
"""
import os
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path("/home/muhamad/MR/jonli-algebra")
LESSONS_BASE = ROOT / "lessons" / "math" / "9"
KITOB_DIR = ROOT / "kitob"

def crop_box(page_num, top, bottom, out_path):
    img_path = KITOB_DIR / f"kitob-{page_num}.png"
    im = Image.open(img_path)
    w, h = im.size
    top = max(0, min(top, h - 10))
    bottom = max(top + 10, min(bottom, h))
    cropped = im.crop((0, top, w, bottom))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(out_path)
    return w, cropped.size[1]

def make_sahifa(page_num):
    return {
        "img": f"../../../../kitob/kitob-{page_num}.png",
        "bet": f"{page_num}-bet",
        "width": 640,
        "height": 758
    }

LESSONS_DATA = [
    # =========================================================================
    # 26-DARS: Keltirish formulalari (129-135-betlar)
    # =========================================================================
    {
        "id": 26,
        "bob": {"roman": "III", "nom": "Trigonometriya elementlari"},
        "paragraf": "26-§",
        "title": "Keltirish formulalari",
        "lead": "Istalgan burchakning trigonometrik funksiyalarini 0° dan 90° gacha bo'lgan o'tkir burchak funksiyalariga keltirish formulalari va qoidalari.",
        "prev": {"href": "../25/", "label": "25-dars"},
        "next": {"href": "../27/", "label": "27-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 25-§ (ikkilangan burchak) ni eslash"},
            {"min": 7, "name": "Sahna — burchakni birlik aylanada burish va chorak ishoralari"},
            {"min": 8, "name": "Qoida — π/2±α va π±α keltirish qoidalari"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 310, 311, 312-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "unit-circle",
            "ariaLabel": "Interaktiv chizma: keltirish formulalari va burchak",
            "hint": "Slayderni suring — burchak o'zgarganda uning o'tkir burchakka keltirilgan qiymati va ishorasi ko'rinadi.",
            "vars": {"t": {"min": 0, "max": 360, "step": 15, "value": 150, "desc": "burchak α (gradus)"}},
            "notes": {
                "q1": "α = {t}° — I chorakda, qiymatlar to'g'ridan-to'g'ri hisoblanadi.",
                "q2": "α = {t}° — II chorakda: sin(180°−α) = sinα, cos(180°−α) = −cosα.",
                "q3": "α = {t}° — III chorakda: sin va cos manfiy, tg musbat.",
                "q4": "α = {t}° — IV chorakda: cos musbat, sin manfiy."
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">25-§da <strong>ikkilangan burchak</strong> formulalarini o'rgangan edik. Endi istalgan katta (yoki manfiy) burchakning sinus, kosinus va tangensini 0° dan 90° gacha bo'lgan o'tkir burchakka keltirish usullarini ko'ramiz.</p>",
            "<p>Keltirish formulalari 2 ta asosiy qoidaga bo'ysunadi: 1) Funksiya nomi o'zgaradimi (π/2, 3π/2 da o'zgaradi, π, 2π da o'zgarmaydi); 2) Boshlang'ich funksiyaning shu chorakdagi ishorasi saqlanadi.</p>"
        ],
        "reja": "Burchaklarni 2πk davriyligi va π/2±α, π±α keltirish formulalari orqali o'tkir burchakka keltirishni o'rganamiz.",
        "qoida": "<p>Asosiy keltirish qoidasi:</p><p><strong>1. π ± α, 2π ± α</strong> burchaklarda funksiya nomi <em>o'zgarmaydi</em>: sin→sin, cos→cos, tg→tg.</p><p><strong>2. π/2 ± α, 3π/2 ± α</strong> burchaklarda nom <em>kofunksiyaga o'zgaradi</em>: sin↔cos, tg↔ctg.</p><p><strong>3. Ishora</strong> berilgan ifodaning dastlabki choragidagi ishorasi bilan bir xil olinadi.</p><p>Masalan: <strong>sin(180° − α) = sinα</strong>, <strong>cos(180° − α) = −cosα</strong>, <strong>sin(90° + α) = cosα</strong>.</p>",
        "savollar": [
            {"savol": "sin(180° − α) nimaga teng?", "variantlar": ["−sinα", "sinα", "cosα"], "togri": 1},
            {"savol": "cos(90° + α) qaysi ifodaga teng?", "variantlar": ["−sinα", "sinα", "cosα"], "togri": 0},
            {"savol": "tg(180° + α) qanday bo'ladi?", "variantlar": ["−tgα", "ctgα", "tgα"], "togri": 2}
        ],
        "eslabQol": [
            "<strong>π va 2π</strong> qatnashsa — nom o'zgarmaydi (sin→sin, cos→cos).",
            "<strong>π/2 va 3π/2</strong> qatnashsa — nom o'zgaradi (sin↔cos, tg↔ctg).",
            "<strong>Ishora</strong> — dastlabki burchak tushgan chorak bo'yicha aniqlanadi.",
            "Davriylik: sin va cos uchun 2πk, tg va ctg uchun πk tashlab yuboriladi."
        ],
        "kitob": {
            "betlar": "129–135-betlar",
            "sahifalar": [make_sahifa(p) for p in range(129, 136)]
        },
        "crops": [
            {"page": 130, "top": 20, "bottom": 290, "name": "1-masala.png", "caption": "1-masala · sin870° va cos870° · 130-bet", "kirish": "870° ni to'la aylanishlar 2·360° + 150° ga ajratamiz.", "alt": "1-masala: sin870 va cos870 hisoblash, 130-bet", "steps": ["870° = 2·360° + 150°.", "sin870° = sin150° = sin(180° − 30°) = sin30° = <strong>1/2</strong>.", "cos870° = cos150° = cos(180° − 30°) = −cos30° = <strong>−√3/2</strong>."]},
            {"page": 131, "top": 400, "bottom": 630, "name": "2-masala.png", "caption": "2-masala · sin930° · 131-bet", "kirish": "930° burchakni keltiramiz.", "alt": "2-masala: sin930 hisoblash, 131-bet", "steps": ["930° = 2·360° + 210° = 720° + 210°.", "sin930° = sin210° = sin(180° + 30°).", "III chorakda sinus manfiy: sin(180° + 30°) = −sin30° = <strong>−1/2</strong>."]},
            {"page": 131, "top": 630, "bottom": 750, "name": "3-masala.png", "caption": "3-masala · cos(15π/4) · 131-bet", "kirish": "Radiandagi burchakni keltiramiz.", "alt": "3-masala: cos(15pi/4) hisoblash, 131-bet", "steps": ["15π/4 = 4π − π/4 = 2·2π − π/4.", "cos(15π/4) = cos(−π/4) = cos(π/4) = <strong>√2/2</strong>."]},
            {"page": 132, "top": 200, "bottom": 420, "name": "4-masala.png", "caption": "4-masala · tg(11π/6) va tg1050° · 132-bet", "kirish": "Tangens uchun keltirish formulalari.", "alt": "4-masala: tg hisoblash, 132-bet", "steps": ["tg(11π/6) = tg(2π − π/6) = −tg(π/6) = <strong>−√3/3</strong>.", "tg1050° = tg(3·360° − 30°) = tg(−30°) = <strong>−√3/3</strong>."]}
        ],
        "mashqlar": {
            "betlar": "134–135-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "310-mashq.", "body": "Hisoblang:", "sub": "1) tg(5π/6); 2) sin(7π/6); 3) cos(4π/3); 4) sin(−5π/3)."},
                {"title": "311-mashq.", "body": "Ifodaning son qiymatini toping:", "sub": "1) cos630° − sin1470° − ctg1125°; 2) tg1800° − sin495° + cos945°."},
                {"title": "312-mashq.", "body": "Ifodani soddalashtiring:", "sub": "1) cos²(π − α) + sin²(α − π); 2) cos(π − α)cos(3π − α) − sin(α − π)sin(α − 3π)."},
                {"title": "313–314-mashq.", "body": "Keltirish formulalari yordamida soddalashtiring (kitob 134-bet)."}
            ]
        },
        "xulosa": [
            "<strong>π va 2π</strong> burchaklarda trigonometrik nom o'zgarmaydi.",
            "<strong>π/2 va 3π/2</strong> burchaklarda nom kofunksiyaga o'zgaradi (sin↔cos, tg↔ctg).",
            "Ifoda oldidagi ishora doim dastlabki burchakning choragidagi ishorasiga qarab qo'yiladi."
        ],
        "xulosaBoard": [
            {"html": "<strong>sin(180° − α)</strong> = sinα"},
            {"html": "<strong>cos(180° − α)</strong> = −cosα"},
            {"html": "<strong>sin(90° ± α)</strong> = cosα"},
            {"html": "<strong>cos(90° ± α)</strong> = ∓sinα"}
        ]
    },

    # =========================================================================
    # 27-DARS: Sinuslar yig'indisi va ayirmasi (135-139-betlar)
    # =========================================================================
    {
        "id": 27,
        "bob": {"roman": "III", "nom": "Trigonometriya elementlari"},
        "paragraf": "27-§",
        "title": "Sinuslar va kosinuslar yig'indisi hamda ayirmasi",
        "lead": "Trigonometrik funksiyalar yig'indisi va ayirmasini ko'paytmaga keltirish formulalari.",
        "prev": {"href": "../26/", "label": "26-dars"},
        "next": {"href": "../28/", "label": "28-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 26-§ (keltirish formulalari) ni eslash"},
            {"min": 7, "name": "Sahna — burchaklar yig'indisi va ko'paytmaga aylanish"},
            {"min": 8, "name": "Qoida — sinα±sinβ va cosα±cosβ formulalari"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 318, 319, 320-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "unit-circle",
            "ariaLabel": "Interaktiv chizma: trigonometrik yig'indilar",
            "hint": "Slayderni suring — burchaklar o'zgarishi bilan funksiyalar yig'indisi ko'paytma orqali qanday ixchamlashishi ko'rinadi.",
            "vars": {"t": {"min": 0, "max": 180, "step": 15, "value": 45, "desc": "burchak α (gradus)"}},
            "notes": {
                "q1": "α = {t}°: sinα va cosα qiymatlari hisoblanadi.",
                "q2": "sinα + cosα = √2 · sin(α + 45°) yordamchi burchak usuli bilan ko'paytmaga keladi.",
                "q3": "Yig'indi ko'paytmaga aylanganda tenglamalarni yechish juda osonlashadi.",
                "q4": "cosα − cosβ = −2 sin((α+β)/2) sin((α−β)/2) — oldidagi minus ishorasiga e'tibor bering."
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">26-§da <strong>keltirish formulalari</strong>ni o'rgangan edik. Bugungi darsda trigonometriyadagi eng foydali formulalardan biri — <strong>yig'indi va ayirmani ko'paytmaga keltirish</strong>ni ko'ramiz.</p>",
            "<p>Tenglamalarni yechishda yig'indini 0 ga tenglash qiyin, lekin ko'paytma 0 ga teng bo'lsa, har bir ko'paytuvchini alohida 0 ga tenglab osongina ildiz topamiz.</p>"
        ],
        "reja": "sinα±sinβ va cosα±cosβ formulalarini o'rganamiz va ifodalarni ko'paytuvchilarga ajratamiz.",
        "qoida": "<p>Yig'indi va ayirmani ko'paytmaga keltirish formulalari:</p><p><strong>sinα + sinβ = 2 sin((α+β)/2) · cos((α−β)/2)</strong></p><p><strong>sinα − sinβ = 2 sin((α−β)/2) · cos((α+β)/2)</strong></p><p><strong>cosα + cosβ = 2 cos((α+β)/2) · cos((α−β)/2)</strong></p><p><strong>cosα − cosβ = −2 sin((α+β)/2) · sin((α−β)/2)</strong></p><p>Diqqat: cosα − cosβ formulasida oldinda <em>minus</em> belgisi bor!</p>",
        "savollar": [
            {"savol": "sinα + sinβ ko'paytmaga qanday aylanadi?", "variantlar": ["2 cos((α+β)/2)cos((α−β)/2)", "2 sin((α+β)/2)cos((α−β)/2)", "−2 sin((α+β)/2)sin((α−β)/2)"], "togri": 1},
            {"savol": "cosα − cosβ formulasida qanday ishora bo'ladi?", "variantlar": ["Doim musbat", "Minus ishora (−2)", "Ishorasiz"], "togri": 1},
            {"savol": "sin75° + sin15° nimaga teng?", "variantlar": ["√6/2", "1", "√2"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>sin ± sin</strong> da sin va cos qatnashadi.",
            "<strong>cos + cos</strong> da faqat cos·cos bo'ladi.",
            "<strong>cos − cos</strong> da oldida <strong>−2</strong> va faqat sin·sin bo'ladi.",
            "Bu formulalar trigonometrik tenglamalarni yechishning asosiy kalitidir."
        ],
        "kitob": {
            "betlar": "135–139-betlar",
            "sahifalar": [make_sahifa(p) for p in range(135, 140)]
        },
        "crops": [
            {"page": 135, "top": 450, "bottom": 740, "name": "1-masala.png", "caption": "1-masala · Ifodani soddalashtirish · 135-bet", "kirish": "Yig'indini ko'paytmaga almashtirish namunasi.", "alt": "1-masala: ifodani soddalashtirish, 135-bet", "steps": ["sin(α + π/12) + sin(α − π/12) yig'indisini olamiz.", "= 2 sinα · cos(π/12).", "Natijada ifoda <strong>1/2 sinα</strong> ko'rinishiga keladi."]},
            {"page": 136, "top": 460, "bottom": 600, "name": "2-masala.png", "caption": "2-masala · sin75° + cos75° · 136-bet", "kirish": "cos75° = sin15° deb olamiz.", "alt": "2-masala: sin75 + cos75 hisoblash, 136-bet", "steps": ["cos75° = sin(90° − 75°) = sin15°.", "sin75° + sin15° = 2 sin(90°/2) · cos(60°/2).", "= 2 sin45° · cos30° = 2 · (√2/2) · (√3/2) = <strong>√6/2</strong>."]},
            {"page": 136, "top": 600, "bottom": 740, "name": "3-masala.png", "caption": "3-masala · 2sinα + √3 ni ko'paytmaga keltirish · 136-bet", "kirish": "Ko'paytuvchiga ajratish.", "alt": "3-masala: ko'paytmaga almashtirish, 136-bet", "steps": ["2(sinα + √3/2) = 2(sinα + sin(π/3)).", "Formula bo'yicha: 2 · 2 sin((α+π/3)/2) cos((α−π/3)/2).", "= <strong>4 sin(α/2 + π/6) cos(α/2 − π/6)</strong>."]},
            {"page": 137, "top": 20, "bottom": 220, "name": "4-masala.png", "caption": "4-masala · sinα + cosα baholash · 137-bet", "kirish": "Eng kichik va eng katta qiymatni topish.", "alt": "4-masala: sin+cos min va max qiymati, 137-bet", "steps": ["sinα + cosα = √2 · sin(α + 45°).", "−1 ≤ sin(α + 45°) ≤ 1 bo'lgani sababli:", "Eng kichik qiymat: <strong>−√2</strong>, eng katta qiymat: <strong>√2</strong>."]}
        ],
        "mashqlar": {
            "betlar": "137–139-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "318-mashq.", "body": "Ko'paytmaga almashtiring:", "sub": "1) sin40° + sin10°; 2) sin(4π/15) − sin(2π/15); 3) cos73° + cos17°; 4) cos(π/6) − cos(π/4)."},
                {"title": "319-mashq.", "body": "Hisoblang:", "sub": "1) cos105° + cos75°; 2) sin105° − sin75°; 3) cos(11π/12) + cos(5π/12)."},
                {"title": "320-mashq.", "body": "Ko'paytmaga almashtiring:", "sub": "1) 1/2 + cosα; 2) √3/2 − sinα; 3) 1 − 2cosα; 4) 1 + 2sinα."}
            ]
        },
        "xulosa": [
            "Trigonometrik yig'indi va ayirmalar ko'paytmaga aylantirilganda soddalashadi.",
            "cosα − cosβ formulasidagi oldingi minus ishora (−2) ga doim e'tibor bering.",
            "Yordamchi burchak kiritish orqali a·sinα + b·cosα ifoda bitta sinusga keltiriladi."
        ],
        "xulosaBoard": [
            {"html": "<strong>sinα + sinβ</strong> = 2 sin((α+β)/2) cos((α−β)/2)"},
            {"html": "<strong>sinα − sinβ</strong> = 2 sin((α−β)/2) cos((α+β)/2)"},
            {"html": "<strong>cosα + cosβ</strong> = 2 cos((α+β)/2) cos((α−β)/2)"},
            {"html": "<strong>cosα − cosβ</strong> = −2 sin((α+β)/2) sin((α−β)/2)"}
        ]
    },

    # =========================================================================
    # 28-DARS: Sonli ketma-ketliklar (150-153-betlar)
    # =========================================================================
    {
        "id": 28,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "28-§",
        "title": "Sonli ketma-ketliklar",
        "lead": "Natural sonlar to'plamida berilgan funksiya — ketma-ketlik, n-had formulasi va rekurrent usul.",
        "prev": {"href": "../27/", "label": "27-dars"},
        "next": {"href": "../29/", "label": "29-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 27-§ (trigonometriya xulosasi) dan yangi bobga o'tish"},
            {"min": 7, "name": "Sahna — ketma-ketlik hadlarining diskret nuqtalari"},
            {"min": 8, "name": "Qoida — ketma-ketlik ta'rifi va berilish usullari"},
            {"min": 11, "name": "Doska — 3 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 349, 350, 351-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "seq-discrete",
            "ariaLabel": "Interaktiv chizma: diskret ketma-ketlik",
            "hint": "Slayderni suring — n natural sonlar bo'yicha ketma-ketlik hadlari qanday hosil bo'lishini ko'ring.",
            "vars": {"n": {"min": 1, "max": 8, "step": 1, "value": 5, "desc": "hadlar soni n"}}
        },
        "kirish": [
            "<p class=\"kirish-nega\">27-§da trigonometriyani yakunladik. Endi yangi IV bobga — <strong>Sonli ketma-ketliklar va progressiyalar</strong>ga qadam qo'yamiz. Hayotda tartiblangan sonlar ro'yxati (har kungi harorat, omonat foizi, sonlar qatori) sonli ketma-ketlik deyiladi.</p>",
            "<p>Ketma-ketlik — bu argumenti faqat natural sonlar (1, 2, 3, ...) bo'lgan maxsus funksiyadir.</p>"
        ],
        "reja": "Sonli ketma-ketlik ta'rifi, n-had formulasi va rekurrent berilish usullari bilan tanishamiz.",
        "qoida": "<p><strong>Ta'rif:</strong> Natural sonlar to'plami N da aniqlangan funksiya <strong>sonli ketma-ketlik</strong> deyiladi.</p><p>Ketma-ketlik hadlari a₁, a₂, a₃, ..., aₙ ko'rinishida yoziladi. Bu yerda n — hadning nomeri, aₙ — ketma-ketlikning <strong>n-hadi</strong> (umumiy hadi).</p><p>Ketma-ketlik 2 xil asosiy usulda beriladi:</p><p>1) <em>Umumiy had formulasi:</em> masalan, aₙ = 2n − 1 (toq sonlar).</p><p>2) <em>Rekurrent formula:</em> keyingi had oldingi hadlar orqali beriladi (masalan, Fibonachchi ketma-ketligi: aₙ₊₂ = aₙ₊₁ + aₙ).</p>",
        "savollar": [
            {"savol": "Ketma-ketlik argumenti n qanday sonlar bo'lishi shart?", "variantlar": ["Istalgan haqiqiy sonlar", "Faqat natural sonlar (1, 2, 3, ...)", "Faqat manfiy sonlar"], "togri": 1},
            {"savol": "Agar aₙ = 3n + 1 bo'lsa, a₄ qancha?", "variantlar": ["12", "13", "10"], "togri": 1},
            {"savol": "Rekurrent usulda had qanday hisoblanadi?", "variantlar": ["Oldingi hadlar yordamida", "Faqat jadvaldan", "Tasodifiy"], "togri": 0}
        ],
        "eslabQol": [
            "Ketma-ketlik — bu natural to'plamda aniqlangan funksiya: n ∈ N.",
            "Har bir had o'zining natural tartib raqamiga (nomeriga) ega.",
            "Umumiy had formulasi istalgan n-hadni darhol hisoblash imkonini beradi.",
            "Rekurrent formula keyingi hadni oldingilariga bog'laydi."
        ],
        "kitob": {
            "betlar": "150–153-betlar",
            "sahifalar": [make_sahifa(p) for p in range(150, 154)]
        },
        "crops": [
            {"page": 151, "top": 150, "bottom": 280, "name": "1-masala.png", "caption": "1-masala · aₙ = n(n − 2) · 151-bet", "kirish": "Yuzinchi hadni topish.", "alt": "1-masala: an=n(n-2) 100-had, 151-bet", "steps": ["aₙ = n(n − 2) formulada n = 100 qo'yamiz.", "a₁₀₀ = 100 · (100 − 2) = 100 · 98 = <strong>9800</strong>."]},
            {"page": 151, "top": 280, "bottom": 520, "name": "2-masala.png", "caption": "2-masala · aₙ = 2n + 3 · 151-bet", "kirish": "Berilgan son ketma-ketlik hadi bo'ladimi?", "alt": "2-masala: nomerni aniqlash, 151-bet", "steps": ["1) 2n + 3 = 43 → 2n = 40 → n = <strong>20</strong> (20-had).", "2) 2n + 3 = 50 → 2n = 47 → n = 23,5.", "23,5 natural son emas, shuning uchun 50 soni ketma-ketlik hadi <strong>bo'la olmaydi</strong>."]},
            {"page": 151, "top": 580, "bottom": 740, "name": "3-masala.png", "caption": "3-masala · Rekurrent formula · 151-bet", "kirish": "bₙ₊₂ = bₙ₊₁ + bₙ, b₁=1, b₂=3.", "alt": "3-masala: rekurrent ketma-ketlik, 151-bet", "steps": ["b₃ = b₂ + b₁ = 3 + 1 = 4.", "b₄ = b₃ + b₂ = 4 + 3 = 7.", "b₅ = b₄ + b₃ = 7 + 4 = <strong>11</strong>."]}
        ],
        "mashqlar": {
            "betlar": "152–153-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "349-mashq.", "body": "Ketma-ketlik hadlarini toping:", "sub": "aₙ = 1/n formulasi berilgan. 1) a₂, a₅, a₁₀ ni toping; 2) aₙ = 1/15 bo'lsa n ni toping."},
                {"title": "350-mashq.", "body": "Dastlabki uchta hadini yozing:", "sub": "1) aₙ = 2n + 1; 2) aₙ = n² + 1; 3) aₙ = 3/(n+1); 4) aₙ = (−1)ⁿ · 2."},
                {"title": "351-mashq.", "body": "Og'zaki savol:", "sub": "xₙ = n² ketma-ketlikda 100, 144, 225 qaysi nomerli hadlar? 48 soni had bo'ladimi?"}
            ]
        },
        "xulosa": [
            "Ketma-ketlik — natural sonlar to'plamida berilgan qonuniyatli sonlar qatori.",
            "Umumiy had aₙ orqali nomeri n bo'lgan istalgan hadni hisoblaymiz.",
            "Rekurrent usulda har bir had oldingilar orqali ketma-ket topiladi."
        ],
        "xulosaBoard": [
            {"html": "<strong>Ketma-ketlik</strong>: a₁, a₂, a₃, ..., aₙ (n ∈ ℕ)"},
            {"html": "<strong>n-had</strong>: aₙ = f(n)"},
            {"html": "<strong>Rekurrent</strong>: aₙ₊₁ = g(aₙ)"}
        ]
    },

    # =========================================================================
    # 29-DARS: Arifmetik progressiya (154-157-betlar)
    # =========================================================================
    {
        "id": 29,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "29-§",
        "title": "Arifmetik progressiya",
        "lead": "Har bir hadi oldingisiga o'zgarmas d sonini qo'shish bilan hosil bo'ladigan ketma-ketlik va uning n-hadi formulasi.",
        "prev": {"href": "../28/", "label": "28-dars"},
        "next": {"href": "../30/", "label": "30-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 28-§ (ketma-ketliklar) ni eslash"},
            {"min": 7, "name": "Sahna — a₁ va d slayderlari bilan pog'onali o'sish"},
            {"min": 8, "name": "Qoida — arifmetik progressiya ta'rifi va aₙ formulasi"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 360, 361, 362-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prog-arith",
            "ariaLabel": "Interaktiv chizma: arifmetik progressiya pog'onalari",
            "hint": "a₁ va d slayderlarini suring — qadamlar bir xil d miqdoriga ko'tarilib yoki tushib boradi.",
            "vars": {
                "a": {"min": 1, "max": 6, "step": 1, "value": 2, "desc": "boshlang'ich had a₁"},
                "d": {"min": -3, "max": 5, "step": 1, "value": 3, "desc": "ayirma d"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">28-§da <strong>sonli ketma-ketliklar</strong> bilan tanishgan edik. Bugun ularning eng muhim va sodda turi — <strong>arifmetik progressiya</strong>ni o'rganamiz.</p>",
            "<p>Zina pog'onalarini tasavvur qiling: har bir keyingi pog'ona oldingisidan aynan bir xil balandlikka (d) ko'tariladi. Bu — arifmetik progressiyaning xuddi o'zidir.</p>"
        ],
        "reja": "Arifmetik progressiya ta'rifi, uning ayirmasi d va n-hadini topish formulasini chiqaramiz.",
        "qoida": "<p><strong>Ta'rif:</strong> Ikkinchi hadidan boshlab har bir hadi oldingi hadga bir xil <strong>d</strong> sonini qo'shish bilan hosil bo'ladigan ketma-ketlik <strong>arifmetik progressiya</strong> deyiladi.</p><p><strong>aₙ₊₁ = aₙ + d</strong>, bundan <strong>d = aₙ₊₁ − aₙ</strong> (arifmetik progressiya ayirmasi).</p><p><strong>n-had formulasi:</strong></p><p><strong>aₙ = a₁ + (n − 1)d</strong></p><p><strong>Xossasi:</strong> Har bir had o'ziga qo'shni ikki hadning o'rta arifmetigiga teng: <strong>aₙ = (aₙ₋₁ + aₙ₊₁) / 2</strong>.</p>",
        "savollar": [
            {"savol": "Arifmetik progressiyada d nima deyiladi?", "variantlar": ["Maxraj", "Ayirma", "Yig'indi"], "togri": 1},
            {"savol": "a₁ = 5 va d = 3 bo'lsa, a₄ nechaga teng?", "variantlar": ["14", "12", "17"], "togri": 0},
            {"savol": "Ketma-ketlik arifmetik progressiya bo'lishi uchun nima doimiy bo'lishi kerak?", "variantlar": ["Hadlar ko'paytmasi", "Qo'shni hadlar ayirmasi (aₙ₊₁ − aₙ)", "Hadlar yig'indisi"], "togri": 1}
        ],
        "eslabQol": [
            "<strong>aₙ = a₁ + (n − 1)d</strong> — n-had formulasi.",
            "<strong>d = aₙ₊₁ − aₙ</strong> — progressiya ayirmasi.",
            "Agar d > 0 bo'lsa — o'suvchi, d < 0 bo'lsa — kamayuvchi progressiya.",
            "O'rta arifmetik xossa: aₙ = (aₙ₋₁ + aₙ₊₁) / 2."
        ],
        "kitob": {
            "betlar": "154–157-betlar",
            "sahifalar": [make_sahifa(p) for p in range(154, 158)]
        },
        "crops": [
            {"page": 154, "top": 360, "bottom": 520, "name": "1-masala.png", "caption": "1-masala · aₙ = 1,5 + 3n · 154-bet", "kirish": "Ketma-ketlik arifmetik progressiya bo'lishini isbotlash.", "alt": "1-masala: arifmetik progressiya isboti, 154-bet", "steps": ["aₙ₊₁ − aₙ ayirmani tuzamiz.", "aₙ₊₁ = 1,5 + 3(n + 1) = 4,5 + 3n.", "aₙ₊₁ − aₙ = (4,5 + 3n) − (1,5 + 3n) = <strong>3</strong> (n ga bog'liq emas).", "Demak bu arifmetik progressiya va d = 3."]},
            {"page": 155, "top": 280, "bottom": 420, "name": "2-masala.png", "caption": "2-masala · a₁₅ ni topish · 155-bet", "kirish": "a₁ = 2 va d = 0,5 bo'lsa a₁₅ ni topamiz.", "alt": "2-masala: a15 hisoblash, 155-bet", "steps": ["aₙ = a₁ + (n − 1)d formulasiga qo'yamiz.", "a₁₅ = 2 + (15 − 1) · 0,5 = 2 + 14 · 0,5 = 2 + 7 = <strong>9</strong>."]},
            {"page": 155, "top": 420, "bottom": 580, "name": "3-masala.png", "caption": "3-masala · d ayirmani topish · 155-bet", "kirish": "a₁ = 4 va a₁₈ = −47 bo'lsa d ni topish.", "alt": "3-masala: ayirma d ni topish, 155-bet", "steps": ["a₁₈ = a₁ + 17d.", "−47 = 4 + 17d → 17d = −51 → d = <strong>−3</strong>."]},
            {"page": 156, "top": 20, "bottom": 180, "name": "4-masala.png", "caption": "4-masala · Nomerini topish · 156-bet", "kirish": "a₁ = −10, d = 2 bo'lsa, 14 soni nechanchi had?", "alt": "4-masala: nomerni topish, 156-bet", "steps": ["14 = a₁ + (n − 1)d → 14 = −10 + (n − 1)·2.", "24 = 2(n − 1) → n − 1 = 12 → n = <strong>13</strong> (13-had)."]}
        ],
        "mashqlar": {
            "betlar": "156–157-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "360-mashq.", "body": "Arifmetik progressiyaning n-hadini toping:", "sub": "1) a₁ = 2, d = 3, n = 11; 2) a₁ = −3, d = −2, n = 7; 3) a₁ = 1/3, d = 1/6, n = 19."},
                {"title": "361-mashq.", "body": "Arifmetik progressiyaning d ayirmasini toping:", "sub": "1) a₁ = 1, a₇ = 19; 2) a₁ = 5, a₁₀ = −40; 3) a₃ = 12, a₈ = 37."},
                {"title": "362-mashq.", "body": "Ketma-ketlikning berilgan soni had bo'ladimi:", "sub": "aₙ = 4n − 1 bo'lsa: 1) 43; 2) 55 sonlari shu progressiya hadlarimi?"}
            ]
        },
        "xulosa": [
            "Arifmetik progressiyaning har bir hadi oldingisidan d ga farq qiladi.",
            "aₙ = a₁ + (n − 1)d formulasi orqali har qanday olis hadni oson hisoblaymiz.",
            "Qo'shni hadlar o'rta arifmetigi o'rtadagi hadga teng bo'ladi."
        ],
        "xulosaBoard": [
            {"html": "<strong>aₙ</strong> = a₁ + (n − 1)d"},
            {"html": "<strong>d</strong> = aₙ₊₁ − aₙ"},
            {"html": "<strong>Xossa</strong>: aₙ = (aₙ₋₁ + aₙ₊₁) / 2"}
        ]
    },

    # =========================================================================
    # 30-DARS: Arifmetik progressiya yig'indisi (158-161-betlar)
    # =========================================================================
    {
        "id": 30,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "30-§",
        "title": "Arifmetik progressiya dastlabki n ta hadining yig'indisi",
        "lead": "Gauss usuli va arifmetik progressiya dastlabki n ta hadining yig'indisi formulalari.",
        "prev": {"href": "../29/", "label": "29-dars"},
        "next": {"href": "../31/", "label": "31-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 29-§ (arifmetik progressiya) ni eslash"},
            {"min": 7, "name": "Sahna — Sₙ yig'indisini pog'onalar maydoni sifatida ko'rish"},
            {"min": 8, "name": "Qoida — Gauss usuli va Sₙ formulalari"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 375, 376, 377-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prog-arith",
            "showSum": True,
            "ariaLabel": "Interaktiv chizma: arifmetik progressiya yig'indisi",
            "hint": "Slayderlarni suring — dastlabki hadlar yig'indisi S₅ formuladagidek hisoblanib boradi.",
            "vars": {
                "a": {"min": 1, "max": 5, "step": 1, "value": 2, "desc": "boshlang'ich had a₁"},
                "d": {"min": 1, "max": 4, "step": 1, "value": 2, "desc": "ayirma d"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">29-§da <strong>arifmetik progressiya</strong> hadlarini topishni o'rgangan edik. Endi ularning dastlabki n ta hadini qo'shib chiqish kerak bo'lsa nima qilamiz?</p>",
            "<p>Mashhur matematik Karl Gauss 10 yoshida 1 dan 100 gacha sonlar yig'indisini bir daqiqada hisoblab hayratga solgan: boshidan va oxiridan olingan juftliklar (1+100=101, 2+99=101, ...) bir xil yig'indini beradi!</p>"
        ],
        "reja": "Arifmetik progressiya dastlabki n ta hadi yig'indisi formulalarini chiqaramiz va amaliyotda qo'llaymiz.",
        "qoida": "<p><strong>Dastlabki n ta had yig'indisi formulalari:</strong></p><p><strong>Sₙ = ((a₁ + aₙ) / 2) · n</strong> &nbsp;(1)</p><p>Agar aₙ o'rniga a₁ + (n − 1)d formulani qo'ysak:</p><p><strong>Sₙ = ((2a₁ + (n − 1)d) / 2) · n</strong> &nbsp;(2)</p><p>Bu formulalar yordamida yuzlab hadlarni bittalab qo'shmasdan darhol javob topiladi.</p>",
        "savollar": [
            {"savol": "1 dan 100 gacha sonlar yig'indisi qancha?", "variantlar": ["5000", "5050", "5500"], "togri": 1},
            {"savol": "Sₙ formulasida n nimani bildiradi?", "variantlar": ["Oxirgi hadni", "Qo'shilayotgan hadlar sonini", "Ayirmani"], "togri": 1},
            {"savol": "Agar a₁ = 1, a₁₀ = 19 bo'lsa, S₁₀ qancha?", "variantlar": ["100", "200", "190"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>Sₙ = ((a₁ + aₙ) / 2) · n</strong> — birinchi va oxirgi had ma'lum bo'lganda.",
            "<strong>Sₙ = ((2a₁ + (n − 1)d) / 2) · n</strong> — faqat a₁ va d ma'lum bo'lganda.",
            "Trapeziya maydoniga o'xshaydi: asoslar yig'indisi yarmi ko'paytirilgan balandlik.",
            "Gauss juftlash qoidasi: a₁ + aₙ = a₂ + aₙ₋₁ = a₃ + aₙ₋₂ = ..."
        ],
        "kitob": {
            "betlar": "158–161-betlar",
            "sahifalar": [make_sahifa(p) for p in range(158, 162)]
        },
        "crops": [
            {"page": 158, "top": 100, "bottom": 380, "name": "1-masala.png", "caption": "1-masala · 1 dan 100 gacha yig'indi · 158-bet", "kirish": "Gauss usuli bilan hisoblash.", "alt": "1-masala: 1 dan 100 gacha sonlar yig'indisi, 158-bet", "steps": ["S = 1 + 2 + ... + 100.", "Teskari yozib qo'shamiz: 2S = 100 · 101 = 10100.", "S = 10100 / 2 = <strong>5050</strong>."]},
            {"page": 159, "top": 120, "bottom": 280, "name": "2-masala.png", "caption": "2-masala · S₂₀ ni topish · 159-bet", "kirish": "a₁ = 3, d = 2 bo'lsa S₂₀ ni topish.", "alt": "2-masala: S20 hisoblash, 159-bet", "steps": ["S₂₀ = ((2a₁ + 19d) / 2) · 20.", "= (2·3 + 19·2) · 10 = (6 + 38) · 10 = 44 · 10 = <strong>440</strong>."]},
            {"page": 159, "top": 280, "bottom": 500, "name": "3-masala.png", "caption": "3-masala · Barcha 2 xonali sonlar yig'indisi · 159-bet", "kirish": "10 dan 99 gacha bo'lgan sonlar.", "alt": "3-masala: 2 xonali sonlar yig'indisi, 159-bet", "steps": ["a₁ = 10, aₙ = 99, d = 1.", "Hadlar soni: n = 99 − 10 + 1 = 90 ta.", "S₉₀ = ((10 + 99) / 2) · 90 = 109 · 45 = <strong>4905</strong>."]},
            {"page": 160, "top": 20, "bottom": 240, "name": "4-masala.png", "caption": "4-masala · Sₙ = 330 bo'lsa n ni topish · 160-bet", "kirish": "a₁ = 10, d = 4, Sₙ = 330.", "alt": "4-masala: n ni topish, 160-bet", "steps": ["((2·10 + (n − 1)·4) / 2) · n = 330.", "(10 + 2(n − 1)) · n = 330 → (2n + 8)·n = 330 → 2n² + 8n − 330 = 0.", "n² + 4n − 165 = 0 → (n − 11)(n + 15) = 0 → n = <strong>11</strong>."]}
        ],
        "mashqlar": {
            "betlar": "160–161-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "375-mashq.", "body": "Dastlabki n ta had yig'indisini toping:", "sub": "1) a₁ = 1, aₙ = 20, n = 50; 2) a₁ = 1, aₙ = 200, n = 100; 3) a₁ = −5, aₙ = −50, n = 10."},
                {"title": "376-mashq.", "body": "Yig'indini hisoblang:", "sub": "1) a₁ = 3, d = 2 bo'lsa S₁₁; 2) a₁ = −4, d = 3 bo'lsa S₁₅."},
                {"title": "377-mashq.", "body": "Barcha juft natural sonlar yig'indisini toping:", "sub": "1 dan 100 gacha bo'lgan juft sonlar (2 + 4 + ... + 100)."}
            ]
        },
        "xulosa": [
            "Arifmetik progressiya yig'indisi chetki hadlar o'rta arifmetigini hadlar soniga ko'paytirish bilan topiladi.",
            "Gauss juftlash printsipi barcha arifmetik qatorlar uchun universal ishlaydi.",
            "Sₙ dan foydalanib masalalarda hadlar soni n ni kvadrat tenglama orqali topish mumkin."
        ],
        "xulosaBoard": [
            {"html": "<strong>Sₙ</strong> = ((a₁ + aₙ) / 2) · n"},
            {"html": "<strong>Sₙ</strong> = ((2a₁ + (n − 1)d) / 2) · n"},
            {"html": "Gauss: 1 + 2 + ... + 100 = 5050"}
        ]
    },

    # =========================================================================
    # 31-DARS: Geometrik progressiya (162-166-betlar)
    # =========================================================================
    {
        "id": 31,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "31-§",
        "title": "Geometrik progressiya",
        "lead": "Har bir hadi oldingisiga noldan farqli o'zgarmas q sonini ko'paytirish bilan olinadigan ketma-ketlik va bₙ formulasi.",
        "prev": {"href": "../30/", "label": "30-dars"},
        "next": {"href": "../32/", "label": "32-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 30-§ (arifmetik progressiya yig'indisi) ni eslash"},
            {"min": 7, "name": "Sahna — b₁ va q slayderlari bilan eksponentsial o'sish"},
            {"min": 8, "name": "Qoida — geometrik progressiya ta'rifi va bₙ formulasi"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 387, 388, 389-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prog-geom",
            "ariaLabel": "Interaktiv chizma: geometrik progressiya",
            "hint": "b₁ va q slayderlarini suring — hadlar har bir qadamda q martadan ko'payib boradi.",
            "vars": {
                "b": {"min": 1, "max": 4, "step": 1, "value": 2, "desc": "boshlang'ich had b₁"},
                "q": {"min": 0.5, "max": 2, "step": 0.5, "value": 2, "desc": "maxraj q"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">30-§da <strong>arifmetik progressiya yig'indisi</strong>ni o'rgangan edik. Endi har safar qo'shish emas, balki <em>ko'paytirish</em> orqali o'sadigan ketma-ketlik — <strong>geometrik progressiya</strong>ga o'tamiz.</p>",
            "<p>Masalan: bakteriyalarning bo'linishi (1 ta bakteriya 2 taga, so'ng 4, 8, 16, ... bo'ladi). Bu progressiya arifmetik progressiyaga qaraganda ancha tez — shiddat bilan o'sadi.</p>"
        ],
        "reja": "Geometrik progressiya ta'rifi, maxraji q va n-hadini topish formulasini o'rganamiz.",
        "qoida": "<p><strong>Ta'rif:</strong> Birinchi hadi b₁ ≠ 0 bo'lib, ikkinchisidan boshlab har bir hadi oldingi hadga biror <strong>q ≠ 0</strong> sonini ko'paytirish bilan olinadigan ketma-ketlik <strong>geometrik progressiya</strong> deyiladi.</p><p><strong>bₙ₊₁ = bₙ · q</strong>, bundan <strong>q = bₙ₊₁ / bₙ</strong> (geometrik progressiya maxraji).</p><p><strong>n-had formulasi:</strong></p><p><strong>bₙ = b₁ · qⁿ⁻¹</strong></p><p><strong>Xossasi:</strong> bₙ² = bₙ₋₁ · bₙ₊₁ (har bir had qo'shnilarining o'rta geometrigi).</p>",
        "savollar": [
            {"savol": "Geometrik progressiyada q soni nima deyiladi?", "variantlar": ["Ayirma", "Maxraj", "Daraja"], "togri": 1},
            {"savol": "b₁ = 3 va q = 2 bo'lsa, b₄ qancha?", "variantlar": ["24", "18", "48"], "togri": 0},
            {"savol": "q soni 0 ga teng bo'lishi mumkinmi?", "variantlar": ["Mumkin", "Mumkin emas (q ≠ 0)", "Faqat birinchi hadda"], "togri": 1}
        ],
        "eslabQol": [
            "<strong>bₙ = b₁ · qⁿ⁻¹</strong> — n-had formulasi.",
            "<strong>q = bₙ₊₁ / bₙ</strong> — progressiya maxraji.",
            "Agar |q| > 1 bo'lsa — hadlar keskin kattalashadi (eksponentsial o'sish).",
            "O'rta geometrik xossa: |bₙ| = √(bₙ₋₁ · bₙ₊₁)."
        ],
        "kitob": {
            "betlar": "162–166-betlar",
            "sahifalar": [make_sahifa(p) for p in range(162, 167)]
        },
        "crops": [
            {"page": 163, "top": 280, "bottom": 420, "name": "1-masala.png", "caption": "1-masala · b₅ ni topish · 163-bet", "kirish": "b₁ = 3 va q = 2 bo'lsa b₅ va bₙ ni topish.", "alt": "1-masala: b5 hisoblash, 163-bet", "steps": ["bₙ = b₁ · qⁿ⁻¹ formulasiga qo'yamiz.", "b₅ = 3 · 2⁵⁻¹ = 3 · 2⁴ = 3 · 16 = <strong>48</strong>.", "bₙ = 3 · 2ⁿ⁻¹."]},
            {"page": 163, "top": 420, "bottom": 600, "name": "2-masala.png", "caption": "2-masala · b₁ va q ni topish · 163-bet", "kirish": "b₃ = 12 va b₅ = 48 bo'lsa.", "alt": "2-masala: b1 va q ni topish, 163-bet", "steps": ["b₅ / b₃ = q² → q² = 48 / 12 = 4 → q = ±2.", "Agar q = 2 bo'lsa: b₁ = b₃ / q² = 12 / 4 = <strong>3</strong>.", "Agar q = −2 bo'lsa: b₁ = <strong>3</strong>."]},
            {"page": 164, "top": 20, "bottom": 180, "name": "3-masala.png", "caption": "3-masala · Nomerini topish · 164-bet", "kirish": "b₁ = 5, q = 3 bo'lsa, 405 soni nechanchi had?", "alt": "3-masala: nomerni topish, 164-bet", "steps": ["405 = 5 · 3ⁿ⁻¹ → 3ⁿ⁻¹ = 81.", "3⁴ = 81 → n − 1 = 4 → n = <strong>5</strong> (5-had)."]},
            {"page": 164, "top": 180, "bottom": 380, "name": "4-masala.png", "caption": "4-masala · Geometriya bilan bog'liq masala · 164-bet", "kirish": "Kvadratlar yuzlarining geometrik progressiyasi.", "alt": "4-masala: kvadratlar yuzalari progressiyasi, 164-bet", "steps": ["Kvadrat tomoni 4 cm, yuzi S₁ = 16.", "Har safar tomon o'rtalari tutashtirilsa yuzi 2 marta kamayadi: q = 1/2.", "Yuzalar ketma-ketligi: 16, 8, 4, 2, 1, ... (q = 1/2)."]}
        ],
        "mashqlar": {
            "betlar": "165–166-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "387-mashq.", "body": "Geometrik progressiyaning n-hadini toping:", "sub": "1) b₁ = 2, q = 3, n = 6; 2) b₁ = 4, q = −1/2, n = 7; 3) b₁ = −1, q = 2, n = 10."},
                {"title": "388-mashq.", "body": "Geometrik progressiya maxraji q ni toping:", "sub": "1) b₁ = 4, b₃ = 36; 2) b₂ = 6, b₄ = 54; 3) b₃ = 25, b₅ = 625."},
                {"title": "389-mashq.", "body": "Berilgan son progressiya hadimi:", "sub": "bₙ = 2 · 3ⁿ⁻¹ ketma-ketlikda 162 va 54 sonlarining nomerini toping."}
            ]
        },
        "xulosa": [
            "Geometrik progressiyada har bir had oldingisiga q sonini ko'paytirish bilan olinadi.",
            "bₙ = b₁ · qⁿ⁻¹ formulasi istalgan hadni tezkor topishga xizmat qiladi.",
            "bₙ² = bₙ₋₁ · bₙ₊₁ xossasi har qanday 3 ta ketma-ket had uchun o'rinlidir."
        ],
        "xulosaBoard": [
            {"html": "<strong>bₙ</strong> = b₁ · qⁿ⁻¹"},
            {"html": "<strong>q</strong> = bₙ₊₁ / bₙ (q ≠ 0)"},
            {"html": "<strong>Xossa</strong>: bₙ² = bₙ₋₁ · bₙ₊₁"}
        ]
    },

    # =========================================================================
    # 32-DARS: Geometrik progressiya yig'indisi (167-170-betlar)
    # =========================================================================
    {
        "id": 32,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "32-§",
        "title": "Geometrik progressiya dastlabki n ta hadining yig'indisi",
        "lead": "Geometrik progressiyaning dastlabki n ta hadini jamlash formulasi: Sₙ = b₁·(1 − qⁿ) / (1 − q).",
        "prev": {"href": "../31/", "label": "31-dars"},
        "next": {"href": "../33/", "label": "33-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 31-§ (geometrik progressiya) ni eslash"},
            {"min": 7, "name": "Sahna — Sₙ yig'indisining hisoblanishi va o'sishi"},
            {"min": 8, "name": "Qoida — Sₙ formulasi va uni chiqarish usuli"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 402, 403, 404-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prog-geom",
            "mode": "sum",
            "ariaLabel": "Interaktiv chizma: geometrik progressiya yig'indisi",
            "hint": "b₁ va q slayderlarini suring — S₅ yig'indisi jonli hisoblanadi.",
            "vars": {
                "b": {"min": 1, "max": 4, "step": 1, "value": 1, "desc": "boshlang'ich had b₁"},
                "q": {"min": 0.5, "max": 2, "step": 0.5, "value": 2, "desc": "maxraj q"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">31-§da <strong>geometrik progressiya</strong> hadlarini hisoblashni o'rgandik. Endi ularning yig'indisini topish formulasi bilan tanishamiz.</p>",
            "<p>Qadimgi afsona: shaxmat ixtirochisiga podshoh birinchi katakka 1 dona bug'doy, ikkinchisiga 2 dona, uchinchisiga 4, 8 va hokazo qo'yishni va'da qiladi. 64-katakka kelganda bug'doy soni butun Yer yuzining hosilidan ham oshib ketgan (2⁶⁴ − 1)!</p>"
        ],
        "reja": "Geometrik progressiyaning dastlabki n ta hadi yig'indisi formulasini o'rganamiz va amalda qo'llaymiz.",
        "qoida": "<p><strong>Dastlabki n ta had yig'indisi formulasi (q ≠ 1):</strong></p><p><strong>Sₙ = (b₁ · (1 − qⁿ)) / (1 − q)</strong> &nbsp;yoki&nbsp; <strong>Sₙ = (bₙ · q − b₁) / (q − 1)</strong></p><p>Agar q = 1 bo'lsa, barcha hadlar b₁ ga teng bo'lib: <strong>Sₙ = n · b₁</strong>.</p><p>Formulani chiqarish uchun Sₙ ni q ga ko'paytirib, qSₙ − Sₙ ayirma olinadi.</p>",
        "savollar": [
            {"savol": "q = 2, b₁ = 1 bo'lsa, dastlabki 3 ta had yig'indisi (1+2+4) qancha?", "variantlar": ["6", "7", "8"], "togri": 1},
            {"savol": "Sₙ formulasida q qanday qiymatni qabul qila olmaydi?", "variantlar": ["q = 0", "q = 1 (maxraj 0 bo'ladi)", "q = −1"], "togri": 1},
            {"savol": "Shaxmat taxtasi masalasida jami bug'doy donalari ifodasi qaysi?", "variantlar": ["2⁶⁴ − 1", "64²", "2⁶⁴"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>Sₙ = b₁(1 − qⁿ) / (1 − q)</strong> (q ≠ 1).",
            "q > 1 bo'lganda yig'indi juda katta tezlikda o'sadi.",
            "Formuladan b₁, q yoki n ni topish uchun ham foydalaniladi."
        ],
        "kitob": {
            "betlar": "167–170-betlar",
            "sahifalar": [make_sahifa(p) for p in range(167, 171)]
        },
        "crops": [
            {"page": 167, "top": 150, "bottom": 360, "name": "1-masala.png", "caption": "1-masala · 1 + 2 + 4 + ... + 2ⁿ⁻¹ · 167-bet", "kirish": "Ikkining darajalari yig'indisi.", "alt": "1-masala: ikkining darajalari yig'indisi, 167-bet", "steps": ["b₁ = 1, q = 2 bo'lgan progressiya.", "Sₙ = 1 · (1 − 2ⁿ) / (1 − 2) = (1 − 2ⁿ) / (−1) = <strong>2ⁿ − 1</strong>."]},
            {"page": 168, "top": 20, "bottom": 180, "name": "2-masala.png", "caption": "2-masala · S₅ ni hisoblash · 168-bet", "kirish": "b₁ = 1/2, q = 1/3 bo'lsa S₅ ni topish.", "alt": "2-masala: S5 hisoblash, 168-bet", "steps": ["S₅ = (1/2 · (1 − (1/3)⁵)) / (1 − 1/3).", "= (1/2 · (1 − 1/243)) / (2/3) = (1/2 · 242/243) · 3/2 = <strong>121/162</strong>."]},
            {"page": 168, "top": 180, "bottom": 360, "name": "3-masala.png", "caption": "3-masala · b₁ va b₇ ni topish · 168-bet", "kirish": "q = 2, S₇ = 635 bo'lsa.", "alt": "3-masala: b1 va b7 ni topish, 168-bet", "steps": ["635 = b₁ · (1 − 2⁷) / (1 − 2) = b₁ · (127).", "b₁ = 635 / 127 = <strong>5</strong>.", "b₇ = 5 · 2⁶ = 5 · 64 = <strong>320</strong>."]},
            {"page": 169, "top": 20, "bottom": 220, "name": "4-masala.png", "caption": "4-masala · Omonat foizi masalasi · 169-bet", "kirish": "Bankdagi murakkab foiz hisobi.", "alt": "4-masala: murakkab foiz yig'indisi, 169-bet", "steps": ["Har yili summa 1,3 barobarga oshadi (q = 1,3).", "n yil oxirida summa: S = S₀ · qⁿ.", "Bu geometrik progressiyaning amaliy qo'llanilishidir."]}
        ],
        "mashqlar": {
            "betlar": "169–170-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "402-mashq.", "body": "Geometrik progressiya dastlabki n ta had yig'indisini hisoblang:", "sub": "1) b₁ = 1/2, q = 2, n = 6; 2) b₁ = −2, q = 1/2, n = 5; 3) b₁ = 1, q = −1/3, n = 4."},
                {"title": "403-mashq.", "body": "Yig'indini toping:", "sub": "1) 1 + 3 + 9 + 27 + 81 + 243; 2) 1/3 + 1/9 + 1/27 + 1/81 + 1/243."},
                {"title": "404-mashq.", "body": "Tenglamani yeching:", "sub": "1 + x + x² + ... + x⁵ = 0 ifodasi uchun x ni toping."}
            ]
        },
        "xulosa": [
            "Sₙ = b₁(1 − qⁿ)/(1 − q) formulasi bilan har qanday geometrik yig'indi tez topiladi.",
            "Murakkab foizlar va biologik ko'payish jarayonlari geometrik yig'indiga asoslanadi.",
            "q < 1 bo'lganda yuqori darajalar qⁿ juda kichrayadi."
        ],
        "xulosaBoard": [
            {"html": "<strong>Sₙ</strong> = b₁(1 − qⁿ) / (1 − q)"},
            {"html": "<strong>Sₙ</strong> = (bₙq − b₁) / (q − 1)"},
            {"html": "q = 2: 1 + 2 + 4 + ... + 2ⁿ⁻¹ = 2ⁿ − 1"}
        ]
    },

    # =========================================================================
    # 33-DARS: Cheksiz kamayuvchi geometrik progressiya (171-175-betlar)
    # =========================================================================
    {
        "id": 33,
        "bob": {"roman": "IV", "nom": "Sonli ketma-ketliklar. Progressiyalar"},
        "paragraf": "33-§",
        "title": "Cheksiz kamayuvchi geometrik progressiya",
        "lead": "Maxraji |q| < 1 bo'lgan cheksiz geometrik progressiya va uning hadlari yig'indisi: S = b₁ / (1 − q).",
        "prev": {"href": "../32/", "label": "32-dars"},
        "next": {"href": "../34/", "label": "34-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 32-§ (geometrik progressiya yig'indisi) ni eslash"},
            {"min": 7, "name": "Sahna — cheksiz yig'indining songa intilishini kuzatish"},
            {"min": 8, "name": "Qoida — |q| < 1 sharti va S = b₁/(1−q) formulasi"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 418, 419, 420-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prog-geom",
            "mode": "infinite",
            "ariaLabel": "Interaktiv chizma: cheksiz kamayuvchi geometrik progressiya",
            "hint": "q slayderini 1 dan kichik qilib o'rnating — cheksiz ko'p hadlar yig'indisi chekli aniq S soniga intiladi.",
            "vars": {
                "b": {"min": 1, "max": 4, "step": 1, "value": 1, "desc": "boshlang'ich had b₁"},
                "q": {"min": 0.2, "max": 0.8, "step": 0.1, "value": 0.5, "desc": "maxraj q (|q| < 1)"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">32-§da <strong>geometrik progressiya yig'indisi</strong>ni o'rgangan edik. Agar progressiyada cheksiz ko'p had bo'lsa, ularni qo'shganda cheksizlik chiqmaydimi?</p>",
            "<p>Ajablanarlisi shundaki, agar <strong>|q| < 1</strong> bo'lsa (masalan, 1/2 + 1/4 + 1/8 + 1/16 + ...), cheksiz ko'p sonlar qo'shilsa ham yig'indi hech qachon 1 dan oshmaydi, balki aynan 1 ga teng bo'ladi!</p>"
        ],
        "reja": "Cheksiz kamayuvchi geometrik progressiya ta'rifi, yig'indisi formulasi va davriy o'nli kasrlarni oddiy kasrga aylantirishni o'rganamiz.",
        "qoida": "<p><strong>Ta'rif:</strong> Maxraji <strong>|q| < 1</strong> bo'lgan geometrik progressiya <strong>cheksiz kamayuvchi geometrik progressiya</strong> deyiladi.</p><p>n → ∞ da qⁿ nolga intiladi (qⁿ → 0). Shuning uchun Sₙ = b₁(1 − qⁿ)/(1 − q) formulasidan:</p><p><strong>S = b₁ / (1 − q)</strong></p><p>Bu formula orqali cheksiz davriy o'nli kasrlar (masalan 0,(7) yoki 0,2(35)) osongina oddiy kasrga aylantiriladi.</p>",
        "savollar": [
            {"savol": "Cheksiz geometrik progressiya kamayuvchi bo'lishi uchun q qanday bo'lishi kerak?", "variantlar": ["q > 1", "|q| < 1", "q = 0"], "togri": 1},
            {"savol": "b₁ = 1 va q = 1/2 bo'lsa, cheksiz yig'indi qancha?", "variantlar": ["1", "2", "cheksiz"], "togri": 1},
            {"savol": "0,(3) davriy kasri qaysi oddiy kasrga teng?", "variantlar": ["1/3", "3/10", "3/100"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>S = b₁ / (1 − q)</strong> — cheksiz kamayuvchi progressiya yig'indisi.",
            "Faqat va faqat <strong>|q| < 1</strong> bo'lgandagina yig'indi mavjud.",
            "Cheksiz davriy kasrlar shu formula bilan oddiy kasrga aylanadi.",
            "Geometrik ma'no: butun maydonning yarmi, choragi, sakkizdan biri qo'shilib butunni beradi."
        ],
        "kitob": {
            "betlar": "171–175-betlar",
            "sahifalar": [make_sahifa(p) for p in range(171, 176)]
        },
        "crops": [
            {"page": 172, "top": 60, "bottom": 240, "name": "1-masala.png", "caption": "1-masala · 1 + 1/2 + 1/4 + ... yig'indisi · 172-bet", "kirish": "Klassik cheksiz yig'indi.", "alt": "1-masala: cheksiz yig'indi 1+1/2+..., 172-bet", "steps": ["b₁ = 1, q = 1/2. |q| = 1/2 < 1.", "S = b₁ / (1 − q) = 1 / (1 − 1/2) = 1 / (1/2) = <strong>2</strong>."]},
            {"page": 172, "top": 240, "bottom": 440, "name": "2-masala.png", "caption": "2-masala · 0,(7) ni oddiy kasrga aylantirish · 172-bet", "kirish": "Davriy o'nli kasr masalasi.", "alt": "2-masala: 0,(7) kasrga aylantirish, 172-bet", "steps": ["0,(7) = 0,7 + 0,07 + 0,007 + ...", "b₁ = 0,7 = 7/10, q = 0,1 = 1/10.", "S = (7/10) / (1 − 1/10) = (7/10) / (9/10) = <strong>7/9</strong>."]},
            {"page": 173, "top": 20, "bottom": 220, "name": "3-masala.png", "caption": "3-masala · 0,2(35) ni oddiy kasrga aylantirish · 173-bet", "kirish": "Aralash davriy kasr.", "alt": "3-masala: 0,2(35) kasrga aylantirish, 173-bet", "steps": ["0,2(35) = 0,2 + (0,035 + 0,00035 + ...)", "Qavs ichida: b₁ = 35/1000, q = 1/100.", "Qavs yig'indisi: (35/1000) / (99/100) = 35/990.", "Jami: 2/10 + 35/990 = (198 + 35)/990 = <strong>233/990</strong>."]},
            {"page": 173, "top": 220, "bottom": 440, "name": "4-masala.png", "caption": "4-masala · Kvadratlar yuzalari yig'indisi · 173-bet", "kirish": "Geometrik fractal masalasi.", "alt": "4-masala: kvadratlar yuzalari cheksiz yig'indisi, 173-bet", "steps": ["Birinchi kvadrat yuzi S₁ = a².", "Har safar yuz 2 marta kamayadi: q = 1/2.", "Cheksiz barcha kvadratlar yuzalari yig'indisi: S = a² / (1 − 1/2) = <strong>2a²</strong>."]}
        ],
        "mashqlar": {
            "betlar": "174–175-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "418-mashq.", "body": "Cheksiz kamayuvchi geometrik progressiya yig'indisini toping:", "sub": "1) b₁ = 1, q = 1/3; 2) b₁ = −2, q = 1/4; 3) b₁ = 4, q = −1/2."},
                {"title": "419-mashq.", "body": "Davriy kasrni oddiy kasrga aylantiring:", "sub": "1) 0,(2); 2) 0,(8); 3) 0,(15); 4) 0,1(6)."},
                {"title": "420-mashq.", "body": "Cheksiz yig'indisi 6 ga, birinchi hadi 3 ga teng progressiyaning maxrajini toping."}
            ]
        },
        "xulosa": [
            "|q| < 1 bo'lganda cheksiz ko'p hadlar yig'indisi aniq chegaralangan songa ega bo'ladi.",
            "S = b₁ / (1 − q) formulasi davriy kasrlarni oddiy kasrga aylantirishning eng aniq usulidir.",
            "Bu mavzu oliy matematikadagi limit va qatorlar nazariyasining poydevori hisoblanadi."
        ],
        "xulosaBoard": [
            {"html": "<strong>S</strong> = b₁ / (1 − q) (|q| < 1)"},
            {"html": "1/2 + 1/4 + 1/8 + ... = 1"},
            {"html": "0,(7) = 7/9, 0,(3) = 1/3"}
        ]
    },

    # =========================================================================
    # 34-DARS: Hodisalar (186-189-betlar)
    # =========================================================================
    {
        "id": 34,
        "bob": {"roman": "V", "nom": "Ehtimolliklar nazariyasi va matematik statistika elementlari"},
        "paragraf": "34-§",
        "title": "Hodisalar",
        "lead": "Tasodifiy, muqarrar va mumkin bo'lmagan hodisalar, teng imkoniyatli hodisalar tushunchasi.",
        "prev": {"href": "../33/", "label": "33-dars"},
        "next": {"href": "../35/", "label": "35-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 33-§ (cheksiz kamayuvchi progressiya) dan yangi bobga o'tish"},
            {"min": 7, "name": "Sahna — qutidagi sharlar va hodisalar turlari"},
            {"min": 8, "name": "Qoida — muqarrar, imkonsiz va tasodifiy hodisa ta'riflari"},
            {"min": 11, "name": "Doska — 4 ta masalani birga tahlil qilish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 460, 461, 462-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prob-classic",
            "ariaLabel": "Interaktiv chizma: hodisalar turlari",
            "hint": "Qulay sharlar soni m ni 0 (imkonsiz), o'rtacha (tasodifiy) va n (muqarrar) qilib ko'ring.",
            "vars": {
                "m": {"min": 0, "max": 8, "step": 1, "value": 3, "desc": "qulay sharlar m"},
                "n": {"min": 1, "max": 8, "step": 1, "value": 8, "desc": "jami sharlar n"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">33-§da progressiyalarni tugatib, oxirgi V bobga — <strong>Ehtimolliklar nazariyasi va matematik statistika</strong>ga o'tamiz. Hayotda hamma narsa qat'iy formula bilan oldindan belgilanmagan — ko'p jarayonlar tasodifga bog'liq.</p>",
            "<p>Ehtimolliklar nazariyasi aynan tasodifiy hodisalarni matematik jihatdan o'rganadigan, ularning qonuniyatlarini kashf etadigan fandir.</p>"
        ],
        "reja": "Hodisa tushunchasi, muqarrar, imkonsiz, tasodifiy va teng imkoniyatli hodisalar bilan tanishamiz.",
        "qoida": "<p>Sinov yoki tajriba natijasida ro'y berishi mumkin bo'lgan har qanday natija <strong>hodisa</strong> deyiladi.</p><p>Hodisalar 3 turga bo'linadi:</p><p><strong>1. Muqarrar hodisa:</strong> berilgan sharoitda <em>albatta</em> ro'y beradigan hodisa (masalan, suvning 100°C da qaynashi, kubikda 7 dan kichik son tushishi).</p><p><strong>2. Mumkin bo'lmagan (imkonsiz) hodisa:</strong> berilgan sharoitda <em>hech qachon</em> ro'y bermaydigan hodisa (masalan, kubikda 7 ochko tushishi).</p><p><strong>3. Tasodifiy hodisa:</strong> ro'y berishi ham, ro'y bermasligi ham mumkin bo'lgan hodisa (tanga tashlaganda gerb tushishi).</p><p>Agar birorta hodisaning ro'y berishi boshqasiga nisbatan ustunlikka ega bo'lmasa, ular <strong>teng imkoniyatli hodisalar</strong> deyiladi.</p>",
        "savollar": [
            {"savol": "Ertaga quyosh chiqishi qanday hodisa?", "variantlar": ["Tasodifiy", "Muqarrar", "Imkonsiz"], "togri": 1},
            {"savol": "Oddiy 6 qirrali o'yin kubigini tashlaganda 8 ochko chiqishi qanday hodisa?", "variantlar": ["Muqarrar", "Imkonsiz", "Tasodifiy"], "togri": 1},
            {"savol": "Tanga tashlaganda gerb yoki raqam tushishi qanday hodisalar?", "variantlar": ["Teng imkoniyatli", "Imkonsiz", "Biri ikkinchisidan ustun"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>Muqarrar hodisa</strong> — albatta ro'y beradi (P = 1).",
            "<strong>Mumkin bo'lmagan hodisa</strong> — ro'y berishi mumkin emas (P = 0).",
            "<strong>Tasodifiy hodisa</strong> — ro'y berishi ham, bermasligi ham mumkin (0 < P < 1).",
            "Teng imkoniyatli hodisalarda natijalar bir xil sharoitga ega."
        ],
        "kitob": {
            "betlar": "186–189-betlar",
            "sahifalar": [make_sahifa(p) for p in range(186, 190)]
        },
        "crops": [
            {"page": 186, "top": 200, "bottom": 440, "name": "1-masala.png", "caption": "1-masala · Tasodifiy hodisalar · 186-bet", "kirish": "Hayotiy misollar tahlili.", "alt": "1-masala: tasodifiy hodisa misollari, 186-bet", "steps": ["Qutida 5 oq va 5 qora shar bor.", "Tavakkal olingan shar oq bo'lishi — <strong>tasodifiy hodisa</strong>.", "Chunki oq shar chiqishi ham, qora shar chiqishi ham mumkin."]},
            {"page": 187, "top": 20, "bottom": 220, "name": "2-masala.png", "caption": "2-masala · Imkonsiz hodisa · 187-bet", "kirish": "Ro'y bermaydigan holatlar.", "alt": "2-masala: imkonsiz hodisa, 187-bet", "steps": ["O'yin kubigida 1, 2, 3, 4, 5, 6 raqamlari bor.", "Bitta kubik tashlanganda 7 ochko tushishi — <strong>mumkin bo'lmagan (imkonsiz) hodisa</strong>."]},
            {"page": 187, "top": 220, "bottom": 440, "name": "3-masala.png", "caption": "3-masala · Muqarrar hodisa · 187-bet", "kirish": "Albatta yuz beradigan hodisalar.", "alt": "3-masala: muqarrar hodisa, 187-bet", "steps": ["O'yin kubigini tashlaganda 7 dan kichik butun son tushishi — <strong>muqarrar hodisa</strong>.", "Chunki barcha 6 ta ochko ham 7 dan kichik."]},
            {"page": 188, "top": 20, "bottom": 240, "name": "4-masala.png", "caption": "4-masala · Teng imkoniyatli hodisalar · 188-bet", "kirish": "Simmetrik tajribalar.", "alt": "4-masala: teng imkoniyatli hodisalar, 188-bet", "steps": ["Ideal tanga tashlanganda gerb yoki raqam tomoni tushishi.", "Hech bir tomon ustunlikka ega emas.", "Bunday hodisalar — <strong>teng imkoniyatli</strong> hodisalardir."]}
        ],
        "mashqlar": {
            "betlar": "188–189-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "460-mashq.", "body": "Quyidagi hodisalar turini aniqlang (muqarrar, imkonsiz, tasodifiy):", "sub": "1) Yozdan keyin kuz keladi; 2) Ertaga yomg'ir yog'adi; 3) 13 oylik yil bo'ladi; 4) 2 ta kubik tashlanganda yig'indi 1 bo'ladi."},
                {"title": "461-mashq.", "body": "Birgalikda bo'lishi mumkin bo'lgan va mumkin bo'lmagan hodisalar:", "sub": "1) Qish keldi va daraxtlar gulladi; 2) Chipta yutuqli chiqdi va yutuqsiz chiqdi."},
                {"title": "462-mashq.", "body": "Qutida 10 ta oq shar bor. Qora shar chiqishi qanday hodisa?"}
            ]
        },
        "xulosa": [
            "Barcha hodisalar muqarrar, imkonsiz va tasodifiy turlarga bo'linadi.",
            "Teng imkoniyatlilik — ehtimollikning matematik poydevoridir.",
            "Ehtimolliklar nazariyasi tasodifiy hodisalarning qonuniyatlarini o'rganadi."
        ],
        "xulosaBoard": [
            {"html": "<strong>Muqarrar</strong>: albatta ro'y beradi (P = 1)"},
            {"html": "<strong>Imkonsiz</strong>: hech qachon ro'y bermaydi (P = 0)"},
            {"html": "<strong>Tasodifiy</strong>: bo'lishi ham, bo'lmasligi ham mumkin (0 < P < 1)"}
        ]
    },

    # =========================================================================
    # 35-DARS: Hodisaning ehtimolligi (190-193-betlar)
    # =========================================================================
    {
        "id": 35,
        "bob": {"roman": "V", "nom": "Ehtimolliklar nazariyasi va matematik statistika elementlari"},
        "paragraf": "35-§",
        "title": "Hodisaning ehtimolligi",
        "lead": "Hodisaning klassik ehtimolligi: P(A) = m / n. Qulay natijalar sonining jami natijalarga nisbati.",
        "prev": {"href": "../34/", "label": "34-dars"},
        "next": {"href": "../36/", "label": "36-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 34-§ (hodisalar turlari) ni eslash"},
            {"min": 7, "name": "Sahna — m/n nisbatini o'zgartirib ehtimollikni hisoblash"},
            {"min": 8, "name": "Qoida — klassik ehtimollik ta'rifi P(A) = m/n"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 468, 469, 470-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "prob-classic",
            "ariaLabel": "Interaktiv chizma: klassik ehtimollik P(A) = m/n",
            "hint": "m va n slayderlarini suring — P(A) kasr va o'nli ko'rinishda hisoblanadi.",
            "vars": {
                "m": {"min": 1, "max": 10, "step": 1, "value": 4, "desc": "qulay natijalar m"},
                "n": {"min": 1, "max": 10, "step": 1, "value": 10, "desc": "jami natijalar n"}
            }
        },
        "kirish": [
            "<p class=\"kirish-nega\">34-§da <strong>hodisalarning turlari</strong>ni ko'rdik. Bugun tasodifiy hodisaning ro'y berish imkoniyatini son bilan baholashni — <strong>ehtimollik</strong>ni o'rganamiz.</p>",
            "<p>Ehtimollik (lotincha <em>probabilitas</em>, shuning uchun <strong>P</strong> harfi bilan belgilanadi) — bu qulay imkoniyatlarning barcha teng imkoniyatli holatlarga nisbatidir.</p>"
        ],
        "reja": "Klassik ehtimollik ta'rifi P(A) = m/n va uning xossalarini o'rganamiz.",
        "qoida": "<p><strong>Klassik ta'rif:</strong> Tajribaning barcha teng imkoniyatli natijalari soni <strong>n</strong> bo'lib, ulardan <strong>m</strong> tasi A hodisaning ro'y berishiga qulaylik tug'dirsa, A hodisaning <strong>ehtimolligi</strong> deb quyidagi nisbatga aytiladi:</p><p><strong>P(A) = m / n</strong></p><p><strong>Xossalari:</strong></p><p>1. Muqarrar hodisa ehtimolligi: <strong>P = 1</strong> (chunki m = n).</p><p>2. Imkonsiz hodisa ehtimolligi: <strong>P = 0</strong> (chunki m = 0).</p><p>3. Har qanday tasodifiy hodisa uchun: <strong>0 ≤ P(A) ≤ 1</strong>.</p>",
        "savollar": [
            {"savol": "O'yin kubigi tashlanganda juft son (2, 4, 6) tushish ehtimolligi qancha?", "variantlar": ["1/6", "1/2 (3/6)", "2/3"], "togri": 1},
            {"savol": "Qutida 3 ta qizil va 7 ta ko'k shar bor. Qizil shar chiqish ehtimolligi qancha?", "variantlar": ["0,3 (3/10)", "0,7", "0,5"], "togri": 0},
            {"savol": "Ehtimollik 1 dan katta bo'lishi mumkinmi?", "variantlar": ["Ha, ba'zan", "Hech qachon (0 ≤ P ≤ 1)", "Faqat 100% dan oshsa"], "togri": 1}
        ],
        "eslabQol": [
            "<strong>P(A) = m / n</strong> — qulay natijalar / jami natijalar.",
            "Ehtimollik doim <strong>0 va 1</strong> oralig'ida bo'ladi (0 ≤ P ≤ 1).",
            "P = 1 — muqarrar hodisa, P = 0 — imkonsiz hodisa.",
            "Qarama-qarshi hodisa ehtimolligi: P(Ā) = 1 − P(A)."
        ],
        "kitob": {
            "betlar": "190–193-betlar",
            "sahifalar": [make_sahifa(p) for p in range(190, 194)]
        },
        "crops": [
            {"page": 191, "top": 200, "bottom": 380, "name": "1-masala.png", "caption": "1-masala · 20 ta kartochkadan 7 soni chiqishi · 191-bet", "kirish": "Oddiy elementar hodisa.", "alt": "1-masala: 20 kartochkadan 7 chiqishi, 191-bet", "steps": ["Jami kartochkalar: n = 20 ta.", "7 raqami yozilgan kartochka: m = 1 ta.", "P(A) = 1/20 = <strong>0,05</strong>."]},
            {"page": 191, "top": 380, "bottom": 620, "name": "2-masala.png", "caption": "2-masala · Toq sonli kartochka chiqishi · 191-bet", "kirish": "Murakkabroq hodisa ehtimolligi.", "alt": "2-masala: toq son chiqish ehtimolligi, 191-bet", "steps": ["1 dan 20 gacha toq sonlar: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 — jami m = 10 ta.", "Jami sonlar: n = 20 ta.", "P(A) = 10/20 = <strong>1/2 = 0,5</strong>."]},
            {"page": 192, "top": 20, "bottom": 180, "name": "3-masala.png", "caption": "3-masala · Kubikda toq ochko tushishi · 192-bet", "kirish": "O'yin kubigi tajribasi.", "alt": "3-masala: kubikda toq son, 192-bet", "steps": ["Jami natijalar: n = 6 (1, 2, 3, 4, 5, 6).", "Toq ochkolar: m = 3 (1, 3, 5).", "P(A) = 3/6 = <strong>1/2</strong>."]},
            {"page": 192, "top": 180, "bottom": 360, "name": "4-masala.png", "caption": "4-masala · Qutidagi rangli sharlar · 192-bet", "kirish": "Sharlar ehtimolligi.", "alt": "4-masala: sharlar ehtimolligi, 192-bet", "steps": ["Qutida 6 oq va 4 qora shar bor. Jami n = 10.", "Oq shar olish: m = 6 → P(oq) = 6/10 = <strong>0,6</strong>.", "Qora shar olish: m = 4 → P(qora) = 4/10 = <strong>0,4</strong>."]}
        ],
        "mashqlar": {
            "betlar": "193–194-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "468-mashq.", "body": "Kubik tashlanganda quyidagi hodisalar ehtimolligini toping:", "sub": "1) 5 ochko tushishi; 2) Juft ochko tushishi; 3) 3 ga karrali ochko tushishi; 4) 7 ochko tushishi."},
                {"title": "469-mashq.", "body": "36 ta o'yin kartasidan tavakkal bittasi olindi:", "sub": "1) Tuz chiqish ehtimolligi; 2) Qizil tusli karta chiqish ehtimolligi."},
                {"title": "470-mashq.", "body": "Sinfda 30 o'quvchidan 18 tasi qizlar. Tavakkal tanlangan o'quvchi o'g'il bola bo'lish ehtimolligi qanday?"}
            ]
        },
        "xulosa": [
            "P(A) = m / n formulasi barcha elementar teng imkoniyatli sinovlar uchun asosiy qoidadir.",
            "Ehtimollik qiymati 0 dan kichik va 1 dan katta bo'lishi mutlaqo mumkin emas.",
            "Amaliyotda ehtimollik qulay va jami natijalarni to'g'ri sanashga tayanadi."
        ],
        "xulosaBoard": [
            {"html": "<strong>P(A)</strong> = m / n"},
            {"html": "0 ≤ P(A) ≤ 1"},
            {"html": "P(Muqarrar) = 1, P(Imkonsiz) = 0"}
        ]
    },

    # =========================================================================
    # 36-DARS: Nisbiy chastota (194-197-betlar)
    # =========================================================================
    {
        "id": 36,
        "bob": {"roman": "V", "nom": "Ehtimolliklar nazariyasi va matematik statistika elementlari"},
        "paragraf": "36-§",
        "title": "Tasodifiy hodisaning nisbiy chastotasi",
        "lead": "Hodisaning tajribadagi paydo bo'lish soni M ning jami sinovlar N ga nisbati: W(A) = M / N va statistik ehtimollik.",
        "prev": {"href": "../35/", "label": "35-dars"},
        "next": {"href": "../37/", "label": "37-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 35-§ (ehtimollik) ni eslash"},
            {"min": 7, "name": "Sahna — sinovlar soni N ortishi bilan nisbiy chastota barqarorlashishi"},
            {"min": 8, "name": "Qoida — nisbiy chastota W(A) = M/N ta'rifi"},
            {"min": 11, "name": "Doska — 4 ta masalani birga tahlil qilish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 476, 477, 478-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "stat-freq",
            "mode": "freq",
            "ariaLabel": "Interaktiv chizma: nisbiy chastota",
            "hint": "N sinovlar sonini oshiring — nisbiy chastota W barqarorlashib nazariy ehtimollik atrofida to'planadi.",
            "vars": {"n": {"min": 10, "max": 200, "step": 10, "value": 50, "desc": "sinovlar soni N"}}
        },
        "kirish": [
            "<p class=\"kirish-nega\">35-§da <strong>nazariy ehtimollik</strong> P(A) = m/n ni o'rgandik. Ammo real hayotda tanga yoki nishon mukammal bo'lmasligi mumkin. Bu holda nima qilinadi?</p>",
            "<p>Bu holatda tajriba (sinov) o'tkaziladi va hodisa necha marta sodir bo'lgani sanaladi. Bu — <strong>nisbiy chastota</strong> (statistik ehtimollik) deyiladi.</p>"
        ],
        "reja": "Nisbiy chastota ta'rifi W(A) = M/N va Katta sonlar qonunining mohiyatini o'rganamiz.",
        "qoida": "<p><strong>Ta'rif:</strong> N ta sinovda A hodisa <strong>M</strong> marta ro'y bergan bo'lsa, M soni A hodisaning <em>absolyut chastotasi</em>, quyidagi nisbat esa <strong>nisbiy chastotasi</strong> deyiladi:</p><p><strong>W(A) = M / N</strong></p><p><strong>Statistik barqarorlik:</strong> Sinovlar soni N juda katta bo'lganda, nisbiy chastota W(A) o'zgarmas bir son (nazariy ehtimollik P(A)) atrofida tebranib, unga yaqinlashadi.</p><p>Buni Byuffon (4040 marta tanga tashlab W=0,5069 olgan) va Karl Pirson (24000 marta tashlab W=0,5005 olgan) tajribalari tasdiqlagan.</p>",
        "savollar": [
            {"savol": "100 ta sinovda hodisa 45 marta yuz bersa, nisbiy chastotasi qancha?", "variantlar": ["0,45", "45", "4,5"], "togri": 0},
            {"savol": "Sinovlar soni N cheksiz ortganda nisbiy chastota nima bo'ladi?", "variantlar": ["Cheksiz ortadi", "Nazariy ehtimollikka yaqinlashadi", "Nolga aylanadi"], "togri": 1},
            {"savol": "W(A) qiymati qaysi oraliqda bo'ladi?", "variantlar": ["[0; 1]", "[−1; 1]", "[0; 100]"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>W(A) = M / N</strong> — ro'y berganlar soni / barcha sinovlar soni.",
            "W — tajriba natijasida olinadigan real ko'rsatkich.",
            "N ortgan sari W(A) barqarorlashadi va P(A) ga intiladi.",
            "Sifat nazorati, tibbiyot va sotsiologiyada ehtimollik aynan W orqali baholanadi."
        ],
        "kitob": {
            "betlar": "194–197-betlar",
            "sahifalar": [make_sahifa(p) for p in range(194, 198)]
        },
        "crops": [
            {"page": 194, "top": 360, "bottom": 600, "name": "1-masala.png", "caption": "1-masala · A'lo baholarning nisbiy chastotasi · 194-bet", "kirish": "Maktabdagi baholar statistikasi.", "alt": "1-masala: a'lo baholar chastotasi, 194-bet", "steps": ["Sinfda 25 ta o'quvchi nazorat ishi yozdi (N = 25).", "6 ta o'quvchi «5» baho oldi (M = 6).", "W(A) = 6/25 = <strong>0,24</strong> (24%)."]},
            {"page": 195, "top": 20, "bottom": 260, "name": "2-masala.png", "caption": "2-masala · Pirson tajribalari · 195-bet", "kirish": "Tanga tashlash tajribasi.", "alt": "2-masala: Pirson tanga tajribalari, 195-bet", "steps": ["Pirson 24000 marta tanga tashlagan (N = 24000).", "Gerb tomoni M = 12012 marta tushgan.", "W = 12012 / 24000 = <strong>0,5005</strong> ≈ 0,5."]},
            {"page": 195, "top": 260, "bottom": 460, "name": "3-masala.png", "caption": "3-masala · Merganning o'q uzishi · 195-bet", "kirish": "Nishonga tegish chastotasi.", "alt": "3-masala: merganning o'q uzishi, 195-bet", "steps": ["Mergan N = 100 ta o'q uzdi.", "M = 87 ta o'q nishonga tegdi.", "Nisbiy chastota: W = 87 / 100 = <strong>0,87</strong>."]},
            {"page": 196, "top": 20, "bottom": 240, "name": "4-masala.png", "caption": "4-masala · Standart detallar chastotasi · 196-bet", "kirish": "Zavoddagi mahsulot sifati.", "alt": "4-masala: standart detallar nisbiy chastotasi, 196-bet", "steps": ["Tekshirilgan detallar: N = 500 ta.", "Yaroqsiz (brak) detallar: M = 15 ta.", "Yaroqsizlik nisbiy chastotasi: W = 15 / 500 = <strong>0,03</strong> (3%)."]}
        ],
        "mashqlar": {
            "betlar": "196–197-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "476-mashq.", "body": "Nisbiy chastotani hisoblang:", "sub": "1) Tanga 50 marta tashlanganda 28 marta gerb tushdi; 2) 200 ta urug'dan 176 tasi unib chiqdi."},
                {"title": "477-mashq.", "body": "Otish mashg'ulotida 80 ta o'qdan 68 tasi nishonga tegdi. Nishonga tegishning nisbiy chastotasi qanday?"},
                {"title": "478-mashq.", "body": "1000 ta lotereya chiptasidan 45 tasi yutuqli chiqdi. Yutuqsiz chiptalarning nisbiy chastotasini toping."}
            ]
        },
        "xulosa": [
            "Nisbiy chastota W = M / N amaliy tajribalar asosida hisoblanadi.",
            "Katta sonlar qonuniga ko'ra sinovlar ko'paygani sari W ehtimollik P ga juda yaqinlashadi.",
            "Statistika aynan nisbiy chastotalarni tahlil qilish orqali xulosa chiqaradi."
        ],
        "xulosaBoard": [
            {"html": "<strong>W(A)</strong> = M / N"},
            {"html": "N → ∞ da W(A) ≈ P(A)"},
            {"html": "Pirson: N=24000 da W = 0,5005 ≈ 0,5"}
        ]
    },

    # =========================================================================
    # 37-DARS: Tasodifiy miqdorlar (198-205-betlar)
    # =========================================================================
    {
        "id": 37,
        "bob": {"roman": "V", "nom": "Ehtimolliklar nazariyasi va matematik statistika elementlari"},
        "paragraf": "37-§",
        "title": "Tasodifiy miqdorlar",
        "lead": "Sinov natijasida turli son qiymatlarni qabul qiluvchi miqdorlar, ularning taqsimot jadvali va poligoni.",
        "prev": {"href": "../36/", "label": "36-dars"},
        "next": {"href": "../38/", "label": "38-dars"},
        "agenda": [
            {"min": 4, "name": "Kirish — 36-§ (nisbiy chastota) ni eslash"},
            {"min": 7, "name": "Sahna — tasodifiy miqdor taqsimot gistogrammasi"},
            {"min": 8, "name": "Qoida — diskret tasodifiy miqdor va taqsimot qonuni"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 484, 485, 486-mashqlar"},
            {"min": 5, "name": "Eslab qol — xulosa va uyga vazifa"}
        ],
        "sahna": {
            "type": "stat-freq",
            "mode": "random_var",
            "ariaLabel": "Interaktiv chizma: tasodifiy miqdor taqsimoti",
            "hint": "N parametrini suring — tasodifiy miqdor qiymatlari chastotalarining taqsimoti ko'rinadi.",
            "vars": {"n": {"min": 20, "max": 200, "step": 20, "value": 80, "desc": "kuzatuvlar soni N"}}
        },
        "kirish": [
            "<p class=\"kirish-nega\">36-§da <strong>nisbiy chastota</strong>ni o'rgangan edik. Endi sinov natijasi sonlar bilan ifodalanadigan tushunchaga — <strong>tasodifiy miqdor</strong>ga o'tamiz.</p>",
            "<p>Masalan: kunlik havo harorati, bir kunda do'konga kirgan xaridorlar soni, o'yin kubigida tushgan ochko — bularning barchasi oldindan aniq aytib bo'lmaydigan tasodifiy miqdorlardir.</p>"
        ],
        "reja": "Tasodifiy miqdor tushunchasi, taqsimot jadvali va chastotalar poligonini yasashni o'rganamiz.",
        "qoida": "<p><strong>Ta'rif:</strong> Sinov natijasida u yoki bu ehtimollik bilan ma'lum son qiymatlarini qabul qiladigan miqdor <strong>tasodifiy miqdor</strong> deyiladi (odatda X, Y bilan belgilanadi).</p><p>Tasodifiy miqdor qabul qiladigan qiymatlari va ularga mos ehtimolliklar (yoki chastotalar) jadvali <strong>taqsimot qonuni</strong> deyiladi:</p><table style=\"margin:8px auto;border-collapse:collapse;text-align:center;\"><tr><th style=\"border:1px solid #999;padding:4px 8px;\">X</th><td style=\"border:1px solid #999;padding:4px 8px;\">x₁</td><td style=\"border:1px solid #999;padding:4px 8px;\">x₂</td><td style=\"border:1px solid #999;padding:4px 8px;\">...</td><td style=\"border:1px solid #999;padding:4px 8px;\">xₖ</td></tr><tr><th style=\"border:1px solid #999;padding:4px 8px;\">P</th><td style=\"border:1px solid #999;padding:4px 8px;\">p₁</td><td style=\"border:1px solid #999;padding:4px 8px;\">p₂</td><td style=\"border:1px solid #999;padding:4px 8px;\">...</td><td style=\"border:1px solid #999;padding:4px 8px;\">pₖ</td></tr></table><p>Asosiy shart: barcha ehtimolliklar yig'indisi 1 ga teng: <strong>p₁ + p₂ + ... + pₖ = 1</strong>.</p>",
        "savollar": [
            {"savol": "Bitta o'yin kubigidagi ochkolar soni X qanday qiymatlarni qabul qiladi?", "variantlar": ["{1, 2, 3, 4, 5, 6}", "Istalgan son", "{0, 1}"], "togri": 0},
            {"savol": "Taqsimot jadvalidagi barcha ehtimolliklar yig'indisi nechaga teng bo'lishi shart?", "variantlar": ["0", "1", "100"], "togri": 1},
            {"savol": "Chastotalar poligoni nima?", "variantlar": ["Ko'pburchak shaklidagi grafik", "Nuqtalarni tutashtiruvchi siniq chiziq", "Aylana"], "togri": 1}
        ],
        "eslabQol": [
            "Tasodifiy miqdor X sinov natijasida aniq bir son qiymatini oladi.",
            "Taqsimot jadvalida barcha ehtimolliklar yig'indisi doim <strong>∑pᵢ = 1</strong> bo'ladi.",
            "Grafik tasvirlash uchun gistogramma va chastotalar poligonidan foydalaniladi."
        ],
        "kitob": {
            "betlar": "198–205-betlar",
            "sahifalar": [make_sahifa(p) for p in range(198, 206)]
        },
        "crops": [
            {"page": 198, "top": 240, "bottom": 500, "name": "1-masala.png", "caption": "1-masala · Ikkita kubik ochkolari yig'indisi · 198-bet", "kirish": "Tasodifiy miqdor qiymatlari.", "alt": "1-masala: ikkita kubik ochkolari yig'indisi, 198-bet", "steps": ["Ikkita kubik tashlanganda ochkolar yig'indisi X tasodifiy miqdordir.", "X qabul qilishi mumkin bo'lgan qiymatlar: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12.", "Eng katta ehtimollik 7 soniga to'g'ri keladi (6 ta holat)."]},
            {"page": 199, "top": 100, "bottom": 320, "name": "2-masala.png", "caption": "2-masala · Taqsimot jadvalini tuzish · 199-bet", "kirish": "Jadval ko'rinishida yozish.", "alt": "2-masala: taqsimot jadvali, 199-bet", "steps": ["Har bir xᵢ qiymatga uning pᵢ ehtimolligi mos qo'yiladi.", "Jami ehtimolliklar: p₁ + p₂ + ... + pₖ = 1.", "Bu jadval orqali jarayon to'liq matematik tavsiflanadi."]},
            {"page": 200, "top": 120, "bottom": 360, "name": "3-masala.png", "caption": "3-masala · Chastotalar poligoni · 200-bet", "kirish": "Koordinata tekisligida chizish.", "alt": "3-masala: chastotalar poligoni, 200-bet", "steps": ["Gorizontal o'qqa X ning qiymatlari (xᵢ), vertikal o'qqa chastotalar (Mᵢ) qo'yiladi.", "(xᵢ, Mᵢ) nuqtalar kesmalar bilan tutashtiriladi.", "Hosil bo'lgan siniq chiziq — <strong>chastotalar poligoni</strong> deyiladi."]},
            {"page": 201, "top": 100, "bottom": 340, "name": "4-masala.png", "caption": "4-masala · Gistogramma yasash · 201-bet", "kirish": "Ustunli diagramma ko'rinishi.", "alt": "4-masala: gistogramma yasash, 201-bet", "steps": ["Har bir oraliq ustiga balandligi chastotaga mos to'g'ri to'rtburchak yasaladi.", "Gistogramma ma'lumotlarning tarqalish shaklini yaqqol ko'rsatadi."]}
        ],
        "mashqlar": {
            "betlar": "203–205-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "484-mashq.", "body": "Taqsimot jadvalini tuzing:", "sub": "Tanga 3 marta tashlanganda gerb tushishlar soni X ning taqsimot jadvalini yozing."},
                {"title": "485-mashq.", "body": "Chastotalar poligonini chizing:", "sub": "Nazorat ishida olingan baholar: 3 (8 ta), 4 (12 ta), 5 (6 ta)."},
                {"title": "486-mashq.", "body": "Noma'lum ehtimollikni toping:", "sub": "X miqdor uchun p₁ = 0,2; p₂ = 0,5; p₃ = ? bo'lsa, p₃ ni hisoblang."}
            ]
        },
        "xulosa": [
            "Tasodifiy miqdor tajriba natijasida ehtimollik bilan ma'lum son qiymatini qabul qiladi.",
            "Taqsimot qonuni barcha mumkin bo'lgan qiymatlar va ularning ehtimolliklarini ko'rsatadi.",
            "Poligon va gistogramma ma'lumotlarni ko'rgazmali tahlil qilish vositasidir."
        ],
        "xulosaBoard": [
            {"html": "<strong>Tasodifiy miqdor</strong>: X = {x₁, x₂, ..., xₙ}"},
            {"html": "<strong>Shart</strong>: p₁ + p₂ + ... + pₙ = 1"},
            {"html": "<strong>Grafik</strong>: Poligon va Gistogramma"}
        ]
    },

    # =========================================================================
    # 38-DARS: Sonli xarakteristikalar (206-210-betlar) — YAKUNIY DARS!
    # =========================================================================
    {
        "id": 38,
        "bob": {"roman": "V", "nom": "Ehtimolliklar nazariyasi va matematik statistika elementlari"},
        "paragraf": "38-§",
        "title": "Tasodifiy miqdorlarning sonli xarakteristikalari",
        "lead": "Tasodifiy miqdorning o'rta qiymati (o'rta arifmetik), modasi va medianasi — statistikaning asosiy ko'rsatkichlari.",
        "prev": {"href": "../37/", "label": "37-dars"},
        "next": None,  # Kursning oxirgi 38-darsi!
        "agenda": [
            {"min": 4, "name": "Kirish — 37-§ (tasodifiy miqdorlar) ni eslash"},
            {"min": 7, "name": "Sahna — o'rta qiymat, moda va mediananing dinamik hisobi"},
            {"min": 8, "name": "Qoida — o'rta qiymat x̄, moda M₀ va mediana Mₑ ta'riflari"},
            {"min": 11, "name": "Doska — 4 ta masalani birga yechish"},
            {"min": 5, "name": "Savollar — sinf ovoz bilan javob beradi"},
            {"min": 5, "name": "Darslikdan mashqlar — 492, 493, 494-mashqlar"},
            {"min": 5, "name": "Eslab qol — kurs xulosasi va yakuniy testga tayyorgarlik"}
        ],
        "sahna": {
            "type": "stat-freq",
            "mode": "metrics",
            "ariaLabel": "Interaktiv chizma: o'rta qiymat, moda, mediana",
            "hint": "Slayderni suring — o'rtacha qiymat x̄, eng ko'p takrorlangan qiymat (moda) va o'rtadagi son (mediana) hisoblanadi.",
            "vars": {"n": {"min": 20, "max": 200, "step": 10, "value": 60, "desc": "tanlanma hajmi N"}}
        },
        "kirish": [
            "<p class=\"kirish-nega\">37-§da <strong>tasodifiy miqdorlar va ularning taqsimoti</strong>ni o'rgangan edik. Bugun 9-sinf algebra kursining yakuniy mavzusi — ma'lumotlarni bitta aniq son bilan tavsiflovchi <strong>sonli xarakteristikalar</strong>ni ko'rib chiqamiz.</p>",
            "<p>Minglab o'quvchilar natijasi yoki butun viloyatdagi oylik maoshlarni bittalab aytib bo'lmaydi. Ular o'rniga o'rtacha qiymat, eng ko'p uchraydigan qiymat (moda) va qoq o'rtadagi qiymat (mediana) aytiladi.</p>"
        ],
        "reja": "O'rta qiymat (x̄), moda (M₀) va mediana (Mₑ) hisoblash qoidalarini to'liq egallaymiz.",
        "qoida": "<p>Ma'lumotlar tahlilining 3 ta asosiy ko'rsatkichi:</p><p><strong>1. O'rta qiymat (o'rta arifmetik):</strong> Barcha qiymatlar yig'indisining ularning umumiy soniga nisbati:</p><p><strong>x̄ = (x₁·M₁ + x₂·M₂ + ... + xₖ·Mₖ) / N</strong></p><p><strong>2. Moda (M₀):</strong> Tanlanmada <em>eng ko'p takrorlangan</em> (chastotasi eng katta bo'lgan) qiymat.</p><p><strong>3. Mediana (Mₑ):</strong> O'sish tartibida joylashtirilgan sonli qatorning <em>qoq o'rtasida</em> turgan qiymat (agar sonlar juft bo'lsa, o'rtadagi ikkita sonning o'rta arifmetigi).</p>",
        "savollar": [
            {"savol": "3, 5, 5, 7, 9 qatorning modasi nechaga teng?", "variantlar": ["5 (eng ko'p takrorlangan)", "3", "7"], "togri": 0},
            {"savol": "2, 4, 6, 8, 10 qatorning medianasi nechaga teng?", "variantlar": ["4", "6 (o'rtada turgan)", "5"], "togri": 1},
            {"savol": "O'rta arifmetik qanday hisoblanadi?", "variantlar": ["Barcha sonlar yig'indisi / sonlar soni", "Eng katta va eng kichik ayirmasi", "Faqat birinchi son"], "togri": 0}
        ],
        "eslabQol": [
            "<strong>O'rta arifmetik (x̄)</strong> — ma'lumotlar massasining markazi.",
            "<strong>Moda (M₀)</strong> — eng ommabop, eng ko'p uchraydigan qiymat.",
            "<strong>Mediana (Mₑ)</strong> — qatorni teng ikkiga bo'luvchi o'rta chegara.",
            "Uchala xarakteristika birgalikda to'liq statistik manzarani ko'rsatadi."
        ],
        "kitob": {
            "betlar": "206–210-betlar",
            "sahifalar": [make_sahifa(p) for p in range(206, 211)]
        },
        "crops": [
            {"page": 206, "top": 120, "bottom": 380, "name": "1-masala.png", "caption": "1-masala · O'rtacha bahoni hisoblash · 206-bet", "kirish": "Sinfning o'rtacha balli.", "alt": "1-masala: o'rtacha qiymat hisoblash, 206-bet", "steps": ["Baholar: «5» (5 ta), «4» (10 ta), «3» (5 ta). Jami N = 20 o'quvchi.", "Yig'indi: 5·5 + 4·10 + 3·5 = 25 + 40 + 15 = 80.", "O'rta arifmetik: x̄ = 80 / 20 = <strong>4,0</strong>."]},
            {"page": 207, "top": 100, "bottom": 320, "name": "2-masala.png", "caption": "2-masala · Modani topish · 207-bet", "kirish": "Eng ko'p takrorlangan qiymat.", "alt": "2-masala: modani aniqlash, 207-bet", "steps": ["Poyabzal o'lchamlari sotuvi: 38 (3 ta), 39 (12 ta), 40 (7 ta).", "Eng katta chastota 12 (39-o'lcham).", "Demak tanlanma modasi: M₀ = <strong>39</strong>."]},
            {"page": 208, "top": 20, "bottom": 240, "name": "3-masala.png", "caption": "3-masala · Medianani topish · 208-bet", "kirish": "Tartiblangan qatorda o'rtani topish.", "alt": "3-masala: medianani aniqlash, 208-bet", "steps": ["Qator: 12, 14, 15, 18, 20, 22, 25 (7 ta son).", "Qoq o'rtadagi 4-son: 18.", "Mediana Mₑ = <strong>18</strong>."]},
            {"page": 208, "top": 240, "bottom": 480, "name": "4-masala.png", "caption": "4-masala · Juft sonli qatorda mediana · 208-bet", "kirish": "O'rtadagi ikkita son holati.", "alt": "4-masala: juft sonli qator medianasi, 208-bet", "steps": ["Qator: 4, 6, 8, 10, 12, 14 (6 ta son).", "O'rtadagi ikkita son: 8 va 10.", "Mediana: Mₑ = (8 + 10) / 2 = <strong>9</strong>."]}
        ],
        "mashqlar": {
            "betlar": "209–210-bet",
            "intro": "Daftarga yeching. O'qituvchi doskada tekshiradi.",
            "items": [
                {"title": "492-mashq.", "body": "O'rta qiymat, moda va medianani toping:", "sub": "1) 3, 4, 5, 5, 6, 7; 2) 10, 12, 12, 14, 16, 20; 3) 2, 2, 3, 4, 4, 4, 5."},
                {"title": "493-mashq.", "body": "O'quvchilarning bo'yi (cm): 152, 154, 155, 155, 158, 160, 162. O'rtacha bo'y va modani toping."},
                {"title": "494-mashq.", "body": "Haftalik harorat (°C): 18, 20, 22, 22, 21, 19, 18. Medianani toping."}
            ]
        },
        "xulosa": [
            "O'rta arifmetik barcha sonlar yig'indisini ularning soniga bo'lish orqali topiladi.",
            "Moda — eng katta chastotaga ega qiymat.",
            "Mediana tartiblangan qatorning o'rtasidagi chegara ko'rsatkichidir.",
            "Tabriklaymiz! 9-sinf Algebra kursining barcha 38 ta darsi to'liq yakunlandi!"
        ],
        "xulosaBoard": [
            {"html": "<strong>O'rta arifmetik (x̄)</strong> = ∑xᵢ / N"},
            {"html": "<strong>Moda (M₀)</strong>: eng ko'p takrorlangan"},
            {"html": "<strong>Mediana (Mₑ)</strong>: qoq o'rtadagi qiymat"},
            {"html": "38-dars: 9-sinf kursi to'liq tayyor!"}
        ]
    }
]

def main():
    print(f"Jami {len(LESSONS_DATA)} ta dars (26 dan 38 gacha) generatsiya qilinadi...")
    for ldata in LESSONS_DATA:
        lid = ldata["id"]
        ldir = LESSONS_BASE / str(lid)
        png_dir = ldir / "png"
        ldir.mkdir(parents=True, exist_ok=True)
        png_dir.mkdir(parents=True, exist_ok=True)

        # 1. Process crops
        masalalar = []
        for c in ldata["crops"]:
            out_png = png_dir / c["name"]
            w, h = crop_box(c["page"], c["top"], c["bottom"], out_png)
            masala_item = {
                "caption": c["caption"],
                "kirish": c["kirish"],
                "img": f"png/{c['name']}",
                "alt": c["alt"],
                "width": w,
                "height": h,
                "steps": c["steps"]
            }
            masalalar.append(masala_item)

        doska_obj = {
            "intro": f"Kitobdagi {ldata['paragraf']} — masalalar va namunalar tahlili.",
            "masalalar": masalalar
        }

        # Build clean data dict
        clean_data = {
            "id": ldata["id"],
            "bob": ldata["bob"],
            "paragraf": ldata["paragraf"],
            "title": ldata["title"],
            "lead": ldata["lead"],
            "prev": ldata["prev"],
            "next": ldata["next"],
            "agenda": ldata["agenda"],
            "sahna": ldata["sahna"],
            "kirish": ldata["kirish"],
            "reja": ldata["reja"],
            "qoida": ldata["qoida"],
            "savollar": ldata["savollar"],
            "eslabQol": ldata["eslabQol"],
            "kitob": ldata["kitob"],
            "doska": doska_obj,
            "mashqlar": ldata["mashqlar"],
            "xulosa": ldata["xulosa"],
            "xulosaBoard": ldata["xulosaBoard"]
        }

        data_json_path = ldir / "data.json"
        data_json_path.write_text(json.dumps(clean_data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  [OK] {lid}-dars ({ldata['paragraf']}) data.json va {len(masalalar)} ta crop yaratildi.")

if __name__ == "__main__":
    main()
