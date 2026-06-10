import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ScoringBreakdown from "@/components/landing/ScoringBreakdown";
import StatsCounter from "@/components/landing/StatsCounter";
import CTASection from "@/components/landing/CTASection";
import FAQSection from "@/components/landing/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ScoringBreakdown />
      <StatsCounter />
      <CTASection />
      <FAQSection />
    </>
  );
}
