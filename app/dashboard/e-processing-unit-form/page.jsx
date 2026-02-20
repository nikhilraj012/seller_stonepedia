"use client";

import CompanyDetailsForm from "./CompanyDetailsForm";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUi } from "@/app/components/context/UiContext";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/app/components/context/AuthContext";
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSubmitting } = useUi();
  const { uid } = useAuth();
  const [checking, setChecking] = useState(true);
  const [companyExists, setCompanyExists] = useState(false);
  const [galleryExists, setGalleryExists] = useState(false);
  
  // const hasSubmittedForm = state?.hasSubmittedForm || false;
  const galleryId = searchParams.get("galleryId");
  const hasApprovedForm = searchParams.get("hasApprovedForm") === "true";

  useEffect(() => {
    const checkData = async () => {
      if (!uid) return;

      try {
        // Company check
        const companyRef = doc(db, "SellerDetails", uid, "CompanyData", "info");
        const companySnap = await getDoc(companyRef);
        setCompanyExists(companySnap.exists());

        // Gallery check (only if editing)
        if (!galleryId) {
          const galleryRef = doc(
            db,
            "SellerDetails",
            uid,
            "ProcessingUnit",
            "info",
          );
          const gallerySnap = await getDoc(galleryRef);
          setGalleryExists(gallerySnap.exists());
        }
      } catch (err) {
        console.log(err);
      } finally {
        setChecking(false);
      }
    };

    checkData();
  }, [uid, galleryId]);

  useEffect(() => {
    if (isSubmitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSubmitting]);

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!companyExists && !galleryId && !galleryExists) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-gray-500 mb-4">
          Add Company and Processing Unit details first in Profile page
        </p>

        <button
          onClick={() => router.push("/dashboard/profile")}
          className="border border-primary cursor-pointer text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition"
        >
          Go to Profile Page
        </button>
      </div>
    );
  }

  if (!companyExists) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-gray-500 mb-4">Add Company details first</p>

        <button
          onClick={() => router.push("/dashboard/profile")}
          className="border border-primary cursor-pointer text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition"
        >
          Add Company Data
        </button>
      </div>
    );
  }

  if (!galleryId && !galleryExists) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-gray-500 mb-4">
          Add Processing Unit details first in Profile page
        </p>

        <button
          onClick={() => router.push("/dashboard/profile")}
          className="border border-primary cursor-pointer text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition"
        >
          Go to Profile Page
        </button>
      </div>
    );
  }
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
              Fill this form to upload your processing unit
            </h2>
          </div>
        </div>
        {!hasApprovedForm && <CompanyDetailsForm galleryId={galleryId} />}

        {hasApprovedForm && <AddSlabForm galleryId={galleryId} />}
      </div>
    </div>
  );
};
export default page;
