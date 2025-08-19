"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

interface Product {
  key: string;
  name: string;
  label?: string;
  img: string;
  bgColor?: string;
  textColor?: string;
  isLastCard?: boolean;
  price?: number;
  isTopSell?: boolean; // Add isTopSell property
  // Add price property
  translations: {
    en: {
      name: string;
      description?: string; // Optionally add description if used
    };
    km: {
      name: string;
      description?: string; // Optionally add description if used
    };
  }; // Optionally add description if used
  id?: string | number; // Optionally add id if used as key/href
  images: string[]; // Optionally add image if used for src
}

const FeaturedSection = () => {
  const t = useTranslations("featured");
  const locale = useLocale();
  console.log("Current locale:", locale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ✅ Fetch products from API
  const {
    data: featuredProducts = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();

      // Adjust this depending on your API shape
      return Array.isArray(json) ? json : json.data || json.products || [];
    },
  });

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">Loading products...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500">Failed to load products.</p>
      </section>
    );
  }

  return (
    <section className="bg-white w-full py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
          <h2
            className={`text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              locale === "km" ? "font-hanuman" : ""
            }`}
          >
            {t("title")}
          </h2>
          <Link
            href={`/${locale}/products`}
            className={`bg-[#F9461C] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-300 hover:bg-[#d13a17] flex items-center gap-2 ${
              locale === "km" ? "font-hanuman" : ""
            }`}
          >
            {t("viewAll")}
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9461C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9461C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Product Carousel */}
          <div
            ref={containerRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={checkScrollButtons}
          >
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id ?? idx}
                className="flex flex-col flex-shrink-0 w-64 sm:w-72 lg:w-80 snap-start"
              >
                {/* Top Sell Badge */}

                {/* Image Container */}
                <div className="card relative aspect-square mb-4 sm:mb-6 bg-white overflow-hidden">
                  <div className="absolute inset-0 w-full h-full rounded-[10px] overflow-hidden">
                    {product.isTopSell && (
                      <span className="absolute top-2 left-2 bg-[#F9461C] text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                        Top Seller
                      </span>
                    )}
                    <Image
                      src={
                        product?.images[0]
                          ? product?.images[0]
                          : "/images/placeholder.jpg"
                      }
                      alt={product.name || "Product image"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                    />
                    {/* <img
                      src={
                        product?.images[0]
                          ? product?.images[0]
                          : "/images/placeholder.jpg"
                      }
                      alt=""
                    /> */}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow text-[#F9461C]">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={`font-bold text-lg sm:text-xl ${
                        locale === "km" ? "font-hanuman" : ""
                      }`}
                    >
                      {product.name}
                    </h3>
                    <span>${product.price}</span>
                  </div>
                  <p>
                    {product?.translations[locale as "en" | "km"]?.description}
                  </p>

                  <Link
                    href={`/${locale}/products`}
                    className={`mt-auto w-full py-2.5 sm:py-3 px-6 sm:px-8 rounded-full font-bold text-sm transition-colors duration-300 border border-current hover:bg-[#F9461C] hover:text-white text-center ${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Swipe to see more
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
