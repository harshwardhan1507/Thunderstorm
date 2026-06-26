import { FloatingNavbar } from "@/components/ui/premium/FloatingNavbar";
import { HeroSection } from "@/components/sections/premium/HeroSection";
import { FeaturesSection } from "@/components/sections/premium/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/premium/TestimonialsSection";
import { ComparisonSection } from "@/components/sections/premium/ComparisonSection";
import { PricingSection } from "@/components/sections/premium/PricingSection";
import { FAQSection } from "@/components/sections/premium/FAQSection";
import { CTASection } from "@/components/sections/premium/CTASection";
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
        
        <TestimonialsSection />
        
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <ComparisonSection />
        
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <PricingSection />
        
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <FAQSection />
        
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
