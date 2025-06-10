const API_BASE = 'http://127.0.0.1:8000/api';

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, email, password })
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
} 