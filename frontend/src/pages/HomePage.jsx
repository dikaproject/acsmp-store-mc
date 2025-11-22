import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";

// Lazy load components yang tidak critical
const ServerStats = lazy(() => import('../components/ServerStats'));
const FeaturesSection = lazy(() => import("../components/home/FeaturesSection").then(module => ({ default: module.FeaturesSection })));
const AboutSection = lazy(() => import("../components/home/AboutSection"));
const VoteLinks = lazy(() => import("../components/VoteLinks"));
const CTASection = lazy(() => import("../components/home/CTASection"));

// Loading skeleton component
const SectionSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-purple-500/10 rounded-xl w-64 mx-auto" />
    <div className="h-4 bg-purple-500/10 rounded-lg w-96 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-96 bg-purple-500/10 rounded-2xl" />
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  // Preload critical resources
  useEffect(() => {
    // Preload fonts
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap"
    ];

    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });

    // Set hero loaded after mount
    const timer = setTimeout(() => setIsHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
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