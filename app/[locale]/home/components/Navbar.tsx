"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

// import img1 from '/public/images/Naga Balm Element (Cloud)/Background 1.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();
  let lastScrollY = 0;

  // Navigation links avec traductions
  const navLinks = [
    { href: `/`, label: t('home') },
    { href: `/products`, label: t('products') },
    { href: `/about`, label: t('about') },
    { href: `/faq`, label: t('faq') },
    { href: `/contact`, label: t('contact') },
    { href: `/where-to-find`, label: t('whereToFind') },
];

useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 10) {
        setShowNavbar(true);
        lastScrollY = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Scroll down
      } else {
        setShowNavbar(true); // Scroll up
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Séparation des liens pour desktop (gauche/droite du logo)
  const leftLinks = navLinks.slice(0, 3);
  const rightLinks = navLinks.slice(3);

// export default function MobileNav({ navLinks }: Props) {
//   const locale = useLocale();

  function openNav() {
    const sidenav = document.getElementById('mySidenav');
    const overlay = document.getElementById('overlay');
    if (sidenav && overlay) {
      sidenav.style.width = '250px';
      overlay.style.display = 'block';
    }
  }

  function closeNav() {
    const sidenav = document.getElementById('mySidenav');
    const overlay = document.getElementById('overlay');
    if (sidenav && overlay) {
      sidenav.style.width = '0';
      overlay.style.display = 'none';
    }
  }
  
  // Fonction pour générer un lien nav
  const NavLink = ({ 
    href, 
    label, 
    onClick,
    isMobile = false 
  }: { 
    href: string; 
    label: string; 
    onClick?: () => void;
    isMobile?: boolean;
  }) => {
    // Construire l'URL complète avec la locale
    const fullHref = `/${locale}${href === '/' ? '' : href}`;
    // Normaliser les chemins pour la comparaison (enlever les slashes de fin)
    const normalizedPathname = pathname.replace(/\/$/, '');
    const normalizedFullHref = fullHref.replace(/\/$/, '');
    const isActive = normalizedPathname === normalizedFullHref;
    
    const baseClasses = isMobile 
      ? "text-base font-semibold tracking-wide transition-all duration-300 relative group py-3 px-6 rounded-full min-h-[48px] flex items-center justify-center w-full max-w-xs mx-auto shadow-md"
      : "text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105 relative group px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2";


  
    return (
      <Link
        href={fullHref}
        className={`${baseClasses} ${
          isActive 
            ? isMobile
              ? "text-white bg-gradient-to-r from-[#F9461C] to-[#e63946] shadow-xl scale-105 border-2 border-white/20"
              : "text-[#2DD4BF]"
            : isMobile
              ? "text-[#F9461C] bg-white/90 backdrop-blur-sm border-2 border-[#F9461C]/30 hover:bg-gradient-to-r hover:from-[#F9461C] hover:to-[#e63946] hover:text-white hover:border-white/20 hover:scale-105 hover:shadow-xl active:scale-95"
              : "text-[#F04923] hover:text-[#2DD4BF]"
        }`}
        onClick={onClick}
      >
        {/* Effet de background au hover pour desktop */}
        {!isMobile && (
          <span className="absolute inset-0 bg-[#CFE8EE] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center -z-10"></span>
        )}
        
        <span className="relative z-10 font-semibold">{label}</span>
        
        {/* Indicateur actif pour desktop */}
        {!isMobile && isActive && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-[#2DD4BF] rounded-full"></span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <nav
        className={`fixed left-1/2 top-4 sm:top-6 z-50 transform -translate-x-1/2 w-[95vw] max-w-7xl
          ${scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-xl border border-white/20" 
            : "bg-white/90 backdrop-blur-sm shadow-lg"
          }
          rounded-full transition-all duration-500 ease-out hidden md:block overflow-hidden
          ${showNavbar ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
          transition-transform transition-opacity duration-300`}
      >
        {/* Logo en arrière-plan avec opacité - hidden on mobile/tablet */}
        <div className="absolute left-0 top-0 h-full items-center pl-4 sm:pl-6 pointer-events-none hidden lg:flex">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] relative">
            <Image
              src="/images/Logo/Naga Balm__Brandmark_Fire.png"
              alt="Background Logo"
              fill
              className="object-contain opacity-30"
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 relative z-10">
            {/* Container principal centré sur le logo */}
            <div className="flex items-center justify-center w-full">
              {/* Navigation gauche */}
              <div className="flex items-center space-x-1 sm:space-x-2 mr-2 sm:mr-4">
                {leftLinks.map(link => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>

              {/* Logo centré */}
              <div className="mx-2 sm:mx-3 transition-transform duration-300 hover:scale-110">
                <Link href={`/${locale}`} className="block">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-[42px] lg:h-[42px]">
                    <Image
                      src="/images/Logo/Naga Balm__Brandmark_Fire.png"
                      alt="Naga Balm Logo"
                      fill
                      priority
                      className="drop-shadow-md object-contain"
                    />
                    {/* Effet de glow au hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#2DD4BF] rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300 blur-md"></div>
                  </div>
                </Link>
              </div>

              {/* Navigation droite */}
              <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                {rightLinks.map(link => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
            </div>
          
          {/* Language Switcher Desktop */}
          <LanguageSwitcher className="ml-4 sm:ml-6 absolute right-4 sm:right-6" />
        </div>
      </nav>

      {/* Mobile Navigation */}
       <nav className="fixed md:hidden bg-white  top-0 left-0 right-0 z-50 px-4 py-2 flex justify-between items-center"
        
      >
       
        <button
          className="flex flex-col space-y-1"
         onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          
        >
          <span className="w-6 h-0.5 bg-[#F9461C] rounded" />
          <span className="w-6 h-0.5 bg-[#F9461C] rounded" />
          <span className="w-6 h-0.5 bg-[#F9461C] rounded" />
        </button>

        <Link href={`/${locale}`}>
          <div className="w-8 h-8 relative">
            <Image
              src="/images/Logo/Naga Balm__Brandmark_Fire.png"
              alt="Naga Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </nav>

      {/* Slide-Out Menu */}
      {/* Slide-Out Menu */}
<div
  className={`fixed inset-0 bg-white z-60 transform transition-transform duration-300 ease-in-out md:hidden
  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }}
>
  <div className="flex justify-between items-center p-4 border-b">
    {/* Close Icon */}
    <button
      onClick={() => setIsOpen(false)}
      aria-label="Close Menu"
      className="text-[#F9461C] text-2xl font-bold"
    >
      ✕
    </button>

    {/* Logo */}
    <Link href={`/${locale}`} className="w-20 h-10 relative">
  <Image
    src="/images/Logo/nagablam-withkhtext.png"
    alt="Naga Logo"
    fill
    className="object-contain"
    priority
  />
</Link>
  </div>

  {/* Nav Links */}
  <ul className="flex flex-col gap-4 mt-4 px-6">
    {navLinks.map((link) => (
      <li key={link.href}>
        <Link
          href={`/${locale}${link.href === '/' ? '' : link.href}`}
          className="text-[#F9461C] text-sm font-bold tracking-wide"
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>

  {/* Divider */}
  <hr className="my-6 mx-6 border-t border-gray-200" />

  {/* Footer */}
  <div className="mt-auto px-6 pb-6">
    <div className="mb-4 mt-70">
      <LanguageSwitcher isMobile className="text-sm font-semibold" />
    </div>

    <div>
      <p className="text-xs text-gray-600 mb-2 font-semibold">FOLLOW US</p>
      <div className="flex space-x-4 text-[#F9461C]">
        <a 
          href="https://www.facebook.com/nagabalmkh/" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-[#F9461C] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.1,3.3,9.1,5.47V7.46H5.5v3.4h3.6V22.5h5.4V10.86h3.47l.44-3.4"/>
          </svg>
        </a>
        <a 
          href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-gradient-to-r hover:from-[#F56565] hover:to-[#C53030] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z"/>
          </svg>
        </a>
        <a 
          href="https://t.me/nagabalm" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-[#0088cc] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      </div>
    </div>

    <div className="absolute bottom-0 right-0 w-40 opacity-20">
      <Image
        src="/images/Logo/Naga Balm__Brandmark_Fire.png"
        alt="Decoration"
        className="transform scale-200 mb-10 ml-19"
        width={200}
        height={200}
      />
    </div>
  </div>
</div>
    </>
  );
};

export default Navbar;















// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useTranslations, useLocale } from 'next-intl';
// import LanguageSwitcher from './LanguageSwitcher';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const pathname = usePathname();
//   const t = useTranslations('navigation');
//   const locale = useLocale();
//   let lastScrollY = 0;

//   // Navigation links avec traductions
//   const navLinks = [
//     { href: /, label: t('home') },
//     { href: /products, label: t('products') },
//     { href: /about, label: t('about') },
//     { href: /faq, label: t('faq') },
//     { href: /contact, label: t('contact') },
//     { href: /where-to-find, label: t('whereToFind') },
//   ];

//   // Effet scroll pour ombre, transparence et direction
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//       if (window.scrollY < 10) {
//         setShowNavbar(true);
//         lastScrollY = window.scrollY;
//         return;
//       }
//       if (window.scrollY > lastScrollY) {
//         setShowNavbar(false); // Scroll down
//       } else {
//         setShowNavbar(true); // Scroll up
//       }
//       lastScrollY = window.scrollY;
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Fermer le menu mobile au changement de page
//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   // Empêcher le scroll du body quand menu mobile ouvert
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "unset";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   // Séparation des liens pour desktop (gauche/droite du logo)
//   const leftLinks = navLinks.slice(0, 3);
//   const rightLinks = navLinks.slice(3);

//   // Fonction pour générer un lien nav
//   const NavLink = ({ 
//     href, 
//     label, 
//     onClick,
//     isMobile = false 
//   }: { 
//     href: string; 
//     label: string; 
//     onClick?: () => void;
//     isMobile?: boolean;
//   }) => {
//     // Construire l'URL complète avec la locale
//     const fullHref = /${locale}${href === '/' ? '' : href};
//     const isActive = pathname === fullHref;
    
//     const baseClasses = isMobile 
//       ? "text-base font-semibold tracking-wide transition-all duration-300 relative group py-3 px-6 rounded-full min-h-[48px] flex items-center justify-center w-full max-w-xs mx-auto shadow-md"
//       : "text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105 relative group px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2";
    
//     return (
//       <Link
//         href={fullHref}
//         className={${baseClasses} ${
//           isActive 
//             ? isMobile
//               ? "text-white bg-gradient-to-r from-[#F9461C] to-[#e63946] shadow-xl scale-105 border-2 border-white/20"
//               : "text-[#2DD4BF]"
//             : isMobile
//               ? "text-[#F9461C] bg-white/90 backdrop-blur-sm border-2 border-[#F9461C]/30 hover:bg-gradient-to-r hover:from-[#F9461C] hover:to-[#e63946] hover:text-white hover:border-white/20 hover:scale-105 hover:shadow-xl active:scale-95"
//               : "text-[#F04923] hover:text-[#2DD4BF]"
//         }}
//         onClick={onClick}
//       >
//         {/* Effet de background au hover pour desktop */}
//         {!isMobile && (
//           <span className="absolute inset-0 bg-[#CFE8EE] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center -z-10"></span>
//         )}
        
//         <span className="relative z-10 font-semibold">{label}</span>
        
//         {/* Indicateur actif pour desktop */}
//         {!isMobile && isActive && (
//           <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-[#2DD4BF] rounded-full"></span>
//         )}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Desktop & Tablet Navigation */}
//       <nav
//         className={fixed left-1/2 top-4 sm:top-6 z-50 transform -translate-x-1/2 w-[95vw] max-w-7xl
//           ${scrolled 
//             ? "bg-white/95 backdrop-blur-md shadow-xl border border-white/20" 
//             : "bg-white/90 backdrop-blur-sm shadow-lg"
//           }
//           rounded-full transition-all duration-500 ease-out hidden md:block overflow-hidden
//           ${showNavbar ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
//           transition-transform transition-opacity duration-300}
//       >
//         {/* Logo en arrière-plan avec opacité - hidden on mobile/tablet */}
//         <div className="absolute left-0 top-0 h-full items-center pl-4 sm:pl-6 pointer-events-none hidden lg:flex">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] relative">
//             <Image
//               src="/images/Logo/Naga Balm__Brandmark_Fire.png"
//               alt="Background Logo"
//               fill
//               className="object-contain opacity-30"
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 relative z-10">
//             {/* Container principal centré sur le logo */}
//             <div className="flex items-center justify-center w-full">
//               {/* Navigation gauche */}
//               <div className="flex items-center space-x-1 sm:space-x-2 mr-2 sm:mr-4">
//                 {leftLinks.map(link => (
//                   <NavLink key={link.href} href={link.href} label={link.label} />
//                 ))}
//               </div>

//               {/* Logo centré */}
//               <div className="mx-2 sm:mx-3 transition-transform duration-300 hover:scale-110">
//                 <Link href={/${locale}} className="block">
//                   <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-[42px] lg:h-[42px]">
//                     <Image
//                       src="/images/Logo/Naga Balm__Brandmark_Fire.png"
//                       alt="Naga Balm Logo"
//                       fill
//                       priority
//                       className="drop-shadow-md object-contain"
//                     />
//                     {/* Effet de glow au hover */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#2DD4BF] rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300 blur-md"></div>
//                   </div>
//                 </Link>
//               </div>

//               {/* Navigation droite */}
//               <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
//                 {rightLinks.map(link => (
//                   <NavLink key={link.href} href={link.href} label={link.label} />
//                 ))}
//               </div>
//             </div>
          
//           {/* Language Switcher Desktop */}
//           <LanguageSwitcher className="ml-4 sm:ml-6 absolute right-4 sm:right-6" />
//         </div>
//       </nav>

//       {/* Mobile Navigation */}
//       <nav
//         className={fixed left-1/2 top-2 z-50 transform -translate-x-1/2 w-[92vw] max-w-xs
//           ${scrolled 
//             ? "bg-white/95 backdrop-blur-md shadow-lg border border-white/30" 
//             : "bg-white/90 backdrop-blur-sm shadow-md"
//           }
//           rounded-full transition-all duration-500 ease-out md:hidden
//           ${showNavbar ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
//           transition-transform transition-opacity duration-300}
//       >
//         <div className="flex items-center justify-between px-3 py-2 relative z-10">
//           {/* Bouton hamburger animé plus grand et tactile */}
//           <button
//             className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none 
//               transition-all duration-300 hover:scale-110 rounded-lg hover:bg-[#F97316]/10 active:scale-95
//               tap-highlight-transparent select-none"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle menu"
//           >
//             <span
//               className={block w-5 h-0.5 bg-[#F97316] transition-all duration-300 rounded-full ${
//                 isOpen ? "rotate-45 translate-y-1.5" : ""
//               }}
//             />
//             <span
//               className={block w-5 h-0.5 bg-[#F97316] my-1 transition-all duration-300 rounded-full ${
//                 isOpen ? "opacity-0 scale-0" : ""
//               }}
//             />
//             <span
//               className={block w-5 h-0.5 bg-[#F97316] transition-all duration-300 rounded-full ${
//                 isOpen ? "-rotate-45 -translate-y-1.5" : ""
//               }}
//             />
//           </button>

//           {/* Logo mobile centré plus grand */}
//           <Link href={/${locale}} className="absolute left-1/2 transform -translate-x-1/2">
//             <div className="w-8 h-8 relative transition-transform duration-300 hover:scale-110 active:scale-95">
//               <Image
//                 src="/images/Logo/Naga Balm__Brandmark_Fire.png"
//                 alt="Naga Balm Logo"
//                 fill
//                 priority
//                 className="object-contain drop-shadow-sm"
//               />
//             </div>
//           </Link>

//           {/* Language Switcher Mobile */}
//           <LanguageSwitcher isMobile />
//         </div>
//       </nav>

//       {/* Menu mobile overlay amélioré */}
//       <div
//         className={md:hidden fixed inset-0 z-40 transition-all duration-500 ease-out ${
//           isOpen
//             ? "opacity-100 visible"
//             : "opacity-0 invisible"
//         }}
//       >
//         {/* Backdrop avec blur amélioré */}
//         <div 
//           className="absolute inset-0 bg-gradient-to-br from-white/90 via-[#F97316]/10 to-[#2DD4BF]/10 backdrop-blur-xl"
//           onClick={() => setIsOpen(false)}
//         />
        
//         {/* Contenu du menu responsive */}
//         <div className="relative h-full flex flex-col items-center justify-center px-6 py-8">
//           {/* Logo avec animation d'entrée */}
//           <div 
//             className={mb-8 transition-all duration-700 delay-200 ${
//               isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10"
//             }}
//           >
//             <div className="w-12 h-12 relative">
//               <Image
//                 src="/images/Logo/Naga Balm__Brandmark_Fire.png"
//                 alt="Naga Logo"
//                 fill
//                 priority
//                 className="drop-shadow-lg object-contain"
//               />
//             </div>
//           </div>

//           {/* Navigation avec animations décalées - version responsive */}
//           <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
//             {navLinks.map((link, index) => (
//               <div
//                 key={link.href}
//                 className={w-full transition-all duration-500 ease-out ${
//                   isOpen
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-8"
//                 }}
//                 style={{ transitionDelay: ${300 + index * 100}ms }}
//               >
//                 <NavLink
//                   href={link.href}
//                   label={link.label}
//                   onClick={() => setIsOpen(false)}
//                   isMobile={true}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Footer du menu mobile */}
//           <div 
//             className={mt-12 text-center transition-all duration-700 delay-1000 ${
//               isOpen ? "opacity-70 translate-y-0" : "opacity-0 translate-y-4"
//             }}
//           >
//             <p className="text-xs text-gray-500 font-medium mb-3">Made in Cambodia 🇰🇭</p>
            
//             {/* Social Media Icons */}
//             <div className="flex justify-center gap-3">
//               <a 
//                 href="https://www.facebook.com/nagabalmkh/" 
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Facebook" 
//                 className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-[#F9461C] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
//               >
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.1,3.3,9.1,5.47V7.46H5.5v3.4h3.6V22.5h5.4V10.86h3.47l.44-3.4"/>
//                 </svg>
//               </a>
//               <a 
//                 href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy" 
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Instagram" 
//                 className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-gradient-to-r hover:from-[#F56565] hover:to-[#C53030] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
//               >
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z"/>
//                 </svg>
//               </a>
//               <a 
//                 href="https://t.me/nagabalm" 
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Telegram" 
//                 className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F9461C] hover:bg-[#0088cc] hover:text-white transition-all duration-300 hover:scale-110 shadow-md border border-[#F9461C]/20"
//               >
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Effet décoratif en arrière-plan optimisé */}
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-[#F97316]/20 to-[#2DD4BF]/20 rounded-full blur-2xl animate-pulse"></div>
//             <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-[#2DD4BF]/20 to-[#F97316]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar; 