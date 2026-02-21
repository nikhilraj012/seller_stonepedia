"use client";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import UnitForm from "./UnitForm";
import CompanyProfileForm from "./CompanyProfileForm";
import PersonalInfoForm from "./PersonalInfoForm";
import { useUi } from "@/app/components/context/UiContext";
import useLocation from "@/app/hooks/useLocation";
const Page = () => {
  const { isSubmitting, setIsSubmitting } = useUi();

  const [companyExists, setCompanyExists] = useState(false);
  const [seller, setSeller] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyEdit, setCompanyEdit] = useState(false);
  const [gallery, setGallery] = useState({});
  const [newEmail, setNewEmail] = useState("");
  const [galleryExists, setGalleryExists] = useState(false);
  const [galleryEdit, setGalleryEdit] = useState(false);
  const [processingUnit, setProcessingUnit] = useState({});
  const [processingExists, setProcessingExists] = useState(false);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stoneProduct, setStoneProduct] = useState({});
  const [stoneExists, setStoneExists] = useState(false);
  const [stoneEdit, setStoneEdit] = useState(false);
  const storage = getStorage();
  const { countries, states, cities } = useLocation(
    company?.country,
    company?.state,
  );
  const normalize = (str) =>
    typeof str === "string"
      ? str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  const uploadFiles = async (files, baseFolder, subFolder) => {
    if (!files) return [];

    const user = auth.currentUser;
    if (!user) return [];

    const uid = user.uid;
    const fileArray = Array.isArray(files) ? files : [files];

    return Promise.all(
      fileArray.map(async (f) => {
        const file = f.file || f;
        const name = file.name || `file_${Date.now()}`;

        const fileRef = ref(
          storage,
          `${baseFolder}/${uid}/${subFolder}/${name}`,
        );

        await uploadBytes(fileRef, file);

        return {
          url: await getDownloadURL(fileRef),
          name,
        };
      }),
    );
  };
  const fetchSubDoc = async (path, setter, existsSetter) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "SellerDetails", user.uid, ...path);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setter(snap.data());
      existsSetter(true);
    } else {
      existsSetter(false);
    }
  };
  const saveSubDoc = async (path, data, setExists, setEdit, msg) => {
    const user = auth.currentUser;
    if (!user) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Please wait...");

    try {
      const ref = doc(db, "SellerDetails", user.uid, ...path);
      await setDoc(ref, data, { merge: true });

      setExists(true);
      setEdit(false);

      toast.success(msg, { id: toastId });
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        await user.reload();
        const sellerRef = doc(db, "SellerDetails", user.uid);
        const snap = await getDoc(sellerRef);

        if (snap.exists()) {
          const data = snap.data();
          // Check if email was recently verified and needs to be updated in Firestore
          if (user.emailVerified && !data.emailVerified) {
            await updateDoc(sellerRef, {
              email: user.email,
              emailVerified: true,
            });
            toast.success("Email verified successfully!");
            // Update local state
            setSeller((prev) => ({
              ...prev,
              email: user.email,
              emailVerified: true,
            }));
            setNewEmail(user.email);
            setEmailVerified(true);
            setEmailChanged(false);
          }
          setSeller({ ...data, emailVerified: user.emailVerified });
          setNewEmail(user.email);
          setEmailVerified(user.emailVerified);
          if (data.email !== user.email) {
            await updateDoc(sellerRef, {
              email: user.email,
              emailVerified: user.emailVerified,
            });
            toast.success("Email synced successfully!");
          }

          await fetchSubDoc(
            ["CompanyData", "info"],
            (data) => {
              setCompany({
                ...data,
                country: data.country,
                state: data.state,
                city: data.city,
              });
            },
            setCompanyExists,
          );
          await fetchSubDoc(
            ["GalleryDetails", "info"],
            setGallery,
            setGalleryExists,
          );
          await fetchSubDoc(
            ["ProcessingUnit", "info"],
            setProcessingUnit,
            setProcessingExists,
          );
          await fetchSubDoc(
            ["StoneProduct", "info"],
            setStoneProduct,
            setStoneExists,
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!company) return;

    const companyCountryLabel =
      typeof company.country === "string"
        ? company.country
        : company.country?.label || "";

    const companyStateLabel =
      typeof company.state === "string"
        ? company.state
        : company.state?.label || "";

    const companyCityLabel =
      typeof company.city === "string"
        ? company.city
        : company.city?.label || "";

    const countryObj = countries.find(
      (c) => normalize(c.label) === normalize(companyCountryLabel),
    );

    const stateObj = countryObj
      ? states.find((s) => normalize(s.label) === normalize(companyStateLabel))
      : null;

    const cityObj =
      countryObj && stateObj
        ? cities.find((c) => normalize(c.label) === normalize(companyCityLabel))
        : null;

    // Only update if anything changed
    if (
      countryObj !== company.country ||
      stateObj !== company.state ||
      cityObj !== company.city
    ) {
      setCompany((prev) => ({
        ...prev,
        country: countryObj || prev.country,
        state: stateObj || prev.state,
        city: cityObj || prev.city,
      }));
    }
  }, [countries, states, cities]); 
  
  const handleCompanySave = async (e) => {
    e.preventDefault();

    const msg = companyExists
      ? "Company Updated Successfully"
      : "Company Created Successfully";

    const dataToSave = {
      ...company,
      country: company.country?.label || company.country || "",
      state: company.state?.label || company.state || "",
      city: company.city?.label || company.city || "",
    };

    await saveSubDoc(
      ["CompanyData", "info"],
      dataToSave,
      setCompanyExists,
      setCompanyEdit,
      msg,
    );
  };
  const saveUnitData = async ({
    e,
    data,
    setExists,
    setEdit,
    folderName,
    docName,
    requireImage = true,
    allowBrochure = false,
    exists,
  }) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    if (requireImage && !data?.imageUrl && !data?.imageFile) {
      toast.error("Image is required");
      return;
    }

    setIsSubmitting(true);

    const toastId = toast.loading(exists ? "Updating..." : "Creating...");

    let updatedData = { ...data };

    try {
      if (data.imageFile) {
        const [img] = await uploadFiles(data.imageFile, folderName, "image");
        updatedData.imageUrl = img.url;
        delete updatedData.imageFile;
      }

      if (allowBrochure && data.brochureFile) {
        const [pdf] = await uploadFiles(
          data.brochureFile,
          folderName,
          "brochure",
        );
        updatedData.brochureUrl = pdf.url;
        delete updatedData.brochureFile;
      }

      await setDoc(
        doc(db, "SellerDetails", user.uid, docName, "info"),
        updatedData,
        { merge: true },
      );

      setExists(true);
      setEdit(false);
      toast.success(
        exists
          ? `${docName} Updated Successfully`
          : `${docName} Created Successfully`,
        { id: toastId },
      );
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  const processingConfig = useMemo(
    () => ({
      data: processingUnit,
      setData: setProcessingUnit,
      exists: processingExists,
      edit: processingEdit,
      setEdit: setProcessingEdit,
      isSubmitting,

      onSave: (e) =>
        saveUnitData({
          e,
          data: processingUnit,
          setData: setProcessingUnit,
          setExists: setProcessingExists,
          setEdit: setProcessingEdit,
          folderName: "ProcessingUnit",
          docName: "Processing Unit",
          allowBrochure: true,
          exists: processingExists,
        }),
    }),
    [processingUnit, processingExists, processingEdit, isSubmitting],
  );

  const galleryConfig = useMemo(
    () => ({
      data: gallery,
      setData: setGallery,
      exists: galleryExists,
      edit: galleryEdit,
      setEdit: setGalleryEdit,
      isSubmitting,
      onSave: (e) =>
        saveUnitData({
          e,
          data: gallery,
          setData: setGallery,
          setExists: setGalleryExists,
          setEdit: setGalleryEdit,
          folderName: "GalleryDetails",
          docName: "Gallery Details",
          allowBrochure: false,
          exists: galleryExists,
        }),
    }),
    [gallery, galleryExists, galleryEdit, isSubmitting],
  );
  const stoneConfig = useMemo(
    () => ({
      data: stoneProduct,
      setData: setStoneProduct,
      exists: stoneExists,
      edit: stoneEdit,
      setEdit: setStoneEdit,
      isSubmitting,
      onSave: (e) =>
        saveUnitData({
          e,
          data: stoneProduct,
          setData: setStoneProduct,
          setExists: setStoneExists,
          setEdit: setStoneEdit,
          folderName: "StoneProduct",
          docName: "Stone Product",
          allowBrochure: false,
          exists: stoneExists,
        }),
    }),
    [stoneProduct, stoneExists, stoneEdit, isSubmitting],
  );

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  return (
    <div className="mt-9 md:mt-10 lg:mt-12 min-h-screen py-6 sm:py-8 px-3 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Account Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage your profile and business information
          </p>
        </div>
        <PersonalInfoForm
          seller={seller}
          setSeller={setSeller}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          emailVerified={emailVerified}
          setEmailVerified={setEmailVerified}
        />

        <CompanyProfileForm
          company={company}
          setCompany={setCompany}
          companyExists={companyExists}
          companyEdit={companyEdit}
          setCompanyEdit={setCompanyEdit}
          onSave={handleCompanySave}
          isSubmitting={isSubmitting}
        />

        <UnitForm
          title="Processing Unit"
          description="Manage your processing unit details."
          aboutLabel="About Processing Unit"
          imageLabel="Upload E-Processing Unit"
          brochureLabel="Upload Brochure"
          config={processingConfig}
        />
        <UnitForm
          title="E-Gallery"
          description="Manage your E-Gallery."
          aboutLabel="About Gallery"
          imageLabel="Upload Shop Image"
          config={galleryConfig}
        />
        <UnitForm
          title="Stone Product"
          description="Manage your stone product."
          aboutLabel="Description"
          imageLabel="Upload Company Logo"
          config={stoneConfig}
          textFieldName="description"
          showBrochure={false}
        />
      </div>
    </div>
  );
};
export default Page;
