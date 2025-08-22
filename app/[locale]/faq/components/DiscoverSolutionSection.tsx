"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const DiscoverSolutionSection = () => {
  const router = useRouter();
  const t = useTranslations("faq.discoverSolution");

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  return (
    <section className="w-full bg-[#D6F2F2] flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6">
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

      {/* Cards wrapper */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-7xl justify-center items-stretch">
        {/* Active Lifestyles Card */}
        <div className="bg-[#F9461C] text-white w-full md:w-1/2 p-6 flex flex-col md:flex-row relative rounded-xl min-h-[14rem] sm:min-h-[12rem]">
          <div className="flex-1 md:pr-24 lg:pr-36">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">
              {t("activeLifestyles.title")}
            </h2>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-4 whitespace-pre-line">
              {t("activeLifestyles.subtitle")}
            </p>

            <div className="mt-4 md:absolute md:bottom-4 md:right-4 z-10">
              <button
                onClick={() => handleCategoryClick("everyday")}
                className="bg-[#CFE8EE] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm sm:text-base hover:bg-[#ffd580] transition-colors"
              >
                {t("everydayRelief.viewProducts")}
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:absolute md:right-[-30px] md:bottom-0 flex justify-center md:block">
            <Image
              src="/images/History of CoCo Khmer 3/ActiveLifeStyle@4x.png"
              alt="Active Lifestyle"
              width={300}
              height={300}
              className="object-contain w-40 sm:w-56 lg:w-64"
            />
          </div>
        </div>

        {/* Everyday Relief Card */}
        <div className="bg-[#00B388] text-white w-full md:w-1/2 p-6 flex flex-col md:flex-row relative rounded-xl min-h-[14rem] sm:min-h-[12rem]">
          <div className="flex-1 md:pr-24 lg:pr-36">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">
              {t("everydayRelief.title")}
            </h2>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-4">
              {t("everydayRelief.subtitle")
                .split("\n")
                .map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx === 0 && <br />}
                  </React.Fragment>
                ))}
            </p>

            <div className="mt-4 md:absolute md:bottom-4 md:right-4 z-10">
              <button
                onClick={() => handleCategoryClick("everyday")}
                className="bg-[#CFE8EE] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm sm:text-base hover:bg-[#ffd580] transition-colors"
              >
                {t("everydayRelief.viewProducts")}
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:absolute md:right-[-20px] md:bottom-0 flex justify-center md:block">
            <Image
              src="/images/History of CoCo Khmer 3/DailyLifeStyle@4x.png"
              alt="Daily Lifestyle"
              width={300}
              height={300}
              className="object-contain w-40 sm:w-56 lg:w-64"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSolutionSection;
