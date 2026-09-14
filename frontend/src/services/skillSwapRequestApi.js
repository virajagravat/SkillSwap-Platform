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
      errorMessage = parsed.message || parsed.error || errorMessage;
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

export const createSkillSwapRequest = async (requestData) => {
  const path = '/api/skill-swap-requests';

  try {
    return await postJson(GATEWAY_URL, path, requestData);
  } catch (gatewayError) {
    // A response from the gateway (for example 400, 401, or 409) is a real
    // application error. Only fall back when the gateway is unavailable.
    if (gatewayError.status && ![502, 503, 504].includes(gatewayError.status)) {
      throw gatewayError;
    }
    console.warn('API Gateway unreachable for Skill Swap Request Service, trying direct port:', gatewayError.message);
    return postJson(DIRECT_URL, path, requestData);
  }
};
