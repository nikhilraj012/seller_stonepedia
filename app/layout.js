'use client';

import { Poppins, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UiProvider } from "./components/context/UiContext";
import { AuthProvider } from "./components/context/AuthContext";
import GetInTouch from "./components/common/GetInTouch";
import Login from "./components/Login";
import GlobalLoading from "./components/common/GlobalLoading";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable} font-poppins`}>
      <body className="antialiased">
        <Toaster />
        <AuthProvider>
          <GlobalLoading>
            <UiProvider>
              <Navbar />
              {children}
              <Footer />
              <GetInTouch />
              <Login />
            </UiProvider>
          </GlobalLoading>
        </AuthProvider>
        
      </body>
    </html>
  );
}
