import hero from "./modules/hero.js";
import inventory from "./modules/inventory.js";
import pageHeader from "./modules/pageHeader.js";
import garage from "./modules/garage.js";
import bespoke from "./modules/bespoke.js";
import textBlock from "./modules/text.js";
import authBlock from "./modules/auth.js";
import dashboard from "./modules/dashboard.js";
import comparePage from "./modules/comparePage.js";
import checkout from "./modules/checkout.js";

const registry={ hero, inventory, pageHeader, garage, bespoke, text: textBlock, auth: authBlock, dashboard, compare: comparePage, checkout };

export async function renderModules(modules){
  const main=document.getElementById("app-main");
  main.innerHTML="";
  for(const m of modules){
    const fn=registry[m.type]; if(!fn) continue;
    const node=await fn(m.props||{});
    if(node) main.appendChild(node);
  }
}
