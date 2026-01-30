"use client";

import CompanyDetailsForm from "./CompanyDetailsForm";
import { useEffect } from "react";
import AddSlabForm from "./AddSlabForm";
import { useSearchParams } from "next/navigation";
import { useUi } from "@/app/components/context/UiContext";
const page = () => {
  const searchParams = useSearchParams();
   const { isSubmitting} = useUi();
  // const hasSubmittedForm = state?.hasSubmittedForm || false;
  const galleryId = searchParams.get("galleryId");
  const hasApprovedForm = searchParams.get("hasApprovedForm") === "true";

  return (
    <div className="py-16 max-lg:px-4 lg:mx-24 xl:mx-32">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <img    
          src="/images/logo1.png"
          alt="Loading"
          className="w-20 md:w-24 animate-pulse"
        />
          
        </div>
      )}
      <div className="my-3 md:my-5 mx-auto ">
        <div className="space-y-1 lg:space-y-2">
          <h1 className="font-medium text-primary text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
            Stonepedia E - Gallery For Processing Unit
          </h1>
          <div className="space-y-0.5">
            <h2 className="text-[#6E6E6E] text-base md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
              Fill this form to upload your slab
            </h2>
          </div>
        </div>
        {!hasApprovedForm && <CompanyDetailsForm />}

        {hasApprovedForm && <AddSlabForm galleryId={galleryId} />}
      </div>
    </div>
  );
};
export default page;
