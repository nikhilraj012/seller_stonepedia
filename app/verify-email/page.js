"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAuth, applyActionCode } from "firebase/auth";
import { app } from "@/app/firebase/config";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const auth = getAuth(app);

    useEffect(() => {
        const oobCode = searchParams.get("oobCode");

        if (oobCode) {
            applyActionCode(auth, oobCode)
                .then(() => {
                    alert("Email verified successfully ✅");
                    window.close();
                })
                .catch(() => {
                    alert("Verification failed ❌");
                });
        }
    }, []);

    return <p>Verifying...</p>;
}