import { apiJson } from "./api.js";
import { renderModules } from "./renderer.js";

export async function loadPage(pathname){
  const slug = pathname === "/" ? "home" : pathname.replace(/^\//,"");
  const main=document.getElementById("app-main");
  document.body.style.paddingBottom = window.matchMedia("(max-width: 768px)").matches ? "72px" : "0px";
  main.innerHTML=`<div class="animate-pulse"><div class="h-4 w-32 bg-white/10 rounded"></div>
    <div class="mt-4 h-24 bg-white/5 rounded-2xl"></div>
    <div class="mt-6 grid gap-4 md:grid-cols-3"><div class="h-40 bg-white/5 rounded-2xl"></div><div class="h-40 bg-white/5 rounded-2xl"></div><div class="h-40 bg-white/5 rounded-2xl"></div></div></div>`;
  const page=await apiJson(`/api/pages/${slug}/`);
  document.title = page.title ? `Danial Garage · ${page.title}` : "Danial Garage";
  await renderModules(page.modules);
}
