import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const businessCategories = [
  {
    id: 1,
    title: "Block",
    description:
      "A block seller trades large quantities of assets, influencing market prices significantly.",
    image: "/images/dashboard/block.webp",
    route: "/dashboard/blocks-form",
  },
  {
    id: 2,
    title: "E-processing unit",
    description:
      "List electronic processing units here to reach the right buyers faster.",
    image: "/images/dashboard/processing-unit.webp",
    route: "/dashboard/e-processing-unit-form",
  },
  {
    id: 3,
    title: "E-Gallery",
    description:
      "An E-gallery empowers sellers to showcase and sell their art to a global audience.",
    image: "/images/dashboard/gallery.webp",
    route: "/dashboard/e-gallery-form",
  },

  {
    id: 4,
    title: "Stone Product",
    description:
      "A stone product allows sellers to present unique creations to customers worldwide.",
    image: "/images/dashboard/stone-product.webp",
    route: "/dashboard/stone-products-form",
  },
];

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="pt-14 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
          <div className="bg-[#f6f6f6] px-5 py-2 rounded-full m-4">
            <p className="text-base text-black font-medium">categories</p>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#141219] mb-2 lg:mb-4 xl:mb-6">
            Explore Product Categories
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-black max-w-xl">
            List your stone slabs, blocks and all stone related products in
            separate categories to reach the right buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {businessCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.12)] p-3 flex flex-col"
            >
              <div className="relative w-full h-[190px] rounded-[10px] overflow-hidden mb-3">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex flex-col gap-4 mb-6">
                  <h2 className="text-2xl font-medium text-[#141219] text-center">
                    {category.title}
                  </h2>
                  <p className="text-sm text-[#141219] text-center">
                    {category.description}
                  </p>
                </div>

                <button
                  onClick={() => router.push(category.route)}
                  className="w-full border border-[#141219]/20 rounded-[40px] px-8 py-4 text-base font-medium text-[#141219] hover:bg-gray-50 transition-colors mt-auto cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
