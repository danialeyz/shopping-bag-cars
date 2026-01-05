export default async function pageHeader(props){
  const el=document.createElement("section");
  el.className="mb-8";
  el.innerHTML=`<span class="pill">${props.eyebrow||"Page"}</span>
    <h1 class="mt-4 font-display text-[clamp(2.0rem,2.6vw,2.6rem)] uppercase tracking-[0.08em] leading-[1.05]">${props.title||""}</h1>
    <p class="mt-3 text-sm text-muted max-w-[680px]">${props.subtitle||""}</p>`;
  return el;
}
