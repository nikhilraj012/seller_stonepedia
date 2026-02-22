import admin from "../request-email-change/firebaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);
  const oobCode = url.searchParams.get("oobCode");

  if (!oobCode) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    // Apply OOB code using Firebase REST API
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode }),
      }
    );

    const data = await resp.json();

    if (data.error) {
      console.error("identitytoolkit error:", data.error);
      return new Response("Invalid or expired code", { status: 400 });
    }

    const { email, localId } = data;


    const sellerRef = admin.firestore().collection("SellerDetails").doc(localId);

    // Fetch existing data
    const sellerSnap = await sellerRef.get();
    const existingData = sellerSnap.exists ? sellerSnap.data() : {};

    // Merge new email with existing data
    await sellerRef.set(
      {
        ...existingData,
        email,
        emailVerified: true,
      },
      { merge: true }
    );

    await admin.auth().updateUser(localId, { email, emailVerified: true }).catch(() => { });

    // Return success JSON
    return new Response(JSON.stringify({ success: true, email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("confirm-email-change error:", err);
    return new Response("Server error", { status: 500 });
  }
}