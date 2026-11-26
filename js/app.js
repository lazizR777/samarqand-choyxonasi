let cart = [];
let compareList = [];
let discountRate = 0;
let tipRate = 0;
let deliveryFee = 10000;
let selectedTapchan = null;
let orderHistory = [];
let wheelAngle = 0;

// Preloader & Initial Setup
window.addEventListener("load", () => {
  setTimeout(() => {
    const pre = document.getElementById("preloader");
    pre.style.opacity = "0";
    setTimeout(() => pre.style.display = "none", 600);
  }, 900);
  renderMenu();
  renderTapchans();
  animateCounters();
  startProverbTicker();
});

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// Parallax Hero Pattern
document.addEventListener("mousemove", (e) => {
  const pat = document.getElementById("parallax-pattern");
  if (pat) {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    pat.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// Proverb Ticker
function startProverbTicker() {
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % PROVERBS.length;
    document.getElementById("proverb-text").textContent = PROVERBS[idx];
  }, 5000);
}

// Counters
function animateCounters() {
  document.querySelectorAll(".counter").forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.ceil(target / 45);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
      else el.textContent = cur.toLocaleString();
    }, 30);
  });
}

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", (e) => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  e.target.textContent = isDark ? "🌙" : "☀️";
});

// Language Switcher
document.getElementById("lang-switch").addEventListener("change", (e) => {
  const lang = e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
  });
  showToast("Til o‘zgartirildi: " + lang.toUpperCase());
});

// Ambient Fountain Sound (Web Audio API)
let audioCtx = null, isSoundOn = false, noiseNode = null;
document.getElementById("sound-toggle").addEventListener("click", (e) => {
  if (!isSoundOn) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const out = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.04;
    noiseNode.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    noiseNode.start();
    isSoundOn = true;
    e.target.textContent = "🔊";
    showToast("Choyxona favvorasi ovozi yoqildi");
  } else {
    if (noiseNode) noiseNode.stop();
    isSoundOn = false;
    e.target.textContent = "🔇";
  }
});

// Seasonal Particles Canvas
const canvas = document.getElementById("season-canvas");
const ctx = canvas.getContext("2d");
let particles = [], currentSeason = "none";
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener("resize", resizeCanvas); resizeCanvas();

document.getElementById("season-switch").addEventListener("change", (e) => {
  currentSeason = e.target.value;
  particles = Array.from({ length: currentSeason === "none" ? 0 : 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 5 + 3,
    vy: Math.random() * 1.8 + 0.7,
    vx: Math.random() * 1 - 0.5
  }));
});

function renderSeasonLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentSeason !== "none") {
    const colors = { spring: "#f9a8d4", summer: "#7dd3fc", autumn: "#ea580c", winter: "#ffffff" };
    ctx.fillStyle = colors[currentSeason] || "#d4a338";
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.vy; p.x += p.vx;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
    });
  }
  requestAnimationFrame(renderSeasonLoop);
}
renderSeasonLoop();

