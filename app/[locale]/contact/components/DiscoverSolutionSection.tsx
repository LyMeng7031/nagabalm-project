

"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const DiscoverSolutionSection = () => {
  const router = useRouter();
  const t = useTranslations('contact.discoverSolution');

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  return (
<section
  id="discover-solution"
  className="relative w-full overflow-hidden flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 bg-[#F5F5F5] md:bg-[#CEEDD7]"
>
  <div className="w-full max-w-5xl mx-auto">
    {/* Title */}
 <h2 
  className="text-[#F9461C] text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-10 leading-tight py-2 px-4"
>
  {t('title').split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index === 0 && <br />}
    </React.Fragment>
  ))}
</h2>

    {/* Two Cards */}
    <div className="flex flex-col md:flex-row gap-6 md:gap-4 mb-10 sm:mb-12">
      {/* Card 1 */}
      <div className="bg-[#00C3E3] text-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
          {t('activeLifestyles.title')}
        </h3>
        <p className="text-sm sm:text-base opacity-90 mb-4">
          {t('activeLifestyles.description').split('\\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        <button
          onClick={() => handleCategoryClick('active')}
          className="bg-[#FFE6B0] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm sm:text-base hover:bg-[#ffd580]"
        >
          {t('activeLifestyles.button')} →
        </button>
      </div>

      {/* Card 2 */}
      <div className="bg-[#00B888] text-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
          {t('everydayRelief.title')}
        </h3>
        <p className="text-sm sm:text-base opacity-90 mb-4">
          {t('everydayRelief.description').split('\\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        <button
          onClick={() => handleCategoryClick('relief')}
          className="bg-[#FFE6B0] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm sm:text-base hover:bg-[#ffd580]"
        >
          {t('everydayRelief.button')} <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="lucide lucide-arrow-right-icon lucide-arrow-right"
>
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>
        </button>
      </div>
    </div>

    {/* ✅ Image (Mobile Only, BELOW CARDS) */}
    <div className="mt-10 flex justify-center md:hidden">
      <img
        src="/images/about-grid/Mainposter.png"
        alt="Poster"
        className="w-full max-w-[500px] transform scale-125 object-contain"
      />
    </div>
  </div>
</section>

  );
};

export default DiscoverSolutionSection;
