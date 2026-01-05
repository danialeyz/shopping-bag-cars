export default async function hero(props){
  const el=document.createElement("section");
  el.className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center mb-14";
  const img = props.image ? `style="background-image: linear-gradient(135deg, rgba(0,0,0,.55), rgba(11,9,3,.82)), url('./${props.image}');"` : "";
  el.innerHTML=`<div>
    <span class="pill">${props.eyebrow||"Private Collection"}</span>
    <h1 class="mt-5 font-display text-[clamp(2.4rem,3vw,3.1rem)] uppercase tracking-[0.06em] leading-[1.05]">${props.title||""}</h1>
    <p class="mt-4 text-sm text-muted max-w-[560px]">${props.subtitle||""}</p>
    <div class="mt-7 flex flex-wrap gap-3">
      ${props.primaryCta?`<a class="btn-primary" href="${props.primaryCta.to}" data-link>${props.primaryCta.label}</a>`:""}
      ${props.secondaryCta?`<a class="btn-ghost" href="${props.secondaryCta.to}" data-link>${props.secondaryCta.label}</a>`:""}
    </div></div>
    <div class="h-[300px] rounded-2xl border border-white/10 bg-cover bg-center shadow-glow" ${img}></div>`;
  return el;
}