// Render Menu
function renderMenu() {
  const grid = document.getElementById("menu-grid");
  const activeCat = document.querySelector(".filter-btn.active").dataset.cat;
  const query = document.getElementById("menu-search").value.toLowerCase();
  const vegOnly = document.getElementById("filter-veg").checked;
  const noSpicy = document.getElementById("filter-nospicy").checked;

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = activeCat === "all" || item.cat === activeCat;
    const matchQuery = item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    const matchVeg = !vegOnly || item.veg;
    const matchSpicy = !noSpicy || !item.spicy;
    return matchCat && matchQuery && matchVeg && matchSpicy;
  });

  grid.innerHTML = filtered.map(item => `
    <div class="dish-card">
      <div class="dish-img-wrap">
        <img src="${item.img}" alt="${item.title}" id="img-dish-${item.id}" />
        <div class="dish-badges">
          <span class="tag-pill">⏱ ${item.time}</span>
          <span class="tag-pill">🔥 ${item.cal} kkal</span>
        </div>
        <div class="dish-tools">
          <button onclick="openDishDetail(${item.id})" title="Tarkibi va KBJU">👁️</button>
          <button onclick="toggleCompare(${item.id})" title="Taqqoslash">⚖️</button>
        </div>
      </div>
      <div class="dish-body">
        <div>
          <h3>${item.title}</h3>
          <p class="dish-meta">${item.desc}</p>
        </div>
        <div>
          <select id="portion-${item.id}" class="portion-select">
            <option value="1">1.0 portsiya (Standart)</option>
            <option value="0.7">0.7 portsiya (-30%)</option>
            <option value="1.5">1.5 portsiya (+50%)</option>
          </select>
          <div class="dish-footer">
            <span class="price-tag">${item.price.toLocaleString()} so‘m</span>
            <button class="pill-btn primary-btn" onclick="addToCart(${item.id})">+ Savatga</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu();
  });
});
document.getElementById("menu-search").addEventListener("input", renderMenu);
document.getElementById("filter-veg").addEventListener("change", renderMenu);
document.getElementById("filter-nospicy").addEventListener("change", renderMenu);

// Voice Search
document.getElementById("voice-search-btn").addEventListener("click", () => {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return showToast("Brauzer ovozli qidiruvni qo‘llab-quvvatlamaydi");
  const rec = new SpeechRec();
  rec.lang = "uz-UZ";
  rec.start();
  showToast("Gapiring... (masalan: Osh)");
  rec.onresult = (e) => {
    document.getElementById("menu-search").value = e.results[0][0].transcript;
    renderMenu();
  };
});

// Dish Details & KBJU
function openDishDetail(id) {
  const item = MENU_ITEMS.find(d => d.id === id);
  document.getElementById("detail-modal-body").innerHTML = `
    <div class="modal-head"><h3>${item.title}</h3><button onclick="closeModal('detail-modal')" class="icon-btn">✕</button></div>
    <img src="${item.img}" style="width:100%;height:200px;object-fit:cover;border-radius:16px;margin-bottom:12px;" />
    <p>${item.desc}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0;text-align:center;background:var(--bg);padding:12px;border-radius:14px;">
      <div><strong>${item.cal}</strong><br><small>Kkal</small></div>
      <div><strong>${item.protein}g</strong><br><small>Oqsil</small></div>
      <div><strong>${item.fat}g</strong><br><small>Yog‘</small></div>
      <div><strong>${item.carbs}g</strong><br><small>Uglevod</small></div>
    </div>
    <button class="primary-btn full-btn" onclick="addToCart(${item.id});closeModal('detail-modal')">Savatga qo‘shish</button>
  `;
  openModal("detail-modal");
}

// Compare Dishes
function toggleCompare(id) {
  if (compareList.includes(id)) compareList = compareList.filter(i => i !== id);
  else if (compareList.length < 2) compareList.push(id);
  else { compareList.shift(); compareList.push(id); }
  document.getElementById("compare-count").textContent = compareList.length;
  showToast("Taqqoslash ro‘yxati yangilandi");
}

document.getElementById("compare-open-btn").addEventListener("click", () => {
  if (compareList.length < 2) return showToast("Taqqoslash uchun 2 ta taom tanlang");
  const items = compareList.map(id => MENU_ITEMS.find(d => d.id === id));
  document.getElementById("compare-body").innerHTML = items.map(it => `
    <div class="glass-panel">
      <h4>${it.title}</h4>
      <p>Narxi: <strong>${it.price.toLocaleString()} so‘m</strong></p>
      <p>Kaloriya: <strong>${it.cal} kkal</strong></p>
      <p>Oqsil / Yog‘: <strong>${it.protein}g / ${it.fat}g</strong></p>
      <p>Tayyorlanishi: <strong>${it.time}</strong></p>
    </div>
  `).join("");
  openModal("compare-modal");
});

// Fly-to-Cart Animation & Cart Logic
function flyToCart(imgEl) {
  if (!imgEl) return;
  const rect = imgEl.getBoundingClientRect();
  const cartBtn = document.getElementById("cart-open-btn").getBoundingClientRect();
  const clone = imgEl.cloneNode();
  clone.className = "fly-img";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    clone.style.left = cartBtn.left + "px";
    clone.style.top = cartBtn.top + "px";
    clone.style.transform = "scale(0.2)";
    clone.style.opacity = "0.3";
  });
  setTimeout(() => clone.remove(), 700);
}

function addToCart(id) {
  const item = MENU_ITEMS.find(d => d.id === id);
  const mult = parseFloat(document.getElementById(`portion-${id}`)?.value || 1);
  const finalPrice = Math.round(item.price * mult);
  const title = mult === 1 ? item.title : `${item.title} (${mult}x)`;
  flyToCart(document.getElementById(`img-dish-${id}`));

  const existing = cart.find(c => c.title === title);
  if (existing) existing.qty++;
  else cart.push({ title, price: finalPrice, qty: 1 });
  updateCartUI();
  showToast(`«${title}» savatga qo‘shildi`);
}

function addCombo(title, price) {
  const existing = cart.find(c => c.title === title);
  if (existing) existing.qty++;
  else cart.push({ title, price, qty: 1 });
  updateCartUI();
  showToast(`«${title}» savatga qo‘shildi`);
}

document.getElementById("add-custom-tea").addEventListener("click", () => {
  const [baseName, basePrice] = document.getElementById("tea-base").value.split("|");
  let total = +basePrice;
  const addons = [];
  document.querySelectorAll(".tea-addon:checked").forEach(cb => {
    total += +cb.dataset.price;
    addons.push(cb.value.split(" ")[0]);
  });
  const label = addons.length ? `${baseName} (+${addons.join(", ")})` : baseName;
  addCombo(label, total);
});

function updateCartUI() {
  const container = document.getElementById("cart-items");
  const countEl = document.getElementById("cart-count");
  let subtotal = 0, totalQty = 0;

  container.innerHTML = cart.map((item, idx) => {
    subtotal += item.price * item.qty;
    totalQty += item.qty;
    return `
      <div class="cart-row">
        <div><strong>${item.title}</strong><br><small>${item.price.toLocaleString()} so‘m</small></div>
        <div class="qty-controls">
          <button onclick="changeQty(${idx}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("") || "<p style='text-align:center;color:var(--muted);margin-top:20px;'>Savat bo‘sh</p>";

  countEl.textContent = totalQty;
  const freeTarget = 100000;
  const pct = Math.min(100, (subtotal / freeTarget) * 100);
  document.getElementById("delivery-progress-fill").style.width = pct + "%";
  document.getElementById("delivery-progress-text").textContent = subtotal >= freeTarget
    ? "🎉 Tabriklaymiz! Yetkazib berish BEPUL!"
    : `Bepul yetkazish uchun yana ${(freeTarget - subtotal).toLocaleString()} so‘m qoldi`;

  const discounted = subtotal * (1 - discountRate);
  const grandTotal = Math.round(discounted + discounted * tipRate);
  document.getElementById("cart-total").textContent = grandTotal.toLocaleString() + " so‘m";

  const splitN = +document.getElementById("split-slider").value;
  document.getElementById("split-count").textContent = splitN;
  document.getElementById("per-person-price").textContent = Math.round(grandTotal / splitN).toLocaleString() + " so‘m";
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

document.getElementById("split-slider").addEventListener("input", updateCartUI);
document.querySelectorAll(".tip-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tip-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tipRate = +btn.dataset.tip;
    updateCartUI();
  });
});

