const GATEWAY_URL = 'http://localhost:8086';
const DIRECT_URL = 'http://localhost:8089';
const PROFILE_URL = 'http://localhost:8087';

/**
 * Helper to handle HTTP response and errors
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) errorMessage = parsed.message;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return null;
  }
  return JSON.parse(text);
};

/**
 * Search skills and profiles offering to TEACH them from Browse Skill Service
 * @param {string} name - Skill search query
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size (items per page)
 */
export const searchBrowseSkills = async (name, page = 0, size = 10) => {
  if (!name || !name.trim()) {
    return {
      content: [],
      page: 0,
      size,
      totalElements: 0,
      totalPages: 0,
    };
  }

  const queryParams = new URLSearchParams({
    name: name.trim(),
    page: String(page),
    size: String(size),
  }).toString();

  // Try API Gateway first, fallback to direct service port if needed
  try {
    const response = await fetch(`${GATEWAY_URL}/api/browse/skills/search?${queryParams}`);
    return await handleResponse(response);
  } catch (gatewayErr) {
    console.warn('API Gateway unreachable for Browse Skill Service, trying direct port:', gatewayErr.message);
    const directResponse = await fetch(`${DIRECT_URL}/api/browse/skills/search?${queryParams}`);
    return await handleResponse(directResponse);
  }
};

/**
 * Resolve full photo URL for profile avatar
 */
export const getFullPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  return `${PROFILE_URL}/uploads/profiles/${photoPath}`;
};
