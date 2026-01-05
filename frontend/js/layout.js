import { isAuthed } from "./state.js";
import { me, logout } from "./auth.js";
import { apiJson } from "./api.js";
import { getCompareIds, setCompareIds, clearCompare } from "./compareState.js";

const navLink = (to,label)=>`<a href="${to}" data-link class="nav-link">${label}</a>`;

export async function renderHeader(){
  const el = document.getElementById("app-header");
  let right = `<a class="btn-ghost" href="/login" data-link>Sign in</a>`;
  if (isAuthed()){
    try{
      const user = await me();
      right = `<a class="btn-ghost" href="/dashboard" data-link>${user.username}</a>
               <button class="btn-ghost" id="logoutBtn">Logout</button>`;
    }catch{}
  }

  el.innerHTML = `
    <div class="container">
      <nav class="grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-4">
        <a href="/" data-link class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center font-display text-xs tracking-[0.2em]">DG</span>
          <span class="font-display uppercase tracking-[0.18em] text-[13px] sm:text-[14px]">Danial Garage</span>
        </a>

        <div class="hidden md:flex justify-center gap-7">
          ${navLink("/", "Collection")}
          ${navLink("/garage", "My Garage")}
          ${navLink("/compare", "Compare")}
          ${navLink("/bespoke", "Bespoke")}
          ${navLink("/about", "About")}
        </div>

        <div class="flex items-center justify-end gap-3">
          <button id="compareBtn" class="relative inline-flex h-10 w-[92px] items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition" aria-label="Open compare">
            <span class="text-xs tracking-[0.18em] uppercase text-muted">Compare</span>
            <span id="compareQty" class="absolute -top-2 -right-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-[#0b0b10]">0</span>
          </button>

          <button id="cartBtn" class="relative inline-flex h-10 w-[72px] items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition" aria-label="Open cart">
            <span class="text-xs tracking-[0.18em] uppercase text-muted">Cart</span>
            <span id="cartQty" class="absolute -top-2 -right-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-[#0b0b10]">0</span>
          </button>

          ${right}
        </div>
      </nav>
    </div>
  `;

  const lb = document.getElementById("logoutBtn");
  if (lb) lb.addEventListener("click", ()=>logout());
  refreshCompareBadge();
}

export function renderFooter(){
  document.getElementById("app-footer").innerHTML = `
    <div class="container py-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <div class="font-display uppercase tracking-[0.18em]">Danial Garage</div>
          <p class="mt-3 text-sm text-muted">Curated luxury performance. Concierge workflow. Private membership.</p>
        </div>

        <div class="text-sm">
          <div class="uppercase tracking-[0.18em] text-muted text-[11px]">Navigate</div>
          <div class="mt-3 flex flex-col gap-2">
            <a class="text-white/80 hover:text-white" href="/" data-link>Collection</a>
            <a class="text-white/80 hover:text-white" href="/garage" data-link>My Garage</a>
            <a class="text-white/80 hover:text-white" href="/compare" data-link>Compare</a>
            <a class="text-white/80 hover:text-white" href="/bespoke" data-link>Bespoke</a>
            <a class="text-white/80 hover:text-white" href="/about" data-link>About</a>
          </div>
        </div>

        <div class="text-sm">
          <div class="uppercase tracking-[0.18em] text-muted text-[11px]">Contact</div>
          <div class="mt-3 text-white/80">Bremen 28759, Germany</div>
          <div class="text-white/80">Danialeyvaziiii@gmail.com</div>
        </div>
      </div>

      <div class="mt-10 border-t border-white/10 pt-6 text-xs text-muted">© ${new Date().getFullYear()} Danial Garage</div>
    </div>
  `;
}

export function renderBottomNav(){
  const el = document.getElementById("app-bottom-nav");
  el.innerHTML = `
    <div class="container py-2">
      <div class="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-muted">
        <a href="/" data-link class="py-3 rounded-xl hover:bg-white/5">Home</a>
        <a href="/garage" data-link class="py-3 rounded-xl hover:bg-white/5">Garage</a>
        <a href="/compare" data-link class="py-3 rounded-xl hover:bg-white/5">Compare</a>
        <a href="${isAuthed()?"/dashboard":"/login"}" data-link class="py-3 rounded-xl hover:bg-white/5">${isAuthed()?"Account":"Sign in"}</a>
      </div>
    </div>
  `;
}