function applyPromo() {
  const code = document.getElementById("promo-input").value.trim().toUpperCase();
  if (code === "NAVRUZ20") { discountRate = 0.2; showToast("20% chegirma qo‘llandi!"); }
  else if (code === "CHOYXONA10") { discountRate = 0.1; showToast("10% chegirma qo‘llandi!"); }
  else showToast("Noto‘g‘ri promokod");
  updateCartUI();
}

function toggleCart(open) {
  document.getElementById("cart-drawer").classList.toggle("open", open);
}
document.getElementById("cart-open-btn").addEventListener("click", () => toggleCart(true));

// Tapchan Map & Banquet
function renderTapchans() {
  const nodes = [
    { id: 1, name: "Tapchan №1", status: "free" },
    { id: 2, name: "Tapchan №2", status: "busy" },
    { id: 3, name: "Tapchan №3", status: "free" },
    { id: 4, name: "VIP Xona №1", status: "free" },
    { id: 5, name: "Favvora №5", status: "busy" },
    { id: 6, name: "Shiypon №6", status: "free" }
  ];
  const grid = document.getElementById("tapchan-grid");
  grid.innerHTML = nodes.map(n => `
    <div class="tapchan-node ${n.status}" onclick="selectTapchan(this, '${n.name}', '${n.status}')">
      ${n.name}<br><small>${n.status === "free" ? "Bo‘sh" : "Band"}</small>
    </div>
  `).join("");
}

