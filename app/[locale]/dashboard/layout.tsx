import { locales } from "@/i18n";
import { notFound } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Attendre les paramètres
  const { locale } = await params;

  // Valider que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div>
      
      {children}
    
    </div>
  );
}
//not token go to page loign auto