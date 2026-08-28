const BASE_URL = 'http://localhost:8088';

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
  if (response.status === 24 || response.status === 204) {
    return null;
  }
  return response.json();
};

/**
 * Fetch all profiles
 */
export const getAllProfiles = async () => {
  const response = await fetch(`${BASE_URL}/api/profiles`);
  return handleResponse(response);
};

/**
 * Get profile by profile ID
 */
export const getProfileById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${id}`);
  return handleResponse(response);
};

/**
 * Find profile by userId
 */
export const getProfileByUserId = async (userId) => {
  const profiles = await getAllProfiles();
  return profiles.find((p) => String(p.userId) === String(userId)) || null;
};

/**
 * Create a new profile
 */
export const createProfile = async (profileData) => {
  const response = await fetch(`${BASE_URL}/api/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
    body: formData,
  });
  return handleResponse(response);
};

/**
 * Get skills associated with profile
 */
export const getProfileSkills = async (profileId) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/skills`);
  return handleResponse(response);
};

/**
 * Add skill to profile (TEACH or LEARN)
 */
export const addSkillToProfile = async (profileId, skillId, skillType) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  });
  return handleResponse(response);
};

/**
 * Search global skills
 */
export const searchSkills = async (query) => {
  const response = await fetch(`${BASE_URL}/api/skills/search?name=${encodeURIComponent(query)}`);
  return handleResponse(response);
};

/**
 * Create a new global skill
 */
export const createSkill = async (name) => {
  const response = await fetch(`${BASE_URL}/api/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  return `${BASE_URL}/uploads/profiles/${photoPath}`;
};
