"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUi } from "../context/UiContext";

const GlobalLoading = ({ children }) => {
  const { loading } = useAuth();
  const { isSubmitting } = useUi();

  useEffect(() => {
    if (isSubmitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSubmitting]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
        <img
          src="/images/logo.png"
          alt="Loading"
          className="w-20 md:w-24 animate-pulse"
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalLoading;
