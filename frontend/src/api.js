const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao fazer login');
  }

  return res.json();
}

export async function searchPhotos(token, { rover, camera, earth_date, page }) {
  const params = new URLSearchParams();
  if (rover) params.set('rover', rover);
  if (camera) params.set('camera', camera);
  if (earth_date) params.set('earth_date', earth_date);
  if (page) params.set('page', String(page));

  const res = await fetch(`${API_BASE}/api/photos?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao buscar fotos');
  }

  return res.json();
}

export async function insertPhoto(token, photo) {
  const res = await fetch(`${API_BASE}/api/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(photo),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao inserir foto');
  }

  return res.json();
}
