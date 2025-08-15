const API_BASE = import.meta.env.VITE_BACK_END_SERVER_URL;
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getUser(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });
  if (!res.ok) throw new Error(`getUser failed: ${res.status}`);
  return res.json();
}

export async function updateUser(userId, patch) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`updateUser failed: ${res.status}`);
  return res.json();
}

export async function changePassword(userId, payload) {
  const res = await fetch(`${API_BASE}/users/${userId}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`changePassword failed: ${res.status}`);
  return res.json();
}