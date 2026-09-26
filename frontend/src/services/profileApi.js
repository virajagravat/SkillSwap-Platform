const GATEWAY_URL = 'http://localhost:8086';
const DIRECT_URL = 'http://localhost:8087';
const PHOTO_BASE_URL = DIRECT_URL;
const STORAGE_KEY_TOKEN = 'skillswap_token';

export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getJsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

/**
 * Helper to handle HTTP errors
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

const requestProfileService = async (path, options = {}) => {
  let gatewayResponse;
  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}${path}`, options);
  } catch (gatewayErr) {
    console.warn('API Gateway unreachable for Profile Service, trying direct port:', gatewayErr.message);
    return requestDirectProfileService(path, options);
  }

  if (gatewayResponse.status === 502 || gatewayResponse.status === 503 || gatewayResponse.status === 504) {
    console.warn(`API Gateway returned ${gatewayResponse.status} for Profile Service, trying direct port`);
    return requestDirectProfileService(path, options);
  }

  return handleResponse(gatewayResponse);
};

const requestDirectProfileService = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${DIRECT_URL}${path}`, options);
  } catch (directErr) {
    throw new Error(
      `Failed to reach Profile Service. Start API Gateway on 8086 or profile-service on 8087. ${directErr.message}`
    );
  }

  return handleResponse(response);
};

/**
 * Fetch all profiles
 */
export const getAllProfiles = async () => {
  return requestProfileService('/api/profiles', {
    headers: getAuthHeaders(),
  });
};

/**
 * Get profile by profile ID
 */
export const getProfileById = async (id) => {
  return requestProfileService(`/api/profiles/${id}`, {
    headers: getAuthHeaders(),
  });
};

/**
 * Find profile by userId
 */
export const getProfileByUserId = async (userId) => {
  try {
    return await requestProfileService(`/api/profiles/user/${userId}`, {
      headers: getAuthHeaders(),
    });
  } catch (err) {
    console.warn('User profile lookup fallback:', err);
  }
  const profiles = await getAllProfiles();
  return profiles.find((p) => String(p.userId) === String(userId)) || null;
};

/**
 * Create a new profile
 */
export const createProfile = async (profileData) => {
  return requestProfileService('/api/profiles', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData),
  });
};

/**
 * Update profile details (Name / photo URL)
 */
export const updateProfile = async (id, profileData) => {
  return requestProfileService(`/api/profiles/${id}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData),
  });
};

/**
 * Upload profile photo (Multipart File)
 */
export const uploadProfilePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('photo', file);

  return requestProfileService(`/api/profiles/${id}/photo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
};

/**
 * Get skills associated with profile
 */
export const getProfileSkills = async (profileId) => {
  return requestProfileService(`/api/profiles/${profileId}/skills`, {
    headers: getAuthHeaders(),
  });
};

/**
 * Add skill to profile (TEACH or LEARN)
 */
export const addSkillToProfile = async (profileId, skillId, skillType) => {
  return requestProfileService(`/api/profiles/${profileId}/skills`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ skillId, skillType }),
  });
};

/**
 * Remove skill from profile
 */
export const removeSkillFromProfile = async (profileId, skillId, skillType = 'TEACH') => {
  return requestProfileService(
    `/api/profiles/${profileId}/skills/${skillId}?skillType=${encodeURIComponent(skillType)}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );
};

/**
 * Search global skills
 */
export const searchSkills = async (query) => {
  return requestProfileService(`/api/skills/search?name=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
};

/**
 * Create a new global skill
 */
export const createSkill = async (name) => {
  return requestProfileService('/api/skills', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ name }),
  });
};

/**
 * Format photo URL to point to backend uploads directory if relative filename
 */
export const getFullPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  if (photoPath.startsWith('/uploads/')) {
    return `${PHOTO_BASE_URL}${photoPath}`;
  }
  return `${PHOTO_BASE_URL}/uploads/profiles/${photoPath.replace(/^\/+/, '')}`;
};
