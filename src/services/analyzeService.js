// src/services/analyzeService.js
const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const API_PREFIX = "/requests";

/** Read JWT (if any) and build auth header */
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Fetch with timeout and improved error surfaces */
async function fetchWithTimeout(url, options = {}, timeoutMs = 60_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`HTTP ${res.status} ${res.statusText} - ${text || "Request failed"}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
  } finally {
    clearTimeout(id);
  }
}

/**
 * Upload image Files to persistent storage.
 * Returns: { urls: string[] }
 */
export async function uploadImages(files = []) {
  if (!files || files.length === 0) return { urls: [] };

  const form = new FormData();
  for (const f of files) form.append("images", f);

  const url = `${BASE_URL}${API_PREFIX}/uploads/images`;
  return fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        ...authHeader(), // Bearer token
      },
      body: form, // let browser set multipart boundary
      // If using cookie-based auth, also set: credentials: "include"
    },
    60_000
  );
}

/**
 * Analyze with optional images.
 * - If `files` provided, they’re uploaded first to get public URLs.
 * - Then calls /requests/analyze with JSON { userText, imageUrls }.
 *
 * @param {Object} params
 * @param {string} params.userText
 * @param {string[]} [params.imageUrls]
 * @param {File[]} [params.files]
 * @returns {Promise<{ result: any, imageUrls: string[] }>}
 */
export async function analyzeRequest({ userText = "", imageUrls = [], files = [] } = {}) {
  let uploaded = [];
  if (files && files.length) {
    const up = await uploadImages(files);
    uploaded = Array.isArray(up?.urls) ? up.urls : [];
  }
  const allUrls = [...(imageUrls || []), ...uploaded];

  const url = `${BASE_URL}${API_PREFIX}/analyze1`;
  return fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(), // Bearer token
      },
      body: JSON.stringify({ userText, imageUrls: allUrls }),
      // If using cookie-based auth, also set: credentials: "include"
    },
    60_000
  );
}