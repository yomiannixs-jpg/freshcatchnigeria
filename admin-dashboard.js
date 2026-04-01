const PRODUCT_STORAGE_KEY = "freshcatch-product-catalog";
const PRODUCT_TABLE = "product_price_lists";
const DEFAULT_PRODUCT_CATALOG = [
  { id: 1, sku: "fish-titus-mackerel", name: "Titus (Mackerel)", price: 7800, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 2, sku: "fish-barracuda", name: "Barracuda", price: 7500, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 3, sku: "fish-shining-nose", name: "Shining Nose Fish", price: 7500, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 4, sku: "fish-tilapia", name: "Tilapia", price: 6100, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 5, sku: "fish-catfish", name: "Catfish", price: 5460, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 6, sku: "fish-croaker", name: "Croaker", price: 7800, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 7, sku: "fish-yellow-croaker", name: "Yellow Croaker", price: 6000, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 8, sku: "fish-grouper", name: "Grouper", price: 5850, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 9, sku: "fish-snapper", name: "Snapper", price: 3515, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 10, sku: "fish-sole", name: "Sole Fish", price: 6000, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 11, sku: "fish-hake", name: "Hake Fish", price: 4200, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 4200, price_max_ngn: 5390 },
  { id: 12, sku: "fish-panla", name: "Panla", price: 4200, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 4200, price_max_ngn: 5300 },
  { id: 13, sku: "fish-stockfish-panla", name: "Stockfish Panla", price: 35300, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 35300, price_max_ngn: 43780 },
  { id: 14, sku: "fish-kote", name: "Kote Fish", price: 6200, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 15, sku: "fish-bonga-shawa", name: "Bonga (Shawa)", price: 3250, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 3250, price_max_ngn: 3625 },
  { id: 16, sku: "fish-salmon", name: "Salmon", price: 38000, unit: "kg", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 17, sku: "fish-tuna", name: "Tuna", price: 1975, unit: "tin", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 1975, price_max_ngn: 4990 },
  { id: 18, sku: "fish-sardine", name: "Sardine", price: 450, unit: "tin", category: "Fish", market: "Nigeria", pricing_type: "range", price_min_ngn: 450, price_max_ngn: 9165 },
  { id: 19, sku: "fish-anchovies", name: "Anchovies", price: 8930, unit: "pack", category: "Fish", market: "Nigeria", pricing_type: "fixed" },
  { id: 20, sku: "seafood-prawns", name: "Prawns", price: 12000, unit: "kg", category: "Seafood", market: "Nigeria", pricing_type: "fixed" },
  { id: 21, sku: "seafood-crabs", name: "Crabs", price: 10000, unit: "kg", category: "Seafood", market: "Nigeria", pricing_type: "fixed" },
  { id: 22, sku: "service-cleaning-cutting", name: "Cleaning / Cutting", price: 500, unit: "service", category: "Service", market: "Nigeria", pricing_type: "fixed" }
];
let editableProductCatalog = [];


const statusOptions = ["pending","pending-confirmation","payment-initialized","paid","processing","out-for-delivery","delivered","cancelled"];
let allOrders = [];
let allVendors = [];
let allRiders = [];
let allInventory = [];
let adminRealtimeChannel = null;
let riderMap = null;
let riderMarkers = {};

function adminNaira(v){
  return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(v || 0);
}
function toast(title, message, kind="info"){
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  el.innerHTML = `<strong>${title}</strong><div>${message}</div>`;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}


function copyTextValue(value, label = "Copied") {
  if (!value) return;
  navigator.clipboard.writeText(String(value)).then(() => {
    toast(label, String(value), "success");
  }).catch(() => {
    toast("Copy failed", "Please copy manually", "info");
  });
}

function openRiderPortalForId(id){
  if (!id) return;
  window.open(`./rider-portal.html?rider_id=${encodeURIComponent(id)}`, "_blank");
}