// ---------- Cart drawer ----------
export function mountCartDrawer(){
  if (document.getElementById("cartDrawer")) return;
  const drawer = document.createElement("div");
  drawer.id = "cartDrawer";
  drawer.className = "fixed inset-0 z-[60] hidden";
  drawer.innerHTML = `
    <div id="cartBackdrop" class="absolute inset-0 bg-black/60"></div>
    <aside class="absolute right-0 top-0 h-full w-full max-w-[440px] bg-[#07070d] border-l border-white/10 p-5 overflow-y-auto">
      <div class="flex items-center justify-between">
        <div class="font-display uppercase tracking-[0.18em]">Shortlist</div>
        <button id="cartClose" class="btn-ghost">Close</button>
      </div>

      <div id="cartBody" class="mt-5"></div>

      <div class="mt-6 flex justify-between border-t border-white/10 pt-4 text-sm">
        <span class="text-muted">Estimated total</span>
        <strong id="cartTotal">$0</strong>
      </div>

      <a id="cartCheckout" class="btn-primary w-full mt-4" href="/checkout" data-link>Checkout</a>
      <button id="cartClear" class="btn-ghost w-full mt-3">Clear cart</button>
    </aside>
  `;
  document.body.appendChild(drawer);

  const close = ()=> drawer.classList.add("hidden");
  drawer.querySelector("#cartClose").addEventListener("click", close);
  drawer.querySelector("#cartBackdrop").addEventListener("click", close);
}

export async function refreshCartBadge(){
  const badge = document.getElementById("cartQty");
  if (!badge) return;
  try{
    const items = await apiJson("/api/cart/");
    badge.textContent = String(items.reduce((s,i)=>s+i.quantity,0));
  }catch{
    badge.textContent = "0";
  }
}

export async function openCart(){
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;
  drawer.classList.remove("hidden");

  const body = drawer.querySelector("#cartBody");
  const totalEl = drawer.querySelector("#cartTotal");
  const checkoutBtn = drawer.querySelector("#cartCheckout");

  try{
    const items = await apiJson("/api/cart/");
    if (!items.length){
      body.innerHTML = `<p class="text-sm text-muted">Your shortlist is empty. Add models from the collection.</p>`;
      totalEl.textContent = "$0";
      checkoutBtn.classList.add("opacity-40","pointer-events-none");
      await refreshCartBadge();
      return;
    }
    checkoutBtn.classList.remove("opacity-40","pointer-events-none");

    let total = 0;
    body.innerHTML = items.map(it=>{
      total += it.quantity * it.car.price;
      return `
        <div class="flex gap-3 py-3 border-b border-white/10">
          <img class="w-16 h-16 rounded-xl object-cover border border-white/10" src="./${it.car.image}" alt=""/>
          <div class="flex-1">
            <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${it.car.brand}</div>
            <div class="font-display uppercase tracking-[0.12em]">${it.car.name}</div>
            <div class="mt-1 text-sm text-white/80">$${Number(it.car.price).toLocaleString()} · qty ${it.quantity}</div>
          </div>
        </div>
      `;
    }).join("");
    totalEl.textContent = `$${Number(total).toLocaleString()}`;

    drawer.querySelector("#cartClear").onclick = async ()=>{
      await apiJson("/api/cart/", { method:"DELETE" });
      await openCart();
    };

    await refreshCartBadge();
  }catch{
    body.innerHTML = `<p class="text-sm text-muted">Please sign in to use your shortlist.</p>
      <a class="btn-primary mt-4 w-full" href="/login" data-link>Sign in</a>`;
    totalEl.textContent = "$0";
    checkoutBtn.classList.add("opacity-40","pointer-events-none");
  }
}

