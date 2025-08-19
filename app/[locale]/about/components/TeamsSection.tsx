"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

const ourTeamMembers = [
  {
    name: "Robert Esposito",
    role: "Founder and CEO",
    img: "/images/Team Photo/Individual/1. Robert Esposito - Founder and CEO.jpg",
  },
  {
    name: "Sovisal Jerry Meach",
    role: "Director of Business Development",
    img: "/images/Team Photo/Individual/2.Sovisal Jerry Meach-Co -Founder.jpg",
  },
  {
    name: "Moeun Putheamony",
    role: "HR & Finance Manager",
    img: "/images/Team Photo/Individual/3. Moeun Putheamony - HR & Finance Manager.jpg",
  },
  {
    name: "Ses Sarom",
    role: "Sales Supervisor",
    img: "/images/Team Photo/Individual/4. Ses Sarom - Sale Supervisor.jpg",
  },
  {
    name: "Nou Virak",
    role: "Marketing and Communications Officer",
    img: "/images/Staff Photo/Individual/5. Nou Virak-Makerting and Communication Officer.jpg",
  },
  {
    name: "Chhen Vannak",
    role: "Visual Creative Specialist",
    img: "/images/Team Photo/Individual/Facility Tam/Chhen Vannak.jpg",
  },
];

const facilityTeamMembers = [
  { name: "Korng Sreysor", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Korng Sreysor.jpg" },
  { name: "Sem Tola", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Sem Tola.jpg" },
  { name: "KimHouy Aok", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/KimHouy Aok.jpg" },
  { name: "Vann Sreypich", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Vann Sreypich.jpg" },
  { name: "John Souphea", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/John Souphea.jpg" },
  { name: "Phorn Sokin", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Phorn Sokin.jpg" },
  { name: "Thida Emmav", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Thida Emmav.jpg" },
  { name: "Kim Lin", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Kim Lin.jpg" },
  { name: "Lun Bopha", role: "Facility Team", img: "/images/Team Photo/Individual/Facility Tam/Lun Bopha.jpg" },
  { name: "Sim Yem", role: "Facility Maintenance Technician", img: "/images/Team Photo/Individual/Facility Tam/Sim Yem.jpg" },
];

const TeamsSection = () => {
  const t = useTranslations('about.teams');
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: t('tabs.ourTeam'), members: ourTeamMembers },
    { label: t('tabs.facilityTeam'), members: facilityTeamMembers },
  ];

  return (
    <section className="w-full flex flex-col items-center py-12 sm:py-16 bg-white">
      <h2 className="text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-center px-4">
        {t('title')}
      </h2>
      <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl px-4">
        {t('subtitle')}
      </p>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold border-2 text-sm sm:text-base transition-colors duration-200 w-full sm:w-auto text-center ${
              activeTab === idx
                ? 'bg-[#F9461C] text-white border-[#F9461C]'
                : 'bg-white text-[#F9461C] border-[#F9461C]'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {tabs[activeTab].members.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="rounded-xl overflow-hidden mb-3 mx-auto shadow-md relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-[180px] lg:h-[240px]">
              <Image 
                src={member.img} 
                alt={member.name} 
                fill
                className="object-cover object-center"
                sizes="(max-width: 600px) 100px, (max-width: 768px) 160px, (max-width: 1024px) 176px, 180px"
                loading="lazy"
              />
            </div>
            <div className="text-[#F9461C] font-bold text-sm sm:text-base text-center">
              {member.name}
            </div>
            <div className="text-gray-700 text-xs sm:text-sm text-center">
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamsSection;
