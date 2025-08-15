const API_BASE = import.meta.env.VITE_BACK_END_SERVER_URL;
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /api/settings/:userId
export async function getSettings(userId) {
  const res = await fetch(`${API_BASE}/settings/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });
  if (!res.ok) throw new Error(`getSettings failed: ${res.status}`);
  return res.json();
}

// PUT /api/settings/:userId
export async function updateSettings(userId, patch) {
  const res = await fetch(`${API_BASE}/settings/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`updateSettings failed: ${res.status}`);
  return res.json();
}
