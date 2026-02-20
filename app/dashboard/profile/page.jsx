"use client";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import UnitForm from "./UnitForm";
import CompanyProfileForm from "./CompanyProfileForm";
import PersonalInfoForm from "./PersonalInfoForm";

const Page = () => {
  const [companyExists, setCompanyExists] = useState(false);
  const [seller, setSeller] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false)
  const [editMode, setEditMode] = useState(false);
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

  const saveSubDoc = async (e, path, data, setExists, setEdit, msg) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "SellerDetails", user.uid, ...path);
    await setDoc(ref, data, { merge: true });

    setExists(true);
    setEdit(false);
    toast.success(msg);
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

          // Fetch sub-documents
          await fetchSubDoc(
            ["CompanyData", "info"],
            setCompany,
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

  // const handleCompanySave = (e) => {
  //   const msg = companyExists ? "Company Updated" : "Company Created";
  //   saveSubDoc(
  //     e,
  //     ["CompanyData", "info"],
  //     company,
  //     setCompanyExists,
  //     setCompanyEdit,
  //     msg,
  //   );
  // };
  const handleCompanySave = (e) => {
    e.preventDefault();
    const msg = companyExists ? "Company Updated" : "Company Created";

    const dataToSave = {
      ...company,
      country: company.country?.label || company.country || "",
      state: company.state?.label || company.state || "",
      city: company.city?.label || company.city || "",
    };

    saveSubDoc(
      e,
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

    let updatedData = { ...data };

    try {
      // Upload Image
      if (data.imageFile) {
        const [img] = await uploadFiles(data.imageFile, folderName, "image");
        updatedData.imageUrl = img.url;
        delete updatedData.imageFile;
      }

      // Upload Brochure
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
      );
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const processingConfig = useMemo(
    () => ({
      data: processingUnit,
      setData: setProcessingUnit,
      exists: processingExists,
      edit: processingEdit,
      setEdit: setProcessingEdit,
      onSave: (e) =>
        saveUnitData({
          e,
          data: processingUnit,
          setData: setProcessingUnit,
          setExists: setProcessingExists,
          setEdit: setProcessingEdit,
          folderName: "ProcessingUnit",
          docName: "ProcessingUnit",
          allowBrochure: true,
          exists: processingExists,
        }),
    }),
    [processingUnit, processingExists, processingEdit],
  );

  const galleryConfig = useMemo(
    () => ({
      data: gallery,
      setData: setGallery,
      exists: galleryExists,
      edit: galleryEdit,
      setEdit: setGalleryEdit,
      onSave: (e) =>
        saveUnitData({
          e,
          data: gallery,
          setData: setGallery,
          setExists: setGalleryExists,
          setEdit: setGalleryEdit,
          folderName: "GalleryDetails",
          docName: "GalleryDetails",
          allowBrochure: false,
          exists: galleryExists,
        }),
    }),
    [gallery, galleryExists, galleryEdit],
  );
  const stoneConfig = useMemo(
    () => ({
      data: stoneProduct,
      setData: setStoneProduct,
      exists: stoneExists,
      edit: stoneEdit,
      setEdit: setStoneEdit,
      onSave: (e) =>
        saveUnitData({
          e,
          data: stoneProduct,
          setData: setStoneProduct,
          setExists: setStoneExists,
          setEdit: setStoneEdit,
          folderName: "StoneProduct",
          docName: "StoneProduct",
          allowBrochure: false,
          exists: stoneExists,
        }),
    }),
    [stoneProduct, stoneExists, stoneEdit],
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
          {/* <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Settings
          </h1> */}
          <p className="text-sm sm:text-base text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>
        <PersonalInfoForm
          seller={seller}
          setSeller={setSeller}
          editMode={editMode}
          setEditMode={setEditMode}
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
