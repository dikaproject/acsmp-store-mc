import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import DigitalProductsSection from "../components/DigitalProductsSection";

// Lazy load components yang tidak critical
const ServerStats = lazy(() => import('../components/ServerStats'));
const FeaturesSection = lazy(() => import("../components/home/FeaturesSection").then(module => ({ default: module.FeaturesSection })));
const AboutSection = lazy(() => import("../components/home/AboutSection"));
const VoteLinks = lazy(() => import("../components/VoteLinks"));
const CTASection = lazy(() => import("../components/home/CTASection"));

// Loading skeleton component
const SectionSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-ink-elevated w-64 mx-auto rounded-full" />
    <div className="h-4 bg-ink-elevated w-96 mx-auto rounded-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-96 bg-ink-elevated rounded-2xl" />
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ink overflow-x-hidden">
      {/* Hero Section - Always visible first */}
      <HeroSection />

      {/* Lazy loaded sections with suspense */}
      {isHeroLoaded && (
        <>
          <Suspense fallback={<SectionSkeleton />}>
            <ServerStats />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <FeaturesSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <AboutSection />
          </Suspense>

          <DigitalProductsSection compact />

          <Suspense fallback={<SectionSkeleton />}>
            <VoteLinks />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <CTASection />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default HomePage;