async function fetchJSON(url, options = {}){
  const token = await getAdminAccessToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

let adminSupabaseClient = null;
function getSupabase(){
  if (adminSupabaseClient) return adminSupabaseClient;
  if (!window.supabase || !window.APP_CONFIG) return null;
  const conf = window.APP_CONFIG;
  if (!conf.supabaseUrl || conf.supabaseUrl.includes("YOUR_PROJECT")) return null;
  if (!conf.supabaseAnonKey || conf.supabaseAnonKey.includes("YOUR_SUPABASE")) return null;
  adminSupabaseClient = window.supabase.createClient(conf.supabaseUrl, conf.supabaseAnonKey);
  return adminSupabaseClient;
}

async function fetchOrders(){ const data = await fetchJSON("/api/admin-orders"); allOrders = data.orders || []; renderOrders(); }
async function fetchVendors(){ const data = await fetchJSON("/api/admin-vendors"); allVendors = data.vendors || []; renderVendors(); populateVendorSelect(); }
async function fetchRiders(){ const data = await fetchJSON("/api/admin-riders"); allRiders = data.riders || []; renderRiders(); renderRiderMap(); }
async function fetchInventory(){ const data = await fetchJSON("/api/admin-inventory"); allInventory = data.inventory || []; renderInventory(); }

function renderOrders(){
  const q = (document.getElementById("searchBox")?.value || "").toLowerCase().trim();
  const filter = document.getElementById("statusFilter")?.value || "";
  const rows = allOrders.filter(o => {
    const matchQ = !q || (o.reference || "").toLowerCase().includes(q) || (o.customer_name || "").toLowerCase().includes(q);
    const matchF = !filter || o.status === filter;
    return matchQ && matchF;
  });

  document.getElementById("metricOrders").textContent = rows.length;
  document.getElementById("metricRevenue").textContent = adminNaira(rows.reduce((s,o)=>s + Number(o.amount_ngn || 0),0));
  document.getElementById("metricPaid").textContent = rows.filter(o => o.payment_status === "paid" || o.status === "delivered").length;
  document.getElementById("metricPending").textContent = rows.filter(o => ["pending","payment-pending","confirmed","assigned","out-for-delivery"].includes(o.status)).length;

  const body = document.getElementById("ordersBody");
  if (!body) return;
  body.innerHTML = rows.map(o => {
    const assignedRider = allRiders.find(r => r.id === o.rider_id);
    return `
    <tr>
      <td><strong>${o.reference || ""}</strong><br><span class="muted">${o.created_at || ""}</span></td>
      <td>${o.customer_name || ""}<br><span class="muted">${o.customer_phone || ""}</span><br><span class="muted">${o.delivery_zone || ""}</span></td>
      <td>${adminNaira(o.amount_ngn)}</td>
      <td><span class="pill">${o.status || "pending"}</span><br><span class="muted">Payment: ${o.payment_status || "pending"}</span></td>
      <td>${Array.isArray(o.items) ? o.items.map(i => `${i.name} x${i.qty}`).join("<br>") : ""}</td>
      <td>
        <div class="row-actions" style="margin-bottom:8px">
          <select onchange="assignRiderToOrder('${o.reference}', this.value)">
            <option value="">Assign rider</option>
            ${allRiders.map(r => `<option value="${r.id}" ${o.rider_id===r.id?'selected':''}>${r.name}</option>`).join("")}
          </select>
        </div>
        <div class="row-actions">
          <button class="mini" onclick="updateOrderMeta('${o.reference}', { status: 'confirmed' })">Confirm</button>
          <button class="mini" onclick="updateOrderMeta('${o.reference}', { status: 'packed' })">Packed</button>
          <button class="mini" onclick="updateOrderMeta('${o.reference}', { status: 'out-for-delivery' })">Dispatch</button>
          <button class="mini" onclick="updateOrderMeta('${o.reference}', { status: 'delivered' })">Delivered</button>
        </div>
        <div class="muted" style="margin-top:8px">Rider: ${assignedRider ? assignedRider.name + ' (' + (assignedRider.phone || '') + ')' : 'Not assigned'}</div>
      </td>
    </tr>`;
  }).join("");
}

function renderVendors(){
  const body = document.getElementById("vendorsBody");
  if (!body) return;
  body.innerHTML = allVendors.map(v => `
    <tr>
      <td><strong>${v.name || ""}</strong><br><span class="muted">${v.location || ""}</span></td>
      <td>${v.phone || ""}</td>
      <td><span class="tag">${v.specialty || ""}</span></td>
      <td><button class="mini" onclick="deleteVendor('${v.id}')">Delete</button></td>
    </tr>
  `).join("");
}
function renderRiders(){
  const body = document.getElementById("ridersBody");
  if (!body) return;
  body.innerHTML = allRiders.map(r => {
    const safeId = String(r.id || "").replace(/'/g, "\'");
    return `
    <tr>
      <td>
        <strong>${r.name || ""}</strong><br>
        <span class="muted">${r.bike || ""}</span><br>
        <span class="muted">ID: ${r.id || ""}</span>
      </td>
      <td>${r.phone || ""}</td>
      <td><span class="tag">${r.status || ""}</span></td>
      <td>${r.last_seen || ""}</td>
      <td>
        <div class="row-actions">
          <button class="mini" onclick="copyTextValue('${safeId}', 'Rider ID copied')">Copy ID</button>
          <button class="mini" onclick="openRiderPortalForId('${safeId}')">Open Portal</button>
          <button class="mini" onclick="deleteRider('${safeId}')">Delete</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}
function renderInventory(){
  const body = document.getElementById("inventoryBody");
  if (!body) return;
  body.innerHTML = allInventory.map(i => `
    <tr>
      <td><strong>${i.vendor_name || ""}</strong></td>
      <td>${i.product_name || ""}<br><span class="muted">${i.unit || ""}</span></td>
      <td>${i.quantity || 0}</td>
      <td>${adminNaira(i.unit_price || 0)}</td>
      <td><span class="tag">${i.stock_status || ""}</span></td>
      <td><button class="mini" onclick="deleteInventory('${i.id}')">Delete</button></td>
    </tr>
  `).join("");
}
function populateVendorSelect(){
  const select = document.getElementById("inventoryVendor");
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">Select vendor</option>' + allVendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
  if (current) select.value = current;
}
function renderRiderMap(){
  const mapEl = document.getElementById("riderMap");
  if (!mapEl || typeof L === "undefined") return;
  if (!riderMap) {
    riderMap = L.map("riderMap").setView([6.5244, 3.3792], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(riderMap);
  }
  Object.values(riderMarkers).forEach(m => riderMap.removeLayer(m));
  riderMarkers = {};
  const active = allRiders.filter(r => r.lat && r.lng);
  active.forEach(r => {
    const marker = L.marker([r.lat, r.lng]).addTo(riderMap).bindPopup(`<strong>${r.name || "Rider"}</strong><br>${r.status || ""}<br>${r.phone || ""}`);
    riderMarkers[r.id] = marker;
  });
  if (active.length) {
    const group = L.featureGroup(Object.values(riderMarkers));
    riderMap.fitBounds(group.getBounds().pad(0.2));
  }
}

async function updateStatus(reference, status){
  await fetchJSON("/api/admin-update-order", {
    method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ reference, status })
  });
  await fetchOrders();
  showAuthMessage(`Order ${reference} updated to ${status}.`, 'success');
  toast("Order updated", `${reference} → ${status}`, "success");
}
async function saveVendor(){
  const payload = {
    name: document.getElementById("vendorName")?.value.trim(),
    phone: document.getElementById("vendorPhone")?.value.trim(),
    email: document.getElementById("vendorEmail")?.value.trim(),
    location: document.getElementById("vendorLocation")?.value.trim(),
    specialty: document.getElementById("vendorSpecialty")?.value.trim()
  };
  await fetchJSON("/api/admin-vendors", {
    method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
  });
  toast("Vendor saved", payload.name || "Vendor", "success");
  await fetchVendors();
}
async function saveRider(){
  const payload = {
    name: document.getElementById("riderName")?.value.trim(),
    phone: document.getElementById("riderPhone")?.value.trim(),
    bike: document.getElementById("riderBike")?.value.trim(),
    status: document.getElementById("riderStatus")?.value || "available"
  };
  await fetchJSON("/api/admin-riders", {
    method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
  });
  toast("Rider saved", payload.name || "Rider", "success");
  await fetchRiders();
}
async function saveInventory(){
  const payload = {
    vendor_id: document.getElementById("inventoryVendor")?.value || "",
    product_name: document.getElementById("inventoryProduct")?.value.trim(),
    quantity: Number(document.getElementById("inventoryQty")?.value || 0),
    unit: document.getElementById("inventoryUnit")?.value.trim(),
    unit_price: Number(document.getElementById("inventoryPrice")?.value || 0),
    stock_status: document.getElementById("inventoryStatus")?.value || "in-stock"
  };
  await fetchJSON("/api/admin-inventory", {
    method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
  });
  toast("Inventory saved", payload.product_name || "Inventory", "success");
  await fetchInventory();
}
async function deleteVendor(id){ await fetchJSON("/api/admin-vendors", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id }) }); await fetchVendors(); }
async function deleteRider(id){ await fetchJSON("/api/admin-riders", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id }) }); await fetchRiders(); }
async function deleteInventory(id){ await fetchJSON("/api/admin-inventory", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id }) }); await fetchInventory(); }

function initRealtime(){
  const supa = getAdminSupabase?.();
  if (!supa) return;
  if (adminRealtimeChannel) { try { supa.removeChannel(adminRealtimeChannel); } catch(e){} }
  adminRealtimeChannel = supa.channel("admin-live-all")
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async (payload) => {
      const ref = payload.new?.reference || payload.old?.reference || "Order";
      toast("Orders live", ref, payload.eventType === "INSERT" ? "info" : "success");
      try { await fetchOrders(); } catch (e) {}
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, async () => {
      toast("Vendors live", "Vendor list updated", "info");
      try { await fetchVendors(); } catch (e) {}
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "riders" }, async () => {
      toast("Riders live", "Rider list updated", "info");
      try { await fetchRiders(); } catch (e) {}
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, async () => {
      toast("Inventory live", "Inventory updated", "info");
      try { await fetchInventory(); } catch (e) {}
    })
    .subscribe();
}

function assignRiderToOrder(reference, riderId){
  return updateOrderMeta(reference, { rider_id: riderId, status: riderId ? "assigned" : "confirmed" });
}
async function updateOrderMeta(reference, payload){
  const token = await getAdminAccessToken();
  const res = await fetch("/api/admin-update-order", {
    method: "POST",
    headers: {"Content-Type":"application/json", ...(token ? {"Authorization": `Bearer ${token}`} : {})},
    body: JSON.stringify({ reference, ...payload })
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || "Update failed");
  await Promise.allSettled([fetchOrders(), fetchRiders()]);
  toast("Order updated", reference, "success");
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('ordersBody')) return;
  await requireAdminAuth();

  document.getElementById("refreshBtn")?.addEventListener("click", async () => {
    await Promise.allSettled([fetchOrders(), fetchVendors(), fetchRiders(), fetchInventory()]);
  });
  document.getElementById("searchBox")?.addEventListener("input", renderOrders);
  document.getElementById("statusFilter")?.addEventListener("change", renderOrders);
  document.getElementById("saveVendorBtn")?.addEventListener("click", saveVendor);
  document.getElementById("saveRiderBtn")?.addEventListener("click", saveRider);
  document.getElementById("saveInventoryBtn")?.addEventListener("click", saveInventory);
  document.getElementById("savePricesBtn")?.addEventListener("click", saveProductPrices);
  document.getElementById("resetPricesBtn")?.addEventListener("click", resetProductPrices);
  document.getElementById("exportPricesBtn")?.addEventListener("click", exportProductPrices);
  document.getElementById("priceSearch")?.addEventListener("input", renderPriceManager);

  document.querySelectorAll(".nav a[data-panel]").forEach(a => {
    a.addEventListener("click", (e)=>{
      e.preventDefault();
      document.querySelectorAll(".nav a[data-panel]").forEach(x=>x.classList.remove("active"));
      a.classList.add("active");
      document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
      document.getElementById(a.dataset.panel).classList.add("active");
      if (a.dataset.panel === "ridersPanel") setTimeout(renderRiderMap, 200);
    });
  });

  try {
    await Promise.allSettled([fetchOrders(), fetchVendors(), fetchRiders(), fetchInventory(), hydrateProductCatalog()]);
    renderPriceManager();
    initRealtime();
    initProductRealtime();
  } catch (err) {
    document.getElementById("ordersBody").innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
    showAuthMessage(err.message, 'error');
  }
});

function mergeProductCatalog(overrides = []){
  const byKey = new Map(overrides.map(item => [String(item.sku || item.id), item]));
  return DEFAULT_PRODUCT_CATALOG.map(item => {
    const override = byKey.get(String(item.sku || item.id));
    return { ...item, ...(override || {}), price: Number((override || {}).price ?? (override || {}).price_ngn ?? item.price) };
  });
}

function loadProductCatalog(){
  try {
    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCT_CATALOG.map(item => ({...item}));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PRODUCT_CATALOG.map(item => ({...item}));
    return mergeProductCatalog(parsed);
  } catch (err) {
    console.warn('Could not read stored product catalog', err);
    return DEFAULT_PRODUCT_CATALOG.map(item => ({...item}));
  }
}

async function hydrateProductCatalog(){
  const supa = getSupabase();
  if (!supa) {
    editableProductCatalog = loadProductCatalog();
    return editableProductCatalog;
  }
  const { data, error } = await supa
    .from(PRODUCT_TABLE)
    .select('sku,name,unit,price_ngn,price_min_ngn,price_max_ngn,pricing_type,category,market,notes')
    .eq('market', 'Nigeria');
  if (error) {
    console.warn('Could not load product prices from Supabase', error);
    editableProductCatalog = loadProductCatalog();
    return editableProductCatalog;
  }
  editableProductCatalog = mergeProductCatalog(data || []);
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(editableProductCatalog));
  return editableProductCatalog;
}

function renderPriceManager(){
  const body = document.getElementById('pricesBody');
  if (!body) return;
  const q = (document.getElementById('priceSearch')?.value || '').trim().toLowerCase();
  const rows = editableProductCatalog.filter(item => !q || item.name.toLowerCase().includes(q));
  body.innerHTML = rows.map(item => `
    <tr>
      <td><strong>${item.name}</strong><br><span class="muted">${item.sku}</span></td>
      <td>${item.unit || ''}</td>
      <td><input type="number" min="0" step="1" class="price-input" data-product-id="${item.id}" value="${Number(item.price || 0)}" /></td>
      <td><span class="tag">${item.pricing_type || 'fixed'}</span></td>
    </tr>
  `).join('');
}

async function saveProductPrices(){
  const latest = editableProductCatalog.length ? editableProductCatalog.map(item => ({...item})) : loadProductCatalog();
  const map = new Map(latest.map(item => [Number(item.id), item]));
  document.querySelectorAll('#pricesBody input[data-product-id]').forEach(input => {
    const id = Number(input.dataset.productId);
    const product = map.get(id);
    if (!product) return;
    const nextPrice = Number(input.value || 0);
    product.price = Number.isFinite(nextPrice) ? nextPrice : product.price;
    product.price_ngn = product.price;
  });
  const payload = Array.from(map.values());
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(payload));
  editableProductCatalog = payload;

  const supa = getSupabase();
  if (supa) {
    const rows = payload.map(item => ({
      sku: item.sku,
      name: item.name,
      category: item.category || 'Fish',
      market: item.market || 'Nigeria',
      unit: item.unit,
      price_ngn: Number(item.price || 0),
      price_min_ngn: item.price_min_ngn ?? Number(item.price || 0),
      price_max_ngn: item.price_max_ngn ?? Number(item.price || 0),
      pricing_type: item.pricing_type || 'fixed',
      notes: item.notes || ''
    }));
    const { error } = await supa.from(PRODUCT_TABLE).upsert(rows, { onConflict: 'sku' });
    if (error) {
      toast('Supabase sync failed', error.message, 'error');
      showAuthMessage('Prices saved locally, but Supabase sync failed.', 'error');
      renderPriceManager();
      return;
    }
    toast('Prices saved', 'Storefront prices synced to Supabase.', 'success');
    showAuthMessage('Product prices saved to Supabase and will sync across devices.', 'success');
  } else {
    toast('Prices saved', 'Storefront prices updated in admin storage.', 'success');
    showAuthMessage('Product prices saved locally. Add Supabase keys to sync across devices.', 'success');
  }
  renderPriceManager();
}

async function resetProductPrices(){
  editableProductCatalog = DEFAULT_PRODUCT_CATALOG.map(item => ({...item}));
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(editableProductCatalog));
  const supa = getSupabase();
  if (supa) {
    const rows = editableProductCatalog.map(item => ({
      sku: item.sku,
      name: item.name,
      category: item.category || 'Fish',
      market: item.market || 'Nigeria',
      unit: item.unit,
      price_ngn: Number(item.price || 0),
      price_min_ngn: item.price_min_ngn ?? Number(item.price || 0),
      price_max_ngn: item.price_max_ngn ?? Number(item.price || 0),
      pricing_type: item.pricing_type || 'fixed',
      notes: item.notes || ''
    }));
    const { error } = await supa.from(PRODUCT_TABLE).upsert(rows, { onConflict: 'sku' });
    if (error) {
      toast('Reset partially saved', error.message, 'error');
      showAuthMessage('Default prices restored locally, but Supabase sync failed.', 'error');
      renderPriceManager();
      return;
    }
  }
  renderPriceManager();
  toast('Prices reset', 'Default prices restored.', 'info');
  showAuthMessage('Default product prices restored.', 'success');
}

function initProductRealtime(){
  const supa = getSupabase();
  if (!supa) return;
  supa
    .channel('public:product_price_lists:admin')
    .on('postgres_changes', { event: '*', schema: 'public', table: PRODUCT_TABLE }, async () => {
      await hydrateProductCatalog();
      renderPriceManager();
    })
    .subscribe();
}

function exportProductPrices(){
  const payload = loadProductCatalog();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'freshcatch-product-prices.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
