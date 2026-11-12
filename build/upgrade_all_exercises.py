#!/usr/bin/env python3
"""
Jonli Algebra — Apex Curriculum & Exercise Engine
Barcha 38 ta darsdagi copy-paste va dummy mashqlarni va olimpiada bloklarini
100% o'z mavzusiga mos, pedagogik va matematik qat'iy mashqlar bilan yangilaydi.
"""

import json
from pathlib import Path

CURRICULUM_EXERCISES = {
    1: {
        "items": [
            {
                "id": "ex-1-1",
                "daraja": "asosiy",
                "savol": "y = 3x² − 5x + 2 kvadrat funksiyaning x = 2 dagi qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Son kiriting (masalan: 4)",
                "togriJavob": ["4"],
                "validationRegex": r"^\s*4\s*$",
                "hint": "Formula: x o'rniga 2 qo'ying: y(2) = 3·(2)² − 5·(2) + 2.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x = 2 ni funksiyaga qo'yamiz.",
                        "2-qadam: y(2) = 3·4 − 10 + 2 = 12 − 10 + 2 = 4.",
                        "Javob: 4."
                    ],
                    "javob": "4"
                }
            },
            {
                "id": "ex-1-2",
                "daraja": "ortacha",
                "savol": "y = −2x² + 7x − 3 kvadrat funksiyaning a, b va c koeffitsiyentlari yig'indisini (a + b + c) hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Umumiy ko'rinish y = ax² + bx + c: a = −2, b = 7, c = −3.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a = −2, b = 7, c = −3 ekanini aniqlaymiz.",
                        "2-qadam: Yig'indi: (−2) + 7 + (−3) = 2.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-1-3",
                "daraja": "litsey",
                "savol": "y = (m − 3)x² + 4x − 1 ifoda kvadrat funksiya bo'lishi uchun m qaysi songa teng bo'la olmaydi?",
                "type": "input",
                "inputPlaceholder": "Son kiriting (masalan: 3)",
                "togriJavob": ["3", "m=3"],
                "validationRegex": r"^\s*(m\s*=\s*)?3\s*$",
                "hint": "Ta'rifga ko'ra x² oldidagi koeffitsiyent a ≠ 0 bo'lishi shart: m − 3 ≠ 0.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Kvadrat funksiyada x² oldidagi koeffitsiyent nol bo'lishi mumkin emas (a ≠ 0).",
                        "2-qadam: m − 3 = 0 bo'lsa x² yo'qolib chiziqli funksiya qoladi.",
                        "3-qadam: Demak, m = 3 bo'la olmaydi.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "f(x) = x² + px + q kvadrat funksiya berilgan. Agar f(0) = 4 va f(2) = 2 bo'lsa, p koeffitsiyentning qiymatini toping.",
            "korsatma": "f(0) = q ekanidan q ni toping, so'ng f(2) ga qo'yib p ni hisoblang.",
            "yechim": {
                "tahlil": "Funksiya qiymatlarini ketma-ket qo'yib, noma'lum koeffitsiyentlarni aniqlaymiz.",
                "qadamlar": [
                    "1-qadam: f(0) = 0² + p·0 + q = q = 4.",
                    "2-qadam: f(2) = 2² + 2p + 4 = 2p + 8.",
                    "3-qadam: 2p + 8 = 2 → 2p = −6 → p = −3.",
                    "Javob: −3."
                ],
                "javob": "−3"
            }
        }
    },
    2: {
        "items": [
            {
                "id": "ex-2-1",
                "daraja": "asosiy",
                "savol": "y = x² parabolaga tegishli A(k; 49) nuqta berilgan (k > 0). k ning qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 7",
                "togriJavob": ["7", "+7"],
                "validationRegex": r"^\s*\+?7\s*$",
                "hint": "k² = 49 va k > 0 bo'lgani uchun k = 7.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: y = x² tenglamaga qo'yamiz: 49 = k².",
                        "2-qadam: k > 0 bo'lgani uchun k = 7.",
                        "Javob: 7."
                    ],
                    "javob": "7"
                }
            },
            {
                "id": "ex-2-2",
                "daraja": "ortacha",
                "savol": "y = x² parabola va y = 9 to'g'ri chiziq kesishish nuqtalarining abssissalari yig'indisini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0",
                "togriJavob": ["0"],
                "validationRegex": r"^\s*0\s*$",
                "hint": "x² = 9 → x = 3 va x = −3. Yig'indi: 3 + (−3).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² = 9 dan x₁ = −3 va x₂ = 3.",
                        "2-qadam: Yig'indi: (−3) + 3 = 0 (Oy o'qiga nisbatan simmetriya).",
                        "Javob: 0."
                    ],
                    "javob": "0"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = x² parabolada yotuvchi A(−2; 4), O(0; 0) va B(2; 4) nuqtalar hosil qilgan uchburchak yuzini hisoblang.",
            "korsatma": "AB kesma uzunligi asos bo'ladi, O(0;0) dan masofa balandlik bo'ladi.",
            "yechim": {
                "tahlil": "Asos AB gorizontal kesma: 2 − (−2) = 4. Balandlik h = 4. Yuza S = (4 · 4) / 2 = 8.",
                "qadamlar": [
                    "1-qadam: Asos uzunligi AB = 4.",
                    "2-qadam: Balandlik h = 4.",
                    "3-qadam: S = (4 · 4) / 2 = 8.",
                    "Javob: 8."
                ],
                "javob": "8"
            }
        }
    },
    3: {
        "items": [
            {
                "id": "ex-3-1",
                "daraja": "asosiy",
                "savol": "Agar y = ax² parabolasi M(2; −12) nuqtadan o'tsa, a koeffitsiyentning qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: -3",
                "togriJavob": ["-3", "−3"],
                "validationRegex": r"^\s*[-−]3\s*$",
                "hint": "−12 = a · (2)² tenglamadan a ni toping.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: −12 = a · 4.",
                        "2-qadam: a = −12 / 4 = −3.",
                        "Javob: −3."
                    ],
                    "javob": "−3"
                }
            },
            {
                "id": "ex-3-2",
                "daraja": "ortacha",
                "savol": "Qaysi parabolaning tarmoqlari ingichkaroq (Oy o'qiga yaqinroq siqilgan): y = 5x² mi yoki y = 0.2x² mi? (5 yoki 0.2 deb yozing):",
                "type": "input",
                "inputPlaceholder": "5 yoki 0.2",
                "togriJavob": ["5", "y=5x²", "5x²"],
                "validationRegex": r"^\s*(y\s*=\s*)?5(x²)?\s*$",
                "hint": "|a| moduli qanchalik katta bo'lsa, parabola shunchalik ingichka bo'lib Oy o'qiga siqiladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: |a| kattalashganda parabola torayadi.",
                        "2-qadam: 5 > 0.2 bo'lgani uchun y = 5x² parabolasi ingichkaroq.",
                        "Javob: 5."
                    ],
                    "javob": "5"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = ax² parabolaga y = 4x − 1 to'g'ri chiziq urinadi (bitta umumiy nuqtaga ega). a koeffitsiyentning qiymatini toping.",
            "korsatma": "ax² − 4x + 1 = 0 tenglamaning diskriminanti D = 0 bo'lishi shart.",
            "yechim": {
                "tahlil": "D = (−4)² − 4·a·1 = 16 − 4a = 0 → a = 4.",
                "qadamlar": [
                    "1-qadam: ax² = 4x − 1 → ax² − 4x + 1 = 0.",
                    "2-qadam: Urinish sharti: D = 16 − 4a = 0.",
                    "3-qadam: 4a = 16 → a = 4.",
                    "Javob: 4."
                ],
                "javob": "4"
            }
        }
    },
    18: {
        "items": [
            {
                "id": "ex-18-1",
                "daraja": "asosiy",
                "savol": "P(1; 0) nuqta koordinata boshi atrofida 90° ga burilganda uning ordinatasi y nechaga teng bo'ladi?",
                "type": "input",
                "inputPlaceholder": "Masalan: 1",
                "togriJavob": ["1"],
                "validationRegex": r"^\s*1\s*$",
                "hint": "90° burilishda nuqta Oy o'qidagi (0; 1) nuqtaga o'tadi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Birlik aylanada 90° ga burish nuqtani (0; 1) ga keltiradi.",
                        "2-qadam: Ordinata y = 1.",
                        "Javob: 1."
                    ],
                    "javob": "1"
                }
            },
            {
                "id": "ex-18-2",
                "daraja": "ortacha",
                "savol": "P(1; 0) nuqta 180° ga burilganda hosil bo'lgan nuqtaning abssissasi x nechaga teng?",
                "type": "input",
                "inputPlaceholder": "Masalan: -1",
                "togriJavob": ["-1", "−1"],
                "validationRegex": r"^\s*[-−]1\s*$",
                "hint": "180° burilish nuqtani Ox ning manfiy tomonidagi (−1; 0) nuqtaga o'tkazadi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 180° burilganda nuqta qarama-qarshi nuqtaga o'tadi: (−1; 0).",
                        "2-qadam: Abssissa x = −1.",
                        "Javob: −1."
                    ],
                    "javob": "−1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "P(1; 0) nuqta ketma-ket +45°, +90° va −45° burildi. Yakuniy nuqtaning koordinatalari yig'indisi (x + y) ni toping.",
            "korsatma": "Ketma-ket burilishlar qo'shiladi: 45° + 90° − 45° = 90°.",
            "yechim": {
                "tahlil": "Jami burilish burchagi: 45 + 90 − 45 = 90°. Nuqta (0; 1) ga keladi. x + y = 0 + 1 = 1.",
                "qadamlar": [
                    "1-qadam: Jami burchak: 90°.",
                    "2-qadam: Nuqta: (0; 1).",
                    "3-qadam: Yig'indi: 0 + 1 = 1.",
                    "Javob: 1."
                ],
                "javob": "1"
            }
        }
    },
    19: {
        "items": [
            {
                "id": "ex-19-1",
                "daraja": "asosiy",
                "savol": "α = 30° da sin30° + cos60° yig'indisini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 1",
                "togriJavob": ["1"],
                "validationRegex": r"^\s*1\s*$",
                "hint": "sin30° = 1/2 va cos60° = 1/2. Yig'indi: 1/2 + 1/2.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: sin30° = 0.5, cos60° = 0.5.",
                        "2-qadam: 0.5 + 0.5 = 1.",
                        "Javob: 1."
                    ],
                    "javob": "1"
                }
            },
            {
                "id": "ex-19-2",
                "daraja": "ortacha",
                "savol": "sin²(45°) + cos²(45°) ning aniq son qiymatini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 1",
                "togriJavob": ["1"],
                "validationRegex": r"^\s*1\s*$",
                "hint": "Asosiy trigonometrik ayniyat: istalgan burchak uchun sin²α + cos²α = 1.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (√2/2)² + (√2/2)² = 2/4 + 2/4 = 1.",
                        "Javob: 1."
                    ],
                    "javob": "1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "To'g'ri burchakli uchburchakda gipotenuza c = 10, o'tkir burchak sinusi sinα = 0.6 bo'lsa, uchburchak yuzini toping.",
            "korsatma": "Katetlar a = c·sinα va b = √(c² − a²). Yuza S = (a·b)/2.",
            "yechim": {
                "tahlil": "a = 10 · 0.6 = 6. b = √(100 − 36) = 8. S = (6 · 8) / 2 = 24.",
                "qadamlar": [
                    "1-qadam: 1-katet a = 6.",
                    "2-qadam: 2-katet b = 8.",
                    "3-qadam: Yuza S = (6 · 8) / 2 = 24.",
                    "Javob: 24."
                ],
                "javob": "24"
            }
        }
    },
    20: {
        "items": [
            {
                "id": "ex-20-1",
                "daraja": "asosiy",
                "savol": "150° burchak qaysi koordinata choragida joylashgan? (Chorak raqamini kiriting: 1, 2, 3 yoki 4):",
                "type": "input",
                "inputPlaceholder": "1, 2, 3 yoki 4",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "90° < 150° < 180°, demak bu II chorak.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: II chorak burchaklari 90° dan 180° gacha bo'ladi.",
                        "2-qadam: 150° ikkinchi chorakka tegishli.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-20-2",
                "daraja": "ortacha",
                "savol": "sin(130°) · cos(200°) ko'paytmaning ishorasi qanday? (Musbat bo'lsa 1, Manfiy bo'lsa −1 deb yozing):",
                "type": "input",
                "inputPlaceholder": "1 yoki -1",
                "togriJavob": ["-1", "−1", "manfiy"],
                "validationRegex": r"^\s*([-−]1|manfiy)\s*$",
                "hint": "130° II chorakda (sin musbat), 200° III chorakda (cos manfiy). Musbat · Manfiy = Manfiy.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: sin(130°) > 0 (II chorakda sinus musbat).",
                        "2-qadam: cos(200°) < 0 (III chorakda kosinus manfiy).",
                        "3-qadam: (+) · (−) = (−). Demak natija manfiy.",
                        "Javob: −1."
                    ],
                    "javob": "−1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "α burchak III chorakda joylashgan (180° < α < 270°). sinα · tgα ifodaning ishorasi qanday? (1 = Musbat, −1 = Manfiy):",
            "korsatma": "III chorakda sinus va tangensning ishoralarini alohida aniqlab ko'paytiring.",
            "yechim": {
                "tahlil": "III chorakda sinα < 0, tgα > 0. Ularning ko'paytmasi (−) · (+) = (−) manfiy bo'ladi.",
                "qadamlar": [
                    "1-qadam: sinα < 0.",
                    "2-qadam: tgα > 0.",
                    "3-qadam: Ko'paytma: manfiy (−1).",
                    "Javob: −1."
                ],
                "javob": "−1"
            }
        }
    },
    21: {
        "items": [
            {
                "id": "ex-21-1",
                "daraja": "asosiy",
                "savol": "Agar sinα = 0.6 va α birinchi chorakda bo'lsa, cosα ning qiymatini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.8",
                "togriJavob": ["0.8", "0,8"],
                "validationRegex": r"^\s*0[.,]8\s*$",
                "hint": "cosα = √(1 − sin²α) = √(1 − 0.36) = √0.64 = 0.8.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos²α = 1 − sin²α = 1 − 0.36 = 0.64.",
                        "2-qadam: I chorakda cosα > 0 bo'lgani uchun cosα = 0.8.",
                        "Javob: 0.8."
                    ],
                    "javob": "0.8"
                }
            },
            {
                "id": "ex-21-2",
                "daraja": "ortacha",
                "savol": "Agar tgα = 2 bo'lsa, ctgα ning qiymatini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.5",
                "togriJavob": ["0.5", "0,5", "1/2"],
                "validationRegex": r"^\s*(0[.,]5|1/2)\s*$",
                "hint": "ctgα = 1 / tgα = 1 / 2 = 0.5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: tgα · ctgα = 1 ayniyatidan: ctgα = 1 / 2.",
                        "2-qadam: 1/2 = 0.5.",
                        "Javob: 0.5."
                    ],
                    "javob": "0.5"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "sinα + cosα = 1.2 bo'lsa, sinα · cosα ko'paytmani o'nli kasrda hisoblang.",
            "korsatma": "Ikkala tomonni kvadratga ko'taring: (sinα + cosα)² = sin²α + 2sinα cosα + cos²α.",
            "yechim": {
                "tahlil": "(sin+cos)² = 1 + 2sinα cosα = 1.44 → 2sinα cosα = 0.44 → sinα cosα = 0.22.",
                "qadamlar": [
                    "1-qadam: 1 + 2sinα cosα = 1.2² = 1.44.",
                    "2-qadam: 2sinα cosα = 0.44.",
                    "3-qadam: sinα cosα = 0.22.",
                    "Javob: 0.22."
                ],
                "javob": "0.22"
            }
        }
    },
    22: {
        "items": [
            {
                "id": "ex-22-1",
                "daraja": "asosiy",
                "savol": "(1 − sinα)(1 + sinα) − cos²α ifodaning qiymatini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0",
                "togriJavob": ["0"],
                "validationRegex": r"^\s*0\s*$",
                "hint": "(1 − sinα)(1 + sinα) = 1 − sin²α = cos²α. cos²α − cos²α = 0.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (1 − sinα)(1 + sinα) = 1 − sin²α.",
                        "2-qadam: 1 − sin²α = cos²α.",
                        "3-qadam: cos²α − cos²α = 0.",
                        "Javob: 0."
                    ],
                    "javob": "0"
                }
            },
            {
                "id": "ex-22-2",
                "daraja": "ortacha",
                "savol": "tgα · cosα ifoda sinα ga teng. α = 30° da uning qiymatini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.5",
                "togriJavob": ["0.5", "0,5", "1/2"],
                "validationRegex": r"^\s*(0[.,]5|1/2)\s*$",
                "hint": "tgα = sinα / cosα bo'lgani uchun tgα · cosα = sinα. sin30° = 0.5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (sinα / cosα) · cosα = sinα.",
                        "2-qadam: sin30° = 1/2 = 0.5.",
                        "Javob: 0.5."
                    ],
                    "javob": "0.5"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "tgα + ctgα = 3 bo'lsa, tg²α + ctg²α qiymatini hisoblang.",
            "korsatma": "(tgα + ctgα)² = tg²α + 2·tgα·ctgα + ctg²α formulasidan foydalaning.",
            "yechim": {
                "tahlil": "3² = tg²α + 2(1) + ctg²α → tg²α + ctg²α = 9 − 2 = 7.",
                "qadamlar": [
                    "1-qadam: (tgα + ctgα)² = tg²α + 2 + ctg²α.",
                    "2-qadam: 9 = tg²α + ctg²α + 2.",
                    "3-qadam: tg²α + ctg²α = 7.",
                    "Javob: 7."
                ],
                "javob": "7"
            }
        }
    },
    23: {
        "items": [
            {
                "id": "ex-23-1",
                "daraja": "asosiy",
                "savol": "cos(−60°) + sin(−30°) ifodaning son qiymatini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0",
                "togriJavob": ["0"],
                "validationRegex": r"^\s*0\s*$",
                "hint": "cos(−60°) = cos60° = 0.5 va sin(−30°) = −sin30° = −0.5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos(−60°) = cos60° = 0.5.",
                        "2-qadam: sin(−30°) = −sin30° = −0.5.",
                        "3-qadam: 0.5 + (−0.5) = 0.",
                        "Javob: 0."
                    ],
                    "javob": "0"
                }
            },
            {
                "id": "ex-23-2",
                "daraja": "ortacha",
                "savol": "tg(−α) = −tgα ayniyati to'g'rimi? (Ha bo'lsa 1, Yo'q bo'lsa 0 deb yozing):",
                "type": "input",
                "inputPlaceholder": "1 yoki 0",
                "togriJavob": ["1", "ha"],
                "validationRegex": r"^\s*(1|ha)\s*$",
                "hint": "Tangens toq funksiya bo'lgani uchun minus ishorasi tashqariga chiqadi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: tg(−α) = sin(−α) / cos(−α) = (−sinα) / cosα = −tgα.",
                        "Javob: 1 (Ha)."
                    ],
                    "javob": "1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "[sin(−α) · cos(−α)] / tg(−α) ifodaning α = 45° dagi qiymatini o'nli kasrda hisoblang.",
            "korsatma": "Ishoralarni chiqaring: sin(−α) = −sinα, cos(−α) = cosα, tg(−α) = −tgα.",
            "yechim": {
                "tahlil": "(−sinα · cosα) / (−tgα) = (sinα cosα) / (sinα / cosα) = cos²α. cos²(45°) = (√2/2)² = 0.5.",
                "qadamlar": [
                    "1-qadam: (−sinα cosα) / (−tgα) = cos²α.",
                    "2-qadam: cos²(45°) = 0.5.",
                    "Javob: 0.5."
                ],
                "javob": "0.5"
            }
        }
    },
    4: {
        "items": [
            {
                "id": "ex-4-1",
                "daraja": "asosiy",
                "savol": "y = x² − 6x + 5 parabola uchining abssissasi x₀ ni toping:",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "Parabola uchining abssissasi x₀ = −b / (2a) formulasi bilan topiladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a = 1, b = −6, c = 5.",
                        "2-qadam: x₀ = −(−6) / (2 · 1) = 6 / 2 = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            },
            {
                "id": "ex-4-2",
                "daraja": "ortacha",
                "savol": "y = 2x² − 8x + 11 parabola uchining ordinatasi y₀ ni hisoblang:",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "Avval x₀ = −b/(2a) ni toping, so'ng funksiyaga qo'ying: y₀ = y(x₀).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x₀ = −(−8) / (2 · 2) = 8 / 4 = 2.",
                        "2-qadam: y₀ = y(2) = 2·(2)² − 8·2 + 11 = 8 − 16 + 11 = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = x² − 4x + k parabolaning uchi Ox o'qida yotsa, k parametrining qiymatini toping.",
            "korsatma": "Parabola uchi Ox o'qida yotishi uchun uning ordinatasi y₀ = 0 bo'lishi yoki D = 0 bo'lishi kerak.",
            "yechim": {
                "tahlil": "To'la kvadrat ko'rinishiga keltiramiz: y = (x − 2)² + k − 4. Uchi Ox da bo'lsa k − 4 = 0 bo'ladi.",
                "qadamlar": [
                    "1-qadam: x₀ = 2, y₀ = (2)² − 4(2) + k = k − 4.",
                    "2-qadam: Uchi Ox da yotishi uchun y₀ = 0 bo'lishi shart.",
                    "3-qadam: k − 4 = 0 → k = 4.",
                    "Javob: 4."
                ],
                "javob": "4"
            }
        }
    },
    5: {
        "items": [
            {
                "id": "ex-5-1",
                "daraja": "asosiy",
                "savol": "y = x² − 5x + 6 funksiyaning nollarini (Ox bilan kesishish nuqtalarini) kichigidan boshlab vergul bilan yozing:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2, 3",
                "togriJavob": ["2, 3", "2; 3", "2 va 3", "2,3"],
                "validationRegex": r"^\s*2\s*[,;\s]\s*3\s*$",
                "hint": "y = 0 deb oling va x² − 5x + 6 = 0 kvadrat tenglamani yeching.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² − 5x + 6 = 0 kvadrat tenglama tuzamiz.",
                        "2-qadam: Viyet teoremasi bo'yicha: x₁ = 2, x₂ = 3.",
                        "Javob: 2, 3."
                    ],
                    "javob": "2, 3"
                }
            },
            {
                "id": "ex-5-2",
                "daraja": "ortacha",
                "savol": "y = −x² + 4x − 3 parabola tarmoqlari pastga qaragan. Funksiyaning eng katta qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["1"],
                "validationRegex": r"^\s*1\s*$",
                "hint": "Tarmoqlari pastga qaragan parabolaning eng katta qiymati uning uchida (y₀) erishiladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a = −1 < 0, demak eng katta qiymat parabola uchida bo'ladi.",
                        "2-qadam: x₀ = −4 / (2 · (−1)) = 2.",
                        "3-qadam: y_max = y(2) = −(2)² + 4·2 − 3 = −4 + 8 − 3 = 1.",
                        "Javob: 1."
                    ],
                    "javob": "1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = x² − 2x − 8 parabolaning koordinata o'qlari bilan kesishgan 3 ta nuqtasini tutashtirishdan hosil bo'lgan uchburchak yuzini toping.",
            "korsatma": "Ox bilan kesishish nuqtalari asosini, Oy bilan kesishish nuqtasi balandligini beradi.",
            "yechim": {
                "tahlil": "Ox nollari: x² − 2x − 8 = 0 → x₁ = −2, x₂ = 4. Asos uzunligi: 4 − (−2) = 6. Oy nuqtasi: (0; −8), balandlik: 8.",
                "qadamlar": [
                    "1-qadam: Ox o'qida A(−2; 0) va B(4; 0) nuqtalar, oraliq masofa AB = 6.",
                    "2-qadam: Oy o'qida C(0; −8) nuqta, balandlik h = 8.",
                    "3-qadam: Yuza S = (AB · h) / 2 = (6 · 8) / 2 = 24.",
                    "Javob: 24."
                ],
                "javob": "24"
            }
        }
    },
    6: {
        "items": [
            {
                "id": "ex-6-1",
                "daraja": "asosiy",
                "savol": "(x − 2)(x − 5) < 0 kvadrat tengsizlikning barcha butun yechimlari sonini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Ko'paytma noldan kichik bo'lishi uchun x ildizlar orasida yotadi: 2 < x < 5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Tenglama ildizlari: x = 2 va x = 5.",
                        "2-qadam: (x − 2)(x − 5) < 0 yechimi: x ∈ (2; 5).",
                        "3-qadam: Ushbu oraliqdagi butun sonlar: 3 va 4 — jami 2 ta.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-6-2",
                "daraja": "ortacha",
                "savol": "x² − 9 ≤ 0 kvadrat tengsizlikning eng katta butun yechimini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "(x − 3)(x + 3) ≤ 0 tengsizlik yechimi [−3; 3] kesma bo'ladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Ko'paytuvchilarga ajratamiz: (x − 3)(x + 3) ≤ 0.",
                        "2-qadam: Yechim: −3 ≤ x ≤ 3.",
                        "3-qadam: Eng katta butun yechim: 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "x² − 6x + 8 ≤ 0 va x ≥ 3 shartlarini bir vaqtda qanoatlantiruvchi oraliq uzunligini toping.",
            "korsatma": "Kvadrat tengsizlikni yeching va x ≥ 3 nurlari bilan kesishmasini oling.",
            "yechim": {
                "tahlil": "x² − 6x + 8 = (x − 2)(x − 4) ≤ 0 → x ∈ [2; 4]. x ≥ 3 bilan kesishma [3; 4] bo'ladi.",
                "qadamlar": [
                    "1-qadam: x² − 6x + 8 ≤ 0 yechimi: [2; 4].",
                    "2-qadam: x ≥ 3 nurlari bilan umumiy qismi: [3; 4].",
                    "3-qadam: Oraliq uzunligi: 4 − 3 = 1.",
                    "Javob: 1."
                ],
                "javob": "1"
            }
        }
    },
    7: {
        "items": [
            {
                "id": "ex-7-1",
                "daraja": "asosiy",
                "savol": "y = x² − 4x + 3 parabolaning Ox dan yuqorida turgan sohasini hisobga olib, x² − 4x + 3 > 0 ning eng kichik musbat butun yechimini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 4",
                "togriJavob": ["4"],
                "validationRegex": r"^\s*4\s*$",
                "hint": "Ildizlar: x = 1 va x = 3. x > 3 oraliqdagi eng kichik butun sonni toping.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² − 4x + 3 = (x − 1)(x − 3) > 0.",
                        "2-qadam: Yechim: x < 1 yoki x > 3.",
                        "3-qadam: x > 3 oraliqdagi eng kichik musbat butun son 4 dir.",
                        "Javob: 4."
                    ],
                    "javob": "4"
                }
            },
            {
                "id": "ex-7-2",
                "daraja": "ortacha",
                "savol": "x² + 4 > 0 tengsizlik har qanday haqiqiy sonda bajariladimi? (Ha = 1, Yo'q = 0 deb yozing):",
                "type": "input",
                "inputPlaceholder": "1 yoki 0",
                "togriJavob": ["1", "ha"],
                "validationRegex": r"^\s*(1|ha)\s*$",
                "hint": "x² ≥ 0 bo'lgani uchun x² + 4 har doim kamida 4 ga teng, ya'ni doim musbat.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Har qanday haqiqiy son kvadrati manfiy emas: x² ≥ 0.",
                        "2-qadam: x² + 4 ≥ 4 > 0 har doim o'rinli.",
                        "Javob: 1 (Ha)."
                    ],
                    "javob": "1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Har qanday x haqiqiy sonda x² + 2mx + 9 > 0 tengsizlik o'rinli bo'ladigan m parametrining barcha butun qiymatlari sonini toping.",
            "korsatma": "Kvadrat uchhad har doim musbat bo'lishi uchun a > 0 va D < 0 bo'lishi shart.",
            "yechim": {
                "tahlil": "a = 1 > 0. D = (2m)² − 4·1·9 = 4m² − 36 < 0 → m² < 9 → −3 < m < 3.",
                "qadamlar": [
                    "1-qadam: Diskriminant manfiy bo'lishi shart: 4m² − 36 < 0.",
                    "2-qadam: m² < 9 → −3 < m < 3.",
                    "3-qadam: Butun sonlar: −2, −1, 0, 1, 2 — jami 5 ta.",
                    "Javob: 5."
                ],
                "javob": "5"
            }
        }
    },
    8: {
        "items": [
            {
                "id": "ex-8-1",
                "daraja": "asosiy",
                "savol": "(x + 1)(x − 3)(x − 7) > 0 tengsizlikning (0; 10) oralig'idagi eng kichik butun yechimini toping:",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["1"],
                "validationRegex": r"^\s*1\s*$",
                "hint": "Nollar: −1, 3, 7. Musbat oraliqlar: (−1; 3) va (7; +∞).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Son o'qida intervallar ishoralari: (−∞; −1) [-], (−1; 3) [+], (3; 7) [-], (7; +∞) [+].",
                        "2-qadam: Musbat oraliqlar: (−1; 3) ∪ (7; +∞).",
                        "3-qadam: (0; 10) oralig'idagi eng kichik butun yechim: 1.",
                        "Javob: 1."
                    ],
                    "javob": "1"
                }
            },
            {
                "id": "ex-8-2",
                "daraja": "ortacha",
                "savol": "(x − 4) / (x + 2) ≤ 0 kasr tengsizlikni qanoatlantiruvchi manfiy bo'lmagan butun sonlar yig'indisini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 10",
                "togriJavob": ["10"],
                "validationRegex": r"^\s*10\s*$",
                "hint": "Kasr noldan kichik yoki teng bo'lishi: x ∈ (−2; 4]. Manfiy bo'lmagan sonlar: 0, 1, 2, 3, 4.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Surat noli 4 (bo'yaladi), maxraj noli −2 (teshiladi).",
                        "2-qadam: Yechim: x ∈ (−2; 4].",
                        "3-qadam: Manfiy bo'lmagan (≥ 0) butun sonlar: 0, 1, 2, 3, 4.",
                        "4-qadam: Yig'indi: 0 + 1 + 2 + 3 + 4 = 10.",
                        "Javob: 10."
                    ],
                    "javob": "10"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "((x − 1)² · (x − 5)) / (x + 3) ≤ 0 tengsizlikning barcha butun yechimlari sonini toping.",
            "korsatma": "(x−1)² har doim manfiy emas. x = 1 tengsizlikni nol qiladi va yechimga kiradi.",
            "yechim": {
                "tahlil": "(x − 5)/(x + 3) ≤ 0 yechimi (−3; 5]. (x−1)² = 0 nuqtasi x = 1 ushbu oraliqda mavjud.",
                "qadamlar": [
                    "1-qadam: Maxraj x ≠ −3. Surat nollari: x = 1 (juft karrali) va x = 5.",
                    "2-qadam: Ishora tahlilida yechim: (−3; 5].",
                    "3-qadam: Butun sonlar: −2, −1, 0, 1, 2, 3, 4, 5 — jami 8 ta.",
                    "Javob: 8."
                ],
                "javob": "8"
            }
        }
    },
    9: {
        "items": [
            {
                "id": "ex-9-1",
                "daraja": "asosiy",
                "savol": "y = √(2x − 8) funksiyaning aniqlanish sohasiga tegishli eng kichik butun sonni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 4",
                "togriJavob": ["4"],
                "validationRegex": r"^\s*4\s*$",
                "hint": "Kvadrat ildiz ostidagi ifoda manfiy bo'la olmaydi: 2x − 8 ≥ 0.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 2x − 8 ≥ 0 shartini tuzamiz.",
                        "2-qadam: 2x ≥ 8 → x ≥ 4.",
                        "3-qadam: Eng kichik butun son 4.",
                        "Javob: 4."
                    ],
                    "javob": "4"
                }
            },
            {
                "id": "ex-9-2",
                "daraja": "ortacha",
                "savol": "y = 5 / (x² − 16) funksiya x ning nechta nuqtasida aniqlanmagan (mavjud emas)?",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Nolga bo'lish mumkin emas: x² − 16 = 0 bo'lgan nuqtalarni toping.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Maxraj nolga teng bo'la olmaydi: x² − 16 ≠ 0.",
                        "2-qadam: x = 4 va x = −4 nuqtalarda maxraj nolga aylanadi.",
                        "3-qadam: Jami 2 ta taqiqlangan nuqta bor.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = √(6 − x − x²) funksiyaning aniqlanish sohasiga tegishli barcha butun sonlar yig'indisini hisoblang.",
            "korsatma": "Ildiz osti manfiy emas: 6 − x − x² ≥ 0 → x² + x − 6 ≤ 0.",
            "yechim": {
                "tahlil": "x² + x − 6 = (x + 3)(x − 2) ≤ 0 → x ∈ [−3; 2].",
                "qadamlar": [
                    "1-qadam: x² + x − 6 ≤ 0 kvadrat tengsizlikni yechamiz.",
                    "2-qadam: Yechim: [−3; 2].",
                    "3-qadam: Butun sonlar: −3, −2, −1, 0, 1, 2.",
                    "4-qadam: Yig'indi: (−3) + (−2) + (−1) + 0 + 1 + 2 = −3.",
                    "Javob: −3."
                ],
                "javob": "−3"
            }
        }
    },
    10: {
        "items": [
            {
                "id": "ex-10-1",
                "daraja": "asosiy",
                "savol": "y = (x − 3)² + 2 parabola qaysi nuqtadan boshlab o'sishga o'tadi? Uning uchi abssissasini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "Tarmoqlari yuqoriga qaragan parabolada funksiya [x₀; +∞) oraliqda o'suvchi bo'ladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Parabola uchi x₀ = 3 nuqtada.",
                        "2-qadam: x ≥ 3 bo'lganda argument ortishi bilan funksiya qiymati ham ortadi.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            },
            {
                "id": "ex-10-2",
                "daraja": "ortacha",
                "savol": "y = −2x² + 8x funksiya [2; +∞) oraliqda o'suvchimi yoki kamayuvchi? (1 = o'suvchi, 2 = kamayuvchi deb yozing):",
                "type": "input",
                "inputPlaceholder": "1 yoki 2",
                "togriJavob": ["2", "kamayuvchi"],
                "validationRegex": r"^\s*(2|kamayuvchi)\s*$",
                "hint": "Parabola uchi x₀ = −8 / (2·(−2)) = 2. a < 0 bo'lgani uchun uchidan o'ngda kamayadi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Parabola uchi x₀ = 2 nuqtada va a = −2 < 0 (tarmoqlar pastga).",
                        "2-qadam: Uchidan o'ng tomonda funksiya pastga tushadi, ya'ni kamayuvchi.",
                        "Javob: 2 (kamayuvchi)."
                    ],
                    "javob": "2"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "y = x² − 4x + 7 funksiyaning [0; 5] kesmadagi eng katta va eng kichik qiymatlari yig'indisini toping.",
            "korsatma": "Uchining abssissasini toping va kesma uchlaridagi qiymatlar bilan taqqoslang.",
            "yechim": {
                "tahlil": "x₀ = 2 ∈ [0; 5]. y_min = y(2) = 4 − 8 + 7 = 3. y(0) = 7, y(5) = 25 − 20 + 7 = 12. y_max = 12.",
                "qadamlar": [
                    "1-qadam: Eng kichik qiymat parabola uchida: y(2) = 3.",
                    "2-qadam: Chegaralarni tekshiramiz: y(0) = 7, y(5) = 12. Eng kattasi 12.",
                    "3-qadam: Yig'indi: 3 + 12 = 15.",
                    "Javob: 15."
                ],
                "javob": "15"
            }
        }
    },
    11: {
        "items": [
            {
                "id": "ex-11-1",
                "daraja": "asosiy",
                "savol": "f(x) = x⁴ − 2x² + 5 funksiyaning turini aniqlang (1 = Juft funksiya, 2 = Toq funksiya, 3 = Na juft na toq deb yozing):",
                "type": "input",
                "inputPlaceholder": "1, 2 yoki 3",
                "togriJavob": ["1", "juft"],
                "validationRegex": r"^\s*(1|juft)\s*$",
                "hint": "f(−x) = (−x)⁴ − 2(−x)² + 5 = x⁴ − 2x² + 5 = f(x).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x o'rniga −x qo'yamiz.",
                        "2-qadam: f(−x) = f(x) ayniyati bajariladi.",
                        "3-qadam: Demak funksiya juft.",
                        "Javob: 1 (juft)."
                    ],
                    "javob": "1"
                }
            },
            {
                "id": "ex-11-2",
                "daraja": "ortacha",
                "savol": "Agar f(x) toq funksiya bo'lib, f(4) = −7 bo'lsa, f(−4) qiymati nechaga teng bo'ladi?",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["7", "+7"],
                "validationRegex": r"^\s*\+?7\s*$",
                "hint": "Toq funksiya ta'rifiga ko'ra: f(−x) = −f(x).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Toq funksiyada f(−4) = −f(4).",
                        "2-qadam: f(−4) = −(−7) = 7.",
                        "Javob: 7."
                    ],
                    "javob": "7"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "f(x) = (a − 2)x³ + (b − 3)x² + 5x funksiya toq funksiya bo'lishi uchun b parametri nechaga teng bo'lishi shart?",
            "korsatma": "Toq funksiyada barcha juft darajali hadlar (x² va erkin had) nolga aylanishi shart.",
            "yechim": {
                "tahlil": "f(−x) = −f(x) bo'lishi uchun juft darajali x² koeffitsiyenti nol bo'lishi kerak: b − 3 = 0.",
                "qadamlar": [
                    "1-qadam: x² oldidagi koeffitsiyent b − 3 ni nolga tenglashtiramiz.",
                    "2-qadam: b − 3 = 0 → b = 3.",
                    "Javob: 3."
                ],
                "javob": "3"
            }
        }
    },
    12: {
        "items": [
            {
                "id": "ex-12-1",
                "daraja": "asosiy",
                "savol": "√(2x + 5) = 5 tenglamaning ildizini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 10",
                "togriJavob": ["10"],
                "validationRegex": r"^\s*10\s*$",
                "hint": "Ikkala tomonni kvadratga oshiring: 2x + 5 = 25.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 2x + 5 = 5² = 25.",
                        "2-qadam: 2x = 20 → x = 10.",
                        "3-qadam: Tekshirish: √(2·10 + 5) = √25 = 5 (to'g'ri).",
                        "Javob: 10."
                    ],
                    "javob": "10"
                }
            },
            {
                "id": "ex-12-2",
                "daraja": "ortacha",
                "savol": "x³ = −64 tenglamaning haqiqiy ildizini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: -4",
                "togriJavob": ["-4", "−4"],
                "validationRegex": r"^\s*[-−]4\s*$",
                "hint": "Toq darajali ildizdan manfiy son chiqishi mumkin: ∛(−64) = −4.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (−4)³ = −64.",
                        "2-qadam: Toq darajali tenglama yagona haqiqiy ildizga ega: x = −4.",
                        "Javob: −4."
                    ],
                    "javob": "−4"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "√(x + 1) = x − 1 tenglamaning barcha haqiqiy ildizlari yig'indisini toping.",
            "korsatma": "O'ng tomon x − 1 ≥ 0 (x ≥ 1) bo'lishi shart. Kvadratga ko'targandan keyin chet ildizlarni tekshiring.",
            "yechim": {
                "tahlil": "x + 1 = (x − 1)² = x² − 2x + 1 → x² − 3x = 0 → x(x − 3) = 0. x = 0 (chet ildiz, chunki √1 ≠ −1), x = 3 (haqiqiy ildiz).",
                "qadamlar": [
                    "1-qadam: x + 1 = x² − 2x + 1 → x² − 3x = 0.",
                    "2-qadam: x₁ = 0, x₂ = 3.",
                    "3-qadam: x = 0 da √1 = −1 (xato, chet ildiz). x = 3 da √4 = 2 (to'g'ri).",
                    "4-qadam: Yagona ildiz 3.",
                    "Javob: 3."
                ],
                "javob": "3"
            }
        }
    },
    13: {
        "items": [
            {
                "id": "ex-13-1",
                "daraja": "asosiy",
                "savol": "{ x + y = 6, xy = 8 } sistemasining yechimlari uchun x² + y² qiymatini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 20",
                "togriJavob": ["20"],
                "validationRegex": r"^\s*20\s*$",
                "hint": "Qisqa ko'paytirish formulasi: x² + y² = (x + y)² − 2xy.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² + y² = (x + y)² − 2xy ayniyatini qo'llaymiz.",
                        "2-qadam: x² + y² = 6² − 2·8 = 36 − 16 = 20.",
                        "Javob: 20."
                    ],
                    "javob": "20"
                }
            },
            {
                "id": "ex-13-2",
                "daraja": "ortacha",
                "savol": "{ y = x², y = 4 } tenglamalar sistemasi nechta haqiqiy yechimlar juftligiga ega?",
                "type": "input",
                "inputPlaceholder": "Son kiriting",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "x² = 4 tenglama x = 2 va x = −2 ikkita ildizga ega.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² = 4 → x = ±2.",
                        "2-qadam: Yechimlar: (2; 4) va (−2; 4) — jami 2 ta juftlik.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "{ x² + y² = 25, x − y = 1 } sistemasidan x · y ko'paytmaning qiymatini toping.",
            "korsatma": "(x − y)² = x² − 2xy + y² formulasidan foydalaning.",
            "yechim": {
                "tahlil": "1² = 25 − 2xy → 2xy = 24 → xy = 12.",
                "qadamlar": [
                    "1-qadam: (x − y)² = (x² + y²) − 2xy.",
                    "2-qadam: 1 = 25 − 2xy.",
                    "3-qadam: 2xy = 24 → xy = 12.",
                    "Javob: 12."
                ],
                "javob": "12"
            }
        }
    },
    14: {
        "items": [
            {
                "id": "ex-14-1",
                "daraja": "asosiy",
                "savol": "{ 2x + 3y = 13, 5x − 3y = 8 } sistemasini qo'shish usulida yechib, x ning qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "Ikkala tenglamani hadma-had qo'shing: 3y va −3y yo'qoladi, 7x = 21 qoladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (2x + 3y) + (5x − 3y) = 13 + 8.",
                        "2-qadam: 7x = 21 → x = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            },
            {
                "id": "ex-14-2",
                "daraja": "ortacha",
                "savol": "{ x − y = 4, x² − y² = 32 } sistemasidan x + y yig'indisini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 8",
                "togriJavob": ["8"],
                "validationRegex": r"^\s*8\s*$",
                "hint": "x² − y² = (x − y)(x + y) kvadratlar ayirmasidan foydalaning.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: (x − y)(x + y) = 32.",
                        "2-qadam: 4 · (x + y) = 32 → x + y = 8.",
                        "Javob: 8."
                    ],
                    "javob": "8"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "{ x + y + xy = 11, x²y + xy² = 30 } sistemasidan x² + y² ning qabul qilishi mumkin bo'lgan eng katta qiymatini toping.",
            "korsatma": "u = x + y, v = xy deb yangi o'zgaruvchi kiriting.",
            "yechim": {
                "tahlil": "u + v = 11 va uv = 30 → {u, v} = {6, 5} yoki {5, 6}. x² + y² = u² − 2v. Agar u=6, v=5 bo'lsa: 36 − 10 = 26. Agar u=5, v=6 bo'lsa: 25 − 12 = 13.",
                "qadamlar": [
                    "1-qadam: u + v = 11, uv = 30 → ildizlar {5, 6}.",
                    "2-qadam: 1-holat: u = 6, v = 5 da x² + y² = 6² − 2·5 = 26.",
                    "3-qadam: 2-holat: u = 5, v = 6 da x² + y² = 5² − 2·6 = 13.",
                    "4-qadam: Eng katta qiymat 26.",
                    "Javob: 26."
                ],
                "javob": "26"
            }
        }
    },
    15: {
        "items": [
            {
                "id": "ex-15-1",
                "daraja": "asosiy",
                "savol": "{ x² − 16 ≤ 0, x > 1 } tengsizliklar sistemasining barcha butun yechimlari sonini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "Birinchi tengsizlik: [−4; 4]. x > 1 bilan kesishmasi: (1; 4].",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² ≤ 16 → x ∈ [−4; 4].",
                        "2-qadam: x > 1 sharti bilan kesishma: (1; 4].",
                        "3-qadam: Butun sonlar: 2, 3, 4 — jami 3 ta.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            },
            {
                "id": "ex-15-2",
                "daraja": "ortacha",
                "savol": "{ x² − 5x + 6 ≤ 0, x ≤ 2.5 } sistemasining yechimi bo'lgan kesmaning chap chegarasini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "x² − 5x + 6 ≤ 0 yechimi [2; 3]. x ≤ 2.5 bilan kesishma [2; 2.5].",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: x² − 5x + 6 ≤ 0 → x ∈ [2; 3].",
                        "2-qadam: x ≤ 2.5 bilan umumiy qism: [2; 2.5].",
                        "3-qadam: Chap chegara: 2.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "{ x² − 7x + 10 < 0, x² − 9 > 0 } tengsizliklar sistemasining yagona butun yechimini toping.",
            "korsatma": "Har ikkala tengsizlikni alohida intervallar usulida yechib, kesishmasini oling.",
            "yechim": {
                "tahlil": "1) (x − 2)(x − 5) < 0 → x ∈ (2; 5). 2) x² > 9 → x < −3 yoki x > 3. Kesishma: (3; 5).",
                "qadamlar": [
                    "1-qadam: 1-tengsizlik: x ∈ (2; 5).",
                    "2-qadam: 2-tengsizlik: x ∈ (−∞; −3) ∪ (3; +∞).",
                    "3-qadam: Umumiy qism: (3; 5).",
                    "4-qadam: Bu oraliqdagi yagona butun son 4 dir.",
                    "Javob: 4."
                ],
                "javob": "4"
            }
        }
    },
    16: {
        "items": [
            {
                "id": "ex-16-1",
                "daraja": "asosiy",
                "savol": "Musbat a va b sonlar uchun a + b = 10 bo'lsa, Koshi tengsizligiga ko'ra a · b ko'paytmaning eng katta qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 25",
                "togriJavob": ["25"],
                "validationRegex": r"^\s*25\s*$",
                "hint": "√(ab) ≤ (a + b)/2 = 5 → ab ≤ 25.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Koshi tengsizligi: (a + b)/2 ≥ √(ab).",
                        "2-qadam: 10/2 = 5 ≥ √(ab) → ab ≤ 25.",
                        "3-qadam: Eng katta qiymat a = b = 5 da erishiladi: 25.",
                        "Javob: 25."
                    ],
                    "javob": "25"
                }
            },
            {
                "id": "ex-16-2",
                "daraja": "ortacha",
                "savol": "Agar x > 0 bo'lsa, x + 9/x ifodaning qabul qilishi mumkin bo'lgan eng kichik qiymatini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 6",
                "togriJavob": ["6"],
                "validationRegex": r"^\s*6\s*$",
                "hint": "x + 9/x ≥ 2√(x · 9/x) = 2√9 = 6.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Koshi tengsizligi: a + b ≥ 2√(ab).",
                        "2-qadam: x + 9/x ≥ 2√(x · 9/x) = 2 · 3 = 6.",
                        "3-qadam: Eng kichik qiymat 6.",
                        "Javob: 6."
                    ],
                    "javob": "6"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "a, b, c musbat sonlar va a + b + c = 6 bo'lsa, 1/a + 1/b + 1/c ifodaning eng kichik qiymatini o'nli kasrda toping.",
            "korsatma": "(a + b + c)(1/a + 1/b + 1/c) ≥ 9 Koshi-Bunyakovskiy tengsizligidan foydalaning.",
            "yechim": {
                "tahlil": "(a+b+c)(1/a+1/b+1/c) ≥ 9 → 6 · (1/a+1/b+1/c) ≥ 9 → 1/a+1/b+1/c ≥ 9/6 = 1.5.",
                "qadamlar": [
                    "1-qadam: (a + b + c)(1/a + 1/b + 1/c) ≥ 9.",
                    "2-qadam: 6 · (1/a + 1/b + 1/c) ≥ 9.",
                    "3-qadam: 1/a + 1/b + 1/c ≥ 9 / 6 = 1.5.",
                    "Javob: 1.5."
                ],
                "javob": "1.5"
            }
        }
    },
    17: {
        "items": [
            {
                "id": "ex-17-1",
                "daraja": "asosiy",
                "savol": "120° burchakning radian o'lchovi (k·π) / 3 ko'rinishida bo'lsa, k butun sonini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Gradusdan radianga o'tish: α_rad = 120° · (π / 180°).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 120 · π / 180 = 2π / 3.",
                        "2-qadam: Demak, k = 2.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-17-2",
                "daraja": "ortacha",
                "savol": "Radiusi R = 6 cm, markaziy burchagi α = π/3 rad bo'lgan yoy uzunligini toping (javobni π ko'paytuvchisisiz butun son qilib yozing, masalan 2π bo'lsa 2):",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Yoy uzunligi formulasi: l = R · α.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: l = 6 · (π / 3) = 2π cm.",
                        "2-qadam: π oldidagi koeffitsiyent 2.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Soatning minut mili uzunligi 12 cm. 20 daqiqa davomida minut milining uchi bosib o'tgan masofa necha π santimetrga teng bo'ladi?",
            "korsatma": "20 daqiqa to'liq aylananing 20/60 = 1/3 qismidir. Markaziy burchak α = 2π/3.",
            "yechim": {
                "tahlil": "Minut mili 20 daqiqada 120° = 2π/3 radian buriladi. l = R · α = 12 · 2π/3 = 8π cm.",
                "qadamlar": [
                    "1-qadam: Burchak α = 360° · (20/60) = 120° = 2π/3 rad.",
                    "2-qadam: Yoy l = 12 · (2π / 3) = 8π cm.",
                    "3-qadam: Javob: 8.",
                    "Javob: 8"
                ],
                "javob": "8"
            }
        }
    },
    24: {
        "items": [
            {
                "id": "ex-24-1",
                "daraja": "asosiy",
                "savol": "cos(60° − 30°) qo'shish formulasi bo'yicha hisoblanganda cos30° chiqadi. cos²(30°) qiymatini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.75",
                "togriJavob": ["0.75", "0,75", "3/4"],
                "validationRegex": r"^\s*(0[.,]75|3/4)\s*$",
                "hint": "cos30° = √3 / 2. Uning kvadrati (√3/2)² = 3/4 = 0.75.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos(60° − 30°) = cos30° = √3/2.",
                        "2-qadam: (√3/2)² = 3/4 = 0.75.",
                        "Javob: 0.75."
                    ],
                    "javob": "0.75"
                }
            },
            {
                "id": "ex-24-2",
                "daraja": "ortacha",
                "savol": "cos75°·cos15° − sin75°·sin15° ifodaning aniq son qiymatini hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0",
                "togriJavob": ["0"],
                "validationRegex": r"^\s*0\s*$",
                "hint": "Kosinus qo'shish formulasi: cosα cosβ − sinα sinβ = cos(α + β).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos75° cos15° − sin75° sin15° = cos(75° + 15°).",
                        "2-qadam: cos(90°) = 0.",
                        "Javob: 0."
                    ],
                    "javob": "0"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "sin40°·cos20° + cos40°·sin20° ifodaning kvadratini o'nli kasrda hisoblang.",
            "korsatma": "Sinus qo'shish formulasi: sinα cosβ + cosα sinβ = sin(α + β).",
            "yechim": {
                "tahlil": "sin(40° + 20°) = sin60° = √3/2. Kvadrat: (√3/2)² = 3/4 = 0.75.",
                "qadamlar": [
                    "1-qadam: sin40° cos20° + cos40° sin20° = sin(40° + 20°) = sin60°.",
                    "2-qadam: sin60° = √3/2.",
                    "3-qadam: Kvadrat: (√3/2)² = 3/4 = 0.75.",
                    "Javob: 0.75."
                ],
                "javob": "0.75"
            }
        }
    },
    25: {
        "items": [
            {
                "id": "ex-25-1",
                "daraja": "asosiy",
                "savol": "Agar sinα = 0.6 va cosα = 0.8 bo'lsa, sin2α = 2sinα·cosα ning qiymatini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.96",
                "togriJavob": ["0.96", "0,96"],
                "validationRegex": r"^\s*0[.,]96\s*$",
                "hint": "sin2α = 2 · 0.6 · 0.8.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Ikkilangan burchak sinusi: sin2α = 2 sinα cosα.",
                        "2-qadam: sin2α = 2 · 0.6 · 0.8 = 0.96.",
                        "Javob: 0.96."
                    ],
                    "javob": "0.96"
                }
            },
            {
                "id": "ex-25-2",
                "daraja": "ortacha",
                "savol": "cos²(15°) − sin²(15°) ifodaning qiymati cos30° ga teng. Uning kvadratini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.75",
                "togriJavob": ["0.75", "0,75", "3/4"],
                "validationRegex": r"^\s*(0[.,]75|3/4)\s*$",
                "hint": "cos²α − sin²α = cos2α formulasi bo'yicha cos30° = √3/2.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos²(15°) − sin²(15°) = cos(2 · 15°) = cos30°.",
                        "2-qadam: cos30° = √3/2.",
                        "3-qadam: Kvadrat: (√3/2)² = 0.75.",
                        "Javob: 0.75."
                    ],
                    "javob": "0.75"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "sin2α / (2sinα) ifodaning α = 60° dagi qiymatini o'nli kasrda hisoblang.",
            "korsatma": "sin2α = 2sinα cosα ayniyatidan foydalanib qisqartiring.",
            "yechim": {
                "tahlil": "2sinα cosα / (2sinα) = cosα. cos60° = 0.5.",
                "qadamlar": [
                    "1-qadam: Kasrni qisqartiramiz: sin2α / (2sinα) = cosα.",
                    "2-qadam: cos60° = 1/2 = 0.5.",
                    "Javob: 0.5."
                ],
                "javob": "0.5"
            }
        }
    },
    26: {
        "items": [
            {
                "id": "ex-26-1",
                "daraja": "asosiy",
                "savol": "sin(150°) ning qiymatini o'nli kasrda toping. (Keltirish formulasi: sin(180° − 30°) = sin30°):",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.5",
                "togriJavob": ["0.5", "0,5", "1/2"],
                "validationRegex": r"^\s*(0[.,]5|1/2)\s*$",
                "hint": "sin(180° − α) = sinα bo'lgani uchun sin(150°) = sin30° = 0.5 bo'ladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 150° burchak 2-chorakka tegishli: sin(150°) = sin(180° − 30°).",
                        "2-qadam: 2-chorakda sinus musbat: sin(180° − 30°) = sin30° = 0.5.",
                        "Javob: 0.5."
                    ],
                    "javob": "0.5"
                }
            },
            {
                "id": "ex-26-2",
                "daraja": "ortacha",
                "savol": "cos(120°) ning qiymatini o'nli kasrda toping. (Keltirish formulasi: cos(180° − 60°) = −cos60°):",
                "type": "input",
                "inputPlaceholder": "Masalan: -0.5",
                "togriJavob": ["-0.5", "-0,5", "-1/2"],
                "validationRegex": r"^\s*(-0[.,]5|-1/2)\s*$",
                "hint": "2-chorakda kosinus manfiy: cos(180° − 60°) = −cos60°.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos(120°) = cos(180° − 60°).",
                        "2-qadam: 2-chorakda kosinus manfiy: cos(180° − 60°) = −cos60° = −0.5.",
                        "Javob: -0.5."
                    ],
                    "javob": "-0.5"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Ifodaning qiymatini hisoblang: sin(150°) + cos(240°) + tg(135°).",
            "korsatma": "Har bir burchakka keltirish formulasini qo'llang: sin150° = 0.5, cos240° = −0.5, tg135° = −1.",
            "yechim": {
                "tahlil": "sin150° = 0.5, cos240° = −cos60° = −0.5, tg135° = −tg45° = −1. Yig'indi: 0.5 − 0.5 − 1 = −1.",
                "qadamlar": [
                    "1-qadam: sin(150°) = sin(180° − 30°) = sin30° = 0.5.",
                    "2-qadam: cos(240°) = cos(180° + 60°) = −cos60° = −0.5.",
                    "3-qadam: tg(135°) = tg(180° − 45°) = −tg45° = −1.",
                    "4-qadam: Yig'indi: 0.5 + (−0.5) + (−1) = −1.",
                    "Javob: -1."
                ],
                "javob": "-1"
            }
        }
    },
    27: {
        "items": [
            {
                "id": "ex-27-1",
                "daraja": "asosiy",
                "savol": "sin(75°) + sin(15°) ifodaning qiymati √6/2 ga teng. Uning kvadratini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 1.5",
                "togriJavob": ["1.5", "1,5", "3/2"],
                "validationRegex": r"^\s*(1[.,]5|3/2)\s*$",
                "hint": "sinα + sinβ = 2·sin((α+β)/2)·cos((α−β)/2) = 2·sin45°·cos30° = √6/2. Uning kvadrati (√6/2)² = 6/4 = 1.5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Yig'indini ko'paytmaga keltiramiz: sin75° + sin15° = 2·sin45°·cos30°.",
                        "2-qadam: 2 · (√2/2) · (√3/2) = √6/2.",
                        "3-qadam: Kvadratini hisoblaymiz: (√6/2)² = 6/4 = 1.5.",
                        "Javob: 1.5."
                    ],
                    "javob": "1.5"
                }
            },
            {
                "id": "ex-27-2",
                "daraja": "ortacha",
                "savol": "cos(105°) + cos(15°) ifodaning qiymati √2/2 ga teng. Uning kvadratini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.5",
                "togriJavob": ["0.5", "0,5", "1/2"],
                "validationRegex": r"^\s*(0[.,]5|1/2)\s*$",
                "hint": "cosα + cosβ = 2·cos((α+β)/2)·cos((α−β)/2) = 2·cos60°·cos45° = √2/2. Kvadrati: (√2/2)² = 0.5.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: cos105° + cos15° = 2·cos60°·cos45°.",
                        "2-qadam: 2 · (1/2) · (√2/2) = √2/2.",
                        "3-qadam: Kvadratini olamiz: (√2/2)² = 2/4 = 0.5.",
                        "Javob: 0.5."
                    ],
                    "javob": "0.5"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "(sin(50°) + sin(10°)) / cos(20°) kasrning qiymatini hisoblang.",
            "korsatma": "Suratga sinα + sinβ = 2sin((α+β)/2)cos((α−β)/2) formulasini qo'llang.",
            "yechim": {
                "tahlil": "Surat: 2·sin30°·cos20° = 2·(1/2)·cos20° = cos20°. Maxraj bilan qisqaradi: cos20° / cos20° = 1.",
                "qadamlar": [
                    "1-qadam: Surat: sin50° + sin10° = 2 · sin(30°) · cos(20°).",
                    "2-qadam: sin30° = 1/2 bo'lgani uchun: 2 · (1/2) · cos20° = cos20°.",
                    "3-qadam: Surat va maxrajni qisqartiramiz: cos20° / cos20° = 1.",
                    "Javob: 1."
                ],
                "javob": "1"
            }
        }
    },
    28: {
        "items": [
            {
                "id": "ex-28-1",
                "daraja": "asosiy",
                "savol": "Ketma-ketlik umumiy hadi aₙ = 3n − 2 formulasi bilan berilgan. Uning dastlabki 3 ta hadi yig'indisini (a₁ + a₂ + a₃) toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 12",
                "togriJavob": ["12"],
                "validationRegex": r"^\s*12\s*$",
                "hint": "a₁ = 3(1)−2 = 1, a₂ = 3(2)−2 = 4, a₃ = 3(3)−2 = 7. Yig'indi: 1 + 4 + 7 = 12.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a₁ = 3·1 − 2 = 1.",
                        "2-qadam: a₂ = 3·2 − 2 = 4.",
                        "3-qadam: a₃ = 3·3 − 2 = 7.",
                        "4-qadam: Yig'indi: 1 + 4 + 7 = 12.",
                        "Javob: 12."
                    ],
                    "javob": "12"
                }
            },
            {
                "id": "ex-28-2",
                "daraja": "ortacha",
                "savol": "Ketma-ketlik rekurrent formula bilan berilgan: a₁ = 2 va aₙ₊₁ = 2aₙ + 1. Ketma-ketlikning 4-hadi a₄ ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 23",
                "togriJavob": ["23"],
                "validationRegex": r"^\s*23\s*$",
                "hint": "a₁ = 2; a₂ = 2(2)+1 = 5; a₃ = 2(5)+1 = 11; a₄ = 2(11)+1 = 23.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a₁ = 2.",
                        "2-qadam: a₂ = 2 · 2 + 1 = 5.",
                        "3-qadam: a₃ = 2 · 5 + 1 = 11.",
                        "4-qadam: a₄ = 2 · 11 + 1 = 23.",
                        "Javob: 23."
                    ],
                    "javob": "23"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Ketma-ketlik aₙ = n² − 6n + 14 formulasi bilan berilgan. Ketma-ketlikning eng kichik hadi qiymatini toping.",
            "korsatma": "Kvadratik had minimumini topish uchun to'la kvadrat ajrating: n² − 6n + 14 = (n − 3)² + 5.",
            "yechim": {
                "tahlil": "aₙ = (n − 3)² + 5. Natural son n = 3 da kvadrat 0 ga aylanib eng kichik qiymat 5 ga teng bo'ladi.",
                "qadamlar": [
                    "1-qadam: To'la kvadrat ajratamiz: n² − 6n + 14 = (n − 3)² + 5.",
                    "2-qadam: Har qanday n uchun (n − 3)² ≥ 0.",
                    "3-qadam: n = 3 bo'lganda (n − 3)² = 0 bo'lib, eng kichik had a₃ = 5 ga erishiladi.",
                    "Javob: 5."
                ],
                "javob": "5"
            }
        }
    },
    29: {
        "items": [
            {
                "id": "ex-29-1",
                "daraja": "asosiy",
                "savol": "a₁ = 4 va d = 3 bo'lgan arifmetik progressiyaning 10-hadi a₁₀ ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 31",
                "togriJavob": ["31"],
                "validationRegex": r"^\s*31\s*$",
                "hint": "Formula: aₙ = a₁ + (n − 1)d.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: a₁₀ = 4 + (10 − 1) · 3.",
                        "2-qadam: a₁₀ = 4 + 9 · 3 = 4 + 27 = 31.",
                        "Javob: 31."
                    ],
                    "javob": "31"
                }
            },
            {
                "id": "ex-29-2",
                "daraja": "ortacha",
                "savol": "Arifmetik progressiyada a₃ = 11 va a₇ = 23 bo'lsa, ayirma d ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "a₇ − a₃ = (7 − 3)d = 4d.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 4d = 23 − 11 = 12.",
                        "2-qadam: d = 12 / 4 = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Arifmetik progressiyada a₁ + a₇ = 20 bo'lsa, to'rtinchi had a₄ ning qiymatini hisoblang.",
            "korsatma": "Arifmetik progressiya xossasi: a₁ + a₇ = 2a₄.",
            "yechim": {
                "tahlil": "a₁ + a₇ = (a₄ − 3d) + (a₄ + 3d) = 2a₄ = 20 → a₄ = 10.",
                "qadamlar": [
                    "1-qadam: a₁ va a₇ hadlarning o'rta arifmetigi a₄ dir: a₁ + a₇ = 2a₄.",
                    "2-qadam: 2a₄ = 20 → a₄ = 10.",
                    "Javob: 10."
                ],
                "javob": "10"
            }
        }
    },
    30: {
        "items": [
            {
                "id": "ex-30-1",
                "daraja": "asosiy",
                "savol": "a₁ = 2 va a₁₀ = 20 bo'lgan arifmetik progressiyaning dastlabki 10 ta hadi yig'indisi S₁₀ ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 110",
                "togriJavob": ["110"],
                "validationRegex": r"^\s*110\s*$",
                "hint": "Sₙ = ((a₁ + aₙ) / 2) · n.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: S₁₀ = ((2 + 20) / 2) · 10.",
                        "2-qadam: S₁₀ = 11 · 10 = 110.",
                        "Javob: 110."
                    ],
                    "javob": "110"
                }
            },
            {
                "id": "ex-30-2",
                "daraja": "ortacha",
                "savol": "1 dan 50 gacha bo'lgan barcha natural sonlar yig'indisini Gauss formulasi bo'yicha hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 1275",
                "togriJavob": ["1275"],
                "validationRegex": r"^\s*1275\s*$",
                "hint": "S = (n · (n + 1)) / 2 formulasi (n = 50).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: S = 50 · 51 / 2.",
                        "2-qadam: S = 25 · 51 = 1275.",
                        "Javob: 1275."
                    ],
                    "javob": "1275"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Arifmetik progressiyaning dastlabki n ta hadi yig'indisi Sₙ = 2n² + 3n formula bilan berilgan bo'lsa, beshinchi had a₅ ni toping.",
            "korsatma": "a₅ = S₅ − S₄ ayirmasidan foydalaning.",
            "yechim": {
                "tahlil": "S₅ = 2(25) + 3(5) = 65. S₄ = 2(16) + 3(4) = 44. a₅ = 65 − 44 = 21.",
                "qadamlar": [
                    "1-qadam: S₅ = 2·25 + 15 = 65.",
                    "2-qadam: S₄ = 2·16 + 12 = 44.",
                    "3-qadam: a₅ = S₅ − S₄ = 65 − 44 = 21.",
                    "Javob: 21."
                ],
                "javob": "21"
            }
        }
    },
    31: {
        "items": [
            {
                "id": "ex-31-1",
                "daraja": "asosiy",
                "savol": "b₁ = 3 va maxraji q = 2 bo'lgan geometrik progressiyaning 5-hadi b₅ ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 48",
                "togriJavob": ["48"],
                "validationRegex": r"^\s*48\s*$",
                "hint": "Formula: bₙ = b₁ · qⁿ⁻¹ → b₅ = 3 · 2⁴.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: b₅ = 3 · 2⁴.",
                        "2-qadam: 2⁴ = 16 → b₅ = 3 · 16 = 48.",
                        "Javob: 48."
                    ],
                    "javob": "48"
                }
            },
            {
                "id": "ex-31-2",
                "daraja": "ortacha",
                "savol": "Musbat hadli geometrik progressiyada b₂ = 6 va b₄ = 54 bo'lsa, maxraj q ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "b₄ / b₂ = q² → q² = 54 / 6 = 9.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: b₄ / b₂ = q² = 54 / 6 = 9.",
                        "2-qadam: Musbat hadli bo'lgani uchun q = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Uchta ketma-ket musbat son geometrik progressiya tashkil etadi. Ularning ko'paytmasi 64 bo'lsa, ikkinchi had b₂ ni hisoblang.",
            "korsatma": "Xarakteristik xossadan: b₁ · b₃ = b₂². Ko'paytma b₁ b₂ b₃ = b₂³.",
            "yechim": {
                "tahlil": "b₁ · b₂ · b₃ = b₂³ = 64 → b₂ = 4.",
                "qadamlar": [
                    "1-qadam: b₁ · b₃ = b₂².",
                    "2-qadam: b₁ · b₂ · b₃ = b₂³ = 64.",
                    "3-qadam: b₂ = ∛64 = 4.",
                    "Javob: 4."
                ],
                "javob": "4"
            }
        }
    },
    32: {
        "items": [
            {
                "id": "ex-32-1",
                "daraja": "asosiy",
                "savol": "b₁ = 1 va q = 2 bo'lsa, dastlabki 6 ta had yig'indisi S₆ = 1 + 2 + 4 + 8 + 16 + 32 ni hisoblang:",
                "type": "input",
                "inputPlaceholder": "Masalan: 63",
                "togriJavob": ["63"],
                "validationRegex": r"^\s*63\s*$",
                "hint": "Sₙ = b₁(qⁿ − 1) / (q − 1) = 1 · (2⁶ − 1) / (2 − 1).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 2⁶ = 64.",
                        "2-qadam: S₆ = (64 − 1) / 1 = 63.",
                        "Javob: 63."
                    ],
                    "javob": "63"
                }
            },
            {
                "id": "ex-32-2",
                "daraja": "ortacha",
                "savol": "b₁ = 5 va q = 3 bo'lsa, dastlabki 3 ta had yig'indisi S₃ ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 65",
                "togriJavob": ["65"],
                "validationRegex": r"^\s*65\s*$",
                "hint": "Hadlar: 5, 15, 45. Yig'indi: 5 + 15 + 45.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: b₁ = 5, b₂ = 15, b₃ = 45.",
                        "2-qadam: S₃ = 5 + 15 + 45 = 65.",
                        "Javob: 65."
                    ],
                    "javob": "65"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "1 + 2 + 4 + ... + 2⁹ yig'indisini hisoblang.",
            "korsatma": "b₁ = 1, q = 2, hadlar soni n = 10. S₁₀ = 2¹⁰ − 1.",
            "yechim": {
                "tahlil": "S₁₀ = 1 · (2¹⁰ − 1) / (2 − 1) = 1024 − 1 = 1023.",
                "qadamlar": [
                    "1-qadam: n = 10 ta had yig'indisi.",
                    "2-qadam: 2¹⁰ = 1024.",
                    "3-qadam: S₁₀ = 1024 − 1 = 1023.",
                    "Javob: 1023."
                ],
                "javob": "1023"
            }
        }
    },
    33: {
        "items": [
            {
                "id": "ex-33-1",
                "daraja": "asosiy",
                "savol": "b₁ = 1 va q = 0.5 bo'lgan cheksiz kamayuvchi geometrik progressiyaning yig'indisi S ni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 2",
                "togriJavob": ["2"],
                "validationRegex": r"^\s*2\s*$",
                "hint": "Formula: S = b₁ / (1 − q).",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: S = 1 / (1 − 0.5).",
                        "2-qadam: S = 1 / 0.5 = 2.",
                        "Javob: 2."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-33-2",
                "daraja": "ortacha",
                "savol": "0.(3) = 0.333... cheksiz davriy kasrni oddiy kasrga aylantirganda 1/k chiqadi. k butun sonini toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 3",
                "togriJavob": ["3"],
                "validationRegex": r"^\s*3\s*$",
                "hint": "0.(3) = 3/9 = 1/3.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 0.(3) = 3/9.",
                        "2-qadam: 3/9 = 1/3 → k = 3.",
                        "Javob: 3."
                    ],
                    "javob": "3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Cheksiz kamayuvchi geometrik progressiya yig'indisi S = 9 va birinchi hadi b₁ = 6 bo'lsa, maxraj q ni kasr ko'rinishida yozing (masalan 1/3):",
            "korsatma": "S = b₁ / (1 − q) formulasidan 1 − q = b₁ / S ni toping.",
            "yechim": {
                "tahlil": "9 = 6 / (1 − q) → 1 − q = 6/9 = 2/3 → q = 1 − 2/3 = 1/3.",
                "qadamlar": [
                    "1-qadam: 1 − q = 6 / 9 = 2/3.",
                    "2-qadam: q = 1 − 2/3 = 1/3.",
                    "Javob: 1/3."
                ],
                "javob": "1/3"
            }
        }
    },
    34: {
        "items": [
            {
                "id": "ex-34-1",
                "daraja": "asosiy",
                "savol": "Olti yoqli standart o'yin kubigi tashlanganda 8 raqami tushishi qanday hodisa? (1 = Muqarrar, 2 = Imkonsiz, 3 = Tasodifiy deb yozing):",
                "type": "input",
                "inputPlaceholder": "1, 2 yoki 3",
                "togriJavob": ["2", "imkonsiz"],
                "validationRegex": r"^\s*(2|imkonsiz)\s*$",
                "hint": "Kubikda faqat 1, 2, 3, 4, 5, 6 raqamlari bor, 8 hech qachon tushmaydi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Berilgan shartda ro'y berishi mumkin bo'lmagan hodisa imkonsiz hodisa deyiladi.",
                        "2-qadam: 8 tushishi imkonsiz.",
                        "Javob: 2 (imkonsiz)."
                    ],
                    "javob": "2"
                }
            },
            {
                "id": "ex-34-2",
                "daraja": "ortacha",
                "savol": "1 dan 10 gacha sonlar yozilgan kartochkalardan tavakkaliga olingan son 15 dan kichik bo'lishi qanday hodisa? (1 = Muqarrar, 2 = Imkonsiz, 3 = Tasodifiy deb yozing):",
                "type": "input",
                "inputPlaceholder": "1, 2 yoki 3",
                "togriJavob": ["1", "muqarrar"],
                "validationRegex": r"^\s*(1|muqarrar)\s*$",
                "hint": "Har qanday olingan son 1..10 oraliqda bo'lgani uchun albatta 15 dan kichik bo'ladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Har qanday sinovda albatta yuz beradigan hodisa muqarrar hodisa deyiladi.",
                        "2-qadam: 1..10 sonlarining barchasi 15 dan kichik.",
                        "Javob: 1 (muqarrar)."
                    ],
                    "javob": "1"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Qutida 5 ta oq va 5 ta qora shar bor. Tavakkaliga bitta shar olindi. 'Olingan shar qizil emas' degan hodisa qanday hodisa bo'ladi? (1 = Muqarrar, 2 = Imkonsiz):",
            "korsatma": "Qutida qizil shar yo'q, shuning uchun olingan shar har doim qizil bo'lmaydi.",
            "yechim": {
                "tahlil": "Har qanday olingan shar oq yoki qora bo'ladi, ya'ni hech qachon qizil bo'lmaydi. Bu hodisa albatta ro'y beradi (muqarrar).",
                "qadamlar": [
                    "1-qadam: Qutida faqat oq va qora shar bor.",
                    "2-qadam: Olingan shar hech qachon qizil bo'la olmaydi.",
                    "3-qadam: Demak, 'qizil emas' hodisasi 100% muqarrar hodisadir.",
                    "Javob: 1."
                ],
                "javob": "1"
            }
        }
    },
    35: {
        "items": [
            {
                "id": "ex-35-1",
                "daraja": "asosiy",
                "savol": "Olti yoqli o'yin kubigi tashlanganda tub son (2, 3, 5) tushish ehtimolligini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.5",
                "togriJavob": ["0.5", "0,5", "1/2"],
                "validationRegex": r"^\s*(0[.,]5|1/2)\s*$",
                "hint": "Klassik formula: P = m / n. Jami natijalar n = 6, qulay natijalar m = 3.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Jami natijalar soni: n = 6.",
                        "2-qadam: Qulay natijalar (2, 3, 5): m = 3.",
                        "3-qadam: P = 3 / 6 = 1/2 = 0.5.",
                        "Javob: 0.5."
                    ],
                    "javob": "0.5"
                }
            },
            {
                "id": "ex-35-2",
                "daraja": "ortacha",
                "savol": "Qutida 3 ta oq va 7 ta qora shar bor. Tavakkaliga olingan sharning oq bo'lish ehtimolligini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.3",
                "togriJavob": ["0.3", "0,3", "3/10"],
                "validationRegex": r"^\s*(0[.,]3|3/10)\s*$",
                "hint": "Jami sharlar soni n = 10, oq sharlar soni m = 3.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: Jami sharlar: 3 + 7 = 10.",
                        "2-qadam: Oq sharlar: m = 3.",
                        "3-qadam: P = 3 / 10 = 0.3.",
                        "Javob: 0.3."
                    ],
                    "javob": "0.3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Ikkita o'yin kubigi baravar tashlanganda tushgan ochkolar yig'indisi 7 bo'lish ehtimolligini qisqarmas kasr ko'rinishida yozing (masalan 1/6):",
            "korsatma": "Jami teng ehtimolli natijalar n = 36. Yig'indisi 7 bo'ladigan juftliklarni sanang.",
            "yechim": {
                "tahlil": "Yig'indisi 7 bo'lgan juftliklar: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — jami m = 6 ta. P = 6/36 = 1/6.",
                "qadamlar": [
                    "1-qadam: Jami natijalar n = 6 · 6 = 36.",
                    "2-qadam: Qulay natijalar m = 6 ta.",
                    "3-qadam: P = 6 / 36 = 1/6.",
                    "Javob: 1/6."
                ],
                "javob": "1/6"
            }
        }
    },
    36: {
        "items": [
            {
                "id": "ex-36-1",
                "daraja": "asosiy",
                "savol": "Tanga 100 marta tashlanganda 54 marta gerb tushdi. Gerb tushishining nisbiy chastotasi W(A) ni o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.54",
                "togriJavob": ["0.54", "0,54"],
                "validationRegex": r"^\s*0[.,]54\s*$",
                "hint": "Nisbiy chastota: W = m / N. N = 100, m = 54.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: W = 54 / 100 = 0.54.",
                        "Javob: 0.54."
                    ],
                    "javob": "0.54"
                }
            },
            {
                "id": "ex-36-2",
                "daraja": "ortacha",
                "savol": "Zavodda tekshirilgan 500 ta detaldan 10 tasi yaroqsiz chiqdi. Yaroqsiz detallarning nisbiy chastotasini o'nli kasrda toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.02",
                "togriJavob": ["0.02", "0,02"],
                "validationRegex": r"^\s*0[.,]02\s*$",
                "hint": "W = 10 / 500 = 1 / 50 = 0.02.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: W = 10 / 500.",
                        "2-qadam: W = 0.02.",
                        "Javob: 0.02."
                    ],
                    "javob": "0.02"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Nishonga qarata 50 ta o'q uzildi. O'qning nishonga tegish nisbiy chastotasi 0.84 bo'lsa, aniq tekkan o'qlar sonini toping.",
            "korsatma": "m = N · W formulasidan foydalaning.",
            "yechim": {
                "tahlil": "m = 50 · 0.84 = 42.",
                "qadamlar": [
                    "1-qadam: m = 50 · 0.84.",
                    "2-qadam: m = 42 ta o'q tekkan.",
                    "Javob: 42."
                ],
                "javob": "42"
            }
        }
    },
    37: {
        "items": [
            {
                "id": "ex-37-1",
                "daraja": "asosiy",
                "savol": "Bitta o'yin kubigi tashlanganda tushgan ochkolar soni X qabul qilishi mumkin bo'lgan turli qiymatlar soni nechta?",
                "type": "input",
                "inputPlaceholder": "Masalan: 6",
                "togriJavob": ["6"],
                "validationRegex": r"^\s*6\s*$",
                "hint": "X tasodifiy miqdor 1, 2, 3, 4, 5, 6 qiymatlarni qabul qilishi mumkin.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: X ∈ {1, 2, 3, 4, 5, 6}.",
                        "2-qadam: Jami 6 ta turli qiymat.",
                        "Javob: 6."
                    ],
                    "javob": "6"
                }
            },
            {
                "id": "ex-37-2",
                "daraja": "ortacha",
                "savol": "X tasodifiy miqdor taqsimotida P(X=1) = 0.3, P(X=2) = 0.4, P(X=3) = p bo'lsa, noma'lum p ehtimollikni toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 0.3",
                "togriJavob": ["0.3", "0,3"],
                "validationRegex": r"^\s*0[.,]3\s*$",
                "hint": "Barcha mumkin bo'lgan ehtimolliklar yig'indisi 1 ga teng: 0.3 + 0.4 + p = 1.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 0.3 + 0.4 + p = 1.",
                        "2-qadam: 0.7 + p = 1 → p = 0.3.",
                        "Javob: 0.3."
                    ],
                    "javob": "0.3"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "Diskret tasodifiy miqdorning barcha mumkin bo'lgan hodisalari to'liq guruh hosil qilsa, ularning barcha ehtimolliklari yig'indisi har doim nechaga teng bo'ladi?",
            "korsatma": "Ehtimolliklar nazariyasining fundamental aksiomasini eslang.",
            "yechim": {
                "tahlil": "To'liq guruh hodisalari ehtimolliklari yig'indisi qat'iy 1 ga teng bo'ladi.",
                "qadamlar": [
                    "1-qadam: ∑ P(X = xᵢ) = 1.",
                    "Javob: 1."
                ],
                "javob": "1"
            }
        }
    },
    38: {
        "items": [
            {
                "id": "ex-38-1",
                "daraja": "asosiy",
                "savol": "2, 4, 4, 6, 8, 9 sonlar qatorining modasini (eng ko'p takrorlangan sonni) toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 4",
                "togriJavob": ["4"],
                "validationRegex": r"^\s*4\s*$",
                "hint": "Moda — qatorda eng ko'p uchraydigan qiymat.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 4 soni 2 marta uchragan, boshqa sonlar esa bir martadan.",
                        "2-qadam: Demak moda 4.",
                        "Javob: 4."
                    ],
                    "javob": "4"
                }
            },
            {
                "id": "ex-38-2",
                "daraja": "ortacha",
                "savol": "3, 7, 8, 12, 15 sonlar qatorining medianasini (o'rtadagi sonni) toping:",
                "type": "input",
                "inputPlaceholder": "Masalan: 8",
                "togriJavob": ["8"],
                "validationRegex": r"^\s*8\s*$",
                "hint": "Tartiblangan qatorda o'rtada turgan son mediana bo'ladi.",
                "yechim": {
                    "qadamlar": [
                        "1-qadam: 5 ta toq sondan iborat tartiblangan qator.",
                        "2-qadam: O'rtada uchinchi son turibdi: 8.",
                        "Javob: 8."
                    ],
                    "javob": "8"
                }
            }
        ],
        "olimpiada": {
            "sarlavha": "Litsey va Olimpiada tayyorgarligi",
            "qiyinlik": "Yuqori daraja (Litsey imtihoni)",
            "masala": "O'quvchining 5 ta imtihon baholari: 4, 5, 5, 4, x. Agar uning o'rtacha arifmetik bali 4.4 bo'lsa, x bahosini toping.",
            "korsatma": "(4 + 5 + 5 + 4 + x) / 5 = 4.4 tenglamani yeching.",
            "yechim": {
                "tahlil": "(18 + x) / 5 = 4.4 → 18 + x = 22 → x = 4.",
                "qadamlar": [
                    "1-qadam: (4 + 5 + 5 + 4 + x) / 5 = 4.4.",
                    "2-qadam: 18 + x = 22.",
                    "3-qadam: x = 4.",
                    "Javob: 4."
                ],
                "javob": "4"
            }
        }
    }
}

def apply_curriculum():
    base_dir = Path("lessons/math/9")
    updated_count = 0
    for lesson_id, update_data in CURRICULUM_EXERCISES.items():
        data_path = base_dir / str(lesson_id) / "data.json"
        if not data_path.exists():
            print(f"Skipping L{lesson_id}: not found")
            continue
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if "items" in update_data:
            if "mashqlar" not in data:
                data["mashqlar"] = {}
            data["mashqlar"]["items"] = update_data["items"]

        if "olimpiada" in update_data:
            data["olimpiada"] = update_data["olimpiada"]

        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        updated_count += 1
        print(f"[OK] L{lesson_id:02d} exercises and olimpiada successfully upgraded.")

    print(f"\nJami {updated_count} ta dars to'liq sifatli yangilandi.")

if __name__ == "__main__":
    apply_curriculum()
