const API_BASE = 'http://127.0.0.1:8000/api';

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerApi(email: string, password: string, firstName: string, lastName: string) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function forgotPasswordApi(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to send OTP');
  }
  return res.json();
}

export async function verifyOtpApi(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/verify-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid OTP');
  }
  return res.json();
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to reset password');
  }
  return res.json();
}

export async function googleAuthApi(idToken: string) {
  const res = await fetch(`${API_BASE}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Google authentication failed');
  }
  return res.json();
} 