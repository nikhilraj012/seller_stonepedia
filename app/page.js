import Hero from "./components/landing/Hero";
import GlobalBuyers from "./components/landing/GlobalBuyers";
import AboutBusiness from "./components/landing/AboutBusiness";
import StonePlatform from "./components/landing/StonePlatform";

export default function Home() {
  return (
    <div>
      <Hero />
      <GlobalBuyers />
      <AboutBusiness />
      <StonePlatform />
    </div>
  );
}
