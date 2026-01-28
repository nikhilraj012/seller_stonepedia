'use client';

import Hero from "./components/landing/Hero";
import GlobalBuyers from "./components/landing/GlobalBuyers";
import AboutBusiness from "./components/landing/AboutBusiness";
import StonePlatform from "./components/landing/StonePlatform";
import SupplierBenefits from "./components/landing/SupplierBenefits";
import AiBenefits from "./components/landing/AiBenefits";
import PublicRoute from "./components/common/PublicRoute";

export default function Home() {
  return (
    <PublicRoute>
      <div>
        <div id="hero">
          <Hero />
        </div>
        <GlobalBuyers />
        <div id="about-business">
          <AboutBusiness />
        </div>
        <div id="products">
          <StonePlatform />
        </div>
        <div id="supplier-benefits">
          <SupplierBenefits />
        </div>
        <div id="ai-benefits">
          <AiBenefits />
        </div>
      </div>
    </PublicRoute>
  );
}