function selectTapchan(el, name, status) {
  if (status === "busy") return showToast("Bu tapchan band, boshqasini tanlang");
  document.querySelectorAll(".tapchan-node").forEach(n => n.classList.remove("selected"));
  el.classList.add("selected");
  selectedTapchan = name;
}

document.getElementById("booking-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedTapchan) return showToast("Avval xaritadan tapchan tanlang!");
  showToast(`✅ ${selectedTapchan} muvaffaqiyatli band qilindi!`);
});

function calcBanquet() {
  const guests = +document.getElementById("guest-slider").value;
  document.getElementById("guest-count-val").textContent = guests;
  const tier = +document.getElementById("banquet-tier").value;
  let total = guests * tier;
  if (document.getElementById("banquet-music").checked) total += 400000;
  if (document.getElementById("banquet-decor").checked) total += 300000;
  document.getElementById("banquet-total-price").textContent = total.toLocaleString() + " so‘m";
}
["guest-slider", "banquet-tier", "banquet-music", "banquet-decor"].forEach(id => {
  document.getElementById(id).addEventListener("input", calcBanquet);
});

// Checkout & 3D Credit Card
function openCheckout() {
  if (!cart.length) return showToast("Avval savatga taom qo‘shing!");
  toggleCart(false);
  openModal("checkout-modal");
}

document.getElementById("delivery-map").addEventListener("click", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  const pin = document.getElementById("user-map-pin");
  pin.style.left = x + "%"; pin.style.top = y + "%";
  const dist = (Math.hypot(x - 45, y - 45) / 10).toFixed(1);
  deliveryFee = Math.max(5000, Math.round(dist * 3000));
  document.getElementById("map-distance").textContent = dist + " km";
  document.getElementById("delivery-fee-display").textContent = deliveryFee.toLocaleString() + " so‘m";
});

function switchPayTab(tab) {
  document.querySelectorAll(".pay-tab").forEach((t, i) => t.classList.toggle("active", (tab === "card" && i === 0) || (tab === "qr" && i === 1)));
  document.getElementById("pay-card-section").style.display = tab === "card" ? "block" : "none";
  document.getElementById("pay-qr-section").style.display = tab === "qr" ? "block" : "none";
}

