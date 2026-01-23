'use client';

import React, { createContext, useContext, useState } from 'react';

const UiContext = createContext();

export const UiProvider = ({ children }) => {
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);

  const openGetInTouch = () => setIsGetInTouchOpen(true);
  const closeGetInTouch = () => setIsGetInTouchOpen(false);

  return (
    <UiContext.Provider
      value={{
        isGetInTouchOpen,
        openGetInTouch,
        closeGetInTouch,
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