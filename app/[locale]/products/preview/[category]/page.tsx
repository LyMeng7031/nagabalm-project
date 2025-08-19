"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";

// === Types ===
export type ApiProduct = {
  id: string;
  translations: {
    en: {
      name: string;
      description: string;
      size?: string;
      activeIngredient?: string;
      usage?: string[];
      bestForTags?: string[];
    };
  };
  images?: string[];
  category: string;
};

export type Product = {
  id: string;
  name: { en: string };
  description: { en: string };
  image: string;
  images: string[];
  weight: string;
  keyIngredient?: {
    benefits: string;
  };
  recommendedFor?: string;
  useCase?: {
    benefits: string[];
  };
};

// === API Functions ===
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
}

export async function apiGetProducts({
  category,
}: { category?: string } = {}) {
  const url = new URL("/api/products", window.location.origin);
  if (category) url.searchParams.append("category", category);

  return request<{ success: boolean; data: ApiProduct[]; count: number }>(
    url.toString()
  );
}

export async function apiGetProduct(id: string) {
  return request<{ success: boolean; data: ApiProduct }>(
    `/api/products/${id}`
  );
}

// === Utility: Map API → UI Model ===
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const primaryImage = apiProduct.images?.[0] || "/images/fallback.jpg";
  const allImages = apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images : [primaryImage];

  return {
    id: apiProduct.id,
    name: { en: apiProduct.translations.en.name },
    description: { en: apiProduct.translations.en.description },
    image: primaryImage,
    images: allImages,
    weight: apiProduct.translations.en.size || "N/A",
    keyIngredient: apiProduct.translations.en.activeIngredient
      ? { benefits: apiProduct.translations.en.activeIngredient }
      : undefined,
    recommendedFor: apiProduct.translations.en.usage?.join("\n"),
    useCase: apiProduct.translations.en.bestForTags
      ? { benefits: apiProduct.translations.en.bestForTags }
      : undefined,
  };
}

// === Valid Categories ===
const VALID_CATEGORIES = ["active", "everyday"] as const;
type CategorySlug = (typeof VALID_CATEGORIES)[number];

const categoryStyles: Record<CategorySlug, { bg: string; text: string }> = {
  active: { bg: "bg-[#F9461C]", text: "text-white" },
  everyday: { bg: "bg-[#00B388]", text: "text-white" },
};

// === Product Modal Component ===
const ProductModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const t = useTranslations("products.preview.modal");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white max-w-5xl w-full rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Gallery */}
            <div className="flex-1 flex flex-col">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name.en}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <span className="text-xl">‹</span>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <span className="text-xl">›</span>
                  </button>
                </>
              )}

              {hasMultipleImages && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded border-2 transition-all ${
                        index === currentImageIndex ? "border-[#F9461C] scale-105" : "border-gray-300"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="text-[#F9461C] text-3xl font-extrabold leading-tight">{product.name.en}</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.description.en}</p>

              {product.keyIngredient && (
                <div className="bg-[#B2E3D7] p-5 rounded-xl">
                  <h3 className="font-bold text-[#009688] mb-2 uppercase tracking-wide text-sm">
                    {t("activeIngredient")}
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{product.keyIngredient.benefits}</p>
                </div>
              )}

              {product.recommendedFor && (
                <div className="bg-[#FFE6B0] p-5 rounded-xl">
                  <h3 className="font-bold text-[#F9461C] mb-2 uppercase tracking-wide text-sm">
                    {t("usage")}
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">{product.recommendedFor}</p>
                </div>
              )}

              {product.useCase?.benefits && product.useCase.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.useCase.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="bg-[#B2E3D7] text-[#009688] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Main Page Component ===
const CategoryPreviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("products.preview");
  const tCategories = useTranslations("products.preview.categories");

  const categoryParam = params.category as string;
  const category = VALID_CATEGORIES.includes(categoryParam as any)
    ? (categoryParam as CategorySlug)
    : null;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
        <p>{t("invalidCategory")}</p>
      </div>
    );
  }

  const style = categoryStyles[category];
  const title = tCategories(category);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await apiGetProducts({ category });
      return res.data.map(mapApiProductToProduct);
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${style.bg} ${style.text}`}>
        <p>{t("loading")}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${style.bg} ${style.text}`}>
        <p>{t("error")}</p>
      </div>
    );
  }

  const categories: CategorySlug[] = ["active", "everyday"];
  const currentIndex = categories.indexOf(category);
  const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];
  const nextCategory = categories[(currentIndex + 1) % categories.length];

  return (
    <div className={`min-h-screen w-full ${style.bg} ${style.text} flex flex-col items-center justify-center pb-16 px-0 relative`}>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#F9461C]/30 via-[#00B388]/20 to-white/80 pointer-events-none" />

      {/* Hero */}
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-8 relative z-10">
        <Image
          src="/images/Logo/Naga Balm__Brandmark_White.png"
          alt="Naga Balm Logo"
          width={90}
          height={90}
          className="drop-shadow-lg mb-4"
        />
        <h1
          className="text-4xl md:text-6xl font-extrabold mb-2 text-center tracking-tight drop-shadow-lg text-white"
          style={{ textShadow: "0 2px 16px rgba(249, 70, 28, 0.6)" }}
        >
          {t("hero.productsTitle", { category: title })}
        </h1>
        <div className="h-2 w-24 bg-gradient-to-r from-[#F9461C] to-[#00B388] rounded-full mb-4" />
        <p className="text-lg text-white/90 max-w-2xl text-center mb-2">
          {t("hero.subtitle", { category: title.toLowerCase() })}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => router.push(`/products/preview/${prevCategory}`)}
        className="fixed left-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#F9461C] rounded-full p-3 shadow hover:bg-white z-50 border-2 border-[#F9461C] hover:scale-110 transition-transform"
        aria-label={`Previous category: ${prevCategory}`}
      >
        <span className="text-3xl">&#8592;</span>
      </button>
      <button
        onClick={() => router.push(`/products/preview/${nextCategory}`)}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#F9461C] rounded-full p-3 shadow hover:bg-white z-50 border-2 border-[#F9461C] hover:scale-110 transition-transform"
        aria-label={`Next category: ${nextCategory}`}
      >
        <span className="text-3xl">&#8594;</span>
      </button>

      {/* Back Button */}
      <button
        onClick={() => router.push("/products")}
        className="absolute top-8 left-8 bg-white text-[#F9461C] font-bold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors z-20 border border-[#F9461C]"
      >
        {t("navigation.backToProducts")}
      </button>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full max-w-7xl px-4 z-10">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-white">{t("noProducts")}</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white/90 card shadow-xl p-4 flex flex-col h-[500px] rounded-2xl border border-[#F9461C]/10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#F9461C]/10 to-[#00B388]/10 rounded-full blur-2xl z-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl z-10 flex items-center justify-center bg-white/60">
                <Image
                  src={product.image}
                  alt={product.name.en}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-col flex-grow z-10">
                <div className="text-[#F9461C] font-extrabold text-base mb-1 text-center min-h-[48px] flex items-center justify-center">
                  {product.name.en}
                </div>
                <div className="text-black text-xs mb-2 text-center overflow-hidden h-16">
                  {product.description.en}
                </div>
                <div className="mt-auto">
                  <div className="text-xs text-right w-full text-gray-500 mb-4">{product.weight}</div>
                  <button
                    className="border-2 border-[#F9461C] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm transition-colors hover:bg-[#F9461C] hover:text-white w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {t("modal.learnMore")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default CategoryPreviewPage;