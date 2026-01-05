import { isAuthed } from "../state.js";
import { me } from "../auth.js";
import { apiJson } from "../api.js";

export default async function dashboard(){
  const el=document.createElement("section");
  if(!isAuthed()){
    el.innerHTML=`<div class="card p-6"><div class="font-display uppercase tracking-[0.12em] text-lg">Sign in required</div>
      <p class="mt-2 text-sm text-muted">Please sign in to view your dashboard.</p>
      <a class="btn-primary mt-5" href="/login" data-link>Sign in</a></div>`;
    return el;
  }
  const user=await me().catch(()=>null);
  const favs=await apiJson("/api/favorites/").catch(()=>[]);
  const cart=await apiJson("/api/cart/").catch(()=>[]);
  const totalQty=cart.reduce((s,i)=>s+i.quantity,0);
  const totalPrice=cart.reduce((s,i)=>s+i.quantity*i.car.price,0);
  el.innerHTML=`<div class="mb-8"><span class="pill">Dashboard</span>
    <h1 class="mt-4 font-display text-3xl uppercase tracking-[0.1em]">Welcome${user?`, ${user.username}`:""}.</h1>
    <p class="mt-3 text-sm text-muted">Your account summary, favourites and shortlist.</p></div>
    <div class="grid gap-6 md:grid-cols-3">
      <div class="card p-6"><div class="uppercase tracking-[0.18em] text-[11px] text-muted">Shortlist</div>
        <div class="mt-3 text-lg font-semibold">${totalQty?`${totalQty} item(s)`:"Empty"}</div>
        <div class="mt-1 text-sm text-white/80">${totalQty?`$${Number(totalPrice).toLocaleString()} est.`:"Add models from Collection."}</div>
        <a class="btn-ghost mt-4 w-full" href="/garage" data-link>Open garage</a></div>
      <div class="card p-6 md:col-span-2"><div class="uppercase tracking-[0.18em] text-[11px] text-muted">Saved models</div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          ${favs.length?favs.slice(0,6).map(f=>`<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="text-[10px] uppercase tracking-[0.18em] text-muted">${f.car.brand}</div>
            <div class="font-display uppercase tracking-[0.12em]">${f.car.name}</div>
            <div class="mt-2 text-sm text-white/80">$${Number(f.car.price).toLocaleString()} · ${f.car.category}</div></div>`).join(""):`<p class="text-sm text-muted">No favourites yet.</p>`}
        </div></div></div>`;
  return el;
}
