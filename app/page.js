import Hero from "./components/landing/Hero";
import GlobalBuyers from "./components/landing/GlobalBuyers";
import AboutBusiness from "./components/landing/AboutBusiness";
import StonePlatform from "./components/landing/StonePlatform";
import SupplierBenefits from "./components/landing/SupplierBenefits";
import AiBenefits from "./components/landing/AiBenefits";

export default function Home() {
  return (
    <div>
      <Hero />
      <GlobalBuyers />
      <AboutBusiness />
      <StonePlatform />
      <SupplierBenefits />
      <AiBenefits />
    </div>
  );
}
