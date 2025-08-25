import { setRequestLocale } from "next-intl/server";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import WhereToFindHeroSection from "./components/HeroSection";
import LocationsSection from "./components/LocationsSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WhereToFind({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <Navbar />
      <WhereToFindHeroSection />
      <LocationsSection />
      <Footer />
    </div>
  );
}
