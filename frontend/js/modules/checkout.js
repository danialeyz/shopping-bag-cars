import { isAuthed } from "../state.js";
import { apiJson } from "../api.js";
import { refreshCartBadge } from "../layout.js";

export default async function checkout(){
  const el = document.createElement("section");
  if(!isAuthed()){
    el.innerHTML = `
      <div class="card p-6">
        <div class="font-display uppercase tracking-[0.12em] text-lg">Sign in required</div>
        <p class="mt-2 text-sm text-muted">Checkout is available to members only.</p>
        <a class="btn-primary mt-5" href="/login" data-link>Sign in</a>
      </div>
    `;
    return el;
  }

  el.innerHTML = `
    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
      <form id="checkoutForm" class="card p-6">
        <div class="font-display uppercase tracking-[0.12em] text-lg">Checkout</div>
        <p class="mt-2 text-sm text-muted">Confirm details and submit your request.</p>

        <div class="mt-5 grid gap-3">
          <input class="input" name="full_name" placeholder="Full name" required />
          <input class="input" name="email" type="email" placeholder="Email" required />
          <input class="input" name="phone" placeholder="Phone (optional)" />
          <textarea class="input min-h-[120px]" name="address" placeholder="Address / delivery notes" required></textarea>
        </div>

        <button class="btn-primary mt-5 w-full" type="submit" id="checkoutSubmit">Submit order</button>
        <p id="checkoutMsg" class="mt-3 text-sm"></p>
      </form>

      <aside class="card p-6">
        <div class="uppercase tracking-[0.18em] text-[11px] text-muted">Order summary</div>
        <div id="summaryBody" class="mt-4"></div>
        <div class="mt-5 flex justify-between border-t border-white/10 pt-4 text-sm">
          <span class="text-muted">Estimated total</span>
          <strong id="summaryTotal">$0</strong>
        </div>
      </aside>
    </div>
  `;

  const summaryBody = el.querySelector("#summaryBody");
  const totalEl = el.querySelector("#summaryTotal");
  const msg = el.querySelector("#checkoutMsg");
  const submit = el.querySelector("#checkoutSubmit");

  async function loadSummary(){
    const items = await apiJson("/api/cart/");
    if(!items.length){
      summaryBody.innerHTML = `<p class="text-sm text-muted">Your cart is empty. Add models from Collection.</p>
        <a class="btn-ghost mt-4 w-full" href="/" data-link>Go to collection</a>`;
      totalEl.textContent = "$0";
      return { items: [], total: 0 };
    }
    let total = 0;
    summaryBody.innerHTML = items.map(it => {
      total += it.quantity * it.car.price;
      return `
        <div class="flex items-center justify-between gap-3 py-3 border-b border-white/10">
          <div class="min-w-0">
            <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${it.car.brand}</div>
            <div class="font-display uppercase tracking-[0.12em] truncate">${it.car.name}</div>
            <div class="text-xs text-white/70">qty ${it.quantity}</div>
          </div>
          <div class="text-sm">$${Number(it.car.price * it.quantity).toLocaleString()}</div>
        </div>
      `;
    }).join("");
    totalEl.textContent = `$${Number(total).toLocaleString()}`;
    return { items, total };
  }

  let snapshot = await loadSummary();

  el.querySelector("#checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "mt-3 text-sm text-muted";
    if(!snapshot.items.length){
      msg.textContent = "Your cart is empty.";
      msg.className = "mt-3 text-sm text-red-400";
      return;
    }

    const data = Object.fromEntries(new FormData(e.target).entries());
    submit.disabled = true;
    submit.textContent = "Submitting...";

    try{
      const res = await apiJson("/api/checkout/", { method:"POST", body: JSON.stringify(data) });
      msg.textContent = `Order submitted. Reference: #${res.order_id}`;
      msg.className = "mt-3 text-sm text-green-400";
      await refreshCartBadge();
      history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }catch(err){
      msg.textContent = err.message || "Checkout failed.";
      msg.className = "mt-3 text-sm text-red-400";
    }finally{
      submit.disabled = false;
      submit.textContent = "Submit order";
    }
  });

  return el;
}
