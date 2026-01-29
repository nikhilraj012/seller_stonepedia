
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { db, storage, auth } from "../firebase/config";


export const uploadProfilePhoto = async (file, updateAppUser, onSuccess) => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    throw new Error("Invalid file type");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB");
    throw new Error("File size too large");
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    toast.loading("Uploading photo...", { id: "upload-photo" });

    // Get current user data to check for existing photo
    const userDocRef = doc(db, "SellerDetails", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const oldPhotoURL = userDocSnap.exists()
      ? userDocSnap.data().photoURL
      : null;

    // Delete old photo from storage if it exists
    if (oldPhotoURL) {
      try {
        const oldPhotoPath = decodeURIComponent(
          oldPhotoURL.split("/o/")[1]?.split("?")[0]
        );
        if (oldPhotoPath) {
          const oldPhotoRef = ref(storage, oldPhotoPath);
          await deleteObject(oldPhotoRef);
        }
      } catch (deleteError) {
        console.warn("Could not delete old photo:", deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new photo
    const storageRef = ref(
      storage,
      `profilePhotos/${user.uid}/${Date.now()}_${file.name}` 
    );
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Update Firebase Auth profile
    await updateProfile(user, { photoURL: downloadURL });

    // Update Firestore user document
    await updateDoc(userDocRef, {
      photoURL: downloadURL,
    });

    // 🔥 Update AuthContext state (updates Navbar & MobileNav instantly)
    updateAppUser({
      photoURL: downloadURL,
    });

    toast.success("Profile photo updated successfully", {
      id: "upload-photo",
    });

    // Call optional success callback
    if (onSuccess) {
      onSuccess(downloadURL);
    }

    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo:", error);
    toast.error(error.message || "Failed to upload photo", {
      id: "upload-photo",
    });
    throw error;
  }
};