document.getElementById("cc-number").addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  e.target.value = val;
  document.getElementById("card-num-display").textContent = val || "8600 •••• •••• 4512";
  const brand = val.startsWith("9860") ? "HUMO" : val.startsWith("4") ? "VISA" : "UZCARD";
  document.getElementById("card-brand").textContent = brand;
});
document.getElementById("cc-holder").addEventListener("input", (e) => {
  document.getElementById("card-holder-display").textContent = e.target.value.toUpperCase() || "MEHMON";
});
document.getElementById("cc-exp").addEventListener("input", (e) => {
  document.getElementById("card-exp-display").textContent = e.target.value || "09/29";
});
const cvvInput = document.getElementById("cc-cvv");
cvvInput.addEventListener("focus", () => document.getElementById("credit-card-3d").classList.add("flipped"));
cvvInput.addEventListener("blur", () => document.getElementById("credit-card-3d").classList.remove("flipped"));
cvvInput.addEventListener("input", (e) => { document.getElementById("card-cvv-display").textContent = e.target.value || "***"; });

function completePayment() {
  const totalText = document.getElementById("cart-total").textContent;
  const orderId = "SMQ-" + Math.floor(100000 + Math.random() * 900000);
  orderHistory.unshift({ id: orderId, total: totalText, date: new Date().toLocaleTimeString() });
  closeModal("checkout-modal");

  document.getElementById("receipt-content").innerHTML = `
    <h3>🧾 RASMIY ELEKTRON CHEK</h3>
    <p>Chek raqami: <strong>#${orderId}</strong></p>
    <hr style="margin:12px 0;border-color:var(--border);" />
    ${cart.map(c => `<p>${c.title} x${c.qty} — ${(c.price * c.qty).toLocaleString()} so‘m</p>`).join("")}
    <h4 style="margin:12px 0;color:var(--emerald);">To‘landi: ${totalText}</h4>
    <button onclick="window.print()" class="pill-btn">🖨️ Chekni chop etish</button>
    <button onclick="closeModal('receipt-modal')" class="primary-btn pill-btn">Yopish</button>
  `;
  openModal("receipt-modal");
  cart = []; updateCartUI();
  startLiveTracker();
}

function startLiveTracker() {
  const box = document.getElementById("live-tracker");
  const bar = document.getElementById("tracker-bar");
  const st = document.getElementById("tracker-status");
  box.style.display = "block";
  const stages = [
    { w: "30%", t: "👨‍🍳 Oshpaz taomingizni tayyorlamoqda..." },
    { w: "65%", t: "🛵 Kuryer buyurtmani olib yo‘lga chiqdi!" },
    { w: "100%", t: "✅ Buyurtma manzilingizga yetib keldi! Yoqimli ishtaha!" }
  ];
  let step = 0;
  const iv = setInterval(() => {
    if (step >= stages.length) return clearInterval(iv);
    bar.style.width = stages[step].w;
    st.textContent = stages[step].t;
    step++;
  }, 4000);
}

// Auth SMS Flow
document.getElementById("auth-btn").addEventListener("click", () => openModal("auth-modal"));
function sendSmsCode() {
  if (!document.getElementById("user-phone").value) return showToast("Telefon raqamini kiriting");
  document.getElementById("auth-step-1").style.display = "none";
  document.getElementById("auth-step-2").style.display = "block";
}
function verifySmsCode() {
  if (document.getElementById("sms-code-input").value !== "1234") return showToast("Kod noto‘g‘ri (1234 kiriting)");
  const name = document.getElementById("user-fullname").value || "Aziz Mehmon";
  document.getElementById("auth-step-2").style.display = "none";
  document.getElementById("user-profile-view").style.display = "block";
  document.getElementById("profile-name").textContent = name;
  document.getElementById("auth-btn").textContent = "👤 " + name.split(" ")[0];
  showToast("Muvaffaqiyatli kirdingiz! +25 000 so‘m bonus");
}

