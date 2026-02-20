import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { FaChevronRight } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";
import { useUi } from "./context/UiContext";
import { useRouter } from "next/navigation";
import ProfileAvatar from "./common/ProfileAvatar";
import { db } from "../firebase/config";
import { usePathname } from "next/navigation";

const profilePages = [
  {
    title: "My Blocks",
    href: "/dashboard/profile/my-blocks",
  },
  {
    title: "My E-Processing Unit",
    href: "/dashboard/profile/my-e-processing-unit",
  },
  {
    title: "My E-Gallery",
    href: "/dashboard/profile/my-e-gallery",
  },
  {
    title: "My Stone Products",
    href: "/dashboard/profile/my-stone-products",
  },
  // {
  //   title: "My Chemicals",
  //   href: "/dashboard/profile/my-chemicals",
  // },
];

const NavbarProfile = ({ isMobile = false }) => {
  const pathname = usePathname();
  const { sellerDetails, logout } = useAuth();
  const { setIsMenuOpen, setShowProfileDropdown } = useUi();
  const router = useRouter();
  const hideUserSection = pathname === "/dashboard/profile";
  const handleLogout = async () => {
    await logout();
    if (isMobile) {
      setIsMenuOpen(false);
    } else {
      setShowProfileDropdown(false);
    }
  };

  const handleNavigation = (href) => {
    router.push(href);
    if (isMobile) {
      setIsMenuOpen(false);
    } else {
      setShowProfileDropdown(false);
    }
  };
  const handleFixAccount = async () => {
    if (!sellerDetails?.id) return;

    const updates = {};

    if (!sellerDetails.accountStatus) {
      updates.accountStatus = "pending";
    }

    if (sellerDetails.emailVerified === undefined) {
      updates.emailVerified = false;
    }

    if (!sellerDetails.role) {
      updates.role = "seller";
    }

    if (!sellerDetails.provider) {
      updates.provider = "password";
    }

    // agar kuch missing hai tabhi update
    if (Object.keys(updates).length > 0) {
      try {
        const sellerRef = doc(db, "SellerDetails", sellerDetails.id);
        await updateDoc(sellerRef, updates);
        alert("Account Updated");
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Already OK");
    }
  };

  if (isMobile) {
    return (
      <>
        <div className="flex items-center gap-3 px-2 py-2">
          <ProfileAvatar size={40} />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">
              {sellerDetails?.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {sellerDetails?.email}
            </p>
            {!hideUserSection && (
              <button
                onClick={() => handleNavigation("/dashboard/profile")}
                className="mt-1 text-xs cursor-pointer text-primary flex items-center gap-1"
              >
                View Profile   <FaChevronRight size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {profilePages.map((page) => (
            <button
              key={page.href}
              onClick={() => handleNavigation(page.href)}
              className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
            >
              {page.title}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#1E1E1E] text-white py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ProfileAvatar size={40} />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">
              {sellerDetails?.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {sellerDetails?.email}
            </p>
            {!hideUserSection && (
              // <button
              //   onClick={() => handleNavigation("/dashboard/profile")}
              //   className="mt-1 hover:cursor-pointer text-xs text-primary hover:underline"
              // >
              //   View Profile <FaChevronRight />
              // </button>
              <button
                onClick={() => handleNavigation("/dashboard/profile")}
                className="mt-1 text-xs cursor-pointer text-primary  flex items-center gap-1"
              >
                View Profile
                <FaChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <button
        onClick={handleFixAccount}
        className="w-full bg-blue-500 text-white py-2 rounded mt-2"
      >
        Fix Account
      </button> */}

      <div className="border-t border-gray-100">
        {profilePages.map((page) => (
          <button
            key={page.href}
            onClick={() => handleNavigation(page.href)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer active:text-primary"
          >
            {page.title}
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-primary text-white rounded-md py-2 cursor-pointer mt-2"
      >
        Logout
      </button>
    </div>
  );
};

export default NavbarProfile;
