import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import {auth, db, storage  } from "../firebase/config";

const useGallery = (collectionName ) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const refCol = collection(db, "SellerDetails", user.uid, collectionName);
        const q = query(refCol, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        setData(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

//   const handleProductFeedback = async (item, product, status) => {
//   if (!auth.currentUser) return;
//   const toastId = toast.loading("Sending feedback...");

//   try {
//     const userUid = auth.currentUser.uid;
//     const itemRef = doc(db, collectionName, item.id); 
//     const userRef = doc(db, "SellerDetails", userUid, collectionName, item.id); // user collection

//     // 1️⃣ Update product inside main item
//     const itemSnap = await getDoc(itemRef);
//     if (!itemSnap.exists()) return;

//     const data = itemSnap.data();
//     const updatedProducts = data.products.map((p) =>
//       p.id === product.id
//         ? { ...p, feedbackStatus: status, feedbackAt: new Date() }
//         : p
//     );

//     // Update both global & user collection
//     await Promise.all([
//       updateDoc(itemRef, { products: updatedProducts }),
//       updateDoc(userRef, { products: updatedProducts }),
//     ]);

    

//     // Update local state to hide banner
//     setData((prev) =>
//       prev.map((i) =>
//         i.id === item.id
//           ? {
//               ...i,
//               products: i.products.map((p) =>
//                 p.id === product.id
//                   ? { ...p, feedbackStatus: status }
//                   : p
//               ),
//             }
//           : i
//       )
//     );

//     toast.success("Feedback sent successfully", { id: toastId });
//   } catch (error) {
//     console.error("Error sending feedback:", error);
//     toast.error("Failed to send feedback", { id: toastId });
//   }
// };
const handleProductFeedback = async (itemId, productId, status) => {
  if (!auth.currentUser) return;

  // ✅ Add these guards
  

  const toastId = toast.loading("Sending feedback...");
  
  try {
    const userUid = auth.currentUser.uid;
    const itemRef = doc(db, collectionName, itemId); 
    const userRef = doc(db, "SellerDetails", userUid, collectionName, itemId);

    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) return;

    const data = itemSnap.data();
    const updatedProducts = data.products.map((p) =>
      p.id === productId
        ? { ...p, feedbackStatus: status, feedbackAt: new Date() }
        : p
    );

    await Promise.all([
      updateDoc(itemRef, { products: updatedProducts }),
      updateDoc(userRef, { products: updatedProducts }),
    ]);

    setData((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              products: i.products.map((p) =>
                p.id === productId
                  ? { ...p, feedbackStatus: status }
                  : p
              ),
            }
          : i
      )
    );

    toast.success("Feedback sent successfully", { id: toastId });
  } catch (error) {
    console.error("Error sending feedback:", error);
    toast.error("Failed to send feedback", { id: toastId });
  }
};

  const handleCancel = async (id) => {
      const toastId = toast.loading("Cancelling...");
  
      try {
        const userRef = doc(
          db,
          "SellerDetails",
          auth.currentUser.uid,
          collectionName,
          id,
        );
        const Ref = doc(db, collectionName, id);
  
        await Promise.all([
          updateDoc(userRef, {
            status: "cancelled",
            cancelledAt: serverTimestamp(),
          }),
          updateDoc(Ref, {
            status: "cancelled",
            cancelledAt: serverTimestamp(),
          }),
        ]);
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "cancelled" } : item
          )
        );
        toast.success("Cancelled successfully", { id: toastId });
      } catch (error) {
        toast.error("Failed to cancel", { id: toastId });
        console.error("Error cancelling :", error);
      }
    };
  


  const deleteItem = async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      const user = auth.currentUser;

      await deleteDoc(doc(db, "SellerDetails", user.uid, collectionName, id));
      await deleteDoc(doc(db, collectionName, id));

      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Delete failed", { id: toastId });
    }
  };

  const deleteProduct = async (item, product) => {
  const toastId = toast.loading("Deleting product...");

  try {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "SellerDetails", user.uid, collectionName, item.id);
    const globalRef = doc(db, collectionName, item.id);

    if (item.products.length === 1) {
      await deleteDoc(userRef);
      await deleteDoc(globalRef);
      setData((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      const updatedProducts = item.products.filter(
        (p) => p.id !== product.id
      );

      await updateDoc(userRef, { products: updatedProducts });
      await updateDoc(globalRef, { products: updatedProducts });

      setData((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, products: updatedProducts } : i
        )
      );
    }

    toast.success("Product deleted", { id: toastId });
  } catch (e) {
    console.error(e);
    toast.error("Delete failed", { id: toastId });
  }
};

  const updateDetails = async (id, payload) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "SellerDetails", user.uid, collectionName, id), payload);
    await updateDoc(doc(db, collectionName, id), payload);

 
    setData((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          companyDetails: {
            ...item.companyDetails,
            ...(payload["companyDetails.image"]
              ? { image: payload["companyDetails.image"] }
              : {}),
            ...(payload["companyDetails.shopName"]
              ? {
                  shopName: payload["companyDetails.shopName"],
                  email: payload["companyDetails.email"],
                  gstNumber: payload["companyDetails.gstNumber"],
                }
              : {}),
          },
        };
      })
    );
  };

  const updateCompanyDetails = async (id, formData) => {
    const toastId = toast.loading("Updating...");
    try {
      await updateDetails(id, {
        "companyDetails.shopName": formData.shopName,
        "companyDetails.email": formData.email,
        "companyDetails.gstNumber": formData.gstNumber,
      });

      toast.success("Updated successfully", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Update failed", { id: toastId });
    }
  };

  const updateThumbnail = async (file, itemId) => {
    if (!file) return;

    setUpdating(true);
    const toastId = toast.loading("Updating thumbnail...");

    try {
      const fileRef = ref(
        storage,
        `StonepediaForBusiness/${collectionName}/${auth.currentUser.uid}/images/${file.name}`
      );

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await updateDetails(itemId, {
        "companyDetails.image": {
          url,
          type: file.type,
        },
      });

      toast.success("Thumbnail updated successfully", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Thumbnail update failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return {
    loading,
    handleCancel,
    updating,
    data,
    deleteItem,
    deleteProduct,
    updateThumbnail,
    updateCompanyDetails,
    handleProductFeedback

  };
};

export default useGallery;