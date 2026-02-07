"use client";

import React from "react";
import Image from "next/image";
import { useUi } from "../context/UiContext";

const Hero = () => {
  const { openSignup } = useUi();

  return (
    <div className="pt-14 lg:min-h-screen p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content - Text Section */}
          <div className="flex flex-col gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 lg:max-w-[840px] order-1 lg:order-1 pt-5 md:pt-12">
            {/* Badge */}
            <div className="inline-flex items-center justify-center px-4 py-2 lg:py-3 xl:py-4 xl:px-6 2xl:px-8 border border-primary rounded-[73px] w-fit">
              <p className="text-sm lg:text-base xl:text-2xl font-medium">
                <span className="text-black">Sell on </span>
                <span className="bg-linear-to-r from-primary to-[#fbad30] bg-clip-text text-transparent">
                  Stonepedia. In
                </span>
              </p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-start gap-6 lg:gap-12 xl:gap-16 2xl:gap-24 max-md:max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-xl 2xl:max-w-3xl">
              {/* Heading */}
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-[#383838] leading-tight lg:leading-10 xl:leading-12 2xl:leading-14">
                  <span>Your Global Online Stone </span>
                  <span className="text-primary">Sale</span>
                  <span> Partner - </span>
                  <span className="text-primary">Boost</span>
                  <span> your business worldwide instantly</span>
                </h1>
              </div>

              {/* CTA Button */}
              <button
                onClick={openSignup}
                className="bg-[#1e1e1e] cursor-pointer border border-black text-white max-md:w-[120px] max-md:h-[40px] md:w-[140px] md:h-[45px] xl:w-[180px] xl:h-[50px] 2xl:w-[200px] 2xl:h-[60px] rounded-[10px] text-sm md:text-base lg:text-lg xl:text-xl hover:bg-[#2e2e2e] transition-colors"
              >
                Register
              </button>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className="relative w-full hidden lg:flex-1 order-2 lg:order-2 lg:flex items-center justify-center ">
            <div className="relative w-full md:max-w-[500px] lg:-mt-4 xl:-mt-6 2xl:-mt-8 lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] aspect-718/795">
              <Image
                src="/images/hero/hero.webp"
                alt="Stone business growth visualization"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
