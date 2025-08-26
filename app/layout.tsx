import type { Metadata } from "next";
import { Karla, Hanuman } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "./metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Providers from "./providers";
import { locales } from "../i18n";

// English primary font
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// Khmer font
const hanuman = Hanuman({
  variable: "--font-hanuman",
  subsets: ["khmer"],
  weight: ["400", "700"],
});

export const metadata: Metadata = defaultMetadata;

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Await the params
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  // Set the HTML lang attribute based on the current locale
  const dir = locale === "ar" ? "rtl" : "ltr";
  const lang = locale;

  return (
    <html lang={lang} dir={dir}>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* OG Social metadata */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Naga Balm",
              "url": "https://nagabalm.com",
              "logo": "https://nagabalm.com/favicon.png",
              "sameAs": [
                "https://facebook.com/nagabalmkh",
                "https://instagram.com/nagabalm"
              ],
              "description": "Ancient Khmer healing traditions meet modern innovation. Premium balms handcrafted in Cambodia."
            }
          `}
        </script>
      </head>
      <body
        className={`${karla.variable} ${hanuman.variable} antialiased ${
          locale === "km" ? "font-hanuman" : "font-karla"
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
