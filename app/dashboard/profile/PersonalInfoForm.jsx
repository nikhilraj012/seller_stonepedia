"use client";
import { MdOutlineEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const PersonalInfoForm = ({
  seller,
  setSeller,
  editMode,
  setEditMode,
}) => {
      const router = useRouter();
  const fullNameRef = useRef(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordForVerification, setPasswordForVerification] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (seller?.email) {
      setNewEmail(seller.email);
      setEmailVerified(seller.emailVerified || false);
    }
  }, [seller]);
  useEffect(() => {
    if (editMode && fullNameRef.current) fullNameRef.current.focus();
  }, [editMode]);

  const checkDuplicate = async (phone, uid) => {
    const q2 = query(
      collection(db, "SellerDetails"),
      where("phoneNumber", "==", phone),
    );
    const s2 = await getDocs(q2);

    if (!s2.empty && s2.docs[0].id !== uid) {
      return "Phone already used by another user";
    }

    return null;
  };
  const handleEmailVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q1 = query(
      collection(db, "SellerDetails"),
      where("email", "==", newEmail),
    );

    const s1 = await getDocs(q1);

    if (!s1.empty && s1.docs[0].id !== user.uid) {
      toast.error("This email is already registered!");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForVerification,
      );
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);

      toast.success("Verification email sent. Please verify.");
      setShowEmailModal(false);
      setPasswordForVerification("");

      // Start real-time verification check
      startRealTimeVerificationCheck();

      await signOut(auth);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered!");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format!");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Wrong password!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const startRealTimeVerificationCheck = () => {
    let checkCount = 0;
    const maxChecks = 60; // Check for 5 minutes (60 * 5 seconds)

    const checkVerification = async () => {
      try {
        checkCount++;

        const currentUser = auth.currentUser;

        if (currentUser) {
          await currentUser.reload();

          if (currentUser.emailVerified) {
            const sellerRef = doc(db, "SellerDetails", currentUser.uid);
            await updateDoc(sellerRef, {
              email: currentUser.email,
              emailVerified: true,
            });

            toast.success("Email verified successfully!");
            setTimeout(() => {
              router.refresh();
            }, 1500);
            return; // Stop checking
          }
        } else {
          console.log("User signed out, waiting for manual login");
        }

        // Continue checking if not verified and under max checks
        if (checkCount < maxChecks) {
          setTimeout(checkVerification, 5000); // Check every 5 seconds
        } else {
          toast.error("Verification timeout. Please login again to check.");
        }
      } catch (error) {
        console.log("Verification check error:", error);
        if (checkCount < maxChecks) {
          setTimeout(checkVerification, 5000);
        }
      }
    };

    // Start checking after 10 seconds (give user time to verify email)
    setTimeout(checkVerification, 10000);
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await sendEmailVerification(user);

      setVerificationSent(true);
      toast.success("Verification email sent!");

      const interval = setInterval(async () => {
        await user.reload();

        if (user.emailVerified) {
          clearInterval(interval);

          await updateDoc(doc(db, "SellerDetails", user.uid), {
            emailVerified: true,
          });

          setEmailVerified(true);
          setVerificationSent(false);
          setSeller((prev) => ({
            ...prev,
            emailVerified: true,
          }));

          toast.success("Email verified successfully!");
        }
      }, 4000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const error = await checkDuplicate(seller.phoneNumber, user.uid);
    if (error) {
      toast.error(error);
      return;
    }

    if (newEmail !== user.email) {
      toast.error("Please verify new email first!");
      return;
    }

    await updateDoc(doc(db, "SellerDetails", user.uid), {
      ...seller,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    setEditMode(false);
    toast.success("Profile Updated Successfully");
  };

  return (
    <>
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
              For security, please enter your current password before sending
              verification.
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
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
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
                        setEmailChanged(e.target.value !== seller?.email);
                      }}
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    />
                    {!emailVerified || emailChanged ? (
                      <button
                        type="button"
                        disabled={verificationSent}
                        onClick={() => {
                          if (editMode && emailChanged) {
                            setShowEmailModal(true);
                          } else {
                            handleResendVerification();
                          }
                        }}
                        className="px-3 mr-2 py-1.5 cursor-pointer text-xs text-white font-medium bg-primary rounded-lg ml-2 disabled:opacity-60"
                      >
                        {verificationSent ? "Sent" : "Send Verification"}
                      </button>
                    ) : (
                      // <span className="text-green-600 mr-2 font-bold text-sm ml-2">
                      //   ✔ Verified
                      // </span>
                      <span className="text-green-600 mr-2 font-bold text-sm ml-2 flex items-center gap-1">
                        <FaCheck size={12} />
                        Verified
                      </span>
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
              onClick={() => {
                setNewEmail(seller?.email);
                setEditMode(false);
                setEmailChanged(false);
              }}
              className="px-4 xl:px-6 cursor-pointer border-gray-400 text-xs font-medium md:text-sm     py-2 border rounded-lg"
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
    </>
  );
};

export default PersonalInfoForm;
