import React from "react";
import { setRequestLocale } from "next-intl/server";
import Navbar from "./home/components/Navbar";
import HeroSection from "./home/components/HeroSection";
import AvailableAtSection from "./home/components/AvailableAtSection";
import FeaturedSection from "./home/components/FeaturedSection";
import ModernizingSection from "./home/components/ModernizingSection";
import WhyNagaBalmSection from "./home/components/WhyNagaBalmSection";
import DiscoverSolutionSection from "./home/components/DiscoverSolutionSection";
import Footer from "./home/components/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AvailableAtSection />
      <FeaturedSection />
      <ModernizingSection />
      <WhyNagaBalmSection />
      <DiscoverSolutionSection />
      <Footer />
    </div>
  );
}
