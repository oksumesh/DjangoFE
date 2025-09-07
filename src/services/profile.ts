const API_BASE = 'http://127.0.0.1:8000/api';

export async function updateProfile(profileData: {
  name?: string;
  email?: string;
  phone?: string;
  preferred_cinemas?: string[];
  is_verified?: boolean;
}, token: string) {
  const res = await fetch(`${API_BASE}/profile/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || 'Failed to update profile');
  }
  return res.json();
} 