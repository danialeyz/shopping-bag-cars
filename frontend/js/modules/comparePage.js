import { openCompare, renderCompareBody } from "../layout.js";

export default async function comparePage(){
  const el = document.createElement("section");
  el.innerHTML = `
    <div class="card p-6">
      <div class="font-display uppercase tracking-[0.12em] text-lg">Compare</div>
      <p class="mt-2 text-sm text-muted">Select up to four models from Collection, then compare specs side-by-side.</p>
      <button class="btn-primary mt-5" id="openCompareInline">Open compare drawer</button>
    </div>
    <div class="mt-6" id="compareInline"></div>
  `;
  el.querySelector("#openCompareInline").addEventListener("click", ()=>openCompare());
  await renderCompareBody();
  return el;
}
