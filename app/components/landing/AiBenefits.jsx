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
    <div className="p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="max-md:space-y-2 md:flex justify-between gap-6">
          <h1 className="text-[#141414] text-xl md:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            Free Additional AI Benefits
          </h1>
          <p className="md:w-[50%] lg:w-[40%] text-sm lg:text-base xl:text-lg 2xl:text-xl">
            Stonepedia’s free advanced AI tools help buyers search, visualize,
            and estimate stone costs instantly giving sellers more qualified
            leads, higher buyer confidence, and faster conversions.
          </p>
        </div>

        <div className="md:flex items-center justify-between">
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="space-y-1">
                <h2 className="text-[#141414] text-base md:text-lg lg:text-xl xl:text-2xl font-semibold">
                  {benefit.title}
                </h2>
                <p className="text-xs md:text-sm xl:text-base">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          <div className="relative h-full hidden md:block aspect-square overflow-hidden">
            <Image
              src="/images/aiBenefits/ai.webp"
              alt="AI Benefits"
              fill
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBenefits;
