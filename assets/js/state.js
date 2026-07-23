/* PACKME 2026 — selection state
   Everything lives in localStorage + URL query params. Nothing is ever sent to a server. */

window.PackmeState = (function () {
  const STORAGE_KEY = "packme2026.selection";
  const PARAM_KEY = "d";

  function emptySelection() {
    return {
      archetype: null,
      state: null,
      taste: null,
      belonging: null,
      habit: null,
      tone: null,
      captionSeed: 0
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptySelection();
      const parsed = JSON.parse(raw);
      return Object.assign(emptySelection(), parsed);
    } catch (e) {
      return emptySelection();
    }
  }

  function save(selection) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch (e) {
      /* localStorage unavailable — selection still works in-memory for this session */
    }
  }

  function clear() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // --- URL param encode/decode (client-side only, no server round trip) ---
  function encodeToParam(selection) {
    const json = JSON.stringify(selection);
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodeFromParam(param) {
    try {
      let b64 = param.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const json = new TextDecoder().decode(bytes);
      return Object.assign(emptySelection(), JSON.parse(json));
    } catch (e) {
      return null;
    }
  }

  function buildShareUrl(selection, path) {
    const url = new URL(path || "shared.html", window.location.href);
    url.searchParams.set(PARAM_KEY, encodeToParam(selection));
    return url.toString();
  }

  function readFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(PARAM_KEY);
    if (!raw) return null;
    return decodeFromParam(raw);
  }

  function isComplete(selection) {
    return !!(selection.archetype && selection.state && selection.taste &&
      selection.belonging && selection.habit && selection.tone);
  }

  // Deterministic "밈력 지수" (meme score) 0-100 derived only from the selections —
  // same picks always render the same score, no randomness, no server round trip.
  function memeScore(selection) {
    const key = [selection.archetype, selection.state, selection.taste,
      selection.belonging, selection.habit, selection.tone, selection.captionSeed].join("|");
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }
    return 60 + (Math.abs(hash) % 41); // 60~100 range, always feels "good enough to share"
  }

  return {
    PARAM_KEY,
    emptySelection,
    load,
    save,
    clear,
    encodeToParam,
    decodeFromParam,
    buildShareUrl,
    readFromLocation,
    isComplete,
    memeScore
  };
})();
