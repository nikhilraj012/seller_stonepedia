"use client";
import { LocationSelector } from "@/app/components/LocationSelector";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged, updateEmail, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import UnitForm from "./UnitForm";
import { collection, query, where, getDocs } from "firebase/firestore";
// import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const Page = () => {

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [companyExists, setCompanyExists] = useState(false);
  const [seller, setSeller] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyEdit, setCompanyEdit] = useState(false);
  const [gallery, setGallery] = useState({});
  const [galleryExists, setGalleryExists] = useState(false);
  const [galleryEdit, setGalleryEdit] = useState(false);
  const [processingUnit, setProcessingUnit] = useState({});
  const [processingExists, setProcessingExists] = useState(false);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordForVerification, setPasswordForVerification] = useState("");

  const fullNameRef = useRef(null);
  const companyNameRef = useRef(null);
  const storage = getStorage();


  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleFileUpload = async (file, path, setter, nameKey, urlKey) => {
    if (!file) return;


    setter((prev) => ({
      ...prev,
      [nameKey]: file.name,
    }));

    try {

      const url = await uploadFile(file, path);

      setter((prev) => ({
        ...prev,
        [urlKey]: url,
      }));
    } catch (err) {
      console.log(err);
      toast.error("File upload failed");
    }
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
    if (editMode && fullNameRef.current) fullNameRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (companyEdit && companyNameRef.current) companyNameRef.current.focus();
  }, [companyEdit]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (!user) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       await user.reload(); // refresh latest emailVerified status

  //       // Set seller state with existing Firestore data + emailVerified
  //       const snap = await getDoc(doc(db, "SellerDetails", user.uid));
  //       const sellerData = snap.exists() ? snap.data() : {};

  //       setSeller({
  //         ...sellerData,
  //         emailVerified: user.emailVerified, // live status
  //       });

  //       // Update email in Firestore if verified
  //       if (user.emailVerified) {
  //         await updateDoc(doc(db, "SellerDetails", user.uid), {
  //           email: user.email,
  //           emailVerified: true,
  //         });
  //       }


  //       // Fetch sub-documents
  //       await fetchSubDoc(["CompanyData", "info"], setCompany, setCompanyExists);
  //       await fetchSubDoc(["GalleryDetails", "info"], setGallery, setGalleryExists);
  //       await fetchSubDoc(["ProcessingUnit", "info"], setProcessingUnit, setProcessingExists);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      await user.reload(); // 🔥 MOST IMPORTANT LINE

      const sellerRef = doc(db, "SellerDetails", user.uid);
      const snap = await getDoc(sellerRef);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const sellerData = snap.data();

      // 🔥🔥🔥 REAL FIX
      if (user.email !== sellerData.email) {
        await updateDoc(sellerRef, {
          email: user.email,
          emailVerified: user.emailVerified,
        });
      }

      setSeller({
        ...sellerData,
        email: user.email, // ALWAYS AUTH EMAIL
      });

      setNewEmail(user.email);
      setEmailVerified(user.emailVerified);

      setLoading(false);
    });

    return () => unsub();
  }, []);


  const handleImageUpload = (e) =>
    handleFileUpload(
      e.target.files[0],
      `processing-units/${auth.currentUser.uid}/image.jpg`,
      setProcessingUnit,
      "imageName",
      "imageUrl",
    );

  const handleBrochureUpload = (e) =>
    handleFileUpload(
      e.target.files[0],
      `processing-units/${auth.currentUser.uid}/brochure.pdf`,
      setProcessingUnit,
      "brochureName",
      "brochureUrl",
    );

  const handleGalleryImageUpload = (e) =>
    handleFileUpload(
      e.target.files[0],
      `e-gallery/${auth.currentUser.uid}/image.jpg`,
      setGallery,
      "imageName",
      "imageUrl",
    );

  const handleGalleryBrochureUpload = (e) =>
    handleFileUpload(
      e.target.files[0],
      `e-gallery/${auth.currentUser.uid}/brochure.pdf`,
      setGallery,
      "brochureName",
      "brochureUrl",
    );


  const checkDuplicate = async (phone, uid) => {
    // const q1 = query(
    //   collection(db, "SellerDetails"),
    //   where("email", "==", email)
    // );
    // const s1 = await getDocs(q1);

    // if (!s1.empty && s1.docs[0].id !== uid) {
    //   return "Email already used by another user";
    // }

    const q2 = query(
      collection(db, "SellerDetails"),
      where("phoneNumber", "==", phone)
    );
    const s2 = await getDocs(q2);

    if (!s2.empty && s2.docs[0].id !== uid) {
      return "Phone already used by another user";
    }

    return null;
  };


  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const error = await checkDuplicate(seller.email, seller.phoneNumber, user.uid);
  //   if (error) {
  //     toast.error(error);
  //     return;
  //   }

  //   await updateDoc(doc(db, "SellerDetails", user.uid), seller);

  //   setEditMode(false);
  //   toast.success("Profile Updated");
  // };
  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   // if (emailChanged) {
  //   //   toast.error("Please verify new email first!");
  //   //   return;
  //   // }

  //   const error = await checkDuplicate(seller.phoneNumber, user.uid);
  //   if (error) {
  //     toast.error(error);
  //     return;
  //   }

  //   await updateDoc(doc(db, "SellerDetails", user.uid), {
  //     ...seller,
  //     email: user.email, // Always Auth email
  //   });

  //   setEditMode(false);
  //   toast.success("Profile Updated");
  // };
  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const error = await checkDuplicate(seller.phoneNumber, user.uid);
    if (error) {
      toast.error(error);
      return;
    }

    // 🔴 Stop save if email changed but not verified
    if (newEmail !== user.email) {
      toast.error("Please verify new email first!");
      return;
    }

    // ✅ Save profile
    await updateDoc(doc(db, "SellerDetails", user.uid), {
      ...seller,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    setEditMode(false);
    toast.success("Profile Updated Successfully");
  };

  const handleCompanySave = (e) => {
    const msg = companyExists ? "Company Updated" : "Company Created";
    saveSubDoc(
      e,
      ["CompanyData", "info"],
      company,
      setCompanyExists,
      setCompanyEdit,
      msg,
    );
  };

  const handleProcessingSave = (e) => {
    if (!processingExists && !processingUnit?.imageUrl) {
      e.preventDefault();
      toast.error("Processing Unit Image is required");
      return;
    }

    const msg = processingExists ? "Processing Unit Updated" : "Processing Unit Created";

    saveSubDoc(
      e,
      ["ProcessingUnit", "info"],
      processingUnit,
      setProcessingExists,
      setProcessingEdit,
      msg,
    );
  };

  const handleGallerySave = (e) => {
    if (!gallery?.imageUrl) {
      e.preventDefault();
      toast.error("Gallery Image is required");
      return;
    }

    const msg = galleryExists ? "E-Gallery Updated" : "E-Gallery Created";

    saveSubDoc(
      e,
      ["GalleryDetails", "info"],
      gallery,
      setGalleryExists,
      setGalleryEdit,
      msg,
    );
  };
  const reauthenticateUser = async () => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      toast.error("Wrong password");
      return false;
    }
  };
  // const handleEmailVerification = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   if (!currentPassword) {
  //     toast.error("Enter your current password first");
  //     return;
  //   }

  //   if (newEmail === user.email) {
  //     toast.error("New email must be different from current email");
  //     return;
  //   }

  //   try {
  //     const credential = EmailAuthProvider.credential(
  //       user.email,
  //       currentPassword
  //     );

  //     await reauthenticateWithCredential(user, credential);

  //     await verifyBeforeUpdateEmail(user, newEmail);
  //     setIsVerifyingEmail(true);
  //     toast.success("Verification email sent to new email!");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };
  // const handleEmailVerification = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   try {
  //     const credential = EmailAuthProvider.credential(
  //       user.email,
  //       password
  //     );

  //     await reauthenticateWithCredential(user, credential);
  //     await verifyBeforeUpdateEmail(user, newEmail);

  //     toast.success("Verification email sent!");

  //     // 🔁 Start polling to check verification
  //     const interval = setInterval(async () => {
  //       await user.reload();

  //       if (user.email === newEmail && user.emailVerified) {
  //         clearInterval(interval);

  //         await updateDoc(doc(db, "SellerDetails", user.uid), {
  //           ...seller,
  //           email: newEmail,
  //           emailVerified: true,
  //         });

  //         toast.success("Email verified & updated!");
  //         setShowEmailModal(false);
  //         setPassword("");
  //       }
  //     }, 3000);

  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  // const handleEmailVerification = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   try {
  //     const credential = EmailAuthProvider.credential(
  //       user.email,
  //       passwordForVerification
  //     );

  //     await reauthenticateWithCredential(user, credential);

  //     await verifyBeforeUpdateEmail(user, newEmail);

  //     toast.success("Verification email sent!");

  //     const interval = setInterval(async () => {
  //       await user.reload();

  //       if (user.emailVerified && user.email === newEmail) {
  //         clearInterval(interval);

  //         // Update Firestore with new verified email
  //         await updateDoc(doc(db, "SellerDetails", user.uid), {
  //           email: newEmail,
  //           emailVerified: true,
  //         });

  //         setSeller((prev) => ({
  //           ...prev,
  //           email: newEmail,
  //         }));

  //         setNewEmail(newEmail);
  //         setEmailVerified(true);
  //         setEmailChanged(false);

  //         toast.success("Email verified & updated successfully!");
  //       }
  //     }, 3000);

  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  const handleEmailVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForVerification
      );

      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, newEmail);

      toast.success("Verification email sent. Please verify and come back.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // const handleEmailVerification = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   try {
  //     const credential = EmailAuthProvider.credential(
  //       user.email,
  //       passwordForVerification   // ✅ correct state
  //     );

  //     await reauthenticateWithCredential(user, credential);

  //     await verifyBeforeUpdateEmail(user, newEmail);

  //     setIsVerifyingEmail(true);

  //     toast.success("Verification email sent to new email!");

  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  const processingConfig = useMemo(
    () => ({
      data: processingUnit,
      setData: setProcessingUnit,
      exists: processingExists,
      edit: processingEdit,
      setEdit: setProcessingEdit,
      onSave: handleProcessingSave,
      onImageUpload: handleImageUpload,
      onBrochureUpload: handleBrochureUpload,
    }),
    [processingUnit, processingExists, processingEdit],
  );

  // Gallery Config
  const galleryConfig = useMemo(
    () => ({
      data: gallery,
      setData: setGallery,
      exists: galleryExists,
      edit: galleryEdit,
      setEdit: setGalleryEdit,
      onSave: handleGallerySave,
      onImageUpload: handleGalleryImageUpload,
      onBrochureUpload: handleGalleryBrochureUpload,
    }),
    [gallery, galleryExists, galleryEdit],
  );

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
        <p className="mt-6 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
  return (
    <div className="mt-9 md:mt-10 lg:mt-12 min-h-screen py-6 sm:py-8 px-3 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Modal Card */}
          <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-full p-6 relative animate-fadeIn">
            {/* Close Button */}


            {/* Header */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Verify Your Password
            </h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              For security, please enter your current password before sending verification.
            </p>

            {/* Password Input */}
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordForVerification}
              onChange={(e) => setPasswordForVerification(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setPasswordForVerification("");
                }}
                className="px-4 cursor-pointer py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!passwordForVerification) {
                    toast.error("Please enter your password");
                    return;
                  }

                  await handleEmailVerification();
                  setShowEmailModal(false);
                  setPasswordForVerification("");
                }}
                className="px-4 cursor-pointer py-2 text-sm font-medium bg-primary  text-white font-medium rounded-lg   transition"
              >
                Verify & Send
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6 sm:space-y-8">
        <div>
          {/* <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Settings
          </h1> */}
          <p className="text-sm sm:text-base text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>
        <form onSubmit={handleSave}>
          <div className="bg-white border-[#D7D7D7] rounded-2xl shadow-md">
            <div className="bg-gray-100 px-4 sm:px-6 rounded-t-xl py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between sm:items-center">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your personal details.
                </p>
              </div>
              {/* <button
                            onClick={() => setEditMode(!editMode)}
                            className="border px-4 cursor-pointer py-2 rounded-lg text-sm"
                        >
                            {editMode ? "Cancel Edit" : "Edit Profile"}
                        </button> */}
              {!editMode && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="border w-fit  px-4 cursor-pointer py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <MdOutlineEdit />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                    <span className="text-red-500 text-[17px] mt-1">*</span>
                    Full Name
                  </label>

                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                      <input
                        ref={fullNameRef}
                        required
                        type="text"
                        placeholder="Full Name"
                        value={seller?.fullName || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setSeller({ ...seller, fullName: e.target.value })
                        }
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs appearance-none w-full 
                   "
                        style={{ WebkitAppearance: "none" }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                    <span className="text-red-500 text-[17px] mt-1">*</span>
                    Phone Number
                  </label>

                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        placeholder="Phone Number"
                        value={seller?.phoneNumber || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setSeller({
                            ...seller,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent outline-none border-0
                   p-3 text-xs appearance-none w-full
                 "
                        style={{ WebkitAppearance: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="mb-0.5 text-xs font-medium text-gray-600">
                    Email
                  </label>

                  <div className="rounded-lg p-[1px]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7]">
                      <input
                        type="email"
                        value={newEmail}
                        disabled={!editMode}
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                          setEmailChanged(e.target.value !== auth.currentUser.email);
                          setEmailVerified(false);
                        }}
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                      />

                      {emailVerified ? (
                        <span className="text-green-600 mr-2 font-bold text-sm ml-2">
                          ✔ Verified
                        </span>
                      ) : (
                        editMode &&
                        emailChanged && (
                          <button
                            type="button"
                            onClick={() => setShowEmailModal(true)}
                            className="px-3 mr-2 py-1.5 cursor-pointer text-xs text-white font-medium bg-primary rounded-lg ml-2"
                          >
                            Send Verification
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          {editMode && (
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 xl:px-6 cursor-pointer border-gray-400 text-xs font-medium md:text-sm  py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 xl:px-6 py-2 cursor-pointer text-xs font-medium md:text-sm  bg-primary text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
        {/* Company Profile Card */}
        <form onSubmit={handleCompanySave}>
          <div className="bg-white border-[#D7D7D7] rounded-2xl shadow-md">
            {/* Header */}
            <div
              className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 
flex flex-col sm:flex-row 
gap-2 sm:gap-0  rounded-t-xl
justify-between sm:items-center"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  Company Profile
                </h2>
                <p className="text-sm text-gray-500">Manage company details.</p>
              </div>

              {companyExists && !companyEdit && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setCompanyEdit(true)}
                    className="border  w-fit px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2"
                  >
                    <MdOutlineEdit />
                    Edit Company
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                    <span className="text-red-500 text-[17px] mt-1">*</span>  Company Name
                  </label>
                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                      <input
                        ref={companyNameRef}
                        type="text"
                        required
                        value={company?.companyName || ""}
                        disabled={companyExists && !companyEdit}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            companyName: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                    <span className="text-red-500 text-[17px] mt-1">*</span>
                    Company Pincode
                  </label>
                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        pattern="\d{6}"
                        value={company?.pincode || ""}
                        disabled={companyExists && !companyEdit}
                        required
                        onChange={(e) =>
                          setCompany({ ...company, pincode: e.target.value })
                        }
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LocationSelector
                  country={company?.country}
                  state={company?.state}
                  city={company?.city}
                  disabled={companyExists && !companyEdit}
                  onChange={(loc) =>
                    setCompany((prev) => ({
                      ...prev,
                      ...loc,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600">
                    GST / Government Id
                  </label>
                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                      <input
                        type="text"
                        value={company?.gstNumber || ""}
                        disabled={companyExists && !companyEdit}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            gstNumber: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-0.5 text-xs font-medium text-gray-600">
                    Website URL
                  </label>
                  <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                    <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                      <input
                        type="url"
                        // placeholder="https://stonepedia.in/"
                        value={company?.websiteUrl || ""}
                        disabled={companyExists && !companyEdit}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            websiteUrl: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                  <span className="text-red-500 text-[17px] mt-1">*</span>
                  Address
                </label>
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                  <div className="bg-white border border-[#D7D7D7] rounded-lg focus-within:border-transparent">
                    <textarea
                      required
                      value={company?.address || ""}
                      disabled={companyExists && !companyEdit}
                      onChange={(e) =>
                        setCompany({ ...company, address: e.target.value })
                      }
                      className="w-full bg-transparent outline-none border-0 p-3 text-xs "
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(companyEdit || !companyExists) && (
            <div className="flex justify-end gap-4 pt-4">
              {companyExists && (
                <button
                  onClick={() => setCompanyEdit(false)}
                  className="px-4 xl:px-6 cursor-pointer border-gray-400 text-xs font-medium md:text-sm  py-2 border rounded-lg"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="px-4 xl:px-6 py-2 cursor-pointer text-xs font-medium md:text-sm  bg-primary text-white rounded-lg"
              >
                {companyExists ? "Save Changes" : "Create Company"}
              </button>
            </div>
          )}
        </form>
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
      </div>
    </div>
  );
};
export default Page;