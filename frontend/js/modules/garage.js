import { apiJson } from "../api.js";
import { isAuthed } from "../state.js";

export default async function garage(){
  const el=document.createElement("section");
  if(!isAuthed()){
    el.innerHTML=`<div class="card p-6"><div class="font-display uppercase tracking-[0.12em] text-lg">Sign in required</div>
      <p class="mt-2 text-sm text-muted">Your garage is private. Sign in to view favourites and shortlist.</p>
      <a class="btn-primary mt-5" href="/login" data-link>Sign in</a></div>`;
    return el;
  }
  const [favs, cart]=await Promise.all([apiJson("/api/favorites/").catch(()=>[]), apiJson("/api/cart/").catch(()=>[])]);
  const totalQty=cart.reduce((s,i)=>s+i.quantity,0);
  const totalPrice=cart.reduce((s,i)=>s+i.quantity*i.car.price,0);
  el.innerHTML=`<div class="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
    <div class="card p-6"><div class="uppercase tracking-[0.18em] text-[11px] text-muted">Shortlist</div>
      <div class="mt-3 text-sm text-white/80">${totalQty?`${totalQty} item(s) · $${Number(totalPrice).toLocaleString()}`:"Your shortlist cart is empty."}</div>
      <p class="mt-2 text-xs text-muted">Add models from Collection. Quantities sync to your account.</p></div>
    <div class="card p-6"><div class="uppercase tracking-[0.18em] text-[11px] text-muted">Saved models</div>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        ${favs.length?favs.map(f=>`<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${f.car.brand}</div>
          <div class="font-display uppercase tracking-[0.12em]">${f.car.name}</div>
          <div class="mt-2 text-sm text-white/80">$${Number(f.car.price).toLocaleString()} · ${f.car.category}</div>
        </div>`).join(""):`<p class="text-sm text-muted">No favourites yet. Go to Collection and tap ♥.</p>`}
      </div></div></div>`;
  return el;
}
