"use client";

import Image from "next/image";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white w-full border-b border-gray-200 h-14">
        <div className="flex items-center justify-between h-full px-4">

          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36">
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-8">
            <button>Sellers Advantages</button>
            <button>Suppliers Benefits</button>
            <button>Products</button>
            <button>AI Benefits</button>
          </div>

          <div className="hidden md:flex text-xs lg:text-sm space-x-4 lg:space-x-6 xl:space-x-8">
            <button>Log in</button>
            <button className="bg-[#1E1E1E] text-white px-4 py-2 rounded">
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
          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36">
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
          <button className="text-left">Sellers Advantages</button>
          <button className="text-left">Suppliers Benefits</button>
          <button className="text-left">Products</button>
          <button className="text-left">AI Benefits</button>

          <button className="bg-[#1E1E1E] text-white py-2 rounded">
            Log in
          </button>
          <button className="bg-[#1E1E1E] text-white py-2 rounded">
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
