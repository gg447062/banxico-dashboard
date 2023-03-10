const V_DATA_CACHE = 'V_DATA_CACHE';

export function checkSessionStorage() {
  const data = window.sessionStorage.getItem(V_DATA_CACHE);
  if (data) {
    return JSON.parse(data);
  } else {
    return false;
  }
}

export function setSessionStorage(data) {
  sessionStorage.setItem(V_DATA_CACHE, JSON.stringify(data));
}
