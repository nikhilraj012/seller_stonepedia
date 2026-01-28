"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, logoutUser, getSellerDetails, observeAuthState } from "../../firebase/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch seller details
        const result = await getSellerDetails(firebaseUser.uid);
        if (result.success) {
          setSellerDetails(result.data);
        }
      } else {
        setUser(null);
        setSellerDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, userData) => {
    try {
      const result = await registerUser(email, password, userData);
      
      if (result.success) {
        toast.success("Registration successful! Welcome aboard!", {
          duration: 4000,
          position: "top-center",
        });
        router.push('/dashboard');
        return { success: true };
      } else {
        toast.error(result.error || "Registration failed. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error("An error occurred during registration.", {
        duration: 4000,
        position: "top-center",
      });
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        toast.success("Login successful!", {
          duration: 4000,
          position: "top-center",
        });
        router.push('/dashboard');
        return { success: true };
      } else {
        toast.error(result.error || "Login failed. Please check your credentials.", {
          duration: 4000,
          position: "top-center",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error("An error occurred during login.", {
        duration: 4000,
        position: "top-center",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setLoggingOut(true);
      const result = await logoutUser();
      
      if (result.success) {
        toast.success("Logged out successfully!", {
          duration: 3000,
          position: "top-center",
        });
        router.push('/');
        return { success: true };
      } else {
        setLoggingOut(false);
        toast.error("Logout failed. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setLoggingOut(false);
      toast.error("An error occurred during logout.", {
        duration: 4000,
        position: "top-center",
      });
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sellerDetails,
        loading,
        loggingOut,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
