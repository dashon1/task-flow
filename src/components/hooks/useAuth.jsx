import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectUrl) => {
    await base44.auth.logout(redirectUrl);
  };

  const updateProfile = async (data) => {
    await base44.auth.updateMe(data);
    await loadUser();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    updateProfile,
    reload: loadUser
  };
}