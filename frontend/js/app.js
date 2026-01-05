import { initRouter } from "./router.js";
import { loadPage } from "./spa.js";
import { renderHeader, renderFooter, renderBottomNav, mountCartDrawer, openCart, refreshCartBadge, mountCompareDrawer, openCompare, refreshCompareBadge } from "./layout.js";

async function boot(){
  await renderHeader();
  renderFooter();
  renderBottomNav();
  mountCartDrawer();
  mountCompareDrawer();
  refreshCompareBadge();

  document.addEventListener("click", (e)=>{
    if(e.target.closest("#compareBtn")) openCompare();
    if(e.target.closest("#cartBtn")) openCart();
  });

  initRouter();
  await loadPage(location.pathname);
  await refreshCartBadge();

  window.addEventListener("compare-changed", ()=>{ refreshCompareBadge(); });

  window.addEventListener("auth-changed", async ()=>{
    await renderHeader();
    renderBottomNav();
    await refreshCartBadge();
    refreshCompareBadge();
  });
  window.addEventListener("popstate", async ()=>{
    await renderHeader();
    renderBottomNav();
    await refreshCartBadge();
    refreshCompareBadge();
  });
}
boot().catch(console.error);
