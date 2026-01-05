import { apiJson, apiFetch } from "../api.js";
import { isAuthed } from "../state.js";
import { openCart, refreshCartBadge, refreshCompareBadge, openCompare } from "../layout.js";
import { toggleCompareId, getCompareIds } from "../compareState.js";

function card(c, favSet, cmpSet){
  const fav = favSet.has(c.id);
  const cmp = cmpSet.has(c.id);
  return `
    <article class="card overflow-hidden group" data-open="${c.id}">
      <div class="relative">
        <img class="w-full h-52 object-cover" src="./${c.image}" alt="${c.brand} ${c.name}" />
        <div class="absolute top-3 left-3 pill">${c.category}</div>
        <div class="absolute top-3 right-3 flex gap-2">
          <button data-fav="${c.id}" class="w-10 h-10 rounded-full border border-white/15 bg-black/40 hover:bg-black/60 transition flex items-center justify-center text-lg" aria-label="Favorite">
            ${fav ? "♥" : "♡"}
          </button>
          <button data-compare="${c.id}" class="w-10 h-10 rounded-full border border-white/15 bg-black/40 hover:bg-black/60 transition flex items-center justify-center text-lg" aria-label="Compare">
            ${cmp ? "≋" : "≡"}
          </button>
        </div>
        <div class="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition">
          <button data-open="${c.id}" class="w-full rounded-xl border border-white/15 bg-black/40 hover:bg-black/60 py-2 text-xs uppercase tracking-[0.18em] text-white">Quick view</button>
        </div>
      </div>
      <div class="p-5">
        <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${c.brand}</div>
        <div class="mt-1 font-display uppercase tracking-[0.12em]">${c.name}</div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="pill">${c.power || "—"}</span>
          <span class="pill">0–100 · ${c.zero_to_hundred || "—"}</span>
        </div>
        <div class="mt-5 flex items-end justify-between gap-4">
          <div>
            <div class="text-[10px] uppercase tracking-[0.18em] text-muted">from</div>
            <div class="text-lg font-semibold">$${Number(c.price).toLocaleString()}</div>
          </div>
          <div class="flex gap-2">
            <button data-compare="${c.id}" class="btn-ghost px-4">${cmp ? "Compared" : "Compare"}</button>
            <button data-add="${c.id}" class="btn-primary">Add</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function ensureModal(){
  if (document.getElementById("dgModal")) return;
  const m = document.createElement("div");
  m.id = "dgModal";
  m.className = "fixed inset-0 z-[70] hidden";
  m.innerHTML = `
    <div id="dgModalBackdrop" class="absolute inset-0 bg-black/70"></div>
    <div class="absolute inset-x-0 top-10 mx-auto w-[calc(100%-2rem)] max-w-[820px] card overflow-hidden">
      <div class="p-5 flex items-center justify-between border-b border-white/10">
        <div class="font-display uppercase tracking-[0.12em]" id="dgModalTitle">Details</div>
        <button id="dgModalClose" class="btn-ghost">Close</button>
      </div>
      <div id="dgModalBody" class="p-5"></div>
    </div>
  `;
  document.body.appendChild(m);
  const close = ()=> m.classList.add("hidden");
  m.querySelector("#dgModalClose").addEventListener("click", close);
  m.querySelector("#dgModalBackdrop").addEventListener("click", close);
}

function openModal(car, favSet, cmpSet){
  ensureModal();
  const m = document.getElementById("dgModal");
  const title = m.querySelector("#dgModalTitle");
  const body = m.querySelector("#dgModalBody");
  title.textContent = `${car.brand} ${car.name}`;
  const fav = favSet.has(car.id);
  const cmp = cmpSet.has(car.id);

  body.innerHTML = `
    <div class="grid gap-6 md:grid-cols-[1fr_1fr]">
      <img class="w-full h-64 object-cover rounded-2xl border border-white/10" src="./${car.image}" alt="" />
      <div>
        <div class="pill">${car.category}</div>
        <div class="mt-4 text-sm text-white/80">${car.description || "A curated model from our private inventory."}</div>
        <div class="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div class="pill">Power · ${car.power || "—"}</div>
          <div class="pill">0–100 · ${car.zero_to_hundred || "—"}</div>
          <div class="pill">Drive · ${car.drivetrain || "—"}</div>
          <div class="pill">Seats · ${car.seats || "—"}</div>
          <div class="pill">Origin · ${car.origin || "—"}</div>
          <div class="pill">Price · $${Number(car.price).toLocaleString()}</div>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <button class="btn-ghost" data-modal-fav="${car.id}">${fav ? "Unfavorite" : "Favorite"}</button>
          <button class="btn-ghost" data-modal-compare="${car.id}">${cmp ? "Remove compare" : "Compare"}</button>
          <button class="btn-primary" data-modal-add="${car.id}">Add to cart</button>
        </div>
      </div>
    </div>
  `;
  m.classList.remove("hidden");
}

export default async function inventory(props){
  const el = document.createElement("section");
  el.innerHTML = `
    <div class="flex items-end justify-between gap-6 mb-6">
      <div>
        <h2 class="font-display uppercase tracking-[0.12em] text-xl">${props.title || "Inventory"}</h2>
        <p class="mt-2 text-sm text-muted">${props.subtitle || ""}</p>
      </div>
      <div class="hidden md:flex gap-2">
        ${props.showFilters ? `
          <input id="invSearch" class="input !py-2 !text-[13px] w-64" placeholder="Search…" />
          <select id="invCategory" class="input !py-2 !text-[13px] w-44">
            <option value="all">All</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Coupe</option>
            <option>Hypercar</option>
          </select>
        ` : ""}
      </div>
    </div>
    <div id="invGrid" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
    <div class="mt-10 text-center text-sm text-muted" id="invEmpty" style="display:none;">No models match your filter.</div>
  `;

  const grid = el.querySelector("#invGrid");
  const empty = el.querySelector("#invEmpty");

  const cars = await apiJson(props.endpoint || "/api/cars/");

  // favorites
  let favSet = new Set();
  if (isAuthed()){
    try{
      const favs = await apiJson("/api/favorites/");
      favSet = new Set(favs.map(f => f.car.id));
    }catch{}
  }

  // compare
  let cmpSet = new Set(getCompareIds());

  function render(list){
    cmpSet = new Set(getCompareIds());
    grid.innerHTML = list.map(c => card(c, favSet, cmpSet)).join("");
    empty.style.display = list.length ? "none" : "block";
  }

  const search = el.querySelector("#invSearch");
  const cat = el.querySelector("#invCategory");
  function applyFilters(){
    let list = cars.slice();
    const q = (search?.value || "").trim().toLowerCase();
    const cv = cat?.value || "all";
    if (q) list = list.filter(c => (c.name + c.brand).toLowerCase().includes(q));
    if (cv !== "all") list = list.filter(c => c.category === cv);
    render(list);
  }
  search?.addEventListener("input", applyFilters);
  cat?.addEventListener("change", applyFilters);
  applyFilters();

  el.addEventListener("click", async (e) => {
    const openBtn = e.target.closest("[data-open]");
    const favBtn = e.target.closest("[data-fav]");
    const cmpBtn = e.target.closest("[data-compare]");
    const addBtn = e.target.closest("[data-add]");

    const modalFav = e.target.closest("[data-modal-fav]");
    const modalCmp = e.target.closest("[data-modal-compare]");
    const modalAdd = e.target.closest("[data-modal-add]");

    // Quick view
    if (openBtn && !favBtn && !cmpBtn && !addBtn){
      const id = Number(openBtn.getAttribute("data-open"));
      const car = cars.find(c => c.id === id);
      if (car) openModal(car, favSet, new Set(getCompareIds()));
      return;
    }

    // modal actions
    if (modalFav || modalCmp || modalAdd){
      const id = Number((modalFav||modalCmp||modalAdd).getAttribute(modalFav ? "data-modal-fav" : modalCmp ? "data-modal-compare" : "data-modal-add"));
      const car = cars.find(c => c.id === id);
      if (!car) return;

      if (modalFav){
        if (!isAuthed()){
          history.pushState({}, "", "/login");
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }
        if (favSet.has(id)){
          await apiFetch(`/api/favorites/${id}/`, { method:"DELETE" });
          favSet.delete(id);
        }else{
          await apiFetch(`/api/favorites/`, { method:"POST", body: JSON.stringify({ car_id:id }) });
          favSet.add(id);
        }
        applyFilters();
        openModal(car, favSet, new Set(getCompareIds()));
        return;
      }

      if (modalCmp){
        const ids = toggleCompareId(id);
        refreshCompareBadge();
        applyFilters();
        openModal(car, favSet, new Set(ids));
        if (ids.length >= 2) openCompare();
        return;
      }

      if (modalAdd){
        if (!isAuthed()){
          history.pushState({}, "", "/login");
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }
        await apiFetch(`/api/cart/`, { method:"POST", body: JSON.stringify({ car_id:id, quantity:1 }) });
        await refreshCartBadge();
        await openCart();
        return;
      }
    }

    // card favorite
    if (favBtn){
      const id = Number(favBtn.getAttribute("data-fav"));
      if (!isAuthed()){
        history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }
      if (favSet.has(id)){
        await apiFetch(`/api/favorites/${id}/`, { method:"DELETE" });
        favSet.delete(id);
      }else{
        await apiFetch(`/api/favorites/`, { method:"POST", body: JSON.stringify({ car_id:id }) });
        favSet.add(id);
      }
      applyFilters();
      return;
    }

    // card compare
    if (cmpBtn){
      const id = Number(cmpBtn.getAttribute("data-compare"));
      const ids = toggleCompareId(id);
      refreshCompareBadge();
      applyFilters();
      if (ids.length >= 2) openCompare();
      return;
    }

    // card add
    if (addBtn){
      const id = Number(addBtn.getAttribute("data-add"));
      if (!isAuthed()){
        history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }
      await apiFetch(`/api/cart/`, { method:"POST", body: JSON.stringify({ car_id:id, quantity:1 }) });
      await refreshCartBadge();
      await openCart();
      return;
    }
  });

  // keep UI synced if compare changes elsewhere
  window.addEventListener("compare-changed", ()=>applyFilters());

  return el;
}
