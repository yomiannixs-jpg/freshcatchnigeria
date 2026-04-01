const PRODUCT_STORAGE_KEY = "freshcatch-product-catalog";
const PRODUCT_TABLE = "product_price_lists";


function withImageFallback(product){
  const fallback = "./assets/hero-fish.png";
  const image = product && product.image ? product.image : fallback;
  return { ...product, image, fallback_image: product?.fallback_image || fallback };
}

const DEFAULT_PRODUCTS = [
  { id: 1, sku: "fish-titus-mackerel", name: "Titus (Mackerel)", price: 7800, unit: "kg", image: "./assets/fish-real/titus-mackerel.png", fallback_image: "./assets/fish-cards/titus-mackerel.svg", description: "Titus (Mackerel) for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 2, sku: "fish-barracuda", name: "Barracuda", price: 7500, unit: "kg", image: "./assets/fish-real/barracuda.png", fallback_image: "./assets/fish-cards/barracuda.svg", description: "Barracuda for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 3, sku: "fish-shining-nose", name: "Shining Nose Fish", price: 7500, unit: "kg", image: "./assets/fish-real/shining-nose-fish.png", fallback_image: "./assets/fish-cards/shining-nose-fish.svg", description: "Shining Nose Fish for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 4, sku: "fish-tilapia", name: "Tilapia", price: 6100, unit: "kg", image: "./assets/fish-real/tilapia.png", fallback_image: "./assets/fish-cards/tilapia.svg", description: "Tilapia for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 5, sku: "fish-catfish", name: "Catfish", price: 5460, unit: "kg", image: "./assets/fish-real/catfish.png", fallback_image: "./assets/fish-cards/catfish.svg", description: "Catfish for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 6, sku: "fish-croaker", name: "Croaker", price: 7800, unit: "kg", image: "./assets/fish-real/croaker.png", fallback_image: "./assets/fish-cards/croaker.svg", description: "Croaker for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 7, sku: "fish-yellow-croaker", name: "Yellow Croaker", price: 6000, unit: "kg", image: "./assets/fish-real/yellow-croaker.png", fallback_image: "./assets/fish-cards/yellow-croaker.svg", description: "Yellow Croaker for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 8, sku: "fish-grouper", name: "Grouper", price: 5850, unit: "kg", image: "./assets/fish-real/grouper.png", fallback_image: "./assets/fish-cards/grouper.svg", description: "Grouper for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 9, sku: "fish-snapper", name: "Snapper", price: 3515, unit: "kg", image: "./assets/fish-real/snapper.png", fallback_image: "./assets/fish-cards/snapper.svg", description: "Snapper for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 10, sku: "fish-sole", name: "Sole Fish", price: 6000, unit: "kg", image: "./assets/fish-real/sole-fish.png", fallback_image: "./assets/fish-cards/sole-fish.svg", description: "Sole Fish for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 11, sku: "fish-hake", name: "Hake Fish", price: 4200, unit: "kg", image: "./assets/fish-real/hake-fish.png", fallback_image: "./assets/fish-cards/hake-fish.svg", description: "Hake Fish for the Nigerian market. Price starts at ₦4,200 per kg and can go up to ₦5,390.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 4200, price_max_ngn: 5390 },
  { id: 12, sku: "fish-panla", name: "Panla", price: 4200, unit: "kg", image: "./assets/fish-real/panla.png", fallback_image: "./assets/fish-cards/panla.svg", description: "Panla for the Nigerian market. Price starts at ₦4,200 per kg and can go up to ₦5,300.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 4200, price_max_ngn: 5300 },
  { id: 13, sku: "fish-stockfish-panla", name: "Stockfish Panla", price: 35300, unit: "kg", image: "./assets/fish-real/stockfish-panla.png", fallback_image: "./assets/fish-cards/stockfish-panla.svg", description: "Stockfish Panla for the Nigerian market. Price starts at ₦35,300 per kg and can go up to ₦43,780.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 35300, price_max_ngn: 43780 },
  { id: 14, sku: "fish-kote", name: "Kote Fish", price: 6200, unit: "kg", image: "./assets/fish-real/kote-fish.png", fallback_image: "./assets/fish-cards/kote-fish.svg", description: "Kote Fish for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 15, sku: "fish-bonga-shawa", name: "Bonga (Shawa)", price: 3250, unit: "kg", image: "./assets/fish-real/bonga-fish.png", fallback_image: "./assets/fish-cards/bonga-shawa.svg", description: "Bonga (Shawa) for the Nigerian market. Price starts at ₦3,250 per kg and can go up to ₦3,625.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 3250, price_max_ngn: 3625 },
  { id: 16, sku: "fish-salmon", name: "Salmon", price: 38000, unit: "kg", image: "./assets/fish-real/salmon.png", fallback_image: "./assets/fish-cards/salmon.svg", description: "Salmon for the Nigerian market at kg pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 17, sku: "fish-tuna", name: "Tuna", price: 1975, unit: "tin", image: "./assets/fish-real/tuna.png", fallback_image: "./assets/fish-cards/tuna.svg", description: "Tuna for the Nigerian market. Price starts at ₦1,975 per tin 160g and can go up to ₦4,990.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 1975, price_max_ngn: 4990 },
  { id: 18, sku: "fish-sardine", name: "Sardine", price: 450, unit: "tin", image: "./assets/fish-real/sardine.png", fallback_image: "./assets/fish-cards/sardine.svg", description: "Sardine for the Nigerian market. Price starts at ₦450 and can go up to ₦9,165 depending on brand and size.", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 450, price_max_ngn: 9165 },
  { id: 19, sku: "fish-anchovies", name: "Anchovies", price: 8930, unit: "pack", image: "./assets/fish-real/anchovies.png", fallback_image: "./assets/fish-cards/anchovies.svg", description: "Anchovies for the Nigerian market at tin pack pricing.", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 20, sku: "seafood-prawns", name: "Prawns", price: 12000, unit: "kg", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80", description: "Premium prawns for soups, rice dishes, and grills.", category: "Seafood", market: "Nigeria", pricing_type: "fixed" },
  { id: 21, sku: "seafood-crabs", name: "Crabs", price: 10000, unit: "kg", image: "./assets/fish-real/crab.png", fallback_image: "./assets/fish-cards/sardine.svg", description: "Fresh crab for premium orders.", category: "Seafood", market: "Nigeria", pricing_type: "fixed" },
  { id: 22, sku: "service-cleaning-cutting", name: "Cleaning / Cutting", price: 500, unit: "service", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80", description: "Add-on service for order preparation.", category: "Service", market: "Nigeria", pricing_type: "fixed" }
];

function loadProductsFromLocal() {
  try {
    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS.map(p => ({...p}));
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return DEFAULT_PRODUCTS.map(p => ({...p}));
    const byKey = new Map(stored.map(item => [String(item.sku || item.id), item]));
    return DEFAULT_PRODUCTS.map(product => {
      const override = byKey.get(String(product.sku || product.id));
      return override ? { ...product, ...override, price: Number(override.price ?? override.price_ngn ?? product.price) } : { ...product };
    });
  } catch (err) {
    console.warn("Failed to load product catalog overrides", err);
    return DEFAULT_PRODUCTS.map(p => ({...p}));
  }
}

async function loadProductsFromSupabase() {
  const supa = getSupabase();
  if (!supa) return null;
  const { data, error } = await supa
    .from(PRODUCT_TABLE)
    .select("sku,name,unit,price_ngn,price_min_ngn,price_max_ngn,pricing_type,category,market,notes")
    .eq("market", "Nigeria");
  if (error) {
    console.warn("Failed to load product prices from Supabase", error);
    return null;
  }
  const bySku = new Map((data || []).map(item => [String(item.sku), item]));
  return DEFAULT_PRODUCTS.map(product => {
    const remote = bySku.get(String(product.sku));
    return remote ? {
      ...product,
      ...remote,
      price: Number(remote.price_ngn ?? product.price),
      unit: remote.unit || product.unit
    } : { ...product };
  });
}

async function refreshProducts() {
  const remote = await loadProductsFromSupabase();
  products = (remote || loadProductsFromLocal()).map(withImageFallback);
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  syncCartWithCurrentPrices();
  renderProducts();
  renderCart();
}

window.heroFallbackImage = "./assets/hero-fish.png";
let products = loadProductsFromLocal().map(withImageFallback);
const modalContent = {
  choose:{title:"Choose Your Seafood",intro:"Browse available products and select the right seafood for your meal or bulk order.",bullets:["Catfish, tilapia, croaker, titus, barracuda, shining nose, panla, stockfish, salmon, canned fish options, prawns, crabs, and add-on services are available.","Each product shows its Nigerian base price to make ordering simple.","You can add items one by one and build your cart before checkout.","Bulk orders can also start through WhatsApp for faster manual confirmation."]},
  review:{title:"Review Your Cart Before Checkout",intro:"Confirm your quantities, delivery fee, contact details, and total amount.",bullets:["Your cart updates dynamically as you add or remove items.","Delivery is currently set as a flat starter fee and can later be made location-based.","Fill in your name, phone number, and delivery address before checkout.","Reviewing your order first helps reduce fulfillment mistakes and delivery delays."]},
  pay:{title:"Choose How You Want to Pay",intro:"FreshCatch NG supports WhatsApp checkout now, with Paystack wired through Netlify Functions for secure initialization and verification.",bullets:["WhatsApp checkout sends your order summary directly for manual confirmation.","Paystack initializes transactions server-side and redirects to a secure checkout flow.","Verification is handled through a serverless function after the transaction reference returns.","Add your Paystack and Supabase keys before deployment."]},
  receive:{title:"Receive Fresh Seafood at Your Doorstep",intro:"After confirmation, FreshCatch NG prepares your order, coordinates delivery, and keeps your process simple.",bullets:["Orders are recorded in Supabase for real tracking.","Preparation may include cleaning, cutting, and packaging.","Delivery is arranged for your selected Lagos area.","The track order page lets customers check status by reference."]}
};

let cart = JSON.parse(localStorage.getItem("freshcatch-cart") || "[]");
const deliveryFee = 2000;
let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase || !window.APP_CONFIG) return null;
  const conf = window.APP_CONFIG;
  if (!conf.supabaseUrl || conf.supabaseUrl.includes("YOUR_PROJECT")) return null;
  if (!conf.supabaseAnonKey || conf.supabaseAnonKey.includes("YOUR_SUPABASE")) return null;
  supabaseClient = window.supabase.createClient(conf.supabaseUrl, conf.supabaseAnonKey);
  return supabaseClient;
}

function naira(v) {
  return new Intl.NumberFormat("en-NG", {style:"currency", currency:"NGN", maximumFractionDigits:0}).format(v);
}
function saveCart(){ localStorage.setItem("freshcatch-cart", JSON.stringify(cart)); }


async function notifyCustomerStatus(phone, message) {
  try {
    await fetch("/api/send-sms", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ phone, message })
    });
  } catch (e) {
    console.warn("SMS notification failed", e);
  }
}

