"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const LocationsSection = () => {
  const t = useTranslations("whereToFind.locations.categories");

  const locationGroups = [
    {
      titleKey: "marts",
      partners: [
        { name: "7-Eleven", logo: "/images/partners/7-11.png" },
        {
          name: "Total Bonjour Mart",
          logo: "/images/partners/Total Bonjour Mart.png",
        },
        { name: "Super Duper", logo: "/images/partners/SuperDuper.png" },
        { name: "Circle K", logo: "/images/partners/Circle K.png" },
        { name: "21 Degree", logo: "/images/partners/21 Degree.jpg" },
        { name: "Shop Satu", logo: "/images/partners/Shop Satu.jpg" },
        {
          name: "Phnom Penh International Airport",
          logo: "/images/partners/Phnom Penh International Airport.png",
        },
      ],
    },
    {
      titleKey: "pharmacy",
      partners: [
        {
          name: "Point Sante Pharmacy",
          logo: "/images/partners/Point Sante Pharmacy.jpg",
        },
        { name: "Aosot Plus", logo: "/images/partners/Aosot Plus.jpg" },
        { name: "Pharmacy Chhat", logo: "/images/partners/Pharmacy Chhat.jpg" },
        {
          name: "Pharmacy Phsar Chas",
          logo: "/images/partners/Pharmacy Phsar Chas.jpg",
        },
        {
          name: "Our Pharmacy BKK",
          logo: "/images/partners/Our Pharmacy BKK.jpg",
        },
        {
          name: "Medilance Pharmacy",
          logo: "/images/partners/Medilance Pharmacy.jpg",
        },
        { name: "HRK Care", logo: "/images/partners/HRK Care.jpg" },
      ],
    },
    {
      titleKey: "clubsFitness",
      partners: [
        {
          name: "Phnom Penh Sport Club",
          logo: "/images/partners/Phnom Penh Sport CLub.jpg",
        },
        {
          name: "Inter Badminton Club",
          logo: "/images/partners/Inter Badminton Club.jpg",
        },
        { name: "Interter Club", logo: "/images/partners/Interter Club.jpg" },
        {
          name: "Sen Bunthen Club",
          logo: "/images/partners/Sen Bunthen Club.png",
        },
        {
          name: "The Ring Fitness Club",
          logo: "/images/partners/The Ring Fitness Club.png",
        },
        {
          name: "Kingdom Fight Gym",
          logo: "/images/partners/Kingdom Fight Gym.jfif",
        },
        {
          name: "Villa Martial Art",
          logo: "/images/partners/Villa Martial Art.jpg",
        },
      ],
    },
    {
      titleKey: "specialtyStores",
      partners: [
        {
          name: "Kabas Concept Store",
          logo: "/images/partners/Kabas Concept store.jpg",
        },
        {
          name: "For Someone I Like",
          logo: "/images/partners/For Someone I Like.jpg",
        },
        {
          name: "Babel Guesthouse",
          logo: "/images/partners/Babel Guesthouse.jpg",
        },
        {
          name: "Kun Khmer International Federation",
          logo: "/images/partners/Kun Khmer international Federation.jpg",
        },
      ],
    },
  ];
  return (
    <section className="w-full bg-white flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {locationGroups.map((group, idx) => (
          <div key={group.titleKey} className="mb-8 sm:mb-12">
            <h3 className="text-[#F9461C] text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 uppercase">
              {t(group.titleKey)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-2">
              {group.partners.map((partner, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center border-2 border-[#F9461C] rounded-md bg-white aspect-square w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-[110px] xl:h-[110px] mx-auto transition-transform hover:scale-105 hover:shadow-lg"
                  title={partner.name}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={80}
                    className="object-contain max-h-12 max-w-12 sm:max-h-16 sm:max-w-16 md:max-h-18 md:max-w-18 lg:max-h-20 lg:max-w-20"
                    sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, (max-width: 1024px) 72px, 80px"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LocationsSection;
