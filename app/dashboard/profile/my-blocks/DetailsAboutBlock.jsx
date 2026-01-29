import React, { useEffect, useState } from "react";
import { MdFavoriteBorder, MdLocationOn } from "react-icons/md";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/app/firebase/config";
import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";

const DetailsAboutBlock = ({ block }) => {
  const [ownershipState, setOwnershipState] = useState({
    isOwner: false,
    isChecking: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [hasRequested, setHasRequested] = useState(false);
  const { setShowUserLogin, isSubmitting, setIsSubmitting } = useUi();
  const { isAuthenticated, uid, authEmail } = useAuth();

  useEffect(() => {
    // If no block ID or no authenticated user, they can't be the owner
    if (!block?.id || !isAuthenticated) {
      setOwnershipState({ isOwner: false, isChecking: false });
      return;
    }

    const checkOwnershipAndRequests = async () => {
      try {
        // Check if user owns this block
        const blockDetailsRef = collection(db, "SellerDetails", uid, "SellBlocks");
        const querySnapshot = await getDocs(blockDetailsRef);

        // Look for the block ID in the user's SellBlocks collection
        let isOwner = false;
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          if (data.blocks && Array.isArray(data.blocks)) {
            if (data.blocks.some((b) => b.id === block.id)) {
              isOwner = true;
              break;
            }
          }
        }

        // Check if user has already requested this block
        const requestsRef = collection(db, "Users", uid, "BlockRequests");

        // Try both possible field structures for block requests
        const directQuery = query(
          requestsRef,
          where("blockId", "==", block.id),
        );
        const nestedQuery = query(
          requestsRef,
          where("requestedBlockDetails.blockId", "==", block.id),
        );

        const [directSnapshot, nestedSnapshot] = await Promise.all([
          getDocs(directQuery),
          getDocs(nestedQuery),
        ]);

        const hasRequested = !directSnapshot.empty || !nestedSnapshot.empty;

        // Update states
        setHasRequested(hasRequested);
        setOwnershipState({
          isOwner,
          isChecking: false,
        });
      } catch (error) {
        // Set default values on error
        setOwnershipState({ isOwner: false, isChecking: false });
        setHasRequested(false);
      }
    };

    checkOwnershipAndRequests();
  }, [block?.id]);

  const handleContactUs = () => {
    if (!isAuthenticated) {
      setShowUserLogin(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleCancelContact = () => {
    // Close the modal without any action
    setShowConfirmModal(false);
  };

  // Format price to show K for thousands, L for lakhs, Cr for crores
  const formatPrice = (price) => {
    if (!price) return "";

    // Convert price to number if it's a string
    const numPrice =
      typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;

    if (isNaN(numPrice)) return price;

    // Format based on value
    if (numPrice >= 10000000) {
      // 1 crore = 10,000,000
      return `${(numPrice / 10000000).toFixed(2).replace(/\.00$/, "")}Cr`;
    } else if (numPrice >= 100000) {
      // 1 lakh = 100,000
      return `${(numPrice / 100000).toFixed(2).replace(/\.00$/, "")}L`;
    } else if (numPrice >= 1000) {
      // 1 thousand = 1,000
      return `${(numPrice / 1000).toFixed(2).replace(/\.00$/, "")}K`;
    } else {
      return numPrice.toString();
    }
  };

  // Function to determine which grade and price to display based on requirements
  const getPriceDisplay = () => {
    const { priceA, priceB, priceC, symbolA, symbolB, symbolC } = block;

    // Check prices in priority order: A, then B, then C
    if (priceA) return { grade: "A", price: priceA, symbol: symbolA };
    if (priceB) return { grade: "B", price: priceB, symbol: symbolB };
    if (priceC) return { grade: "C", price: priceC, symbol: symbolC };

    return null;
  };

  // Function to get remaining prices that should be displayed
  const getRemainingPrices = () => {
    const { priceA, priceB, priceC, symbolA, symbolB, symbolC } = block;
    const mainPrice = getPriceDisplay();
    const remainingPrices = [];

    // If A is the main price, show B and C
    if (mainPrice?.grade === "A") {
      if (priceB)
        remainingPrices.push({ grade: "B", price: priceB, symbol: symbolB });
      if (priceC)
        remainingPrices.push({ grade: "C", price: priceC, symbol: symbolC });
    }

    // If B is the main price, show C
    else if (mainPrice?.grade === "B") {
      if (priceC)
        remainingPrices.push({ grade: "C", price: priceC, symbol: symbolC });
    }

    return remainingPrices;
  };

  const handleConfirmContact = async () => {
    setIsSubmitting(true);
    try {
      // Get user data from Firestore
      const userDocRef = doc(db, "Users", uid);
      const userDocSnap = await getDoc(userDocRef);
      let userData = {};

      if (userDocSnap.exists()) {
        userData = userDocSnap.data();
      }

      // Create details object with user data
      const details = {
        name: userData.name,
        email: authEmail,
        phone: userData.phone,
        status: "Requested",
        requestedBlockDetails: {
          ...block,
        },
      };

      await addDoc(collection(db, "BlockRequests"), {
        ...details,
        seenByAdmin: false,
      });
      await addDoc(collection(db, "Users", uid, "RequestedBlock"), details);

      // Update local state to hide the contact button
      setHasRequested(true);

      // Show success toast message
      toast.success("Block request has been sent successfully!", {
        duration: 3000,
        position: "top-center",
      });

      // Close the modal
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error sending block request:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:w-1/2 relative">
      <div className="border border-[#DFDFDF] p-4 rounded-md space-y-2 md:space-y-4 xl:space-y-5 mt-6 md:mt-0">
        <div className="flex justify-between">
          <div className="md:space-y-0.5 xl:space-y-1">
            <div className="flex items-center gap-1 md:gap-1.5">
              {/* <span className="w-4 md:w-5 lg:w-6 xl:w-8">
                <svg
                  viewBox="0 0 39 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.4727 37L10.1045 31.3619L3.72273 29.9524L4.34318 23.4333L0 18.5L4.34318 13.5667L3.72273 7.04762L10.1045 5.63809L13.4727 0L19.5 2.55476L25.5273 0L28.8955 5.63809L35.2773 7.04762L34.6568 13.5667L39 18.5L34.6568 23.4333L35.2773 29.9524L28.8955 31.3619L25.5273 37L19.5 34.4452L13.4727 37ZM17.6386 24.7548L27.6545 14.8L25.1727 12.2452L17.6386 19.7333L13.8273 16.0333L11.3455 18.5L17.6386 24.7548Z"
                    fill="#3586F6"
                  />
                </svg>
              </span> */}
              <h1 className="font-semibold md:text-xl lg:text-2xl xl:text-4xl capitalize">
                {block.stoneName}
              </h1>
            </div>
            <div className="flex items-center gap-0.5 text-[#595959]">
              <span>
                <MdLocationOn className="text-xs md:text-sm xl:text-xl" />
              </span>
              <p className="text-[10px] md:text-xs xl:text-base">
                {block.quarryDetails.quarryCity},{" "}
                {block.quarryDetails.quarryState}.
              </p>
            </div>
          </div>
          {/* <div>
            <button className="text-[#595959]">
              <MdFavoriteBorder className="text-2xl lg:text-3xl xl:text-4xl" />
            </button>
          </div> */}
        </div>
        <div className="">
          <div>
            <p>Grade {getPriceDisplay()?.grade}</p>
            <h3 className="text-[#424242] font-semibold text-sm md:text-base lg:text-xl xl:text-2xl">
              {getPriceDisplay()?.symbol}{" "}
              {formatPrice(getPriceDisplay()?.price)}
              &nbsp;
              <span className="text-[8px] md:text-[10px] lg:text-xs xl:text-sm text-[#ABABAB] font-normal">
                (Without taxes)
              </span>
            </h3>
          </div>

          <div className="flex justify-between ">
            <div className="self-end">
              {getRemainingPrices().length > 0 && (
                <div className="flex gap-2">
                  {getRemainingPrices().map((price, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span className="text-[10px] md:text-xs lg:text-sm text-[#595959] mx-1">
                          |
                        </span>
                      )}
                      <p className="text-[10px] md:text-xs lg:text-sm text-[#595959]">
                        Grade {price.grade} : {price.symbol}{" "}
                        {formatPrice(price.price)}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            {!ownershipState.isChecking &&
              !ownershipState.isOwner &&
              (hasRequested ? (
                <div className="self-center px-2 md:px-4 py-1 md:py-2 text-green-600 text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-medium">
                  Request Sent
                </div>
              ) : (
                <button
                  onClick={handleContactUs}
                  className="cursor-pointer bg-primary self-center px-2 md:px-4 py-1 md:py-2 text-white rounded-md text-[8px] md:text-[10px] lg:text-xs xl:text-sm"
                >
                  Contact Us
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h2 className="font-semibold text-[#343434]">Block Details</h2>
        <div className="border border-[#DFDFDF] p-4 md:px-5 xl:px-6 rounded-md text-xs md:text-sm lg:text-base space-y-2 md:space-y-4 xl:space-y-5">
          <div className="md:flex md:justify-between gap-4">
            <div className="space-y-2 md:space-y-4 xl:space-y-5 max-md:flex max-md:justify-between">
              <div>
                <h3 className="font-semibold ">Block/Stone Name</h3>
                <p className="text-[#3A3A3A] capitalize">{block.stoneName}</p>
              </div>
              <div>
                <h3 className="font-semibold ">Origin</h3>
                <p className="text-[#3A3A3A]">{block.origin}</p>
              </div>
              <div>
                <h3 className="font-semibold ">Height x Width x Length</h3>
                <p className="text-[#282828]">
                  H {block.height} | W {block.width} | L {block.length}{" "}
                  <span className="text-xs text-[#9A9A9A] capitalize ml-1">
                    {block.units}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-y-2 md:space-y-4 xl:space-y-5 max-md:flex max-md:justify-between">
              <div>
                <h3 className="font-semibold">Grade</h3>
                <p className="text-[#3A3A3A]">
                  {block.priceA ? "A" : ""} {block.priceB ? "B" : ""}{" "}
                  {block.priceC ? "C" : ""}
                </p>
              </div>
              <div>
                <h3 className="font-semibold ">Minimum Order</h3>
                <p className="text-[#3A3A3A]">{block.minimumOrder} Tons</p>
              </div>
            </div>
            <div className="space-y-2 md:space-y-4 xl:space-y-5 max-md:flex max-md:justify-between">
              <div>
                <h3 className="font-semibold">Stone Category</h3>
                <p className="text-[#3A3A3A] capitalize">
                  {block.stoneCategory}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Nearby Port</h3>
                <p className="text-[#3A3A3A] capitalize">{block.portName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block Address */}
      <div className="mt-3 space-y-1">
        <h2 className="font-semibold text-[#343434]">Address</h2>
        <div className="border border-[#DFDFDF] p-4 md:px-5 xl:px-6 rounded-md space-y-2">
          <div className="flex items-center gap-0.5 text-[#595959]">
            <span>
              <MdLocationOn className="text-xs md:text-sm xl:text-xl" />
            </span>
            <p className="text-[10px] md:text-xs xl:text-base">
              {block.quarryDetails.quarryCity},{" "}
              {block.quarryDetails.quarryState},{" "}
              {block.quarryDetails.quarryCountry}
            </p>
          </div>
          {/* {block.quarryDetails.address && (
            <p className="text-[10px] md:text-xs xl:text-base text-[#595959] pl-5">
              {block.quarryDetails.address}
            </p>
          )} */}
          <div>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${block.quarryDetails.quarryCity}, ${block.quarryDetails.quarryState}, ${block.quarryDetails.quarryCountry}`,
              )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full md:h-[200px] xl:h-[300px] border border-[#DFDFDF] rounded-md"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-3 text-center">
              Contact Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Confirm your request. Our team will contact you with in 24 hours.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelContact}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm border border-gray-300 rounded-md ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmContact}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm border rounded-md border-primary text-primary hover:bg-primary hover:text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsAboutBlock;
