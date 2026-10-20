const GATEWAY_URL = 'http://localhost:8086';
const DIRECT_URL = 'http://localhost:8090';
const STORAGE_KEY_TOKEN = 'skillswap_token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getJsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      // Spring Boot ProblemDetail responses put the useful API text in
      // `detail`; without it, a 409 duplicate is shown as a generic error.
      errorMessage = parsed.detail || parsed.message || parsed.error || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : null;
};

const postJson = async (baseUrl, path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

const shouldFallbackToDirectService = (error) => !error.status || error.status >= 500;

export const createSkillSwapRequest = async (requestData) => {
  const path = '/api/skill-swap-requests';

  try {
    return await postJson(GATEWAY_URL, path, requestData);
  } catch (gatewayError) {
    // 4xx responses are real application errors. 5xx responses usually mean
    // the gateway or service discovery is unhealthy, so try the direct service.
    if (!shouldFallbackToDirectService(gatewayError)) {
      throw gatewayError;
    }
    console.warn('API Gateway unreachable for Skill Swap Request Service, trying direct port:', gatewayError.message);
    return postJson(DIRECT_URL, path, requestData);
  }
};

const getJson = async (baseUrl, path) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: getJsonHeaders(),
  });
  return handleResponse(response);
};

export const getSentRequests = async (senderId) => {
  const path = `/api/skill-swap-requests/sent?senderId=${senderId}`;
  try {
    return await getJson(GATEWAY_URL, path);
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return getJson(DIRECT_URL, path);
  }
};

export const getReceivedRequests = async (receiverId) => {
  const path = `/api/skill-swap-requests/received?receiverId=${receiverId}`;
  try {
    return await getJson(GATEWAY_URL, path);
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return getJson(DIRECT_URL, path);
  }
};

// The request service owns this read-only catalog endpoint. The gateway's
// /api/skills route belongs to profile-service, so query the request service
// directly to keep the two services' routes isolated.
export const getRequestServiceSkills = async () => getJson(DIRECT_URL, '/api/skills');

export const acceptSwapRequest = async (id, userId) => {
  const path = `/api/skill-swap-requests/${id}/accept?userId=${userId}`;
  try {
    return await postJson(GATEWAY_URL, path, {});
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return postJson(DIRECT_URL, path, {});
  }
};

export const rejectSwapRequest = async (id, userId) => {
  const path = `/api/skill-swap-requests/${id}/reject?userId=${userId}`;
  try {
    return await postJson(GATEWAY_URL, path, {});
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return postJson(DIRECT_URL, path, {});
  }
};

export const cancelSwapRequest = async (id, userId) => {
  const path = `/api/skill-swap-requests/${id}/cancel?userId=${userId}`;
  try {
    return await postJson(GATEWAY_URL, path, {});
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return postJson(DIRECT_URL, path, {});
  }
};

export const completeSwapRequest = async (id, userId) => {
  const path = `/api/skill-swap-requests/${id}/complete?userId=${userId}`;
  try {
    return await postJson(GATEWAY_URL, path, {});
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return postJson(DIRECT_URL, path, {});
  }
};

export const suggestSwapTime = async (id, suggestData, receiverId) => {
  const path = `/api/skill-swap-requests/${id}/suggest-time?receiverId=${receiverId}`;
  try {
    return await postJson(GATEWAY_URL, path, suggestData);
  } catch (err) {
    if (!shouldFallbackToDirectService(err)) throw err;
    return postJson(DIRECT_URL, path, suggestData);
  }
};

