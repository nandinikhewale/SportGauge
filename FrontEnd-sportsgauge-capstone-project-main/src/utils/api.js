/** In dev, Vite proxies /api → Flask on port 5000. Set VITE_API_BASE to override. */
export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export function avatarUrl(userId, profilePhoto) {
  if (!userId || !profilePhoto) return null;
  return `${API_BASE}/api/user/${userId}/avatar/file?t=${encodeURIComponent(profilePhoto)}`;
}

export async function fetchUser(userId) {
  const res = await fetch(`${API_BASE}/api/user/${userId}`);
  if (!res.ok) throw new Error('Failed to load user');
  return res.json();
}

export async function updateUser(userId, data) {
  const res = await fetch(`${API_BASE}/api/user/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Update failed');
  return json.user;
}

export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`${API_BASE}/api/user/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Upload failed');
  return json;
}

export async function fetchAssessments(userId) {
  const res = await fetch(`${API_BASE}/api/assessments/${userId}`);
  if (!res.ok) throw new Error('Failed to load assessments');
  return res.json();
}

export async function analyzeVideo(testName, userId, videoFile) {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('user_id', String(userId));
  const res = await fetch(`${API_BASE}/api/analyze/${testName}`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Analysis failed');
  }
  return data;
}
