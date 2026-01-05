import { loadPage } from "./spa.js";
export function initRouter(){
  window.addEventListener("popstate", ()=>loadPage(location.pathname));
  document.body.addEventListener("click",(e)=>{
    const a=e.target.closest("a[data-link]"); if(!a) return;
    const href=a.getAttribute("href"); if(!href || href.startsWith("http") || href.startsWith("mailto:")) return;
    e.preventDefault(); history.pushState({}, "", href); loadPage(location.pathname);
  });
}
