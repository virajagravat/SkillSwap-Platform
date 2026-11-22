const GATEWAY_URL = 'http://localhost:8086';
const DIRECT_URL = 'http://localhost:8091';
const STORAGE_KEY_TOKEN = 'skillswap_token';

// Session Service stores UUIDs while the rest of SkillSwap uses positive Long IDs.
// Encoding a Long in a UUID's least-significant 64 bits keeps the mapping reversible.
export const toSessionUuid = (id) => {
  const value = BigInt(id);
  if (value < 0n) throw new Error('Session IDs must be non-negative.');
  const hex = value.toString(16).padStart(16, '0');
  return `00000000-0000-0000-${hex.slice(0, 4)}-${hex.slice(4)}`;
};

const authHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    let message = `HTTP Error ${response.status}`;
    try {
      const body = JSON.parse(text);
      message = body.detail || body.message || body.error || message;
    } catch {
      if (text) message = text;
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  return text.trim() ? JSON.parse(text) : null;
};

const request = async (baseUrl, path, method = 'GET', body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { ...authHeaders(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return handleResponse(response);
};

const withFallback = async (path, method = 'GET', body) => {
  try {
    return await request(GATEWAY_URL, path, method, body);
  } catch (error) {
    if (error.status && error.status < 500) throw error;
    return request(DIRECT_URL, path.replace('/api', ''), method, body);
  }
};

export const getSessionsForUser = (userId) =>
  withFallback(`/api/sessions/user/${encodeURIComponent(userId)}`);

export const createSessionFromRequest = (request) =>
  withFallback('/api/sessions/from-request', 'POST', request);

export const scheduleSession = (sessionId, schedule) =>
  withFallback(`/api/sessions/${sessionId}/schedule`, 'PUT', schedule);

export const cancelSession = (sessionId) =>
  withFallback(`/api/sessions/${sessionId}/cancel`, 'POST', {});

export const completeSession = (sessionId) =>
  withFallback(`/api/sessions/${sessionId}/complete`, 'POST', {});