async function createOrderViaApi(orderPayload) {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(orderPayload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not create order");
  await notifyCustomerStatus(orderPayload.phone, `FreshCatch NG: your order ${orderPayload.reference} has been received.`);
  await fetch("/api/update-inventory", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ items: orderPayload.items })
  }).catch(() => {});
  return data;
}
function syncCartWithCurrentPrices() {
  cart = cart.map(item => {
    const latest = products.find(p => p.id === item.id || p.sku === item.sku);
    return latest ? { ...item, sku: latest.sku, name: latest.name, price: Number(latest.price || item.price) } : item;
  });
  saveCart();
}

window.addEventListener("storage", (event) => {
  if (event.key === PRODUCT_STORAGE_KEY) {
    products = loadProductsFromLocal().map(withImageFallback);
    syncCartWithCurrentPrices();
    renderProducts();
    renderCart();
  }
});

async function initProductRealtime() {
  const supa = getSupabase();
  if (!supa) return;
  supa
    .channel("public:product_price_lists")
    .on("postgres_changes", { event: "*", schema: "public", table: PRODUCT_TABLE }, async () => {
      await refreshProducts();
    })
    .subscribe();
}


function initReveal() {
  const items = document.querySelectorAll(".fade-up");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries)=> {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); });
  }, {threshold:0.12});
  items.forEach(el => io.observe(el));
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="card product-card fade-up">
      <img src="${p.image || './assets/hero-fish.png'}" alt="${p.name}" onerror="this.onerror=null;this.src=(window.heroFallbackImage||'./assets/hero-fish.png')">
      <h3>${p.name}</h3>
      <p>${p.description || ''}</p>
      <div class="price">${naira(p.price)}${p.unit && p.unit !== "service" ? ` / ${p.unit}` : ""}</div>
      <div class="product-actions"><button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button></div>
    </div>
  `).join("");
  initReveal();
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty += 1;
  else {
    const p = products.find(x => x.id === id);
    cart.push({id:p.id, sku:p.sku, name:p.name, price:p.price, qty:1});
  }
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

function clearCart() { cart = []; saveCart(); renderCart(); }

function renderCart() {
  const list = document.getElementById("cartList");
  const empty = document.getElementById("emptyCart");
  if (!list || !empty) return;
  if (!cart.length) {
    empty.style.display = "block";
    list.innerHTML = "";
  } else {
    empty.style.display = "none";
    list.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div><strong>${item.name}</strong><br><span>${naira(item.price)}</span></div>
        <div class="qty">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }
  const zoneValue = document.getElementById("deliveryZone")?.value || "2000|Lagos Mainland";
  const delivery = cart.length ? Number(zoneValue.split("|")[0] || 0) : 0;
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  const total = subtotal + delivery;
  const subtotalEl = document.getElementById("subtotal");
  const deliveryEl = document.getElementById("delivery");
  const totalEl = document.getElementById("total");
  if (subtotalEl) subtotalEl.textContent = naira(subtotal);
  if (deliveryEl) deliveryEl.textContent = naira(delivery);
  if (totalEl) totalEl.textContent = naira(total);
}

function openModal(key) {
  const modal = document.getElementById("infoModal");
  const overlay = document.getElementById("modalOverlay");
  if (!modal || !overlay) return;
  const body = modal.querySelector(".modal-body");
  const content = modalContent[key];
  if (!body || !content) return;
  body.innerHTML = `
    <div class="badge">${content.title}</div>
    <h2>${content.title}</h2>
    <p class="muted">${content.intro}</p>
    <ul class="feature-list">${content.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px">
      <a class="btn btn-primary" href="#products" onclick="closeModal()">Continue</a>
      <a class="btn btn-outline" href="./track.html" onclick="animatePageLink(event, './track.html')">Track Order</a>
    </div>
  `;
  overlay.classList.add("open");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay")?.classList.remove("open");
  document.getElementById("infoModal")?.classList.remove("open");
  document.body.style.overflow = "";
}

function animatePageLink(event, href) {
  if (event) event.preventDefault();
  const el = document.getElementById("pageTransition");
  if (el) {
    el.classList.add("animate");
    setTimeout(() => { window.location.href = href; }, 420);
  } else {
    window.location.href = href;
  }
}

function getCheckoutData() {
  return {
    name: document.getElementById("customerName")?.value.trim() || "",
    phone: document.getElementById("customerPhone")?.value.trim() || "",
    address: document.getElementById("customerAddress")?.value.trim() || "",
    email: document.getElementById("customerEmail")?.value.trim() || "",
    paymentMethod: document.getElementById("paymentMethod")?.value || "whatsapp"
  };
}

async function createOrderRecord(reference, payload, status="pending") {
  const supa = getSupabase();
  if (!supa) return false;
  const record = {
    reference,
    customer_name: payload.name,
    customer_phone: payload.phone,
    customer_email: payload.email,
    delivery_address: payload.address,
    payment_method: payload.paymentMethod,
    amount_ngn: payload.total,
    items: payload.items,
    status
  };
  const { error } = await supa.from("orders").insert(record);
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

function whatsappMessage(order) {
  const lines = order.items.map(i => `- ${i.name} x${i.qty} (${naira(i.price * i.qty)})`).join("%0A");
  return `FreshCatch NG Order%0A%0ARef: ${encodeURIComponent(order.reference)}%0AName: ${encodeURIComponent(order.name)}%0APhone: ${encodeURIComponent(order.phone)}%0ADelivery Zone: ${encodeURIComponent(order.deliveryZone || "")}%0AAddress: ${encodeURIComponent(order.address)}%0A%0AItems:%0A${lines}%0A%0ADelivery: ${encodeURIComponent(naira(order.deliveryFee || 0))}%0ATotal: ${encodeURIComponent(naira(order.total))}%0A%0ATrack here:%0A${encodeURIComponent(window.location.origin + '/track.html?reference=' + order.reference)}`;
}


async function checkout() {
  if (!cart.length) { alert("Your cart is empty."); return; }
  const {name, phone, address, email, paymentMethod} = getCheckoutData();
  const zoneValue = document.getElementById("deliveryZone")?.value || "2000|Lagos Mainland";
  const zoneParts = zoneValue.split("|");
  const deliveryFeeValue = Number(zoneParts[0] || 0);
  const deliveryZone = zoneParts[1] || "Lagos Mainland";
  if (!name || !phone || !address) { alert("Please fill in your name, phone, and address."); return; }

  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  const total = subtotal + deliveryFeeValue;
  const reference = "FC-" + Date.now();
  const order = { reference, name, phone, address, email, paymentMethod, items: cart, subtotal, deliveryFee: deliveryFeeValue, deliveryZone, total };

  try {
    if (paymentMethod === "whatsapp") {
      await createOrderViaApi({ ...order, status: "confirmed", paymentStatus: "pending" });
      window.open(`https://wa.me/2348087156505?text=${whatsappMessage(order)}`, "_blank");
      window.location.href = `./payment-success.html?reference=${encodeURIComponent(reference)}&mode=whatsapp`;
      return;
    }

    if (!email) {
      alert("Please enter your email for Paystack payment receipt.");
      return;
    }

    await createOrderViaApi({ ...order, status: "payment-pending", paymentStatus: "pending" });

    const res = await fetch("/api/init-paystack", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        reference,
        email,
        amount: total,
        metadata: {name, phone, address, items: cart, paymentMethod: "paystack", deliveryZone, deliveryFee: deliveryFeeValue},
        callback_url: `${window.location.origin}/payment-success.html?reference=${encodeURIComponent(reference)}&mode=paystack`
      })
    });
    const data = await res.json();
    if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not initialize payment");
    window.location.href = data.authorization_url;
  } catch (err) {
    alert(err.message || "Checkout failed.");
  }
}

