"use client";

import React, { createContext, useContext, useState } from "react";

const UiContext = createContext();

export const UiProvider = ({ children }) => {
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginState, setLoginState] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  return (
    <UiContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
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
