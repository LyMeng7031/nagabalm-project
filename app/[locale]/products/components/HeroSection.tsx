"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { products as allProducts } from "../products";

const ProductsHeroSection = () => {
  const router = useRouter();
  const t = useTranslations();

  const activeProducts = allProducts
    .filter((p: any) => p.useCase.type.includes("active"))
    .slice(0, 3);
  const everydayProducts = allProducts
    .filter((p: any) => p.useCase.type.includes("everyday"))
    .slice(0, 3);

  return (
    <section className="w-full min-h-[100vh] bg-gradient-to-br from-[#C6E6F2] via-[#E0F4FF] to-[#F0F9FF] flex flex-col items-center relative overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-0 left-0 w-24 sm:w-32 md:w-48 lg:w-64 xl:w-80 h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] z-10 opacity-80">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud left"
          fill
          className="object-contain w-full h-full"
          priority
        />
      </div>
      <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-48 lg:w-64 xl:w-80 h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] z-10 opacity-80">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud right"
          fill
          className="object-contain w-full h-full transform scale-x-[-1]"
          priority
        />
      </div>
      <div className="absolute bottom-10 left-10 w-16 sm:w-20 md:w-24 lg:w-32 h-[40px] sm:h-[50px] md:h-[60px] lg:h-[80px] z-10 opacity-40">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Bottom cloud left"
          fill
          className="object-contain w-full h-full"
        />
      </div>
      <div className="absolute bottom-20 right-16 w-12 sm:w-16 md:w-20 lg:w-24 h-[30px] sm:h-[40px] md:h-[50px] lg:h-[60px] z-10 opacity-30 transform scale-x-[-1]">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Bottom cloud right"
          fill
          className="object-contain w-full h-full"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-8 sm:pb-12 md:pb-16 relative z-20">
        <div className="text-center mb-10">
          <h1 className="text-[#F9461C] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 whitespace-pre-line drop-shadow-sm">
            {t("products.heroTitle")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Lifestyle Card */}
          <div className="group relative bg-gradient-to-br from-[#F9461C] to-[#e63946] rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1">
            <div className="absolute inset-0 opacity-10 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="relative text-white flex flex-col">
              <div className="flex-1 pr-4">
                <h3 className="font-extrabold text-sm sm:text-base md:text-lg mb-2">
                  {t("products.activeLifestyles.title")}
                </h3>
                <p className="text-xs sm:text-sm md:text-base mb-2 font-medium">
                  {t("products.activeLifestyles.subtitle")}
                </p>
                <p className="text-xs sm:text-sm md:text-base opacity-90">
                  {t("products.activeLifestyles.description")}
                </p>
              </div>
              <div className="mt-4 flex justify-start">
                <button
                  onClick={() => router.push("/products/preview/active")}
                  className="bg-white text-[#F9461C] font-semibold py-1.5 px-4 rounded-full text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95"
                >
                  {t("products.activeLifestyles.viewProducts")} →
                </button>
              </div>
            </div>
          </div>
          {/* Everyday Relief Card */}
          <div className="group relative bg-gradient-to-br from-[#00B388] to-[#059669] rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1">
            <div className="absolute inset-0 opacity-10 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="relative text-white flex flex-col">
              <div className="flex-1 pr-4">
                <h3 className="font-extrabold text-sm sm:text-base md:text-lg mb-2">
                  {t("products.everydayRelief.title")}
                </h3>
                <p className="text-xs sm:text-sm md:text-base mb-2 font-medium">
                  {t("products.everydayRelief.subtitle")}
                </p>
                <p className="text-xs sm:text-sm md:text-base opacity-90">
                  {t("products.everydayRelief.description")}
                </p>
              </div>
              <div className="mt-4 flex justify-start">
                <button
                  onClick={() => router.push("/products/preview/everyday")}
                  className="bg-white text-[#00B388] font-semibold py-1.5 px-4 rounded-full text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95 "
                >
                  {t("products.everydayRelief.viewProducts")} →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-10">
          <div className="animate-bounce text-[#2C5F7A] opacity-60">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-2xl">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHeroSection;
