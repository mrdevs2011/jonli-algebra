/**
 * Jonli Algebra — Silent Zero-Friction Resumable Offline Sync Engine
 *
 * 1. 100% Orqa fonda: Foydalanuvchiga hech qanday status/banner ko'rsatilmaydi, ekranni band qilmaydi.
 * 2. Qayta tiklanuvchan (Resumable): Foydalanuvchi 3 soniyada chiqib ketsa ham, keshga tushgan
 *    fayllar saqlanadi. Keyingi kirishda CacheStorage.keys() orqali tekshirilib, faqat yetishmayotgan
 *    fayllar yuklanadi (1ms da skaner qilinadi, oldingi yuklanganlar qayta yuklanmaydi).
 * 3. 2 Bosqichli ustuvorlik (Two-Tier Priority):
 *    - 1-bosqich: Matn, kod, uslublar, 22 ta interaktiv sahna va 38 ta darsning barchasi (Tier 1 ~ 2MB)
 *      1-2 soniyada yuklanadi. Bu tugashi bilan 100% darslar va interaktiv sahnalar offline ishlaydi!
 *    - 2-bosqich: Kitob va doska rasmlari (Tier 2 - 400 ta rasm) fonda xotirjam navbat bilan olinadi.
 * 4. Tarmoq uzilsa to'xtaydi, qayta ulanganda qolgan joyidan davom etadi.
 */
