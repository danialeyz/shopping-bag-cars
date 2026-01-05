import { API_BASE } from "./config.js";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./state.js";

async function refreshAccessToken(){
  const refresh=getRefreshToken(); if(!refresh) return null;
  const res=await fetch(`${API_BASE}/api/auth/token/refresh/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh})});
  if(!res.ok){ clearTokens(); return null; }
  const data=await res.json(); setTokens({access:data.access}); return data.access;
}

export async function apiFetch(path, options={}){
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(options.headers||{});
  if(!headers.get("Content-Type") && options.body!==undefined) headers.set("Content-Type","application/json");
  const token=getAccessToken(); if(token) headers.set("Authorization",`Bearer ${token}`);
  let res=await fetch(url,{...options,headers});
  if(res.status===401 && getRefreshToken()){
    const newAccess=await refreshAccessToken();
    if(newAccess){ headers.set("Authorization",`Bearer ${newAccess}`); res=await fetch(url,{...options,headers}); }
  }
  return res;
}

export async function apiJson(path, options={}){
  const res=await apiFetch(path, options);
  const txt=await res.text();
  let data=null; try{ data = txt ? JSON.parse(txt) : null; }catch{}
  if(!res.ok) throw new Error(data?.detail || data?.message || `Request failed (${res.status})`);
  return data;
}
