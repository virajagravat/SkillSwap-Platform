import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const STORAGE_KEY_USER = "skillswap_user";
const STORAGE_KEY_TOKEN = "skillswap_token";

const BACKEND_BASE_URL = "http://localhost:8085";
const PROFILE_SERVICE_BASE_URL = "http://localhost:8088";

const getFullPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  return `${PROFILE_SERVICE_BASE_URL}/uploads/profiles/${photoPath}`;
};

const normalizeUser = (backendUser = {}) => ({
  id: backendUser.id,
  fullName: backendUser.fullName || "SkillSwap User",
  email: backendUser.email || "",
  avatarUrl: backendUser.avatarUrl || backendUser.profilePicture || "",
  googleId: backendUser.googleId || "",
  roleName: backendUser.roleName,
  accountStatusName: backendUser.accountStatusName,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch latest custom profile from profile-service (Port 8088)
  const syncWithProfileService = async (userId, initialUser) => {
    if (!userId) return;
    try {
      const res = await fetch(`${PROFILE_SERVICE_BASE_URL}/api/profiles/user/${userId}`);
      if (res.ok) {
        const pData = await res.json();
        if (pData && pData.name) {
          setUser((prev) => {
            const baseUser = prev || initialUser;
            if (!baseUser) return null;
            const updated = {
              ...baseUser,
              fullName: pData.name || baseUser.fullName,
              avatarUrl: getFullPhotoUrl(pData.profilePhoto) || baseUser.avatarUrl,
            };
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
            return updated;
          });
        }
      }
    } catch (err) {
      console.warn("Could not sync profile-service user data:", err);
    }
  };

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          // Sync custom name/photo from profile-service in background
          syncWithProfileService(parsedUser.id, parsedUser);
        }
      } catch (error) {
        console.error("ERROR RESTORING AUTHENTICATION :", error);

        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =========================================================
  // GOOGLE JWT LOGIN
  // =========================================================

  const loginWithToken = async (jwtToken) => {
    setIsLoading(true);

    try {
      console.log("=================================");
      console.log("JWT LOGIN STARTED");
      console.log("=================================");

      if (!jwtToken) {
        throw new Error("JWT token is missing");
      }

      // Save JWT immediately
      localStorage.setItem(STORAGE_KEY_TOKEN, jwtToken);
      setToken(jwtToken);
      console.log("JWT SAVED");

      // Fetch authenticated user data from backend database
      console.log("CALLING BACKEND /api/users/me ...");

      const response = await fetch(`${BACKEND_BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      console.log("USER API STATUS :", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("USER API ERROR :", errorText);
        throw new Error(
          `Failed to load authenticated user. Status: ${response.status}`
        );
      }

      const backendUser = await response.json();
      console.log("BACKEND USER DATA :", backendUser);

      // Map backend User entity fields to frontend user object
      const authenticatedUser = normalizeUser(backendUser);

      setUser(authenticatedUser);
      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify(authenticatedUser)
      );

      // Sync custom profile name/photo from profile-service (Port 8088)
      syncWithProfileService(authenticatedUser.id, authenticatedUser);

      console.log("GOOGLE LOGIN SUCCESS :", authenticatedUser);

      return {
        success: true,
        user: authenticatedUser,
      };
    } catch (error) {
      console.error("JWT LOGIN ERROR :", error);

      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);

      setToken(null);
      setUser(null);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // GOOGLE OAUTH2
  // =========================================================

  const loginWithGoogle = (mode = "login") => {
    console.log("REDIRECTING TO GOOGLE LOGIN");

    window.location.assign(
      `${BACKEND_BASE_URL}/api/oauth2/${mode}/google`
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  // =========================================================
  // UPDATE PROFILE (Sync state & localStorage instantly)
  // =========================================================

  const updateProfile = (updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = {
        ...prevUser,
        ...updatedFields,
      };

      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,

        loginWithGoogle,

        // JWT authentication
        loginWithToken,

        // Other
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================
// useAuth Hook
// =========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};
