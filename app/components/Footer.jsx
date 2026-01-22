import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="p-6 md:p-10">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-[#979797] font-extrabold text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
            Connect. Grow. <br />
            Boost Your Stone Business Globally.
          </h1>
        </div>
      </div>

      <div className="bg-[#101010] p-4 max-md:space-y-4 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-32 lg:w-36">
            <Image
              src="/images/logo.png"
              alt="Stonepedia Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <button className="bg-white rounded-[10px] px-4 py-2 text-xs md:hidden">
            Get In Touch
          </button>
        </div>
        <div className="grid grid-cols-2 text-white text-xs lg:text-sm gap-2 md:flex md:gap-4 lg:gap-6 xl:gap-10 2xl:gap-14">
          <button className="max-md:text-left">About Business</button>
          <button className="max-md:text-left">Products</button>
          <button className="max-md:text-left">Supplier Benefits</button>
          <button className="max-md:text-left">AI Benefits</button>
        </div>
        <button className="max-md:hidden md:block bg-white rounded-[10px] px-4 py-2 lg:px-6 lg:py-3 xl:px-8 text-xs lg:text-sm xl:text-base">
          Get In Touch
        </button>
      </div>
    </div>
  );
};

export default Footer;
