'use client';
import Image from "next/image";
import React from "react";
import { useUi } from "./context/UiContext";
import { useAuth } from "./context/AuthContext";

const Footer = () => {
  const { openGetInTouch, navLinks, handleNavClick } = useUi();
  const { user, loggingOut } = useAuth();

  if (user || loggingOut) {
    return null;
  }

  return (
    <div>
      <div className="p-6 md:px-10">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-[#979797] font-extrabold text-2xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">Scale Your Stone Business Globally.</span>
            <br />
            <span>Connect, Build & Grow</span>
          </h1>
        </div>
      </div>

      <div className="bg-[#101010] p-4 max-md:space-y-4 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36 cursor-pointer" onClick={() => handleNavClick("#hero")}>
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <button onClick={openGetInTouch} className="bg-white rounded-[10px] px-4 py-2 text-xs md:hidden">
            Get In Touch
          </button>
        </div>
        <div className="grid grid-cols-2 text-white text-xs lg:text-sm gap-2 md:flex md:gap-4 lg:gap-6 xl:gap-10 2xl:gap-14">
          {navLinks.map((link) => (
            <button key={link.label} className="max-md:text-left cursor-pointer hover:text-primary" onClick={() => handleNavClick(link.href)}>
              {link.label}
            </button>
          ))}
        </div>
        <button onClick={openGetInTouch} className="max-md:hidden md:block bg-white rounded-[10px] px-4 py-2 lg:px-6 lg:py-3 xl:px-8 text-xs lg:text-sm xl:text-base">
          Get In Touch
        </button>
      </div>
    </div>
  );
};

export default Footer;
