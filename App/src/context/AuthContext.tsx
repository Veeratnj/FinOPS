import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  loginUser,
  signupUser,
} from "@/services/authService";

/*USER INTERFACE*/

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "analyst" | "viewer" | "owner";
  tenant_id?: string;
  avatar?: string;
  department?: string;
  createdAt?: string;
}

/* =========================
   AUTH CONTEXT TYPE
========================= */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
    username?: string
  ) => Promise<any>;

  signup: (
  username: string,
  companyName: string,
  email: string,
  password: string,
  confirmPassword: string,
) => Promise<void>;

  logout: () => void;

  isAuthenticated: boolean;

  updateProfile: (
    updates: Partial<User>
  ) => void;
}

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

/* =========================
   PROVIDER
========================= */

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* =========================
     LOAD USER FROM STORAGE
  ========================= */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("access_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Failed to parse stored user:",
          error
        );
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    setIsLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */

  const login = async (
    email: string,
    password: string,
    username?: string
  ) => {

    setIsLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
        username,
      });

      /* =========================
         2FA REQUIRED (if present)
      ========================= */
      if (response.requires_2fa) {
        return response;
      }

      /* =========================
         NORMAL LOGIN
      ========================= */
      const rawUser = response.user || ({} as any);
      const computedName =
        rawUser.username ||
        rawUser.name ||
        (rawUser.email ? rawUser.email.split("@")[0] : "") ||
        "User";

      const loggedInUser: User = {
        id: rawUser.id || "",
        email: rawUser.email || email,
        name: computedName,
        role: (rawUser.role || "viewer") as User["role"],
        tenant_id: rawUser.tenant_id,
        department: rawUser.department,
      };

      /* SAVE TOKENS */
      if (response.access_token) {
        localStorage.setItem(
          "access_token",
          response.access_token
        );
      }

      if (response.refresh_token) {
        localStorage.setItem(
          "refresh_token",
          response.refresh_token
        );
      }

      /* SAVE USER */
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      /* UPDATE STATE */
      setUser(loggedInUser);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     SIGNUP
  ========================= */

  const signup = async (
  username: string,
  companyName: string,
  email: string,
  password: string,
  confirm_password: string,
) => {

  setIsLoading(true);

  try {

    const response = await signupUser({
      username,
      email,
      password,
      confirm_password,
      company_name: companyName,
    });

    // Note: Do not set active user session until email is verified and tokens are received via login

  } catch (error) {

    console.error("Signup failed:", error);

    throw error;

  } finally {

    setIsLoading(false);
  }
};
  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("verification_email");
    localStorage.removeItem("login_2fa");
  };

  /* =========================
     UPDATE PROFILE
  ========================= */

  const updateProfile = (
    updates: Partial<User>
  ) => {

    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  /* =========================
     PROVIDER RETURN
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};