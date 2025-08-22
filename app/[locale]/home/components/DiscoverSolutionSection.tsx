"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

const DiscoverSolutionSection = () => {
  const router = useRouter();
  const t = useTranslations("faq.discoverSolution");
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  return (
    <section
      className={`w-full bg-[#D6F2F2] py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden ${
        !isMobile ? "bg-cover bg-center bg-no-repeat" : ""
      }`}
      style={{
        backgroundImage: !isMobile
          ? "url('/images/about-grid/Mainposter.png')"
          : "none",
      }}
    >
      {/* Optional overlay */}
      {!isMobile && <div className="absolute inset-0 bg-black/5"></div>}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-[#F9461C] text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 leading-tight">
          {t("title")
            .split("\n")
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
        </h1>

        {/* Cards Row */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Active Lifestyles Card */}
          <div className="bg-[#F9461C] text-white p-6 rounded-xl relative overflow-hidden min-h-[280px] flex-1">
            <div className="flex flex-col h-full pr-6 sm:pr-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                  {t("activeLifestyles.title")}
                </h2>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-6">
                  {t("activeLifestyles.subtitle")}
                  {t("activeLifestyles.description")}
                </p>
              </div>

              <button
                onClick={() => handleCategoryClick("active")}
                className="bg-[#CFE8EE] text-[#F9461C] font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-base w-fit hover:bg-white transition-colors self-start"
              >
                {t("activeLifestyles.viewProducts")}
              </button>
            </div>

          <div 
  className="absolute -right-4 -bottom-4 md:right-[-50px] md:bottom-[-30px] w-28 sm:w-36 md:w-44 opacity-90 pointer-events-none select-none"
  aria-hidden="true"
>
  <Image
    src="/images/History of CoCo Khmer 3/ActiveLifeStyle@4x.png"
    alt="Active Lifestyle"
    width={350}
    height={350}
    className="object-contain w-full h-auto"
    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, (max-width: 1024px) 160px, 176px"
    loading="lazy"
    quality={90}
  />
</div>
          </div>

          {/* Everyday Relief Card */}
          <div className="bg-[#00B388] text-white p-6 rounded-xl relative overflow-hidden min-h-[280px] flex-1">
            <div className="flex flex-col h-full pr-6 sm:pr-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                  {t("everydayRelief.title")}
                </h2>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-6">
                  {t("everydayRelief.subtitle")}
                  {t("everydayRelief.description")}
                </p>
              </div>

              <button
                onClick={() => handleCategoryClick("everyday")}
                className="bg-[#CFE8EE] text-[#00B388] font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-base w-fit hover:bg-white transition-colors self-start"
              >
                {t("everydayRelief.viewProducts")}
              </button>
            </div>

            <div
  className="absolute -right-4 -bottom-4 md:right-[-40px] md:bottom-[-25px] w-28 sm:w-36 md:w-40 opacity-90 pointer-events-none select-none"
  aria-hidden="true"
>
  <Image
    src="/images/History of CoCo Khmer 3/DailyLifeStyle@4x.png"
    alt="Daily Lifestyle"
    width={350}
    height={350}
    className="object-contain w-full h-auto"
    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, (max-width: 1024px) 160px, 160px"
    loading="lazy"
    quality={90}
  />
</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSolutionSection;
