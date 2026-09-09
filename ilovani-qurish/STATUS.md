# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-09  
**Holat:** 1–10-§ to‘liq tayyor; barcha data.json 1-dars strukturasi bilan 100% mos

---

## Umumiy

| Ko‘rsatkich              | Qiymat              |
|--------------------------|---------------------|
| Jami darslar (reja)      | 38                  |
| Fizik mavjud dars papkasi| 10 / 38             |
| Tayyor (`readyIds`)      | 10 / 38             |
| O‘tilgan (localStorage)  | 0                   |

---

## Struktura tekshiruvi (1-dars etalon)

Barcha 1–10: top-level maydonlar bir xil  
`id, bob, paragraf, title, lead, prev, next, agenda, sahna, kirish, reja, qoida, savollar, eslabQol, kitob, doska, mashqlar, xulosa, xulosaBoard`

| § | kitob | doska | sahna |
|---|-------|-------|-------|
| 1 | ✓ | ✓ | abc-parabola |
| 2 | ✓ | ✓ | x2-parabola |
| 3 | ✓ (qo‘shildi) | ✓ (qo‘shildi) | abc-parabola |
| 4 | ✓ | ✓ | abc-parabola |
| 5 | ✓ | ✓ | graph-steps |
| 6 | ✓ (qo‘shildi) | ✓ (qo‘shildi) | sign-line |
| 7 | ✓ | ✓ | ineq-parabola |
| 8 | ✓ | ✓ | sign-chain |
| 9 | ✓ (qo‘shildi) | ✓ (qo‘shildi) | domain-line |
| 10 | ✓ | ✓ | mono-parabola |

```js
function readyIds() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
```

---

## Oxirgi o‘zgarish

- 3, 6, 9: `kitob` + `doska` majburiy bloklari to‘ldirildi (PNG + steps)
- 5: `example` → `sahna.example` (top-level olib tashlandi)
- 8: `roots` → `sahna.roots` (top-level olib tashlandi)

---

## Keyingi dars

**11-§** — Funksiyaning juftligi va toqligi
