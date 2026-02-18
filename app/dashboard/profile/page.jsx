
"use client";
import { LocationSelector } from "@/app/components/LocationSelector";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";

const Page = () => {
    const [companyExists, setCompanyExists] = useState(false);
    const [seller, setSeller] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [company, setCompany] = useState(null);
    const [companyEdit, setCompanyEdit] = useState(false);

    const [loading, setLoading] = useState(true);

    const fullNameRef = useRef(null);
    const companyNameRef = useRef(null);

    useEffect(() => {
        if (editMode && fullNameRef.current) {
            fullNameRef.current.focus();
        }
    }, [editMode]);

    useEffect(() => {
        if (companyEdit && companyNameRef.current) {
            companyNameRef.current.focus();
        }
    }, [companyEdit]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const snap = await getDoc(doc(db, "SellerDetails", user.uid));
                if (snap.exists()) {
                    setSeller(snap.data());
                }
                const companyRef = doc(db, "SellerDetails", user.uid, "CompanyData", "info");
                const companySnap = await getDoc(companyRef);
                if (companySnap.exists()) {
                    setCompany(companySnap.data());
                    setCompanyExists(true);
                } else {
                    setCompanyExists(false);
                }



            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);


    // SAVE CHANGES
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) return;

            await updateDoc(doc(db, "SellerDetails", user.uid), seller);
            setEditMode(false);
            toast.success("Profile Updated");
        } catch (err) {
            console.log(err);
        }
    };

    const handleCompanySave = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const companyRef = doc(db, "SellerDetails", user.uid, "CompanyData", "info");
        await setDoc(companyRef, company, { merge: true });
        setCompanyExists(true);
        setCompanyEdit(false);
        toast.success("Company Saved");
    };

    if (loading) return <p className="p-10">Loading...</p>;
    return (
        <div className="mt-12  min-h-screen py-8 max-lg:px-4 lg:px-24 xl:px-32">
            <div className="space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
                    <p className="text-gray-500">
                        Manage your personal account and company information.
                    </p>
                </div>
                <form onSubmit={handleSave}>
                    {/* Personal Information Card */}
                    <div className="bg-white border-[#D7D7D7] rounded-2xl shadow-md ">

                        {/* Card Header */}
                        <div className=" bg-gray-100  px-6 py-4 flex justify-between items-center">
                            <div >
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
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="border  px-4 cursor-pointer py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <MdOutlineEdit />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* <div>
                                <label className="text-sm text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    value={seller?.fullName || ""}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setSeller({ ...seller, fullName: e.target.value })
                                    }
                                    className="w-full mt-1 border rounded-lg px-4 py-2 outline-none "
                                />
                            </div> */}
                                <div>
                                    <label className="mb-0.5 text-xs font-medium text-gray-600">
                                        Full Name
                                    </label>

                                    <div className="rounded-lg p-[1px] transition bg-transparent 
                  focus-within:bg-gradient-to-t 
                  focus-within:from-[#d6c9ea] 
                  focus-within:to-[#871B58]">

                                        <div className="flex items-center gap-2 rounded-lg bg-white 
                    border border-[#D7D7D7] 
                    transition focus-within:border-transparent">

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
                                                className="flex-1 bg-transparent outline-none border-0 
                   p-3 text-xs appearance-none w-full 
                   "
                                                style={{ WebkitAppearance: "none" }}
                                            />

                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <label className="mb-0.5 text-xs font-medium text-gray-600">
                                        Phone Number
                                    </label>

                                    <div
                                        className="rounded-lg p-[1px] transition bg-transparent
               focus-within:bg-gradient-to-t
               focus-within:from-[#d6c9ea]
               focus-within:to-[#871B58]"
                                    >
                                        <div
                                            className="flex items-center gap-2 rounded-lg bg-white
                 border border-[#D7D7D7]
                 transition focus-within:border-transparent"
                                        >
                                            <input
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                maxLength={10}

                                                required
                                                placeholder="Phone Number"
                                                value={seller?.phoneNumber || ""}
                                                disabled={!editMode}
                                                onChange={(e) =>
                                                    setSeller({ ...seller, phoneNumber: e.target.value })
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-0.5 text-xs font-medium text-gray-600">
                                        Email
                                    </label>

                                    <div
                                        className="rounded-lg p-[1px] transition bg-transparent
               focus-within:bg-gradient-to-t
               focus-within:from-[#d6c9ea]
               focus-within:to-[#871B58]"
                                    >
                                        <div
                                            className="flex items-center gap-2 rounded-lg bg-white
                 border border-[#D7D7D7]
                 transition focus-within:border-transparent"
                                        >
                                            <input
                                                type="email"
                                                required
                                                placeholder="Email Address"
                                                value={seller?.email || ""}
                                                disabled={!editMode}
                                                onChange={(e) =>
                                                    setSeller({ ...seller, email: e.target.value })
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
                        </div>
                    </div>
                    {editMode && (
                        <div className="flex justify-end gap-4 pt-2">
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-6 cursor-pointer py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2  cursor-pointer bg-primary text-white rounded-lg hover:bg-primary/80S"
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
                        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg text-gray-800">
                                    Company Profile
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Manage company details.
                                </p>
                            </div>

                            {/* {!companyEdit && (
                            <button
                                onClick={() => setCompanyEdit(true)}
                                className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                                <MdOutlineEdit />
                                Edit Company
                            </button>
                        )} */}
                            {companyExists && !companyEdit && (

                                <button
                                    onClick={() => setCompanyEdit(true)}
                                    className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <MdOutlineEdit />
                                    Edit Company
                                </button>
                            )}

                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Company Name */}
                                <div>
                                    <label className="mb-0.5 text-xs font-medium text-gray-600">
                                        Company Name
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
                                                    setCompany({ ...company, companyName: e.target.value })
                                                }
                                                className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Website */}
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
                                                    setCompany({ ...company, websiteUrl: e.target.value })
                                                }
                                                className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                                            />
                                        </div>
                                    </div>
                                </div>
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


                                {/* Pincode */}
                                <div>
                                    <label className="mb-0.5 text-xs font-medium text-gray-600">
                                        Pincode
                                    </label>
                                    <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                                        <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                                            <input
                                                type="text"
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

                            {/* Address */}
                            <div>
                                <label className="mb-0.5 text-xs font-medium text-gray-600">
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
                        <div className="flex justify-end gap-4 pt-2">

                            {companyExists && (
                                <button
                                    onClick={() => setCompanyEdit(false)}
                                    className="px-6 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"

                                className="px-6 py-2 bg-primary text-white rounded-lg"
                            >
                                {companyExists ? "Save Changes" : "Create Company"}
                            </button>

                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

export default Page;
