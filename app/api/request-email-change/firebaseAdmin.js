import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  console.log("PROJECT ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log("CLIENT EMAIL:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  console.log("PRIVATE KEY EXISTS:", !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
}

export default admin;