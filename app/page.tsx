import { FloatingNavbar } from "@/components/ui/premium/FloatingNavbar";
import { HeroSection } from "@/components/sections/premium/HeroSection";
import { FeaturesSection } from "@/components/sections/premium/FeaturesSection";
import { InteractivePreviewSection } from "@/components/sections/premium/InteractivePreviewSection";
import { AlgorithmCategoriesSection } from "@/components/sections/premium/AlgorithmCategoriesSection";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] selection:bg-primary/30 selection:text-primary">
      <FloatingNavbar />
      
      <main>
        <HeroSection />
        
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <FeaturesSection />

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <InteractivePreviewSection />

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <AlgorithmCategoriesSection />
      </main>

      <Footer />
    </div>
  );
}
