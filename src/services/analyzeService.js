// src/services/analyzeService.js
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/requests`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const uploadImages = async (files = []) => {
  if (!files || files.length === 0) return { urls: [] };

  const form = new FormData();
  for (const f of files) form.append("images", f); // "images" must match your backend field name

  const url = `${BASE_URL}/uploads/images`; // fixed extra }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }

  return res.json();
};

export const analyzeRequest = async ({ userText = "", imageUrls = [], files = [] } = {}) => {
  let uploaded = [];
  
  // Handle file uploads
  if (files && files.length) {
    const up = await uploadImages(files);
    uploaded = Array.isArray(up?.urls) ? up.urls : [];
  }

  const allUrls = [...(imageUrls || []), ...uploaded];

  const url = `${BASE_URL}/analyze`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ userText, imageUrls: allUrls }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text || "Request failed"}`);
    }

    return res.json();
  } catch (err) {
    console.error("Analyze request failed:", err);
    throw err;
  }
};
