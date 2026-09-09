const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const lessonDir = process.argv[2] || "1";
const root = path.resolve(__dirname, "..");
const url = "file://" + path.join(root, lessonDir, "index.html");

const errors = [];

JSDOM.fromFile(path.join(root, lessonDir, "index.html"), {
  url,
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
}).then((dom) => {
  dom.window.onerror = (msg) => errors.push(msg);

  setTimeout(() => {
    const doc = dom.window.document;

    function check(label, cond) {
      console.log((cond ? "  OK  " : "  FAIL") + "  " + label);
      if (!cond) errors.push(label);
    }

    check("title set", doc.title.indexOf("Kvadrat funksiyaning") !== -1);
    check("h1 filled", doc.getElementById("darsTitle").textContent.length > 0);
    check("kicker filled", doc.getElementById("darsKicker").textContent.indexOf("1-§") !== -1);
    check("agenda has 6 steps", doc.getElementById("agendaSteps").children.length === 6);
    check("sahna svg graf exists", !!doc.getElementById("graf"));
    check("sahna sliders exist", !!doc.getElementById("slide-a") && !!doc.getElementById("slide-b") && !!doc.getElementById("slide-c"));
    check("formula curve path drawn", doc.getElementById("graf").querySelector("path") && doc.getElementById("graf").querySelector("path").getAttribute("d").length > 10);
    check("kirish block has 2 paragraphs", doc.getElementById("blockKirish").querySelectorAll("p").length === 2);
    check("qoida filled", doc.getElementById("blockQoida").textContent.indexOf("kvadrat funksiya") !== -1);
    check("savollar rendered (3)", doc.querySelectorAll(".savol").length === 3);
    check("eslabQol rendered (3 li)", doc.querySelectorAll("#blockEslab li").length === 3);
    check("kitob pages rendered (2)", doc.querySelectorAll(".kitob-sahifa").length === 2);
    check("kitob img src uses png/", doc.querySelector(".kitob-sahifa img").getAttribute("src").startsWith("png/"));
    check("doska masalalar rendered (4)", doc.querySelectorAll(".doska-masala").length === 4);
    check("doska step img uses png/", doc.querySelector(".doska-masala img").getAttribute("src").startsWith("png/"));
    check("doska steps list present", doc.querySelectorAll("[data-doska-list] li").length > 0);
    check("mashqlar rendered (2)", doc.querySelectorAll("#mashqList li").length === 2);
    check("xulosa rendered (5 li)", doc.querySelectorAll("#xulosaList li").length === 5);
    check("footer next link set", doc.getElementById("footerNext").getAttribute("href") === "../2/");
    check("footer prev hidden (first lesson)", doc.getElementById("footerPrev").hidden === true);

    // savol click behaviour
    const firstSavolBtns = doc.querySelectorAll(".savol")[0].querySelectorAll("button");
    firstSavolBtns[0].dispatchEvent(new dom.window.Event("click", { bubbles: true }));
    check("clicking correct answer marks 'togri'", firstSavolBtns[0].classList.contains("togri"));

    // doska step reveal
    const firstDoska = doc.querySelectorAll("[data-doska]")[0];
    const nextBtn = firstDoska.querySelector("[data-doska-next]");
    nextBtn.dispatchEvent(new dom.window.Event("click", { bubbles: true }));
    check("doska next reveals first step", firstDoska.querySelectorAll("[data-doska-list] li.is-shown").length === 1);

    // slider interaction updates formula + note
    const slideA = doc.getElementById("slide-a");
    slideA.value = "0";
    slideA.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    check("a=0 note switches to linear-function text", doc.getElementById("sahna1-note").textContent.indexOf("chiziqli funksiya") !== -1);

    console.log("\nJS runtime errors:", errors.filter(e => typeof e !== "string" || !e.startsWith("  ")).length ? errors : "none besides check labels above");
    console.log(errors.length === 0 ? "\nHAMMASI OK" : "\nXATOLAR: " + errors.length);
    process.exit(errors.length === 0 ? 0 : 1);
  }, 300);
}).catch((e) => {
  console.error("Load error:", e);
  process.exit(1);
});
