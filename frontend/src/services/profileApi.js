const BASE_URL = 'http://localhost:8087';
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

/**
 * Fetch all profiles
 */
export const getAllProfiles = async () => {
  const response = await fetch(`${BASE_URL}/api/profiles`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Get profile by profile ID
 */
export const getProfileById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Find profile by userId
 */
export const getProfileByUserId = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/profiles/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Direct user profile fetch fallback:', err);
  }
  const profiles = await getAllProfiles();
  return profiles.find((p) => String(p.userId) === String(userId)) || null;
};

/**
 * Create a new profile
 */
export const createProfile = async (profileData) => {
  const response = await fetch(`${BASE_URL}/api/profiles`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

/**
 * Update profile details (Name / photo URL)
 */
export const updateProfile = async (id, profileData) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${id}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

/**
 * Upload profile photo (Multipart File)
 */
export const uploadProfilePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${BASE_URL}/api/profiles/${id}/photo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  return handleResponse(response);
};

/**
 * Get skills associated with profile
 */
export const getProfileSkills = async (profileId) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/skills`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Add skill to profile (TEACH or LEARN)
 */
export const addSkillToProfile = async (profileId, skillId, skillType) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/skills`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ skillId, skillType }),
  });
  return handleResponse(response);
};

/**
 * Remove skill from profile
 */
export const removeSkillFromProfile = async (profileId, skillId) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/skills/${skillId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Search global skills
 */
export const searchSkills = async (query) => {
  const response = await fetch(`${BASE_URL}/api/skills/search?name=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Create a new global skill
 */
export const createSkill = async (name) => {
  const response = await fetch(`${BASE_URL}/api/skills`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ name }),
  });
  return handleResponse(response);
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
    return `${BASE_URL}${photoPath}`;
  }
  return `${BASE_URL}/uploads/profiles/${photoPath.replace(/^\/+/, '')}`;
};
