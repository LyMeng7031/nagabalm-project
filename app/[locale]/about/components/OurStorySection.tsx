"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const OurStorySection = () => {
  const t = useTranslations("about.ourStory");

  return (
    <section
      id="our-story"
      className="relative min-h-screen w-full bg-[#D6F2F2] flex flex-col md:flex-row items-center justify-between py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 gap-8 sm:gap-10 md:gap-12 overflow-hidden"
    >
      {/* Desktop Background Image */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/about-grid/Mainposter.png"
          alt="Our Story Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Mobile Background Image */}
      <div className="absolute inset-0 z-0 sm:hidden">
        <Image
          src="/images/about-grid/Mainposter.png"
          alt="Our Story Mobile Background"
          fill
          className="w-full max-w-[500px] transform scale-125 object-contain"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10 px-4 sm:px-6 md:px-0 max-w-xl min-h-[60vh] sm:min-h-[50vh]">
        <h2 className="text-[#F9461C] text-2xl sm:text-3xl md:text-4xl lg:text-[64px] font-extrabold leading-tight mb-4 sm:mb-6">
          {t("title")}
        </h2>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed whitespace-pre-line max-w-prose">
          {t("description")}
        </p>
      </div>
    </section>
  );
};

export default OurStorySection;
