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

  const ecosystemSteps = [
    { number: "01", label: "Stone Extraction" },
    { number: "02", label: "Block Selection" },
    { number: "03", label: "Stone Processing" },
    { number: "04", label: "Finishing" },
    { number: "05", label: "Quality Check" },
    { number: "06", label: "Packaging" },
    { number: "07", label: "Logistics" },
    { number: "08", label: "Doorstep Delivery" },
  ];

  return (
    <div className="relative w-full overflow-hidden p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto ">
        <div className="space-y-2 md:space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-5 lg:gap-7 xl:gap-8">
            <h1 className="text-[#141414] text-xl md:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
              Free Additional AI Benefits
            </h1>
            <p className="md:w-[50%] xl:w-[40%] text-sm lg:text-base xl:text-lg 2xl:text-xl">
              Stonepedia's free advanced AI tools help buyers search, visualize,
              and estimate stone costs instantly giving sellers more qualified
              leads, higher buyer confidence, and faster conversions.
            </p>
          </div>

          <div className="relative">
            <div className="md:max-w-[52%] lg:max-w-[50%] xl:max-w-[52%] md:pl-5 lg:pl-8 xl:pl-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 md:gap-2 lg:gap-3 xl:gap-4 py-3 md:py-5 border-b border-gray-300"
                >
                  <h2 className="text-black font-semibold leading-normal md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]">
                    {benefit.title}
                  </h2>
                  <p className="text-[#434343] font-medium leading-normal md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden md:block absolute md:w-[400px] md:h-[400px] md:right-[-6%] md:top-[-10%] lg:w-[500px] lg:h-[600px] lg:top-[-120px] lg:right-[-5%] xl:right-[-5%] xl:h-[800px] xl:w-[650px] xl:top-[-160px] pointer-events-none">
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

        {/* Mobile Ecosystem Timeline - Hidden on md and above */}
        <div className="md:hidden mt-6">
          <h2 className="text-[#1e1e1e] font-semibold text-lg mb-4">
            Stonepedia Ecosystem from Extraction to Delivery
          </h2>
          
          <div className="relative flex flex-col gap-10">
            {/* Vertical Dashed Line */}
            <div className="absolute left-[16px] top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300"></div>
            
            {ecosystemSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 relative">
                {/* Numbered Badge */}
                <div className="bg-white border-2 border-dashed border-[#871b58] rounded-full w-8 h-8 flex items-center justify-center shadow-[0px_0px_6px_0px_rgba(135,27,88,0.25)] flex-shrink-0 z-10">
                  <span className="text-[#2d2d2d] font-semibold text-xs">
                    {step.number}
                  </span>
                </div>
                
                {/* Label */}
                <p className="text-[#871b58] font-medium text-xs tracking-tight">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBenefits;
