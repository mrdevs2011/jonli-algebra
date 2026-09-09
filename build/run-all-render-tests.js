/**
 * Jonli Algebra — barcha darslar uchun UMUMIY render smoke test.
 *
 * test-render.js (1-dars uchun yozilgan) darsga xos qiymatlarni hardcode
 * qiladi ("Kvadrat funksiyaning", "footerNext == ../2/" va h.k.) — bu
 * yaxshi, chuqur test, lekin faqat 1-darsga ishlaydi.
 *
 * Bu fayl boshqacha: har bir N/data.json'ni O'ZI o'qiydi va shundan kelib
 * chiqib nechta savol/kitob-sahifa/doska-masala bo'lishi kerakligini
 * hisoblaydi — shuning uchun 38 darsning HAMMASIGA, kod o'zgarishisiz
 * ishlaydi. Renderer JS xatosiz ishlashini, DOM'ga to'g'ri sondagi
 * elementlar chiqishini tekshiradi. Matn mazmunini emas — buni odam
 * o'qib tekshiradi.
 *
 * Ishlatish:
 *   node build/run-all-render-tests.js         # barcha topilgan darslar
 *   node build/run-all-render-tests.js 3 7 12  # faqat shu darslar
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lessonsRoot = path.join(root, "lessons", "math", "9");

function findLessons() {
  const argNums = process.argv.slice(2).filter((a) => /^\d+$/.test(a));
  if (argNums.length) return argNums;
  return fs
    .readdirSync(lessonsRoot)
    .filter((n) => /^\d+$/.test(n) && fs.existsSync(path.join(lessonsRoot, n, "index.html")))
    .sort((a, b) => Number(a) - Number(b));
}

function testLesson(num) {
  const lessonDir = path.join(lessonsRoot, String(num));
  const dataPath = path.join(lessonDir, "data.json");
  const htmlPath = path.join(lessonDir, "index.html");

  if (!fs.existsSync(dataPath)) return { num, skipped: "data.json yo'q" };
  if (!fs.existsSync(htmlPath)) return { num, fail: ["index.html yo'q — avval build.py ishga tushiring"] };

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const url = "file://" + htmlPath;

  return JSDOM.fromFile(htmlPath, {
    url,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
  }).then(
    (dom) =>
      new Promise((resolve) => {
        const jsErrors = [];
        dom.window.onerror = (msg) => jsErrors.push(String(msg));

        setTimeout(() => {
          const doc = dom.window.document;
          const fails = [];
          const check = (label, cond) => { if (!cond) fails.push(label); };

          check("darsTitle to'ldirilgan", doc.getElementById("darsTitle").textContent.length > 0);
          check("darsKicker paragraf raqamini o'z ichiga oladi", doc.getElementById("darsKicker").textContent.indexOf(data.paragraf) !== -1);
          check(`agenda ${data.agenda.length} qadam`, doc.getElementById("agendaSteps").children.length === data.agenda.length);

          if (data.sahna) {
            check("sahna JS xatosiz render bo'ldi (window.KA_SAHNA topildi)", jsErrors.every((e) => e.indexOf("Noma'lum sahna turi") === -1));
            check("sahna stage bo'sh emas", doc.getElementById("sahna").children.length > 0);
          }
          if (data.savollar) {
            check(`savollar ${data.savollar.length} ta render bo'ldi`, doc.querySelectorAll(".savol").length === data.savollar.length);
          }
          if (data.kitob) {
            check(`kitob ${data.kitob.sahifalar.length} sahifa render bo'ldi`, doc.querySelectorAll(".kitob-sahifa").length === data.kitob.sahifalar.length);
          }
          if (data.doska) {
            check(`doska ${data.doska.masalalar.length} masala render bo'ldi`, doc.querySelectorAll(".doska-masala").length === data.doska.masalalar.length);
          }
          if (data.mashqlar) {
            check(`mashqlar ${data.mashqlar.items.length} ta render bo'ldi`, doc.querySelectorAll("#mashqList li").length === data.mashqlar.items.length);
          }
          if (data.eslabQol) {
            check(`eslabQol ${data.eslabQol.length} li render bo'ldi`, doc.querySelectorAll("#blockEslab li").length === data.eslabQol.length);
          }
          check("footer next holati data.next bilan mos", !!doc.getElementById("footerNext").hidden === (data.next === null || data.next === undefined));
          check("footer prev holati data.prev bilan mos", !!doc.getElementById("footerPrev").hidden === (data.prev === null || data.prev === undefined));
          check("hech qanday runtime JS xatosi yo'q", jsErrors.length === 0);

          resolve({ num, fails, jsErrors });
        }, 250);
      })
  ).catch((e) => ({ num, fail: [`Load xato: ${e.message}`] }));
}

async function main() {
  const nums = findLessons();
  if (!nums.length) {
    console.log("Hech qanday build qilingan dars topilmadi (avval python3 build/build.py ishga tushiring).");
    process.exit(0);
  }
  console.log(`${nums.length} ta dars tekshirilmoqda...\n`);

  let okCount = 0, failCount = 0, skipCount = 0;
  for (const num of nums) {
    const r = await testLesson(num);
    if (r.skipped) { console.log(`  ⏭  ${num}-dars — ${r.skipped}`); skipCount++; continue; }
    if ((r.fails && r.fails.length) || r.fail) {
      failCount++;
      console.log(`  ✗ ${num}-dars:`);
      (r.fail || r.fails).forEach((f) => console.log(`      - ${f}`));
      if (r.jsErrors && r.jsErrors.length) r.jsErrors.forEach((e) => console.log(`      - JS xato: ${e}`));
    } else {
      okCount++;
      console.log(`  ✓ ${num}-dars`);
    }
  }

  console.log(`\nJami: ${okCount} OK, ${failCount} xato, ${skipCount} o'tkazib yuborildi.`);
  process.exit(failCount > 0 ? 1 : 0);
}

main();
