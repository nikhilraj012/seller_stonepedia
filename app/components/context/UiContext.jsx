"use client";

import React, { createContext, useContext, useState } from "react";
import { uploadProfilePhoto } from "../../utils/uploadProfilePhoto";

const UiContext = createContext();

export const UiProvider = ({ children }) => {
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginState, setLoginState] = useState("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const openGetInTouch = () => setIsGetInTouchOpen(true);
  const closeGetInTouch = () => setIsGetInTouchOpen(false);

  const openLogin = () => {
    setLoginState("login");
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setLoginState("register");
    setIsLoginOpen(true);
  };

  const closeLogin = () => setIsLoginOpen(false);

  const navLinks = [
    { href: "#about-business", label: "About Business" },
    { href: "#products", label: "Products" },
    { href: "#supplier-benefits", label: "Supplier Benefits" },
    { href: "#ai-benefits", label: "AI Benefits" },
  ];

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 56;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const updateAppUser = (userData) => {
    // This function will be passed to the uploadProfilePhoto utility
    // The actual user update is handled in the utility via AuthContext
    setPhotoUrl(userData.photoURL);
  };

  return (
    <UiContext.Provider
      value={{
        isGetInTouchOpen,
        openGetInTouch,
        closeGetInTouch,
        isLoginOpen,
        loginState,
        setLoginState,
        openLogin,
        openSignup,
        closeLogin,
        navLinks,
        handleNavClick,
        isMenuOpen,
        setIsMenuOpen,
        showProfileDropdown,
        setShowProfileDropdown,
        photoUrl,
        setPhotoUrl,
        uploadProfilePhoto,
        updateAppUser,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useUi must be used within a UiProvider");
  }
  return context;
};
