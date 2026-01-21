import React from "react";

const GlobalBuyers = () => {
  return (
    <div className="bg-[#1e1e1e] px-6 pt-6 md:px-10 md:pt-10">
      <div className="max-w-[1728px] mx-auto flex flex-col gap-6 lg:gap-16 overflow-hidden">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-8">
          {/* Left - Heading */}
          <div className="flex flex-col md:max-w-[696px]">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white leading-tight lg:leading-normal">
              Register & Unlock Global Buyers
            </h2>
          </div>

          {/* Right - 24x7 Card */}
          <div className="flex flex-col gap-4 border-2 border-[#8e8e8e] rounded-[20px] md:rounded-3xl p-4 md:p-5 w-full md:w-sm">
            <p className="text-[#b4b4b4] text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-medium">
              24x7
            </p>
            <p className="text-[#686868] text-xl md:text-2xl lg:text-4xl font-normal">
              Online Visibility
            </p>
          </div>
        </div>

        {/* Bottom Section - Large Text */}
        <div className="-mb-2 md:-mb-3 lg:-mb-4">
          <div className="flex flex-col justify-center w-full">
            <div className="text-[#393939]">
              <span className="text-6xl md:text-8xl lg:text-9xl xl:text-10xl font-semibold font-outfit">
                190+
              </span>
              <span className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-medium font-outfit">
                Countries Visibility
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalBuyers;
