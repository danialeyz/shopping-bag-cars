const KEY = "dg_compare_ids";

export function getCompareIds(){
  try{
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(Number).filter(n=>Number.isFinite(n)) : [];
  }catch{ return []; }
}

export function setCompareIds(ids){
  const uniq = Array.from(new Set(ids.map(Number).filter(n=>Number.isFinite(n)))).slice(0,4);
  localStorage.setItem(KEY, JSON.stringify(uniq));
  window.dispatchEvent(new Event("compare-changed"));
  return uniq;
}

export function toggleCompareId(id){
  id = Number(id);
  const ids = getCompareIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx,1);
  else ids.push(id);
  return setCompareIds(ids);
}

export function clearCompare(){
  localStorage.setItem(KEY, JSON.stringify([]));
  window.dispatchEvent(new Event("compare-changed"));
}
