import React from "react";
import Image from "next/image";

const AiBenefits = () => {
  const benefits = [
    {
      title: "Stone AI Search",
      description:
        "Upload a product image and instantly find matching stones with our AI-powered visual search.",
    },
    {
      title: "AI Stone Cost Estimator",
      description:
        "Quickly estimate your total project cost with our smart stone cost calculator.",
    },
    {
      title: "StoneBot AI Assistant",
      description:
        "Get personalized stone recommendations and assistance in real-time with our intelligent AI consultant.",
    },
    {
      title: "AI Stone Visualizer",
      description:
        "Visualize how each stone will look as tiles in real spaces before you buy.",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto ">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8 lg:gap-12 xl:gap-16 mb-12 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
          <h1 className="text-[#141414] font-semibold leading-tight md:text-[32px] lg:text-[40px] xl:text-[48px] 2xl:text-[58px] md:shrink-0 md:max-w-[45%] lg:max-w-[40%] xl:max-w-[38%]">
            Free Additional AI Benefits
          </h1>
          <p className="text-black font-normal leading-normal md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] md:max-w-[50%] lg:max-w-[48%] xl:max-w-[45%] 2xl:max-w-[712px]">
            Stonepedia's free advanced AI tools help buyers search, visualize,
            and estimate stone costs instantly giving sellers more qualified
            leads, higher buyer confidence, and faster conversions.
          </p>
        </div>

        {/* Content Section with Image */}
        <div className="relative">
          {/* Benefits List */}
          <div className="md:max-w-[52%] lg:max-w-[48%] xl:max-w-[45%] 2xl:max-w-[656px]">
            {benefits.map((benefit, index) => (
              <div key={index}>
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 py-5 md:py-6">
                  <h2 className="text-black font-semibold leading-normal md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]">
                    {benefit.title}
                  </h2>
                  <p className="text-[#434343] font-medium leading-normal md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                    {benefit.description}
                  </p>
                </div>
                {index < benefits.length - 1 && (
                  <div className="w-full h-px bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Robot Hand Image */}
          <div className="hidden md:block absolute md:right-[-6%] lg:right-[-3%] xl:right-0 2xl:right-[5%] md:top-[-50px] lg:top-[-60px] xl:top-[-70px] 2xl:top-[-80px] md:w-[600px] xl:w-[900px] 2xl:w-[1050px] md:h-[300px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px] pointer-events-none">
            <div className="relative w-full h-full">
              <Image
                src="/images/aiBenefits/AiBenefits.webp"
                alt="AI Benefits Robot Hand"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBenefits;
