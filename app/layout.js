import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Stonepedia-Seller",
  description: "Stonepedia Seller Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className}`}>
        {children}
      </body>
    </html>
  );
}
