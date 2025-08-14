export const isDeepProductUrl = (urlStr) => {
  try {
    const u = new URL(urlStr);
    const p = (u.pathname || "").toLowerCase();
    if (!p || p === "/" || p.length < 2) return false;
    const tokens = ["product", "products", "item", "items", "part", "parts", "sku", "dp", "p-", "pid", "catalog", "store", "buy", "shop"];
    const hasToken = tokens.some((t) => p.includes(t));
    return hasToken || (u.search && u.search.length > 1);
  } catch {
    return false;
  }
};

export const labelForUrl = (urlStr) => {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./, "");
    const segs = u.pathname.split("/").filter(Boolean);
    const last = decodeURIComponent((segs[segs.length - 1] || host)).replace(/[-_]+/g, " ");
    const base = last || host;
    return base.length > 60 ? base.slice(0, 57) + "…" : base;
  } catch {
    return urlStr;
  }
};

export const normalizeRecommended = (list) => {
  if (!Array.isArray(list)) return [];
  const items = list
    .map((it) => {
      if (typeof it === "string") return { label: labelForUrl(it), url: it };
      if (it && typeof it === "object") {
        const url = it.url || it.link || "";
        if (!url) return null;
        const label = it.title || it.name || labelForUrl(url);
        return { label, url };
      }
      return null;
    })
    .filter(Boolean);

  // keep only deep links; if none, fall back to whatever we have
  const deep = items.filter((x) => isDeepProductUrl(x.url));
  const unique = (arr) => {
    const seen = new Set();
    return arr.filter(({ url }) => (seen.has(url) ? false : (seen.add(url), true)));
  };

  const finalList = unique(deep.length ? deep : items).slice(0, 8);
  return finalList;
};