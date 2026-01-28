import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  return (
    <div className="max-md:pt-14 md:flex justify-center items-center h-screen p-4 md:p-6">
      <div className="flex flex-col items-center justify-center text-center md:w-2/3 lg:w-3/4 xl:w-1/2 gap-y-4 max-md:pt-4">
        <h1 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#141219]">Explore Product Categories</h1>
        <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4D4D4D]">
          Register your product range, selected for exceptional craftsmanship,
          cutting-edge design, and high market appeal.
        </p>
      </div>

      <div>
        {/* //Make it here */}
        <button onClick={() => router.push('/dashboard/blocks-form')}>Block</button>
        <button onClick={() => router.push('/dashboard/e-gallery-form')}>E-Gallery</button>
        <button onClick={() => router.push('/dashboard/e-processing-unit-form')}>E-Processing Unit</button>
        <button onClick={() => router.push('/dashboard/stone-products-form')}>Stone Products</button>
      </div>
    </div>
  );
};

export default Dashboard;
