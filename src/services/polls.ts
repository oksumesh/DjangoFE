const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchPolls(token: string) {
  const res = await fetch(`${API_BASE}/polls/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch polls');
  return res.json();
}

export async function fetchPollDetail(id: string, token: string) {
  const res = await fetch(`${API_BASE}/polls/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch poll detail');
  return res.json();
}

export async function submitVote(pollId: string, option: string, voterUserId: number, token: string) {
  const res = await fetch(`${API_BASE}/polls/${pollId}/vote/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ option, voterUserId })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.detail || errorData.error || 'Failed to submit vote');
  }
  return res.json();
}

export async function fetchPollResults(id: string, token: string) {
  const res = await fetch(`${API_BASE}/polls/${id}/results/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch poll results');
  return res.json();
}

export async function createPoll(pollData: {
  question: string;
  options: string[];
  category: string;
  isAnonymous?: boolean;
  duration?: string;
  visibility?: string;
  imageUrl?: string;
  createdByUserId: number;
}, token: string) {
  const res = await fetch(`${API_BASE}/polls/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pollData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || 'Failed to create poll');
  }
  return res.json();
} 