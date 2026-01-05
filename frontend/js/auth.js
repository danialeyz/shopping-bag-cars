import { apiJson } from "./api.js";
import { setTokens, clearTokens } from "./state.js";
export const register = ({username,email,password}) => apiJson("/api/auth/register/",{method:"POST",body:JSON.stringify({username,email,password})});
export async function login({username,password}){ const data=await apiJson("/api/auth/token/",{method:"POST",body:JSON.stringify({username,password})}); setTokens(data); window.dispatchEvent(new Event("auth-changed")); return data; }
export function logout(){ clearTokens(); window.dispatchEvent(new Event("auth-changed")); }
export const me = ()=> apiJson("/api/auth/me/");
