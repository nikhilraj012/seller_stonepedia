"use client";
import React, { useEffect, useRef, useState } from "react";
import CompanyDetails from "./CompanyDetails";
import { v4 as uuidv4 } from "uuid";
import ProductDetails from "./ProductDetails";
import ProductView from "./ProductView";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";
import { db, storage } from "@/app/firebase/config";
const Form = () => {
  const { isSubmitting, setIsSubmitting } = useUi();

  const { uid, authEmail } = useAuth();

  const router = useRouter();
  const { galleryId } = useParams();
  console.log(galleryId);
  const hasApprovedForm = Boolean(galleryId);
  const [resetForm, setResetForm] = useState(false);

  const [productList, setProductList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [companyData, setCompanyData] = useState({});

  const slabRef = useRef();

  const handleEdit = (i) => {
    setEditIndex(i);
    setEditProduct(productList[i]);
  };

  const formatDate = () => {
    const date = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(date.getDate())}-${pad(
      date.getMonth() + 1,
    )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const uploadFiles = async (files, path) => {
    if (!files) return [];
    const fileArray = Array.isArray(files) ? files : [files];

    return Promise.all(
      fileArray.map(async (f) => {
        const file = f.file || f;
        const name = file.name || `file_${Date.now()}`;
        const fileRef = ref(
          storage,
          `sellStoneProducts/${uid}/${path}/${name}`,
        );
        const metadata = {
          contentType: file.type,
          contentDisposition: `attachment; filename="${file.name}"`,
        };

        await uploadBytes(fileRef, file, metadata);
        return { url: await getDownloadURL(fileRef), type: file.type };
      }),
    );
  };

  const uploadProduct = async (product) => {
    const media = await uploadFiles(product.media, `products/${product.id}`);

    let thumbnail = null;

    if (product.thumbnail?.file) {
      const t = await uploadFiles(
        [product.thumbnail.file],
        `products/${product.id}`,
      );
      thumbnail = t[0];
    } else if (
      product.thumbnail?.url &&
      !String(product.thumbnail.url).startsWith("blob:")
    ) {
      thumbnail = product.thumbnail;
    }

    return { ...product, media, thumbnail, createdAt: formatDate() };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // if (!isAuthenticated || !uid) {
    //   setShowUserLogin(true);
    //   toast.error("Please sign in before submitting the form");
    //   return setIsSubmitting(false);
    // }

    try {
      // NEW FORM SUBMISSION

      if (!hasApprovedForm) {
        if (!companyData.image || companyData.image.length === 0) {
          toast.error("Upload at least 1 Shop Image");
          setIsSubmitting(false);
          return;
        }

        const shopImage = await uploadFiles(companyData.image, "images");

        const uploadedProducts = await Promise.all(
          productList.map((p) => uploadProduct(p)),
        );

        const orderId = uuidv4().replace(/\D/g, "").slice(0, 6);

        const companyDataFormatted = {
          ...companyData,
          country: companyData.country?.label,
          state: companyData.state?.label,
          city: companyData.city?.label,

          image: shopImage[0],
        };

        const galleryData = {
          userEmail: authEmail,
          userUid: uid,
          orderId,
          companyDetails: companyDataFormatted,
          products: uploadedProducts,
          status: "pending",
          createdAt: serverTimestamp(),
        };
        console.log(galleryData);
        const ref1 = await addDoc(
          collection(db, "sellStoneProducts"),
          galleryData,
        );
        await setDoc(
          doc(db, "SellerDetails", uid, "sellStoneProducts", ref1.id),
          galleryData,
        );
        console.log("Saved in Users also:", ref1.id);
        console.log("hu", productList);
        toast.success("Form submitted successfully!");
        router.push("/dashboard/profile/my-stone-products");
        setProductList([]);
        setCompanyData({});
        setResetForm(true);
        setTimeout(() => setResetForm(false), 0);
        window.scrollTo({ top: 0, behavior: "smooth" });

        return;
      }

      // ADD NEW PRODUCTS TO EXISTING GALLERY
      //
      if (!galleryId) {
        toast.error("Sell Stone Products not found");
        return;
      }

      if (!productList.length) {
        toast.error("Add at least 1 slab");
        return;
      }

      const newProducts = await Promise.all(productList.map(uploadProduct));

      const gRef = doc(db, "sellStoneProducts", galleryId);
      const uRef = doc(
        db,
        "SellerDetails",
        uid,
        "sellStoneProducts",
        galleryId,
      );
      const gSnap = await getDoc(gRef);
      if (!gSnap.exists()) {
        toast.error("Sell Stone Products not found");
        setIsSubmitting(false);
        return;
      }

      await updateDoc(gRef, {
        products: arrayUnion(...newProducts),
      });

      await updateDoc(uRef, {
        products: arrayUnion(...newProducts),
      });
      console.log("p", newProducts);
      toast.success("New slabs added!");
      router.push("/dashboard/profile/my-stone-products");
      setProductList([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {!hasApprovedForm ? (
          <>
            <h1 className="font-medium text-primary text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
              Sell Stone Products
            </h1>
            <p className="text-[#6E6E6E] text-sm md:text-md lg:text-lg xl:text-xl">
              Share details of your artefact to list it for sell securely.
            </p>
          </>
        ) : (
          <div className="flex justify-center my-2">
            <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
              Add Product
            </h1>
          </div>
        )}
      </div>

      <div className=" relative">
        <form
          onSubmit={handleSubmit}
          className="max-md:space-y-5 md:flex  mt-4 md:mt-7 gap-5 xl:gap-10"
        >
          <div className="shadow-lg md:shadow-2xl p-4 rounded-lg md:w-3/5 space-y-2 md:space-y-4">
            {!hasApprovedForm && (
              <CompanyDetails
                onDataChange={setCompanyData}
                resetForm={resetForm}
              />
            )}
            {(hasApprovedForm ||
              (!hasApprovedForm &&
                (productList.length < 2 || editIndex !== null))) && (
              <ProductDetails
                ref={slabRef}
                setProductList={setProductList}
                editIndex={editIndex}
                hasApprovedForm={hasApprovedForm}
                productList={productList}
                setEditIndex={setEditIndex}
                editProduct={editProduct}
                resetForm={resetForm}
              />
            )}
          </div>

          <div className="md:w-2/5">
            {productList.length === 0 && (
              <div
                className="cursor-pointer bg-[#F4F4F4] text-[#3B3B3B] gap-1 text-xs lg:text-sm py-2 rounded-lg flex items-center justify-center"
                onClick={() => {
                  slabRef.current?.focusStoneCategory?.();
                  toast.error("Please fill all fields in product details", {
                    duration: 2000,
                  });
                }}
              >
                <span>
                  <FaPlus />
                </span>
                Add Product
              </div>
            )}

            <ProductView
              productList={productList}
              setProductList={setProductList}
              editIndex={editIndex}
              onEdit={handleEdit}
            />

            {productList.length > 0 && editIndex === null && (
              <div className="flex justify-end gap-2 mt-5 text-xs md:text-sm">
                <button
                  className={`cursor-pointer px-4 py-1 border border-gray-400 rounded-lg ${
                    isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={() => {
                    setProductList([]);
                    setResetForm(true);
                    setTimeout(() => setResetForm(false), 0);

                    toast.success("Data cleared successfully", {
                      duration: 2000,
                    });
                  }}
                  disabled={isSubmitting}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className={`cursor-pointer px-4 py-1 bg-primary hover:bg-[#6a1545] rounded-lg text-white ${
                    isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
