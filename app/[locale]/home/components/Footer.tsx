import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const email = "info@thenagabalm.com";
  const phone = "+855 16 269 359";

  return (
    <footer className="bg-white w-full pt-6 sm:pt-8 md:pt-10 pb-8 relative overflow-hidden text-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-12">
        {/* Background Logo - responsive */}
        <div className="absolute right-[-15%] top-[1%] w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[500px] 2xl:w-[600px] 2xl:h-[600px] opacity-50 pointer-events-none">
          {/* <Image
            src="/images/Logo/Naga Balm__Brandmark_Fire.png"
            alt="Background Logo"
            fill={true}
            className="object-contain opacity-50"
          /> */}
        </div>
        {/* Left Block */}
        <div className="lg:flex-[1.5] max-w-sm">
          <Image
            src="/images/Logo/Logo-Portrait-Full.png"
            alt="Naga Balm Logo"
            width={180}
            height={100}
            className="mb-4 w-36 h-auto"
          />
          <p className="text-sm leading-relaxed mb-4">
            Naga Balm – we blend tradition with modern innovation, delivering
            clean pain relief solutions to soothe, relieve, and heal.
          </p>
          <div className="font-bold uppercase text-sm">MADE IN CAMBODIA</div>
        </div>

        {/* Middle Block */}
        <div className="flex flex-col gap-12 lg:flex-1">
          {/* Company Links */}
          <div>
            <h4 className="font-bold uppercase mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  PRODUCTS
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link
                  href="/where-to-find"
                  className="hover:text-[#F9461C] transition-colors"
                >
                  FIND US AT
                </Link>
              </li>
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="font-bold uppercase mb-4">PRODUCTS</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products/ingredients"
                  className="text-[#F9461C] font-bold hover:text-[#d13a17] transition-colors"
                >
                  INGREDIENTS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Block */}
        <div className="lg:flex-[1.5] max-w-sm">
          <h4 className="font-bold uppercase mb-4">CONTACT US</h4>
          <div className="mb-6 space-y-2 text-sm">
            <div>
              <span className="font-semibold">EMAIL</span>
              <br />
              <a
                href={`mailto:${email}`}
                className="text-[#F9461C] hover:underline"
              >
                {email}
              </a>
            </div>
            <div>
              <span className="font-semibold">PHONE</span>
              <br />
              <a
                href={`tel:${phone}`}
                className="text-[#F9461C] hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="font-bold mb-4">FOLLOW US</div>
          <div className="flex gap-4 mb-6">
            <a
              href="https://www.facebook.com/nagabalmkh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#F9461C] hover:text-[#d13a17] transition-colors"
            >
              {/* Facebook SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.1,3.3,9.1,5.47V7.46H5.5v3.4h3.6V22.5h5.4V10.86h3.47l.44-3.4" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#F9461C] hover:text-[#d13a17] transition-colors"
            >
              {/* Instagram SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z" />
              </svg>
            </a>
            <a
              href="https://t.me/nagabalm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="text-[#F9461C] hover:text-[#d13a17] transition-colors"
            >
              {/* Telegram SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>

          <div>
            <h4 className="font-bold uppercase mb-2">VISIT US</h4>
            <address className="text-sm not-italic leading-relaxed">
              Coco Khmer Co., Ltd.
              <br />
              #1529, NR. 2, Chakangre Krom
              <br />
              Khan Mean Chey, Phnom Penh
              <br />
              Cambodia
            </address>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-100 pt-4">
        © 2023 Naga Balm®. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
