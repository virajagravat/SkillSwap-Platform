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
    throw new Error(errorMessage);
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
    console.warn('API Gateway unreachable for Skill Swap Request Service, trying direct port:', gatewayError.message);
    return postJson(DIRECT_URL, path, requestData);
  }
};
