import React from "react";

const AboutBusiness = () => {
  const features = [
    {
      number: "001",
      title: "Global Visibility & Reach",
      description:
        "Showcase your stone products to buyers across 190+ countries and expand into new international markets.",
    },
    {
      number: "002",
      title: "Digital Product Showcase",
      description:
        "Promote 100+ products with professional listings designed to attract buyers.",
    },
    {
      number: "003",
      title: "End-to-End Selling Support",
      description:
        "From product listing to buyer inquiries, manage everything seamlessly on one platform with 24×7 assistance",
    },
    {
      number: "004",
      title: "Better Price Realization",
      description:
        "Sell your stone at its true market value by reaching verified buyers directly no middlemen, no price pressure.",
    },
    {
      number: "005",
      title: "Trusted & Transparent Marketplace",
      description:
        "Sell with confidence through a verified network that gives you a strong digital and competitive edge.",
    },
  ];

  return (
    <div className="p-6 md:p-10 2xl:my-40">
      <div className="max-w-[1800px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 xl:gap-16 md:flex-row md:items-center">
          <h2 className="font-semibold text-2xl md:text-3xl lg:text-4xl xl:text-[40px] 2xl:text-[48px] text-[#141414] md:w-[50%] md:leading-9 lg:leading-12 2xl:leading-14">
            Everything your Stone Business Needs
          </h2>
          <p className="font-normal text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] text-[#111] md:w-[50%] text-justify">
            Stonepedia empowers stone suppliers to grow beyond
            boundaries.Providing direct access to worldwide buyers with seamless
            selling, wider visibility, and smooth logistics - Your stone reaches
            global markets with confidence.
          </p>
        </div>

        <div className="">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-b border-solid border-[#dcdcdc] py-4 space-y-2 md:py-6 md:max-w-[90%]  mx-auto"
            >
              <p className="font-normal text-[16px] md:text-[14px] lg:text-[16px] text-[#5d5d5d] text-right md:text-left">
                {feature.number}
              </p>

              <div className="max-md:space-y-2 md:flex justify-between gap-4">
                <div className="md:w-[50%]">
                  <h3 className="font-medium text-lg md:text-xl 2xl:text-[32px] text-[#181818]">
                    {feature.title}
                  </h3>
                </div>

                <div className="md:w-[50%]">
                  <p className="font-normal text-xs md:text-sm 2xl:text-base text-[#111]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutBusiness;
