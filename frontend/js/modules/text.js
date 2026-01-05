export default async function textBlock(props){
  const el=document.createElement("section");
  el.className="card p-6 mb-6";
  el.innerHTML=`<p class="text-sm text-white/80 leading-relaxed">${props.content||""}</p>`;
  return el;
}