// ---------- Compare drawer ----------
export function mountCompareDrawer(){
  if (document.getElementById("compareDrawer")) return;
  const d = document.createElement("div");
  d.id = "compareDrawer";
  d.className = "fixed inset-0 z-[60] hidden";
  d.innerHTML = `
    <div id="compareBackdrop" class="absolute inset-0 bg-black/60"></div>
    <aside class="absolute left-0 top-0 h-full w-full max-w-[980px] bg-[#07070d] border-r border-white/10 p-5 overflow-y-auto">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="font-display uppercase tracking-[0.18em]">Compare</div>
          <div class="text-xs text-muted mt-1">Select up to 4 models from Collection.</div>
        </div>
        <div class="flex gap-2">
          <button id="compareClear" class="btn-ghost">Clear</button>
          <button id="compareClose" class="btn-ghost">Close</button>
        </div>
      </div>

      <div id="compareBody" class="mt-6"></div>
    </aside>
  `;
  document.body.appendChild(d);

  const close = ()=> d.classList.add("hidden");
  d.querySelector("#compareClose").addEventListener("click", close);
  d.querySelector("#compareBackdrop").addEventListener("click", close);
  d.querySelector("#compareClear").addEventListener("click", ()=>{ clearCompare(); renderCompareBody(); refreshCompareBadge(); });
}

export function refreshCompareBadge(){
  const badge = document.getElementById("compareQty");
  if (!badge) return;
  badge.textContent = String(getCompareIds().length);
}

export async function renderCompareBody(){
  const d = document.getElementById("compareDrawer");
  const body = d ? d.querySelector("#compareBody") : document.getElementById("compareInline");
  if (!body) return;

  const ids = getCompareIds();
  if (!ids.length){
    body.innerHTML = `
      <div class="card p-6">
        <div class="text-sm text-muted">No models selected yet.</div>
        <a class="btn-primary mt-4" href="/" data-link>Go to collection</a>
      </div>
    `;
    return;
  }

  const cars = await apiJson("/api/cars/");
  const selected = ids.map(id => cars.find(c => c.id === id)).filter(Boolean);

  if (!selected.length){
    body.innerHTML = `<div class="card p-6"><p class="text-sm text-muted">Selection not found. Please reselect from Collection.</p></div>`;
    return;
  }

  const rows = [
    ["Price", c => `$${Number(c.price).toLocaleString()}`],
    ["Power", c => c.power || "—"],
    ["0–100", c => c.zero_to_hundred || "—"],
    ["Drivetrain", c => c.drivetrain || "—"],
    ["Seats", c => c.seats || "—"],
    ["Origin", c => c.origin || "—"],
    ["Category", c => c.category || "—"],
  ];

  body.innerHTML = `
    <div class="overflow-x-auto card">
      <table class="w-full min-w-[760px] text-sm">
        <thead>
          <tr class="border-b border-white/10">
            <th class="p-4 text-left text-xs uppercase tracking-[0.18em] text-muted w-[160px]">Spec</th>
            ${selected.map(c=>`
              <th class="p-4 text-left">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${c.brand}</div>
                    <div class="font-display uppercase tracking-[0.12em] truncate">${c.name}</div>
                  </div>
                  <button class="btn-ghost px-3 py-1.5" data-remove-compare="${c.id}">Remove</button>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(([label, fn])=>`
            <tr class="border-b border-white/10">
              <td class="p-4 text-xs uppercase tracking-[0.18em] text-muted">${label}</td>
              ${selected.map(c=>`<td class="p-4 text-white/85">${fn(c)}</td>`).join("")}
            </tr>
          `).join("")}
          <tr>
            <td class="p-4 text-xs uppercase tracking-[0.18em] text-muted">Actions</td>
            ${selected.map(c=>`
              <td class="p-4">
                <div class="flex flex-wrap gap-2">
                  <a class="btn-ghost px-4" href="/" data-link>Back</a>
                  <a class="btn-primary px-4" href="/checkout" data-link>Checkout</a>
                </div>
              </td>
            `).join("")}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  body.addEventListener("click", (e)=>{
    const rm = e.target.closest("[data-remove-compare]");
    if (!rm) return;
    const id = Number(rm.getAttribute("data-remove-compare"));
    const next = getCompareIds().filter(x=>x!==id);
    setCompareIds(next);
    refreshCompareBadge();
    renderCompareBody();
  }, { once: true });
}

export async function openCompare(){
  const d = document.getElementById("compareDrawer");
  if (!d) return;
  d.classList.remove("hidden");
  await renderCompareBody();
}
