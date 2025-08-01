
"use client";

import React from "react";
import { useTranslations } from 'next-intl';

const ContactFormSection = () => {
  const tForm = useTranslations('contact.form');
  const tInfo = useTranslations('contact.info');
  const tVisit = useTranslations('contact.visit');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/sendmail.php', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok && json.status === 'OK') {
        alert('Message envoyé !');
        form.reset();
      } else {
        alert('Erreur : ' + (json.error || 'Problème'));
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  return (
    <section className="w-full bg-[#FFE2A9] flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white z-0" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-5xl mx-auto items-stretch mb-10 relative z-10">
        {/* Left: Form */}
        <div className="w-full flex justify-center h-full">
          <form id="contactForm" onSubmit={handleSubmit} className="w-full max-w-xl bg-[#FFF9E6] border border-gray-300 rounded-lg shadow-md p-6 sm:p-8 lg:p-10 flex flex-col h-full gap-4 font-sans text-black">
            <div>
              <div className="font-bold text-2xl sm:text-xl mb-2">{tForm('title')}</div>
              <div className="text-sm font-semibold mb-4">{tForm('subtitle')}</div>
              {/* <label className="text-sm font-medium mb-1 block">{tForm('fields.fullName')}</label> */}
              <input id="contact-fullname" name="name" type="text" placeholder={tForm('fields.fullName')} className="border-b border-[#00B388] bg-transparent py-2 px-1 focus:outline-none mb-3 w-full text-base" />
              {/* <label className="text-sm font-medium mb-1 block">{tForm('fields.email')}</label> */}
              <input id="contact-email" name="email" type="email" placeholder={tForm('fields.email')} className="border-b border-[#00B388] bg-transparent py-2 px-1 focus:outline-none mb-3 w-full text-base" />
              {/* <label className="text-sm font-medium mb-1 block">{tForm('fields.phone')}</label> */}
              <input id="contact-phone" name="phone" type="text" placeholder={tForm('fields.phone')} className="border-b border-[#00B388] bg-transparent py-2 px-1 focus:outline-none mb-3 w-full text-base" />
              {/* <label className="text-sm font-medium mb-1 block">{tForm('fields.subject')}</label> */}
              <input id="contact-subject" name="subject" type="text" placeholder={tForm('fields.subject')} className="border-b border-[#00B388] bg-transparent py-2 px-1 focus:outline-none mb-3 w-full text-base" />
            </div>
            <div className="flex flex-col gap-4">
  <textarea name="message" placeholder={tForm('fields.message')} className="border-b border-[#00B388] bg-transparent py-2 px-1 focus:outline-none min-h-[200px] text-base resize-none" />
  <div className="flex justify-start">
    <button type="submit" className="bg-[#F9461C] hover:bg-[#d13a17] text-white w-40 font-bold py-2 px-6 rounded-full text-base transition-colors">
      {tForm('button')} <span className="ml-2 m">→</span>
    </button>
  </div>
</div>    
  </form>
        </div>
        {/* Right: Contact Info + Address stacked */}
        <div className="w-full flex flex-col gap-6 sm:gap-8 items-center h-full">
          <div className="w-full max-w-xl bg-[#FFF9E6] border border-[#F9461C]/40 rounded-lg shadow-md p-6 sm:p-8 lg:p-10 flex-1 flex flex-col gap-4 font-sans text-black">
            <div className="font-bold text-2xl sm:text-xl mb-2">{tInfo('title')}</div>
            <div className=" text-sm font-semibold mb-4">{tInfo('subtitle')}</div>
            <div className="mb-4">
              <div className="font-bold text-lg mb-1">{tInfo('address.title')}</div>
              <div className="text-sm font-bold leading-relaxed">
                {tInfo('address.text').split('\\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < tInfo('address.text').split('\\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="mb-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6 flex flex-col gap-3">
              <div>
                <div className="font-bold text-lg mb-1">{tInfo('email.title')}</div>
                <a href="Naga Balm@combines ancient khmer" className="text-sm text-black font-bold hover:text-[#d13a17]">
                 Naga Balm@combines ancient khmer
                </a>
              </div>
              <div>
                <div className="font-bold text-lg mb-1">{tInfo('phone.title')}</div>
                <a href="tel:+85512269359" className="text-sm text-black font-bold hover:text-[#d13a17]">
                  016 289 350
                </a>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-bold text-lg mb-1">{tInfo('businessHours.title')}</div>
              <div className="text-sm leading-relaxed">
                {tInfo('businessHours.weekdays').split('\\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < tInfo('businessHours.weekdays').split('\\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
                <br />
                <br />
                {tInfo('businessHours.weekends').split('\\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < tInfo('businessHours.weekends').split('\\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="font-bold mt-4 mb-2 text-sm">{tInfo('followUs')}</div>
            <div className="flex items-center gap-4">
  {/* Facebook */}
  <a
    href="https://www.facebook.com/nagabalmkh/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
  >
    <svg
      className="w-6 h-6 text-white"
      fill="currentColor"
      viewBox="0 0 320 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M279.14 288l14.22-92.66h-88.91V127.39c0-25.35 
        12.42-50.06 52.24-50.06h40.42V6.26S293.76 0 
        268.46 0C173.3 0 137.41 54.42 137.41 
        123.26v72.08H76.2V288h61.21v224h100.2V288z" />
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
  >
     <svg className="w-5 h-5 sm:w-6 text-white sm:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z" />
  </svg>
  </a>

  {/* Telegram */}
  <a
    href="https://t.me/nagabalm"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Telegram"
    className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
  >
    <svg
  className="w-6 h-6 text-white"
  fill="currentColor"
  viewBox="0 0 496 512"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.6 169.9-40.8 192.5c-3.1 13.9-11.4 17.3-23 10.8l-63.6-46.9-30.7 29.6c-3.4 3.4-6.3 6.3-12.9 6.3l4.6-65.1 118.6-106.9c5.2-4.6-1.1-7.2-8-2.6L152 280.4l-62.7-19.6c-13.6-4.2-13.9-13.6 2.8-20.1l244.6-94.2c11.4-4.2 21.4 2.6 17.9 20.4z" />
</svg>

  </a>
</div>

            {/* <div className="flex gap-3 bg sm:gap-4">
                  <a 
                  href="https://www.facebook.com/nagabalmkh/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook" 
                  className="text-[#F9461C] hover:text-[#d13a17] transition-colors duration-200 p-1 bg-[#F9461C] rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-white sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.1,3.3,9.1,5.47V7.46H5.5v3.4h3.6V22.5h5.4V10.86h3.47l.44-3.4"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram" 
                  className="text-[#F9461C] hover:text-[#d13a17] transition-colors duration-200 p-1  rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z"/>
                  </svg>
                </a>
                <a 
                  href="https://t.me/nagabalm" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram" 
                  className="text-[#F9461C] hover:text-[#d13a17] transition-colors duration-200 p-1  rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
            </div> */}
          </div>
          <div className="w-full max-w-xl bg-[#FFCCCC] border border-[#F9461C]/40 rounded-lg shadow-md p-6 flex flex-col font-sans text-black">
            <div className="font-bold text-lg sm:text-xl mb-2">{tVisit('title')}</div>
            <div className="text-sm leading-relaxed">
              {tVisit('address').split('\\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < tVisit('address').split('\\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;