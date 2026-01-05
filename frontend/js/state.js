const ACCESS_KEY="dg_access"; const REFRESH_KEY="dg_refresh";
export const getAccessToken=()=>localStorage.getItem(ACCESS_KEY);
export const getRefreshToken=()=>localStorage.getItem(REFRESH_KEY);
export function setTokens({access,refresh}){ if(access) localStorage.setItem(ACCESS_KEY,access); if(refresh) localStorage.setItem(REFRESH_KEY,refresh); }
export function clearTokens(){ localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); }
export const isAuthed=()=>!!getAccessToken();
