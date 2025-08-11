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
        { name: "21° Mart", logo: "/images/partners/21 Degree.jpg" },
        { name: "Shop SATU", logo: "/images/partners/Shop Satu.jpg" },
        {
          name: "Phnom Penh International Airport",
          logo: "/images/partners/Phnom Penh International Airport.png",
        },
      ],
      //  shop: [
      //   {name: "7-Eleven"},
      //   {name: "Total Bonjour Mart"},
      //   {name: "Super Duper"},
      //   {name: "Circle K"},
      //   {name: "21° Mart"},
      //   {name: "Shop SATU"},
      //   {name: "Phnom Penh International Airport"},
      // ],
    },
    {
      titleKey: "pharmacy",
      partners: [
        {
          name: "Point Santé Pharmacy",
          logo: "/images/partners/Point Sante Pharmacy.jpg",
        },
        {
          name: "Aosot Plus Pharmacy",
          logo: "/images/partners/Aosot Plus.jpg",
        },
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
        { name: "HRK Care Pharmacy", logo: "/images/partners/HRK Care.jpg" },
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
        {locationGroups.map((group) => (
          <div key={group.titleKey} className="mb-10 sm:mb-14">
            <h3 className="text-[#F9461C] text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 uppercase">
              {t(group.titleKey)}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-6 sm:gap-6">
              {group.partners.map((partner, i) => (
                <div key={i} className="text-center py-5 sm:h-56 h-52">
                  <div
                    className="flex justify-center border border-[#F9461C] p-3 h-[140px] sm:h-44 rounded-xl hover:scale-105 hover:shadow-lg transition-transform"
                    // className="flex flex-col py-5 items-center justify-center text-center border border-[#F9461C] rounded-md bg-white aspect-square w-23 h-32 sm:w-58 sm:h-38 md:w-42 md:h-42 lg:w-44 lg:h-44 xl:w-[118px] xl:h-[118px] mx-auto p-2 transition-transform hover:scale-105 hover:shadow-lg"
                    title={partner.name}
                  >
                    <div className="w-full flex items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={150}
                        height={150}
                        className="object-contain h-23 md:40 md:h-40 sm:rounded-md"
                        // sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, (max-width: 1024px) 72px, 80px"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="py-1.5">
                    <span className="text-black  text-md sm:text-md mt-5 leading-tight">
                      {partner.name}
                    </span>
                  </div>
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
