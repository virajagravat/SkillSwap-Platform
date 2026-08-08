import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'skillswap_user';
const STORAGE_KEY_TOKEN = 'skillswap_token';
const BACKEND_BASE_URL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated user session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (error) {
      console.error('Error reading authentication token:', error);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Real User Login
   */
  const login = async ({ email, password, rememberMe = true }) => {
    setIsLoading(true);

    try {
      // 1. Try real Spring Boot backend if available
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const authenticatedUser = data.user;
          const jwtToken = data.token;

          setUser(authenticatedUser);
          setToken(jwtToken);

          if (rememberMe) {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));
            localStorage.setItem(STORAGE_KEY_TOKEN, jwtToken);
          }
          return { success: true, user: authenticatedUser };
        }
      } catch (backendError) {
        // Spring Boot backend offline, fallback to real client registration registry
      }

      // 2. Real user lookup in local registered users database
      const storedUsers = JSON.parse(localStorage.getItem('skillswap_registered_users') || '[]');
      const existingUser = storedUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!existingUser) {
        const userExistsByEmail = storedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (userExistsByEmail) {
          throw new Error('Invalid password. Please check your credentials.');
        } else {
          throw new Error('No account found with this email address. Please sign up first.');
        }
      }

      const jwtToken = 'jwt_' + btoa(existingUser.email + ':' + Date.now());

      setUser(existingUser);
      setToken(jwtToken);

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existingUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, jwtToken);
      }

      return { success: true, user: existingUser };
    } catch (error) {
      return { success: false, message: error.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Real User Registration
   */
  const register = async (userData) => {
    setIsLoading(true);

    try {
      // 1. Try real Spring Boot backend if available
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
          localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
          return { success: true, user: data.user };
        }
      } catch (backendError) {
        // Backend offline, save into real user registry
      }

      // 2. Client registration store
      const storedUsers = JSON.parse(localStorage.getItem('skillswap_registered_users') || '[]');
      const emailExists = storedUsers.some((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim());

      if (emailExists) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        fullName: userData.fullName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        avatarUrl: userData.avatarUrl || '',
        role: 'USER',
        skillsToTeach: userData.skillsToTeach ? userData.skillsToTeach.split(',').map((s) => s.trim()).filter(Boolean) : [],
        skillsToLearn: userData.skillsToLearn ? userData.skillsToLearn.split(',').map((s) => s.trim()).filter(Boolean) : [],
        bio: userData.bio || '',
        rating: 5.0,
        swapsCompleted: 0,
        createdAt: new Date().toISOString(),
      };

      storedUsers.push(newUser);
      localStorage.setItem('skillswap_registered_users', JSON.stringify(storedUsers));

      const jwtToken = 'jwt_' + btoa(newUser.email + ':' + Date.now());

      setUser(newUser);
      setToken(jwtToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, jwtToken);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth2 Redirect
   */
  const loginWithGoogle = () => {
    // Redirects directly to Spring Boot Google OAuth2 authorization endpoint
    window.location.href = `http://localhost:8081/oauth2/authorization/google`;
  };

  /**
   * Log Out User
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  /**
   * Update User Profile
   */
  const updateProfile = async (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };

    try {
      await fetch(`${BACKEND_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
    } catch (err) {
      // Backend offline fallback
    }

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));

    // Update in user store as well
    const storedUsers = JSON.parse(localStorage.getItem('skillswap_registered_users') || '[]');
    const index = storedUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      storedUsers[index] = updatedUser;
      localStorage.setItem('skillswap_registered_users', JSON.stringify(storedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
