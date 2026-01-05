import { login, register } from "../auth.js";
import { isAuthed } from "../state.js";

const emailOk=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||"").toLowerCase());

export default async function authBlock(props){
  const mode=props.mode||"login";
  if(isAuthed() && mode!=="signup"){
    history.replaceState({}, "", "/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
    return null;
  }

  const el=document.createElement("section");
  el.className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start";
  el.innerHTML=`<div>
    <span class="pill">Membership</span>
    <h1 class="mt-4 font-display text-3xl uppercase tracking-[0.1em]">${props.title || (mode==="signup"?"Create account":"Sign in")}</h1>
    <p class="mt-3 text-sm text-muted max-w-[520px]">${props.subtitle||""}</p>
    <div class="mt-8 card p-6">
      <form id="authForm" class="grid gap-3">
        <div><label class="text-[11px] uppercase tracking-[0.18em] text-muted">Username</label>
          <input class="input mt-2" name="username" autocomplete="username" required />
          <p class="mt-1 text-xs text-red-400 hidden" data-err="username"></p></div>
        ${mode==="signup"?`<div><label class="text-[11px] uppercase tracking-[0.18em] text-muted">Email</label>
          <input class="input mt-2" name="email" type="email" autocomplete="email" required />
          <p class="mt-1 text-xs text-red-400 hidden" data-err="email"></p></div>`:""}
        <div><label class="text-[11px] uppercase tracking-[0.18em] text-muted">Password</label>
          <div class="mt-2 flex gap-2">
            <input class="input flex-1" name="password" type="password" autocomplete="${mode==="signup"?"new-password":"current-password"}" minlength="6" required />
            <button class="btn-ghost px-4" type="button" id="togglePw">Show</button>
          </div>
          <p class="mt-1 text-xs text-muted">${mode==="signup"?"At least 6 characters.":""}</p>
          <p class="mt-1 text-xs text-red-400 hidden" data-err="password"></p></div>
        ${mode==="signup"?`<div><label class="text-[11px] uppercase tracking-[0.18em] text-muted">Confirm password</label>
          <input class="input mt-2" name="confirm" type="password" minlength="6" required />
          <p class="mt-1 text-xs text-red-400 hidden" data-err="confirm"></p></div>`:""}
        <button class="btn-primary mt-2 w-full" type="submit" id="authSubmit">${mode==="signup"?"Create account":"Sign in"}</button>
        <p id="authMsg" class="text-sm mt-2"></p>
        <div class="mt-2 text-xs text-muted">
          ${mode==="signup"?`Already a member? <a class="text-white hover:underline" href="/login" data-link>Sign in</a>`:`No account? <a class="text-white hover:underline" href="/signup" data-link>Create one</a>`}
        </div>
      </form>
    </div>
  </div>
  <div class="card p-6">
    <div class="uppercase tracking-[0.18em] text-[11px] text-muted">Why membership?</div>
    <div class="mt-4 space-y-4 text-sm text-white/80">
      <div><div class="font-display uppercase tracking-[0.12em]">Sync favourites</div><p class="mt-1 text-muted">Saved models follow you across devices.</p></div>
      <div><div class="font-display uppercase tracking-[0.12em]">Private shortlist</div><p class="mt-1 text-muted">Build a cart before requesting an offer.</p></div>
      <div><div class="font-display uppercase tracking-[0.12em]">Concierge workflow</div><p class="mt-1 text-muted">Track bespoke submissions and updates.</p></div>
    </div>
  </div>`;

  const form=el.querySelector("#authForm");
  const msg=el.querySelector("#authMsg");
  const submit=el.querySelector("#authSubmit");
  const toggle=el.querySelector("#togglePw");
  const pw=el.querySelector('input[name="password"]');
  toggle.addEventListener("click", ()=>{ pw.type=pw.type==="password"?"text":"password"; toggle.textContent=pw.type==="password"?"Show":"Hide"; });

  const setErr=(k,t)=>{ const p=el.querySelector(`[data-err="${k}"]`); if(!p) return; if(!t){p.classList.add("hidden"); p.textContent="";}else{p.classList.remove("hidden"); p.textContent=t;} };

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    msg.textContent=""; msg.className="text-sm mt-2 text-muted";
    ["username","email","password","confirm"].forEach(k=>setErr(k,""));
    const data=Object.fromEntries(new FormData(form).entries());

    if(!data.username || data.username.length<3) setErr("username","Username must be at least 3 characters.");
    if(mode==="signup" && !emailOk(data.email)) setErr("email","Please enter a valid email.");
    if(!data.password || data.password.length<6) setErr("password","Password must be at least 6 characters.");
    if(mode==="signup" && data.password!==data.confirm) setErr("confirm","Passwords do not match.");
    if([...el.querySelectorAll("[data-err]")].some(p=>!p.classList.contains("hidden"))) return;

    submit.disabled=true; submit.textContent=mode==="signup"?"Creating...":"Signing in...";
    try{
      if(mode==="signup") await register({username:data.username,email:data.email,password:data.password});
      await login({username:data.username,password:data.password});
      msg.textContent="Success. Redirecting..."; msg.className="text-sm mt-2 text-green-400";
      history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }catch(err){
      msg.textContent=err.message||"Authentication failed."; msg.className="text-sm mt-2 text-red-400";
    }finally{
      submit.disabled=false; submit.textContent=mode==="signup"?"Create account":"Sign in";
    }
  });

  return el;
}
