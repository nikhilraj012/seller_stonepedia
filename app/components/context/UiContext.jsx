'use client';

import React, { createContext, useContext, useState } from 'react';

const UiContext = createContext();

export const UiProvider = ({ children }) => {
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginState, setLoginState] = useState('login');

  const openGetInTouch = () => setIsGetInTouchOpen(true);
  const closeGetInTouch = () => setIsGetInTouchOpen(false);

  const openLogin = () => {
    setLoginState('login');
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setLoginState('register');
    setIsLoginOpen(true);
  };

  const closeLogin = () => setIsLoginOpen(false);

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
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};