async function lookupOrder(reference) {
  const supa = getSupabase();
  if (!supa) return null;
  const { data, error } = await supa.from("orders").select("*").eq("reference", reference).limit(1).maybeSingle();
  if (error) return null;
  return data;
}

async function verifyOrderOnTrackPage() {
  const result = document.getElementById("trackResult");
  const refInput = document.getElementById("referenceInput");
  const trackBtn = document.getElementById("trackBtn");
  if (!result || !refInput || !trackBtn) return;

  const params = new URLSearchParams(window.location.search);
  const queryRef = params.get("reference");
  if (queryRef) refInput.value = queryRef;

  async function runLookup() {
    const reference = refInput.value.trim();
    if (!reference) {
      result.style.display = "block";
      result.innerHTML = "Enter an order reference.";
      return;
    }

    const dbOrder = await lookupOrder(reference);
    if (dbOrder) {
      result.style.display = "block";
      result.innerHTML = `
        <div class="status-pill">${dbOrder.status}</div><div class="timeline-mini">${["pending","confirmed","packed","assigned","out-for-delivery","delivered"].map(step => `<span class="timeline-step ${dbOrder.status===step ? "active" : ""}">${step}</span>`).join("")}</div>
        <p><strong>Reference:</strong> ${dbOrder.reference}</p>
        <p><strong>Customer:</strong> ${dbOrder.customer_name || ""}</p>
        <p><strong>Phone:</strong> ${dbOrder.customer_phone || ""}</p>
        <p><strong>Delivery Zone:</strong> ${dbOrder.delivery_zone || ""}</p>
        <p><strong>Amount:</strong> ${naira(dbOrder.amount_ngn || 0)}</p>
        <p><strong>Payment Status:</strong> ${dbOrder.payment_status || dbOrder.payment_method || ""}</p>
        <p><strong>Rider ID:</strong> ${dbOrder.rider_id || "Not assigned yet"}</p>
        <p><strong>Updated:</strong> ${dbOrder.updated_at || dbOrder.created_at || ""}</p>
      `;
      return;
    }

    try {
      const res = await fetch(`/api/verify-paystack?reference=${encodeURIComponent(reference)}`);
      const data = await res.json();
      if (res.ok && data.status) {
        result.style.display = "block";
        result.innerHTML = `
          <div class="status-pill">${data.data.status}</div>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Amount:</strong> ${naira((data.data.amount || 0) / 100)}</p>
          <p><strong>Paid at:</strong> ${data.data.paid_at || "Pending"}</p>
        `;
      } else {
        result.style.display = "block";
        result.innerHTML = `<p>No order found for reference <strong>${reference}</strong>.</p>`;
      }
    } catch (e) {
      result.style.display = "block";
      result.innerHTML = `<p>No order found for reference <strong>${reference}</strong>.</p>`;
    }
  }

  trackBtn.addEventListener("click", runLookup);
  if (queryRef) runLookup();
}

