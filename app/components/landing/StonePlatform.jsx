import React from "react";
import Image from "next/image";

const StonePlatform = () => {
  const categories = [
    {
      number: "1",
      title: "Stone Blocks",
      description:
        "Boost your stone block sales to wider markets and unlock long-term business growth.",
      image: "/images/stonePlatform/stoneblock.webp",
    },
    {
      number: "2",
      title: "Stone Slabs",
      description:
        "Scale your stone Slabs sales business in international market and unlock new business opportunities.",
      image: "/images/stonePlatform/stoneslab.webp",
    },
    {
      number: "3",
      title: "Stone Products",
      description:
        "Promote your stone Products from local buyers to global buyers.",
      image: "/images/stonePlatform/stoneproduct.webp",
    },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto space-y-8 md:space-y-12 lg:space-y-16">
        <div className="max-md:space-y-4 md:flex justify-between gap-6">
          <h1 className="text-[#141414] text-xl md:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            Stone Business on Stone Platform
          </h1>
          <p className="md:w-[40%] xl:w-[30%] text-sm lg:text-base xl:text-lg 2xl:text-xl">
            List your stone slabs, blocks and all stone related products in
            separate categories to reach the right buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] shadow-[0px_0px_60px_0px_rgba(0,0,0,0.06)] h-[280px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[550px] flex flex-col"
            >
              <div className="w-full h-[70%]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-4 p-6 md:p-8 h-[30%]">
                <div className="flex items-center gap-4">
                  <div className="bg-[#1e1e1e] rounded-[20px] w-[24px] h-[24px] 2xl:w-[40px] 2xl:h-[40px] flex items-center justify-center">
                    <p className="text-white 2xl:text-[16px] text-xs font-normal">
                      {category.number}
                    </p>
                  </div>
                  <h3 className="text-[#4a4a4a] text-[20px] 2xl:text-[24px] font-normal">
                    {category.title}
                  </h3>
                </div>

                <p className="text-[#4a4a4a] text-[16px] 2xl:text-[18px] font-normal leading-normal">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StonePlatform;