(function () {
  "use strict";

  var CACHE_NAME = "jonli-algebra-v2";
  var STORAGE_KEY = "ja_offline_sync_v2";

  var TIER_1_FILES = [
  "",
  "index.html",
  "manifest.json",
  "favicon.ico",
  "assets/icons/favicon.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "css/base.css",
  "css/dashboard.css",
  "css/dars.css",
  "js/darslar.js",
  "js/progress.js",
  "js/dashboard.js",
  "js/board.js",
  "js/features.js",
  "js/dars-render.js",
  "js/formulalar-data.js",
  "js/sahna-abc-parabola.js",
  "js/sahna-am-gm-ineq.js",
  "js/sahna-base.js",
  "js/sahna-domain-line.js",
  "js/sahna-even-odd.js",
  "js/sahna-graph-steps.js",
  "js/sahna-ineq-intersect.js",
  "js/sahna-ineq-parabola.js",
  "js/sahna-line-parabola.js",
  "js/sahna-mono-parabola.js",
  "js/sahna-power-growth.js",
  "js/sahna-prob-classic.js",
  "js/sahna-prog-arith.js",
  "js/sahna-prog-geom.js",
  "js/sahna-quadrant-signs.js",
  "js/sahna-seq-discrete.js",
  "js/sahna-sign-chain.js",
  "js/sahna-sign-line.js",
  "js/sahna-stat-freq.js",
  "js/sahna-system-methods.js",
  "js/sahna-trig-add.js",
  "js/sahna-unit-circle.js",
  "js/sahna-x2-parabola.js",
  "lessons/math/9/1/",
  "lessons/math/9/1/index.html",
  "lessons/math/9/1/data.json",
  "lessons/math/9/2/",
  "lessons/math/9/2/index.html",
  "lessons/math/9/2/data.json",
  "lessons/math/9/3/",
  "lessons/math/9/3/index.html",
  "lessons/math/9/3/data.json",
  "lessons/math/9/4/",
  "lessons/math/9/4/index.html",
  "lessons/math/9/4/data.json",
  "lessons/math/9/5/",
  "lessons/math/9/5/index.html",
  "lessons/math/9/5/data.json",
  "lessons/math/9/6/",
  "lessons/math/9/6/index.html",
  "lessons/math/9/6/data.json",
  "lessons/math/9/7/",
  "lessons/math/9/7/index.html",
  "lessons/math/9/7/data.json",
  "lessons/math/9/8/",
  "lessons/math/9/8/index.html",
  "lessons/math/9/8/data.json",
  "lessons/math/9/9/",
  "lessons/math/9/9/index.html",
  "lessons/math/9/9/data.json",
  "lessons/math/9/10/",
  "lessons/math/9/10/index.html",
  "lessons/math/9/10/data.json",
  "lessons/math/9/11/",
  "lessons/math/9/11/index.html",
  "lessons/math/9/11/data.json",
  "lessons/math/9/12/",
  "lessons/math/9/12/index.html",
  "lessons/math/9/12/data.json",
  "lessons/math/9/13/",
  "lessons/math/9/13/index.html",
  "lessons/math/9/13/data.json",
  "lessons/math/9/14/",
  "lessons/math/9/14/index.html",
  "lessons/math/9/14/data.json",
  "lessons/math/9/15/",
  "lessons/math/9/15/index.html",
  "lessons/math/9/15/data.json",
  "lessons/math/9/16/",
  "lessons/math/9/16/index.html",
  "lessons/math/9/16/data.json",
  "lessons/math/9/17/",
  "lessons/math/9/17/index.html",
  "lessons/math/9/17/data.json",
  "lessons/math/9/18/",
  "lessons/math/9/18/index.html",
  "lessons/math/9/18/data.json",
  "lessons/math/9/19/",
  "lessons/math/9/19/index.html",
  "lessons/math/9/19/data.json",
  "lessons/math/9/20/",
  "lessons/math/9/20/index.html",
  "lessons/math/9/20/data.json",
  "lessons/math/9/21/",
  "lessons/math/9/21/index.html",
  "lessons/math/9/21/data.json",
  "lessons/math/9/22/",
  "lessons/math/9/22/index.html",
  "lessons/math/9/22/data.json",
  "lessons/math/9/23/",
  "lessons/math/9/23/index.html",
  "lessons/math/9/23/data.json",
  "lessons/math/9/24/",
  "lessons/math/9/24/index.html",
  "lessons/math/9/24/data.json",
  "lessons/math/9/25/",
  "lessons/math/9/25/index.html",
  "lessons/math/9/25/data.json",
  "lessons/math/9/26/",
  "lessons/math/9/26/index.html",
  "lessons/math/9/26/data.json",
  "lessons/math/9/27/",
  "lessons/math/9/27/index.html",
  "lessons/math/9/27/data.json",
  "lessons/math/9/28/",
  "lessons/math/9/28/index.html",
  "lessons/math/9/28/data.json",
  "lessons/math/9/29/",
  "lessons/math/9/29/index.html",
  "lessons/math/9/29/data.json",
  "lessons/math/9/30/",
  "lessons/math/9/30/index.html",
  "lessons/math/9/30/data.json",
  "lessons/math/9/31/",
  "lessons/math/9/31/index.html",
  "lessons/math/9/31/data.json",
  "lessons/math/9/32/",
  "lessons/math/9/32/index.html",
  "lessons/math/9/32/data.json",
  "lessons/math/9/33/",
  "lessons/math/9/33/index.html",
  "lessons/math/9/33/data.json",
  "lessons/math/9/34/",
  "lessons/math/9/34/index.html",
  "lessons/math/9/34/data.json",
  "lessons/math/9/35/",
  "lessons/math/9/35/index.html",
  "lessons/math/9/35/data.json",
  "lessons/math/9/36/",
  "lessons/math/9/36/index.html",
  "lessons/math/9/36/data.json",
  "lessons/math/9/37/",
  "lessons/math/9/37/index.html",
  "lessons/math/9/37/data.json",
  "lessons/math/9/38/",
  "lessons/math/9/38/index.html",
  "lessons/math/9/38/data.json"
];

  var TIER_2_FILES = [
  "lessons/math/9/1/png/1-masala.png",
  "lessons/math/9/1/png/2-masala.png",
  "lessons/math/9/1/png/3-masala.png",
  "lessons/math/9/1/png/tarif.png",
  "lessons/math/9/10/png/kirish41.png",
  "lessons/math/9/10/png/tarif42.png",
  "lessons/math/9/10/png/tarif43.png",
  "lessons/math/9/11/png/misollar-49.png",
  "lessons/math/9/11/png/tarif-47.png",
  "lessons/math/9/11/png/tarif-48.png",
  "lessons/math/9/12/png/1-masala.png",
  "lessons/math/9/12/png/2-masala.png",
  "lessons/math/9/12/png/3-masala.png",
  "lessons/math/9/12/png/4-masala.png",
  "lessons/math/9/13/png/1-masala.png",
  "lessons/math/9/13/png/2-masala.png",
  "lessons/math/9/13/png/3-masala.png",
  "lessons/math/9/13/png/4-masala.png",
  "lessons/math/9/14/png/1-masala.png",
  "lessons/math/9/14/png/2-masala.png",
  "lessons/math/9/14/png/3-masala.png",
  "lessons/math/9/14/png/4-masala.png",
  "lessons/math/9/15/png/1-masala.png",
  "lessons/math/9/15/png/2-masala.png",
  "lessons/math/9/15/png/3-masala.png",
  "lessons/math/9/16/png/1-masala.png",
  "lessons/math/9/16/png/2-masala.png",
  "lessons/math/9/16/png/3-masala.png",
  "lessons/math/9/16/png/4-masala.png",
  "lessons/math/9/17/png/1-masala.png",
  "lessons/math/9/17/png/2-masala.png",
  "lessons/math/9/17/png/3-masala.png",
  "lessons/math/9/17/png/4-masala.png",
  "lessons/math/9/18/png/1-masala.png",
  "lessons/math/9/18/png/2-masala.png",
  "lessons/math/9/18/png/tarif-100.png",
  "lessons/math/9/18/png/tarif-97.png",
  "lessons/math/9/18/png/tarif-98.png",
  "lessons/math/9/18/png/tarif-99.png",
  "lessons/math/9/19/png/1-masala.png",
  "lessons/math/9/19/png/2-masala.png",
  "lessons/math/9/19/png/3-masala.png",
  "lessons/math/9/19/png/4-masala.png",
  "lessons/math/9/19/png/5-masala.png",
  "lessons/math/9/19/png/6-masala.png",
  "lessons/math/9/19/png/tarif.png",
  "lessons/math/9/2/png/jadval-va-tarif.png",
  "lessons/math/9/2/png/masala.png",
  "lessons/math/9/2/png/xossa1.png",
  "lessons/math/9/2/png/xossa2-3.png",
  "lessons/math/9/20/png/1-masala.png",
  "lessons/math/9/20/png/2-masala.png",
  "lessons/math/9/20/png/qoida-sincos.png",
  "lessons/math/9/20/png/qoida-tangens.png",
  "lessons/math/9/21/png/1-masala.png",
  "lessons/math/9/21/png/2-masala.png",
  "lessons/math/9/21/png/3-masala.png",
  "lessons/math/9/21/png/4-masala.png",
  "lessons/math/9/21/png/5-masala.png",
  "lessons/math/9/21/png/6-masala.png",
  "lessons/math/9/22/png/1-masala.png",
  "lessons/math/9/22/png/2-masala.png",
  "lessons/math/9/22/png/3-masala.png",
  "lessons/math/9/22/png/4-masala.png",
  "lessons/math/9/22/png/5-masala.png",
  "lessons/math/9/23/png/1-geometriya.png",
  "lessons/math/9/23/png/2-formulalar.png",
  "lessons/math/9/23/png/3-tg-ctg.png",
  "lessons/math/9/23/png/4-misol.png",
  "lessons/math/9/24/png/1-cos-plus.png",
  "lessons/math/9/24/png/2-cos75.png",
  "lessons/math/9/24/png/3-cos-minus.png",
  "lessons/math/9/24/png/4-sin-plus.png",
  "lessons/math/9/24/png/5-tg.png",
  "lessons/math/9/25/png/1-sin2a.png",
  "lessons/math/9/25/png/2-masala1.png",
  "lessons/math/9/25/png/3-masala2.png",
  "lessons/math/9/25/png/4-masala4.png",
  "lessons/math/9/26/png/1-masala.png",
  "lessons/math/9/26/png/2-masala.png",
  "lessons/math/9/26/png/3-masala.png",
  "lessons/math/9/26/png/4-masala.png",
  "lessons/math/9/27/png/1-masala.png",
  "lessons/math/9/27/png/2-masala.png",
  "lessons/math/9/27/png/3-masala.png",
  "lessons/math/9/27/png/4-masala.png",
  "lessons/math/9/28/png/1-masala.png",
  "lessons/math/9/28/png/2-masala.png",
  "lessons/math/9/28/png/3-masala.png",
  "lessons/math/9/29/png/1-masala.png",
  "lessons/math/9/29/png/2-masala.png",
  "lessons/math/9/29/png/3-masala.png",
  "lessons/math/9/29/png/4-masala.png",
  "lessons/math/9/3/png/1-masala.png",
  "lessons/math/9/3/png/2-masala.png",
  "lessons/math/9/3/png/3-masala.png",
  "lessons/math/9/3/png/grafik-xulosasi.png",
  "lessons/math/9/3/png/tarif.png",
  "lessons/math/9/3/png/xossalar.png",
  "lessons/math/9/30/png/1-masala.png",
  "lessons/math/9/30/png/2-masala.png",
  "lessons/math/9/30/png/3-masala.png",
  "lessons/math/9/30/png/4-masala.png",
  "lessons/math/9/31/png/1-masala.png",
  "lessons/math/9/31/png/2-masala.png",
  "lessons/math/9/31/png/3-masala.png",
  "lessons/math/9/31/png/4-masala.png",
  "lessons/math/9/32/png/1-masala.png",
  "lessons/math/9/32/png/2-masala.png",
  "lessons/math/9/32/png/3-masala.png",
  "lessons/math/9/32/png/4-masala.png",
  "lessons/math/9/33/png/1-masala.png",
  "lessons/math/9/33/png/2-masala.png",
  "lessons/math/9/33/png/3-masala.png",
  "lessons/math/9/33/png/4-masala.png",
  "lessons/math/9/34/png/1-masala.png",
  "lessons/math/9/34/png/2-masala.png",
  "lessons/math/9/34/png/3-masala.png",
  "lessons/math/9/34/png/4-masala.png",
  "lessons/math/9/35/png/1-masala.png",
  "lessons/math/9/35/png/2-masala.png",
  "lessons/math/9/35/png/3-masala.png",
  "lessons/math/9/35/png/4-masala.png",
  "lessons/math/9/36/png/1-masala.png",
  "lessons/math/9/36/png/2-masala.png",
  "lessons/math/9/36/png/3-masala.png",
  "lessons/math/9/36/png/4-masala.png",
  "lessons/math/9/37/png/1-masala.png",
  "lessons/math/9/37/png/2-masala.png",
  "lessons/math/9/37/png/3-masala.png",
  "lessons/math/9/37/png/4-masala.png",
  "lessons/math/9/38/png/1-masala.png",
  "lessons/math/9/38/png/2-masala.png",
  "lessons/math/9/38/png/3-masala.png",
  "lessons/math/9/38/png/4-masala.png",
  "lessons/math/9/4/png/1-masala.png",
  "lessons/math/9/4/png/2-masala.png",
  "lessons/math/9/4/png/3-masala.png",
  "lessons/math/9/4/png/9-12-rasm.png",
  "lessons/math/9/4/png/parallel-kochirish.png",
  "lessons/math/9/4/png/qoida.png",
  "lessons/math/9/5/png/1-masala-shart.png",
  "lessons/math/9/5/png/1-masala-yechim.png",
  "lessons/math/9/5/png/2-masala.png",
  "lessons/math/9/5/png/3-masala.png",
  "lessons/math/9/5/png/4-masala.png",
  "lessons/math/9/5/png/besh-qadam.png",
  "lessons/math/9/6/png/1-masala.png",
  "lessons/math/9/6/png/2-masala.png",
  "lessons/math/9/6/png/3-masala.png",
  "lessons/math/9/7/png/1-masala.png",
  "lessons/math/9/7/png/2-masala.png",
  "lessons/math/9/7/png/3-masala.png",
  "lessons/math/9/8/png/1-masala.png",
  "lessons/math/9/8/png/2-masala.png",
  "lessons/math/9/8/png/3-masala.png",
  "lessons/math/9/8/png/4-masala.png",
  "lessons/math/9/8/png/usul.png",
  "lessons/math/9/9/png/1-masala.png",
  "lessons/math/9/9/png/2-3-masala.png",
  "kitob/kitob-1.png",
  "kitob/kitob-2.png",
  "kitob/kitob-3.png",
  "kitob/kitob-4.png",
  "kitob/kitob-5.png",
  "kitob/kitob-6.png",
  "kitob/kitob-7.png",
  "kitob/kitob-8.png",
  "kitob/kitob-9.png",
  "kitob/kitob-10.png",
  "kitob/kitob-11.png",
  "kitob/kitob-12.png",
  "kitob/kitob-13.png",
  "kitob/kitob-14.png",
  "kitob/kitob-15.png",
  "kitob/kitob-16.png",
  "kitob/kitob-17.png",
  "kitob/kitob-18.png",
  "kitob/kitob-19.png",
  "kitob/kitob-20.png",
  "kitob/kitob-21.png",
  "kitob/kitob-22.png",
  "kitob/kitob-23.png",
  "kitob/kitob-24.png",
  "kitob/kitob-25.png",
  "kitob/kitob-26.png",
  "kitob/kitob-27.png",
  "kitob/kitob-28.png",
  "kitob/kitob-29.png",
  "kitob/kitob-30.png",
  "kitob/kitob-31.png",
  "kitob/kitob-32.png",
  "kitob/kitob-33.png",
  "kitob/kitob-34.png",
  "kitob/kitob-35.png",
  "kitob/kitob-36.png",
  "kitob/kitob-37.png",
  "kitob/kitob-38.png",
  "kitob/kitob-39.png",
  "kitob/kitob-40.png",
  "kitob/kitob-41.png",
  "kitob/kitob-42.png",
  "kitob/kitob-43.png",
  "kitob/kitob-44.png",
  "kitob/kitob-45.png",
  "kitob/kitob-46.png",
  "kitob/kitob-47.png",
  "kitob/kitob-48.png",
  "kitob/kitob-49.png",
  "kitob/kitob-50.png",
  "kitob/kitob-51.png",
  "kitob/kitob-52.png",
  "kitob/kitob-53.png",
  "kitob/kitob-54.png",
  "kitob/kitob-55.png",
  "kitob/kitob-56.png",
  "kitob/kitob-57.png",
  "kitob/kitob-58.png",
  "kitob/kitob-59.png",
  "kitob/kitob-60.png",
  "kitob/kitob-61.png",
  "kitob/kitob-62.png",
  "kitob/kitob-63.png",
  "kitob/kitob-64.png",
  "kitob/kitob-65.png",
  "kitob/kitob-66.png",
  "kitob/kitob-67.png",
  "kitob/kitob-68.png",
  "kitob/kitob-69.png",
  "kitob/kitob-70.png",
  "kitob/kitob-71.png",
  "kitob/kitob-72.png",
  "kitob/kitob-73.png",
  "kitob/kitob-74.png",
  "kitob/kitob-75.png",
  "kitob/kitob-76.png",
  "kitob/kitob-77.png",
  "kitob/kitob-78.png",
  "kitob/kitob-79.png",
  "kitob/kitob-80.png",
  "kitob/kitob-81.png",
  "kitob/kitob-82.png",
  "kitob/kitob-83.png",
  "kitob/kitob-84.png",
  "kitob/kitob-85.png",
  "kitob/kitob-86.png",
  "kitob/kitob-87.png",
  "kitob/kitob-88.png",
  "kitob/kitob-89.png",
  "kitob/kitob-90.png",
  "kitob/kitob-91.png",
  "kitob/kitob-92.png",
  "kitob/kitob-93.png",
  "kitob/kitob-94.png",
  "kitob/kitob-95.png",
  "kitob/kitob-96.png",
  "kitob/kitob-97.png",
  "kitob/kitob-98.png",
  "kitob/kitob-99.png",
  "kitob/kitob-100.png",
  "kitob/kitob-101.png",
  "kitob/kitob-102.png",
  "kitob/kitob-103.png",
  "kitob/kitob-104.png",
  "kitob/kitob-105.png",
  "kitob/kitob-106.png",
  "kitob/kitob-107.png",
  "kitob/kitob-108.png",
  "kitob/kitob-109.png",
  "kitob/kitob-110.png",
  "kitob/kitob-111.png",
  "kitob/kitob-112.png",
  "kitob/kitob-113.png",
  "kitob/kitob-114.png",
  "kitob/kitob-115.png",
  "kitob/kitob-116.png",
  "kitob/kitob-117.png",
  "kitob/kitob-118.png",
  "kitob/kitob-119.png",
  "kitob/kitob-120.png",
  "kitob/kitob-121.png",
  "kitob/kitob-122.png",
  "kitob/kitob-123.png",
  "kitob/kitob-124.png",
  "kitob/kitob-125.png",
  "kitob/kitob-126.png",
  "kitob/kitob-127.png",
  "kitob/kitob-128.png",
  "kitob/kitob-129.png",
  "kitob/kitob-130.png",
  "kitob/kitob-131.png",
  "kitob/kitob-132.png",
  "kitob/kitob-133.png",
  "kitob/kitob-134.png",
  "kitob/kitob-135.png",
  "kitob/kitob-136.png",
  "kitob/kitob-137.png",
  "kitob/kitob-138.png",
  "kitob/kitob-139.png",
  "kitob/kitob-140.png",
  "kitob/kitob-141.png",
  "kitob/kitob-142.png",
  "kitob/kitob-143.png",
  "kitob/kitob-144.png",
  "kitob/kitob-145.png",
  "kitob/kitob-146.png",
  "kitob/kitob-147.png",
  "kitob/kitob-148.png",
  "kitob/kitob-149.png",
  "kitob/kitob-150.png",
  "kitob/kitob-151.png",
  "kitob/kitob-152.png",
  "kitob/kitob-153.png",
  "kitob/kitob-154.png",
  "kitob/kitob-155.png",
  "kitob/kitob-156.png",
  "kitob/kitob-157.png",
  "kitob/kitob-158.png",
  "kitob/kitob-159.png",
  "kitob/kitob-160.png",
  "kitob/kitob-161.png",
  "kitob/kitob-162.png",
  "kitob/kitob-163.png",
  "kitob/kitob-164.png",
  "kitob/kitob-165.png",
  "kitob/kitob-166.png",
  "kitob/kitob-167.png",
  "kitob/kitob-168.png",
  "kitob/kitob-169.png",
  "kitob/kitob-170.png",
  "kitob/kitob-171.png",
  "kitob/kitob-172.png",
  "kitob/kitob-173.png",
  "kitob/kitob-174.png",
  "kitob/kitob-175.png",
  "kitob/kitob-176.png",
  "kitob/kitob-177.png",
  "kitob/kitob-178.png",
  "kitob/kitob-179.png",
  "kitob/kitob-180.png",
  "kitob/kitob-181.png",
  "kitob/kitob-182.png",
  "kitob/kitob-183.png",
  "kitob/kitob-184.png",
  "kitob/kitob-185.png",
  "kitob/kitob-186.png",
  "kitob/kitob-187.png",
  "kitob/kitob-188.png",
  "kitob/kitob-189.png",
  "kitob/kitob-190.png",
  "kitob/kitob-191.png",
  "kitob/kitob-192.png",
  "kitob/kitob-193.png",
  "kitob/kitob-194.png",
  "kitob/kitob-195.png",
  "kitob/kitob-196.png",
  "kitob/kitob-197.png",
  "kitob/kitob-198.png",
  "kitob/kitob-199.png",
  "kitob/kitob-200.png",
  "kitob/kitob-201.png",
  "kitob/kitob-202.png",
  "kitob/kitob-203.png",
  "kitob/kitob-204.png",
  "kitob/kitob-205.png",
  "kitob/kitob-206.png",
  "kitob/kitob-207.png",
  "kitob/kitob-208.png",
  "kitob/kitob-209.png",
  "kitob/kitob-210.png",
  "kitob/kitob-211.png",
  "kitob/kitob-212.png",
  "kitob/kitob-213.png",
  "kitob/kitob-214.png",
  "kitob/kitob-215.png",
  "kitob/kitob-216.png",
  "kitob/kitob-217.png",
  "kitob/kitob-218.png",
  "kitob/kitob-219.png",
  "kitob/kitob-220.png",
  "kitob/kitob-221.png",
  "kitob/kitob-222.png",
  "kitob/kitob-223.png",
  "kitob/kitob-224.png",
  "kitob/kitob-225.png",
  "kitob/kitob-226.png",
  "kitob/kitob-227.png",
  "kitob/kitob-228.png",
  "kitob/kitob-229.png",
  "kitob/kitob-230.png",
  "kitob/kitob-231.png",
  "kitob/kitob-232.png",
  "kitob/kitob-233.png",
  "kitob/kitob-234.png",
  "kitob/kitob-235.png",
  "kitob/kitob-236.png",
  "kitob/kitob-237.png",
  "kitob/kitob-238.png",
  "kitob/kitob-239.png",
  "kitob/kitob-240.png"
];

  var state = {
    isSyncing: false,
    paused: !navigator.onLine,
    tier1Done: false,
    tier2Done: false,
    totalFiles: TIER_1_FILES.length + TIER_2_FILES.length,
    cachedCount: 0,
    currentStep: ""
  };

  function getBaseUrl() {
    var path = window.location.pathname;
    var idx = path.indexOf("/lessons/math/9/");
    if (idx !== -1) {
      return window.location.origin + path.substring(0, idx + 1);
    }
    var dir = path.substring(0, path.lastIndexOf("/") + 1);
    return window.location.origin + dir;
  }

  function resolveUrl(relPath, baseUrl) {
    if (!relPath) return baseUrl;
    return new URL(relPath, baseUrl).href;
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cachedCount: state.cachedCount,
        totalFiles: state.totalFiles,
        tier1Done: state.tier1Done,
        tier2Done: state.tier2Done,
        updatedAt: Date.now()
      }));
    } catch (e) {}
  }

  function loadSavedProgress() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && typeof parsed.cachedCount === "number") {
          state.cachedCount = parsed.cachedCount;
          state.tier1Done = !!parsed.tier1Done;
          state.tier2Done = !!parsed.tier2Done;
        }
      }
    } catch (e) {}
  }

  // Resumable worker queue
  function downloadBatch(urls, cache, concurrency, throttleMs) {
    return new Promise(function (resolve) {
      var index = 0;
      var active = 0;
      var completed = 0;
      var total = urls.length;

      if (total === 0) {
        resolve();
        return;
      }

      function next() {
        if (completed >= total) {
          resolve();
          return;
        }

        while (active < concurrency && index < total) {
          if (!navigator.onLine) {
            state.paused = true;
            state.isSyncing = false;
            resolve();
            return;
          }

          var i = index++;
          active++;
          fetchAndCache(urls[i]);
        }
      }

      function fetchAndCache(itemUrl) {
        fetch(itemUrl, { cache: "reload" })
          .then(function (response) {
            if (response && response.status === 200) {
              return cache.put(itemUrl, response);
            }
          })
          .catch(function () {})
          .then(function () {
            active--;
            completed++;
            state.cachedCount++;
            if (state.cachedCount % 5 === 0 || state.cachedCount === state.totalFiles) {
              saveProgress();
            }

            if (throttleMs > 0) {
              setTimeout(next, throttleMs);
            } else {
              next();
            }
          });
      }

      next();
    });
  }

  function startSync() {
    if (!("caches" in window)) return;
    if (state.isSyncing) return;
    if (!navigator.onLine) return;

    state.isSyncing = true;

    caches.open(CACHE_NAME).then(function (cache) {
      var baseUrl = getBaseUrl();

      // 1. Keshda mavjud fayllarni 1ms ichida aniqlash (Zero redundant download)
      cache.keys().then(function (cachedRequests) {
        var cachedUrlSet = new Set(cachedRequests.map(function (req) { return req.url; }));

        // Tier 1 tekshirish
        var tier1Remaining = [];
        var tier1CachedCount = 0;
        for (var i = 0; i < TIER_1_FILES.length; i++) {
          var fullUrl1 = resolveUrl(TIER_1_FILES[i], baseUrl);
          if (cachedUrlSet.has(fullUrl1)) {
            tier1CachedCount++;
          } else {
            tier1Remaining.push(fullUrl1);
          }
        }

        // Tier 2 tekshirish
        var tier2Remaining = [];
        var tier2CachedCount = 0;
        for (var j = 0; j < TIER_2_FILES.length; j++) {
          var fullUrl2 = resolveUrl(TIER_2_FILES[j], baseUrl);
          if (cachedUrlSet.has(fullUrl2)) {
            tier2CachedCount++;
          } else {
            tier2Remaining.push(fullUrl2);
          }
        }

        state.cachedCount = tier1CachedCount + tier2CachedCount;
        state.tier1Done = tier1Remaining.length === 0;
        state.tier2Done = tier2Remaining.length === 0;
        saveProgress();

        // Agar barcha fayllar allaqachon keshda bo'lsa:
        if (state.cachedCount >= state.totalFiles) {
          state.isSyncing = false;
          state.tier1Done = true;
          state.tier2Done = true;
          return;
        }

        // 2. Birinchi navbatda TIER 1 (Kod, Sahnalar, Darslar) — Tezkor (Concurrency: 6)
        var promise = Promise.resolve();
        if (tier1Remaining.length > 0) {
          state.currentStep = "tier1";
          promise = downloadBatch(tier1Remaining, cache, 6, 0).then(function () {
            state.tier1Done = true;
            saveProgress();
          });
        }

        // 3. Ikkinchi navbatda TIER 2 (Rasmlar) — Sekinroq, tarmoqni band qilmasdan (Concurrency: 3, 15ms)
        promise.then(function () {
          if (tier2Remaining.length > 0 && navigator.onLine) {
            state.currentStep = "tier2";
            return downloadBatch(tier2Remaining, cache, 3, 15).then(function () {
              state.tier2Done = true;
              saveProgress();
            });
          }
        }).catch(function () {}).then(function () {
          state.isSyncing = false;
        });
      });
    }).catch(function () {
      state.isSyncing = false;
    });
  }

  function init() {
    loadSavedProgress();

    // Service Workerni har qanday sahifada (root yoki dars) avtomatik ro'yxatdan o'tkazish
    if ("serviceWorker" in navigator) {
      var baseUrl = getBaseUrl();
      var swUrl = new URL("sw.js", baseUrl).href;
      navigator.serviceWorker.register(swUrl).catch(function () {});
    }

    // Tarmoq holati tinglovchilari
    window.addEventListener("online", function () {
      state.paused = false;
      startSync();
    });
    window.addEventListener("offline", function () {
      state.paused = true;
      state.isSyncing = false;
    });

    // Sahifa yuklanishi bilanoq fonda darhol ishga tushirish (orqa fonda 100% sukut bilan)
    if (document.readyState === "complete") {
      startSync();
    } else {
      window.addEventListener("load", function () {
        setTimeout(startSync, 350);
      });
    }
  }

  window.JA_OFFLINE_SYNC = {
    start: startSync,
    getState: function () { return state; }
  };

  init();
})();
