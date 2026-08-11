import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

const STORAGE_KEY_USER = "skillswap_user";
const STORAGE_KEY_TOKEN = "skillswap_token";

const BACKEND_BASE_URL = "http://localhost:8085";

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

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
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
  // UPDATE PROFILE
  // =========================================================

  const updateProfile = async (updatedFields) => {
    if (!user || !token) return;

    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      setUser(updatedUser);

      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error("PROFILE UPDATE ERROR :", error);
    }
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
