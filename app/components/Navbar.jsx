"use client";

import Image from "next/image";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useUi } from "./context/UiContext";

const navLinks = [
  { href: "#about-business", label: "About Business" },
  { href: "#products", label: "Products" },
  { href: "#supplier-benefits", label: "Supplier Benefits" },
  { href: "#ai-benefits", label: "AI Benefits" },
];

const Navbar = () => {
  const { openLogin, openSignup } = useUi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 56;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white w-full border-b border-gray-200 h-14">
        <div className="flex items-center justify-between h-full px-4">

          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36" onClick={() => handleNavClick("#hero")}>
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain cursor-pointer"
            />
          </div>

          <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-10 2xl:space-x-14">
            {navLinks.map((link) => (
              <button className="cursor-pointer hover:text-[#871b58]" key={link.label} onClick={() => handleNavClick(link.href)}>
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-8">
            <button className="cursor-pointer hover:text-[#871b58]" onClick={openLogin}>Log in</button>
            <button onClick={openSignup} className="bg-[#1E1E1E] text-white px-4 py-2 rounded cursor-pointer">
              Sign up
            </button>
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
          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36" onClick={() => handleNavClick("#hero")} >
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <button onClick={() => setIsMenuOpen(false)}>
            <RxCross2 size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4 text-sm">
          {navLinks.map((link) => (
            <button className="text-left cursor-pointer hover:text-[#871b58]" key={link.label} onClick={() => handleNavClick(link.href)}>
              {link.label}
            </button>
          ))}

          <button onClick={openLogin} className="py-2 rounded cursor-pointer">
            Log in
          </button>
          <button onClick={openSignup} className="bg-[#1E1E1E] text-white py-2 rounded cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
