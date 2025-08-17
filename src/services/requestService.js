// src/services/requestService.js
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/requests`;

/* ----------------------- auth header ----------------------- */
const authHeader = () => {
  const token = localStorage.getItem("token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ----------------------- API calls ----------------------- */
// GET ALL
export const loadRequests = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeader(),
    },
  });
  return res.json();
}

// GET ONE
export async function getRequest(requestId) {
  const res = await fetch(`${BASE_URL}/${requestId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeader(),
    },
  });
  return res.json();
}

// CREATE
export async function createRequest(data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
    },
    body: isFormData ? data : JSON.stringify(data ?? {}),
  });
  return res.json();
}

// UPDATE
export async function updateRequest(requestId, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${BASE_URL}/${requestId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
    },
    body: isFormData ? data : JSON.stringify(data ?? {}),
  });
  return res.json();
}

// DELETE
export async function deleteRequest(requestId) {
  const res = await fetch(`${BASE_URL}/${requestId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeader(),
    },
  });
  return res.json();
}

// Upload images
export async function uploadImages(input) {
  let form;
  if (input instanceof FormData) {
    form = input;
  } else if (Array.isArray(input)) {
    form = new FormData();
    input.forEach((f) => form.append("images", f));
  } else {
    form = new FormData();
  }

  const res = await fetch(`${BASE_URL}/uploads/images`, {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: form,
  });
  return res.json();
}
