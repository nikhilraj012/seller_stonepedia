import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export const registerUser = async (email, password, userData) => {
  try {
    let identifier = email;
    const isPhone = /^\d{10}$/.test(email);

    if (isPhone) {
      identifier = `${email}@stonepedia.com`;
    }

    const userCredential =
      await createUserWithEmailAndPassword(auth, identifier, password);

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: userData.fullName,
    });

    await setDoc(doc(db, "SellerDetails", user.uid), {
      fullName: userData.fullName,
      email: isPhone ? "" : user.email,   
      phoneNumber: userData.phoneNumber,
      role: "seller",
      provider: "password",
      emailVerified: false,
      accountStatus: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const loginUser = async (email, password) => {
  try {
    let identifier = email;

    if (/^\d{10}$/.test(email)) {
      identifier = `${email}@stonepedia.com`;
    }

    const userCredential =
      await signInWithEmailAndPassword(auth, identifier, password);

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get seller details
export const getSellerDetails = async (uid) => {
  try {
    const docRef = doc(db, "SellerDetails", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No seller details found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};



// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut,
//   onAuthStateChanged,
//   updateProfile
// } from "firebase/auth";
// import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "./config";

// // Register new user
// export const registerUser = async (email, password, userData) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Update user profile with display name
//     await updateProfile(user, {
//       displayName: userData.fullName
//     });

//     // Create seller details in Firestore
//     await setDoc(doc(db, "SellerDetails", user.uid), {
//       fullName: userData.fullName,
//       email: user.email,
//       phoneNumber: userData.phoneNumber,
//       role: "seller",
//       provider: "password",
//       emailVerified: false,
//       accountStatus: "pending",
//       createdAt: serverTimestamp(),
//     });

//     return { success: true, user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // Login user
// export const loginUser = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     return { success: true, user: userCredential.user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // Logout user
// export const logoutUser = async () => {
//   try {
//     await signOut(auth);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // Get seller details
// export const getSellerDetails = async (uid) => {
//   try {
//     const docRef = doc(db, "SellerDetails", uid);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//       return { success: true, data: docSnap.data() };
//     } else {
//       return { success: false, error: "No seller details found" };
//     }
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // Auth state observer
// export const observeAuthState = (callback) => {
//   return onAuthStateChanged(auth, callback);
// };