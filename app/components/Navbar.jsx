"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useUi } from "./context/UiContext";
import { useAuth } from "./context/AuthContext";
import NavbarProfile from "./NavbarProfile";

const Navbar = () => {
  const { openLogin, openSignup, navLinks, handleNavClick, isMenuOpen, setIsMenuOpen, showProfileDropdown, setShowProfileDropdown } = useUi();
  const { user } = useAuth();
  const router = useRouter();
  const photoUrl = user?.photoURL;

  const dropdownRef = useRef(null);

  const handleNavClickAndClose = (href) => {
    setIsMenuOpen(false);
    handleNavClick(href);
  };

  const handleLogoClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      handleNavClick("#hero");
    }
  };

  const handleLogoClickAndClose = () => {
    setIsMenuOpen(false);
    if (user) {
      router.push("/dashboard");
    } else {
      handleNavClick("#hero");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white w-full border-b border-gray-200 h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div
            className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36"
            onClick={handleLogoClick}
          >
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain cursor-pointer"
            />
          </div>

          {!user && (
            <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-10 2xl:space-x-14">
              {navLinks.map((link) => (
                <button
                  className="cursor-pointer hover:text-[#871b58]"
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-8">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt="avatar"
                        fill
                        priority
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IoPersonCircleOutline size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </button>

                {showProfileDropdown && (
                  <NavbarProfile />
                )}
              </div>
            ) : (
              <>
                <button
                  className="cursor-pointer hover:text-[#871b58]"
                  onClick={openLogin}
                >
                  Log in
                </button>
                <button
                  onClick={openSignup}
                  className="bg-[#1E1E1E] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)}>
              {!isMenuOpen && <RxHamburgerMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
          <div
            className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36"
            onClick={handleLogoClickAndClose}
          >
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain cursor-pointer"
            />
          </div>
          <button onClick={() => setIsMenuOpen(false)}>
            <RxCross2 size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4 text-sm">
          {!user &&
            navLinks.map((link) => (
              <button
                className="text-left cursor-pointer hover:text-[#871b58]"
                key={link.label}
                onClick={() => handleNavClickAndClose(link.href)}
              >
                {link.label}
              </button>
            ))}

          {user ? (
            <NavbarProfile
              isMobile={true} setIsMenuOpen={setIsMenuOpen}
            />
          ) : (
            <>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openLogin();
                }}
                className="py-2 rounded cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openSignup();
                }}
                className="bg-[#1E1E1E] text-white py-2 rounded cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
