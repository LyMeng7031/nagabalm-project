import { notFound } from "next/navigation";
import { locales } from "../../i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Validate that the locale is supported
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return <>{children}</>;
}
