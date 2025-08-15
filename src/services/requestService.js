// src/services/requestService.js
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/requests`;

/* ----------------------- helpers ----------------------- */
function authHeader() {
  const token = localStorage.getItem("token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res) {
  const text = await res.text(); // read once
  if (!res.ok) {
    let msg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const j = text ? JSON.parse(text) : null;
      msg = j?.error || j?.err || msg;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function http(url, { method = "GET", headers = {}, body } = {}) {
  const isJson = body !== undefined && !(body instanceof FormData);
  const payload = isJson && typeof body !== "string" ? JSON.stringify(body) : body;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
      ...headers,
    },
    body: payload,
  });

  return parseResponse(res);
}

/* ----------------------- API calls ----------------------- */

// GET ALL
export const loadRequests = () => http(BASE_URL);

// (Backward-compatible alias for original typo)
export const loadReqeusts = loadRequests;

// GET ONE
export const getRequest = (requestId) => http(`${BASE_URL}/${requestId}`);

// CREATE
export const createRequest = (requestFormData) =>
  http(BASE_URL, { method: "POST", body: requestFormData });

// UPDATE
export const updateRequest = (requestId, requestFormData) =>
  http(`${BASE_URL}/${requestId}`, { method: "PUT", body: requestFormData });

// DELETE
export const deleteRequest = (requestId) =>
  http(`${BASE_URL}/${requestId}`, { method: "DELETE" });

/**
 * Upload images to persistent storage.
 * Accepts either a FormData (with "images") OR an array of File objects.
 * Returns: { urls: string[] }
 */
export async function uploadImages(input) {
  let form;
  if (input instanceof FormData) {
    form = input;
  } else if (Array.isArray(input)) {
    form = new FormData();
    input.forEach((f) => form.append("images", f));
  } else {
    throw new Error("uploadImages expects a FormData or an array of File objects.");
  }

  const res = await fetch(`${BASE_URL}/uploads/images`, {
    method: "POST",
    headers: {
      // DO NOT set Content-Type for multipart; browser sets boundary.
      ...authHeader(),
    },
    body: form,
  });

  return parseResponse(res); // -> { urls: [...] }
}