function initSeaAnimation() {
  const canvas = document.getElementById("seaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;

  let fishes = [], bubbles = [], crabs = [], jellies = [], starfishes = [], shrimps = [], turtles = [];

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width, h = rect.height;
    fishes = Array.from({ length: 12 }).map((_, i) => ({
      x: Math.random() * w, y: 40 + Math.random() * (h - 120),
      s: 0.55 + Math.random() * 1.2, speed: 0.4 + Math.random() * 1.1,
      dir: Math.random() > 0.5 ? 1 : -1, hue: [190,198,202,210,174,24][i % 6],
      wobble: Math.random() * Math.PI * 2
    }));
    bubbles = Array.from({ length: 34 }).map(() => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 1.5 + Math.random() * 4.5, speed: 0.5 + Math.random() * 1.4,
      alpha: 0.16 + Math.random() * 0.34
    }));
    crabs = Array.from({ length: 4 }).map((_, i) => ({
      x: 40 + i * (w / 4) + Math.random() * 30, y: h - 36 - Math.random() * 8,
      s: 0.8 + Math.random() * 0.6, dir: Math.random() > 0.5 ? 1 : -1, step: Math.random() * 6.28
    }));
    jellies = Array.from({ length: 3 }).map(() => ({
      x: 60 + Math.random() * (w - 120), y: 80 + Math.random() * (h * 0.45),
      s: 0.8 + Math.random() * 0.8, phase: Math.random() * 6.28
    }));
    starfishes = Array.from({ length: 5 }).map(() => ({
      x: 30 + Math.random() * (w - 60), y: h - 18 - Math.random() * 24,
      s: 0.5 + Math.random() * 0.7, rot: Math.random() * 6.28
    }));
    shrimps = Array.from({ length: 5 }).map(() => ({
      x: Math.random() * w, y: 100 + Math.random() * (h * 0.55),
      s: 0.45 + Math.random() * 0.45, speed: 0.5 + Math.random() * 0.6, dir: Math.random() > 0.5 ? 1 : -1, phase: Math.random() * 6.28
    }));
    turtles = Array.from({ length: 2 }).map(() => ({
      x: Math.random() * w, y: 90 + Math.random() * (h * 0.35),
      s: 0.8 + Math.random() * 0.5, speed: 0.18 + Math.random() * 0.18, dir: Math.random() > 0.5 ? 1 : -1, phase: Math.random() * 6.28
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  function drawFish(f, t) {
    const size = 24 * f.s;
    const tailSwing = Math.sin(t * 0.008 + f.wobble) * 8 * f.s;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.dir, 1);

    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#082f49";
    ctx.beginPath();
    ctx.ellipse(0, size * 0.45, size * 1.05, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const grad = ctx.createLinearGradient(-size, 0, size, 0);
    grad.addColorStop(0, `hsla(${f.hue}, 85%, 72%, 1)`);
    grad.addColorStop(0.55, `hsla(${f.hue + 8}, 90%, 58%, 1)`);
    grad.addColorStop(1, `hsla(${f.hue + 18}, 90%, 38%, 1)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-size * 1.05, 0);
    ctx.quadraticCurveTo(-size * 0.2, -size * 0.95, size * 0.95, 0);
    ctx.quadraticCurveTo(-size * 0.2, size * 0.95, -size * 1.05, 0);
    ctx.fill();

    ctx.fillStyle = `hsla(${f.hue + 14}, 90%, 34%, 1)`;
    ctx.beginPath();
    ctx.moveTo(-size * 1.05, 0);
    ctx.lineTo(-size * 1.6, -size * 0.55 + tailSwing * 0.08);
    ctx.lineTo(-size * 1.45, 0);
    ctx.lineTo(-size * 1.6, size * 0.55 - tailSwing * 0.08);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `hsla(${f.hue + 10}, 85%, 35%, .95)`;
    ctx.beginPath();
    ctx.moveTo(-size * 0.05, -size * 0.08);
    ctx.lineTo(size * 0.18, -size * 0.9);
    ctx.lineTo(size * 0.42, -size * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-size * 0.15, size * 0.12);
    ctx.lineTo(size * 0.12, size * 0.62);
    ctx.lineTo(size * 0.35, size * 0.12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(size * 0.58, -size * 0.1, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#082f49";
    ctx.beginPath();
    ctx.arc(size * 0.62, -size * 0.08, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCrab(c, t) {
    const x = c.x + Math.sin(t * 0.002 + c.step) * 10;
    const y = c.y + Math.sin(t * 0.003 + c.step) * 2;
    const s = 15 * c.s;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(c.dir, 1);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(i * 3, s * 0.2);
      ctx.lineTo(i * 7, s * 0.75);
      ctx.stroke();
    }
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, -2); ctx.lineTo(-s * 1.05, -s * 0.45);
    ctx.moveTo(s * 0.55, -2); ctx.lineTo(s * 1.05, -s * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-s * 1.1, -s * 0.5, s * 0.16, 0.2, 5.1);
    ctx.arc(s * 1.1, -s * 0.5, s * 0.16, -2.0, 2.9);
    ctx.stroke();
    ctx.restore();
  }

  function drawJelly(j, t) {
    const x = j.x + Math.sin(t * 0.001 + j.phase) * 18;
    const y = j.y + Math.sin(t * 0.002 + j.phase) * 10;
    const s = 18 * j.s;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(244, 114, 182, 0.45)";
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.quadraticCurveTo(0, -s * 1.4, s, 0);
    ctx.quadraticCurveTo(0, s * 0.5, -s, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(244, 114, 182, 0.55)";
    ctx.lineWidth = 1.4;
    for (let i = -3; i <= 3; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i * 3, s * 0.15);
      ctx.bezierCurveTo(i * 4, s * 0.7, i * 6, s * 1.2 + Math.sin(t * 0.01 + i) * 4, i * 2, s * 1.8);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStarfish(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    const r1 = 9 * s.s, r2 = 4 * s.s;
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i;
      const r = i % 2 === 0 ? r1 : r2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawShrimp(s, t) {
    const x = s.x, y = s.y + Math.sin(t * 0.004 + s.phase) * 6;
    const size = 12 * s.s;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s.dir, 1);
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0.3, 5.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.8, -size * 0.1);
    ctx.lineTo(size * 1.55, -size * 0.6);
    ctx.moveTo(size * 0.72, size * 0.1);
    ctx.lineTo(size * 1.45, size * 0.55);
    ctx.stroke();
    ctx.restore();
  }

  function drawTurtle(tu, t) {
    const x = tu.x, y = tu.y + Math.sin(t * 0.002 + tu.phase) * 8;
    const s = 20 * tu.s;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(tu.dir, 1);
    ctx.fillStyle = "#065f46";
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.15, s * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(s * 1.18, -2, s * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.55, -s * 0.72, s * 0.42, s * 0.18, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.55, s * 0.72, s * 0.42, s * 0.18, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.2, -s * 0.85, s * 0.35, s * 0.15, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.2, s * 0.85, s * 0.35, s * 0.15, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function animate(t) {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#7dd3fc");
    g.addColorStop(0.2, "#38bdf8");
    g.addColorStop(0.45, "#0ea5e9");
    g.addColorStop(0.75, "#0369a1");
    g.addColorStop(1, "#083344");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      const rx = (i + 1) * w / 6 + Math.sin(t * 0.0005 + i) * 30;
      ctx.moveTo(rx - 45, 0);
      ctx.lineTo(rx + 8, h * 0.58);
      ctx.lineTo(rx + 80, h * 0.58);
      ctx.lineTo(rx + 8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = 2;
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const y = 28 + j * 18 + Math.sin(x * 0.02 + t * 0.0012 + j) * 5;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (let i = 0; i < 9; i++) {
      const x = 26 + i * (w / 9) + Math.sin(t * 0.0007 + i) * 8;
      ctx.strokeStyle = i % 2 === 0 ? "rgba(16,185,129,.5)" : "rgba(45,212,191,.45)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.bezierCurveTo(x - 14, h - 40, x + 18, h - 95, x + Math.sin(t * 0.001 + i) * 10, h - 150);
      ctx.stroke();
    }

    for (let i = 0; i < 7; i++) {
      const x = 40 + i * (w / 7);
      ctx.strokeStyle = i % 2 === 0 ? "rgba(251,113,133,.55)" : "rgba(251,146,60,.55)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x, h - 28);
      ctx.moveTo(x, h - 20); ctx.lineTo(x - 12, h - 38);
      ctx.moveTo(x, h - 18); ctx.lineTo(x + 14, h - 40);
      ctx.stroke();
    }

    bubbles.forEach(b => {
      b.y -= b.speed;
      if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.strokeStyle = "#e0f2fe";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });

    starfishes.forEach(drawStarfish);

    fishes.forEach((f, idx) => {
      f.x += f.speed * f.dir;
      f.y += Math.sin(t * 0.0015 + f.wobble + idx) * 0.35;
      if (f.dir === 1 && f.x > w + 80) { f.x = -100; f.y = 50 + Math.random() * (h - 110); }
      if (f.dir === -1 && f.x < -100) { f.x = w + 80; f.y = 50 + Math.random() * (h - 110); }
      drawFish(f, t);
    });

    shrimps.forEach(s => {
      s.x += s.speed * s.dir;
      if (s.dir === 1 && s.x > w + 40) s.x = -50;
      if (s.dir === -1 && s.x < -50) s.x = w + 40;
      drawShrimp(s, t);
    });

    turtles.forEach(tu => {
      tu.x += tu.speed * tu.dir;
      if (tu.dir === 1 && tu.x > w + 70) tu.x = -90;
      if (tu.dir === -1 && tu.x < -90) tu.x = w + 70;
      drawTurtle(tu, t);
    });

    jellies.forEach(j => drawJelly(j, t));
    crabs.forEach(c => drawCrab(c, t));

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", async () => {
  syncCartWithCurrentPrices();
  renderProducts();
  renderCart();
  initReveal();
  verifyOrderOnTrackPage();
  document.getElementById("modalOverlay")?.addEventListener("click", closeModal);
  document.getElementById("deliveryZone")?.addEventListener("change", renderCart);
  initSeaAnimation();
  try {
    await refreshProducts();
    await initProductRealtime();
  } catch (err) {
    console.warn("Product refresh/init realtime failed", err);
  }
});
