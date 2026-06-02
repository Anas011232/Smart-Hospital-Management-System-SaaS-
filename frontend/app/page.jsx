import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/Heroslider";
import TrustSection from "@/components/Trustsection";
import StatsSection from "@/components/Statssection";
import HowItWorks from "@/components/Howitworks";
import FeaturesSection from "@/components/Featuressection";
import CTASection from "@/components/Ctasection";

export const metadata = {
  title: "MedQube — Smart Hospital Management System",
  description:
    "Next-generation SaaS platform for hospitals, doctors, and patients with real-time operations.",
};

export default function HomePage() {
  return (
    <div
      className="bg-slate-950 text-white antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* google fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Sora:wght@700;800&display=swap');`}</style>

      <Navbar />

      <main>
        <HeroSlider />
        <TrustSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}