// Wheel of Fortune
function spinWheel() {
  const prizes = ["Bepul Samarqand Novvotli Choy!", "10% Chegirma (CHOYXONA10)", "2 ta Issiq Tandir Somsa!", "20% Chegirma (NAVRUZ20)", "Bepul Achichuk Salati!", "25 000 so‘m Bonus!"];
  const extra = Math.floor(Math.random() * 360) + 1440;
  wheelAngle += extra;
  document.getElementById("lucky-wheel").style.transform = `rotate(${wheelAngle}deg)`;
  setTimeout(() => {
    const win = prizes[Math.floor(Math.random() * prizes.length)];
    document.getElementById("wheel-result").textContent = "🎉 Yutug‘ingiz: " + win;
    showToast("Tabriklaymiz: " + win);
  }, 3300);
}

// 360 Panorama Drag
const pano = document.getElementById("pano-viewer");
let isDragging = false, startX = 0, bgPosX = 50;
pano.addEventListener("mousedown", (e) => { isDragging = true; startX = e.clientX; });
window.addEventListener("mouseup", () => isDragging = false);
pano.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  bgPosX += (e.clientX - startX) * 0.15;
  startX = e.clientX;
  pano.style.backgroundPosition = `${bgPosX}% 50%`;
});

// QR Waiter, Gift Card & Admin
function callWaiter(action) {
  const table = document.getElementById("waiter-table").value;
  closeModal("waiter-modal");
  showToast(`🔔 ${table} uchun «${action}» so‘rovi ofitsiantga yuborildi!`);
}

function buyGiftCard() {
  const name = document.getElementById("gift-recipient").value || "Yaqin inson";
  const amount = +document.getElementById("gift-amount").value;
  addCombo(`Sovg‘a Sertifikati (${name})`, amount);
  closeModal("gift-modal");
}

function adminAddDish() {
  const title = document.getElementById("adm-title").value;
  const price = +document.getElementById("adm-price").value;
  const cat = document.getElementById("adm-cat").value;
  if (!title || !price) return showToast("Nom va narxni kiriting");
  MENU_ITEMS.unshift({
    id: Date.now(), title, cat, price, time: "15 daq", cal: 420, protein: 20, fat: 15, carbs: 45,
    veg: cat === "yengil", spicy: false,
    img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=700&q=80",
    desc: "Admin-panel orqali qo‘shilgan yangi maxsus taom."
  });
  renderMenu();
  closeModal("admin-modal");
  showToast(`✅ «${title}» menyuga qo‘shildi!`);
}

// AI Choyxonachi Chat
function toggleAiChat() {
  const box = document.getElementById("ai-chat-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
}
function sendAiMessage() {
  const input = document.getElementById("ai-input");
  const text = input.value.trim();
  if (!text) return;
  const msgs = document.getElementById("ai-messages");
  msgs.innerHTML += `<div class="ai-msg user">${text}</div>`;
  input.value = "";

  let reply = "Sizga mashhur Samarqand Zig‘ir Oshi va Novvotli Ko‘k choyni tavsiya qilaman!";
  if (text.toLowerCase().includes("yengil") || text.toLowerCase().includes("parhez")) {
    reply = "Yengil ovqatlanish uchun Gril sabzavotlari, Achichuk salati va Qatiqli chalop juda mos keladi.";
  } else if (text.includes("4") || text.toLowerCase().includes("oila")) {
    reply = "4 kishilik davra uchun «Do‘stlar Davrasi» kombo-seti (1 kg osh + 2 achichuk + choynak choy) eng zo‘r tanlov!";
  }
  setTimeout(() => {
    msgs.innerHTML += `<div class="ai-msg bot">${reply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 500);
}

// Helpers
function openModal(id) { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }
function openLightbox(src) {
  document.getElementById("detail-modal-body").innerHTML = `
    <div class="modal-head"><h3>Choyxona Galereyasi</h3><button onclick="closeModal('detail-modal')" class="icon-btn">✕</button></div>
    <img src="${src}" style="width:100%;border-radius:16px;" />
  `;
  openModal("detail-modal");
}
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}
