import { apiJson } from "../api.js";
export default async function bespoke(){
  const el=document.createElement("section");
  el.innerHTML=`<div class="grid gap-8 lg:grid-cols-[1fr_1fr] items-start">
    <form id="bespokeForm" class="card p-6">
      <div class="font-display uppercase tracking-[0.12em] text-lg">Submit a brief</div>
      <p class="mt-2 text-sm text-muted">We’ll respond with options, timelines and availability.</p>
      <div class="mt-5 grid gap-3">
        <input class="input" name="name" placeholder="Your name" required />
        <input class="input" name="email" type="email" placeholder="Email" required />
        <input class="input" name="preferred_marque" placeholder="Preferred marque (optional)" />
        <div class="grid gap-3 sm:grid-cols-2">
          <input class="input" name="budget" placeholder="Budget (optional)" />
          <input class="input" name="focus" placeholder="Focus (track / luxury / daily)" />
        </div>
        <textarea class="input min-h-[140px]" name="notes" placeholder="Notes (color, trim, spec, urgency)…"></textarea>
      </div>
      <div class="mt-5 flex gap-3"><button class="btn-primary" type="submit">Send</button><button class="btn-ghost" type="reset">Reset</button></div>
      <p id="bespokeMsg" class="mt-4 text-sm"></p>
    </form>
    <div class="card p-6">
      <div class="uppercase tracking-[0.18em] text-[11px] text-muted">How it works</div>
      <ol class="mt-4 space-y-3 text-sm text-white/80">
        <li><span class="text-muted">1.</span> Submit your brief and constraints.</li>
        <li><span class="text-muted">2.</span> We curate matching builds & availability.</li>
        <li><span class="text-muted">3.</span> You approve and we handle the rest.</li>
      </ol>
      <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">Tip: Start with a category + budget range — we’ll guide the spec.</div>
    </div></div>`;
  const form=el.querySelector("#bespokeForm"); const msg=el.querySelector("#bespokeMsg");
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    msg.textContent=""; msg.className="mt-4 text-sm text-muted";
    const data=Object.fromEntries(new FormData(form).entries());
    try{ await apiJson("/api/bespoke/",{method:"POST",body:JSON.stringify(data)});
      msg.textContent="Brief submitted. Our concierge will respond shortly."; msg.className="mt-4 text-sm text-green-400"; form.reset();
    }catch(err){ msg.textContent=err.message||"Failed to submit."; msg.className="mt-4 text-sm text-red-400"; }
  });
  return el;
}
