"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateProduct,
  apiDeleteProduct,
  apiGetCategories,
  apiGetProducts,
  apiUpdateProduct,
  apiUploadImages,
  type ApiProduct,
  type ApiCategory,
} from "@/lib/api";
import { postAppEvent } from "@/lib/events";

interface ProductFormState {
  id?: string;
  slug: string;
  images: string[];
  price: string;
  isTopSell: boolean;
  translations: {
    en: {
      name: string;
      description: string;
      size: string;
      activeIngredient: string;
      usage: string[];
      bestForTags: string[];
      Slug: string;
    };
    km: {
      name: string;
      description: string;
      size: string;
      activeIngredient: string;
      usage: string[];
      bestForTags: string[];
      Slug: string;
    };
  };
  categoryId: string;
}

function emptyForm(): ProductFormState {
  return {
    slug: "",
    images: [],
    price: "",
    isTopSell: false,
    translations: {
      en: {
        name: "",
        description: "",
        size: "",
        activeIngredient: "",
        usage: [],
        bestForTags: [],
        Slug: "",
      },
      km: {
        name: "",
        description: "",
        size: "",
        activeIngredient: "",
        usage: [],
        bestForTags: [],
        Slug: "",
      },
    },
    categoryId: "",
  };
}

export default function ProductDashboardPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [search, setSearch] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // For multi-step form

  const { data: productsResp, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: apiGetProducts,
  });

  const { data: categoriesResp } = useQuery({
    queryKey: ["categories"],
    queryFn: apiGetCategories,
  });

  const products = productsResp?.data ?? [];
  const categories = categoriesResp?.data ?? [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.slug.toLowerCase().includes(q) ||
        p.translations.en.name.toLowerCase().includes(q) ||
        p.translations.km.name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const createMutation = useMutation({
    mutationFn: async (
      payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">
    ) => {
      const res = await apiCreateProduct(payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      postAppEvent({ type: "products/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
      setCurrentStep(1);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">;
    }) => {
      const res = await apiUpdateProduct(id, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      postAppEvent({ type: "products/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
      setCurrentStep(1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDeleteProduct(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      postAppEvent({ type: "products/changed" });
    },
  });

  function openCreate() {
    setForm(emptyForm());
    setEditingId(undefined);
    setCurrentStep(1);
    setFormOpen(true);
  }

  function openEdit(p: ApiProduct) {
    setForm({
      id: p.id,
      slug: p.slug,
      images: p.images,
      price: String(p.price),
      isTopSell: p.isTopSell,
      translations: {
        en: {
          name: p.translations.en.name || "",
          description: p.translations.en.description || "",
          size: p.translations.en.size || "",
          activeIngredient: p.translations.en.activeIngredient || "",
          usage: p.translations.en.usage || [],
          bestForTags: p.translations.en.bestForTags || [],
          Slug: p.translations.en.Slug || "",
        },
        km: {
          name: p.translations.km.name || "",
          description: p.translations.km.description || "",
          size: p.translations.km.size || "",
          activeIngredient: p.translations.km.activeIngredient || "",
          usage: p.translations.km.usage || [],
          bestForTags: p.translations.km.bestForTags || [],
          Slug: p.translations.km.Slug || "",
        },
      },
      categoryId: p.categoryId,
    });
    setEditingId(p.id);
    setCurrentStep(1);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Generate main slug from English name
    const mainSlug = generateSlug(form.translations.en.name);
    
    const payload = {
      slug: mainSlug,
      images: form.images,
      price: parseFloat(form.price),
      isTopSell: form.isTopSell,
      translations: form.translations,
      categoryId: form.categoryId,
    } as Omit<ApiProduct, "id" | "createdAt" | "updatedAt">;

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const selected = Array.from(files);
    const resp = await apiUploadImages(selected);
    const urls = resp.data.urls;
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  // Helper function to generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Validation functions for each step - ALL required fields must be filled
  const validateStep1 = () => {
    return (
      form.translations.en.name.trim() !== "" &&
      form.translations.km.name.trim() !== "" &&
      form.translations.en.Slug.trim() !== "" &&
      form.translations.km.Slug.trim() !== "" &&
      form.categoryId.trim() !== ""
    );
  };

  const validateStep2 = () => {
    return form.price.trim() !== "" && parseFloat(form.price) > 0;
  };

  const validateStep3 = () => {
    return form.translations.en.description.trim() !== "";
  };

  const validateStep4 = () => {
    return form.translations.km.description.trim() !== "";
  };

  // Get validation status for current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return false;
    }
  };

  // Get missing fields for current step
  const getMissingFields = () => {
    const missing: string[] = [];

    switch (currentStep) {
      case 1:
        if (!form.translations.en.name.trim())
          missing.push("Product Name (English)");
        if (!form.translations.km.name.trim())
          missing.push("Product Name (Khmer)");
        if (!form.translations.en.Slug.trim())
          missing.push("URL Slug (English)");
        if (!form.translations.km.Slug.trim()) missing.push("URL Slug (Khmer)");
        if (!form.categoryId.trim()) missing.push("Category");
        break;
      case 2:
        if (!form.price.trim() || parseFloat(form.price) <= 0)
          missing.push("Price");
        break;
      case 3:
        if (!form.translations.en.description.trim())
          missing.push("Product Description (English)");
        break;
      case 4:
        if (!form.translations.km.description.trim())
          missing.push("Product Description (Khmer)");
        break;
    }

    return missing;
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            New Product
          </button>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product or name..."
            className="w-full md:w-96 border rounded-md px-3 py-2"
          />
        </div>

        {/* === Products Table === */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                  Images
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                  Status
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-b text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(loadingProducts
                ? Array.from({ length: 6 })
                : filteredProducts
              ).map((p, idx) =>
                p ? (
                  <tr
                    key={(p as ApiProduct).id ?? idx}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {(p as ApiProduct).translations.en.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      ${(p as ApiProduct).price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {(p as ApiProduct).images?.slice(0, 3).map((img) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={img}
                            src={img}
                            alt="img"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (p as ApiProduct).isTopSell
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {(p as ApiProduct).isTopSell ? "Top" : "Regular"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(p as ApiProduct)}
                        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this product?"))
                            deleteMutation.mutate((p as ApiProduct).id);
                        }}
                        className="px-3 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={idx}>
                    <td colSpan={5} className="px-4 py-6">
                      <div className="animate-pulse h-6 bg-gray-100 rounded" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* === Improved Product Form Modal === */}
        {formOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="bg-white w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-5xl rounded-lg overflow-hidden max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Progress */}
              <div className="p-3 sm:p-4 md:p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Product" : "Create New Product"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between max-w-xs sm:max-w-sm md:max-w-md">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                          step <= currentStep
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-6 sm:w-8 md:w-12 h-1 mx-1 sm:mx-2 ${
                            step < currentStep ? "bg-orange-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-xs sm:text-sm text-gray-600">
                  Step {currentStep} of {totalSteps}:{" "}
                  {currentStep === 1
                    ? "Basic Information"
                    : currentStep === 2
                    ? "Images & Pricing"
                    : currentStep === 3
                    ? "Product Details (English)"
                    : "Product Details (Khmer)"}
                </div>
              </div>

              {/* Form Content */}
              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6"
                style={{ maxHeight: "calc(95vh - 120px)" }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              <strong>Step 1:</strong> Let's start with the
                              basic product information. Fill in the product
                              name first, and we'll help generate a URL-friendly
                              slug for you.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Product Name (English) */}
                        <div>
                          <label
                            htmlFor="product-name-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Product Name (English){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="product-name-en"
                            required
                            placeholder="e.g., Pain Relief Balm"
                            value={form.translations.en.name}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    name: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This will be the main product name displayed to
                            customers
                          </p>
                        </div>

                        {/* Product Name (Khmer) */}
                        <div>
                          <label
                            htmlFor="product-name-kh"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            ឈ្មោះផលិតផល (ភាសាខ្មែរ){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="product-name-kh"
                            required
                            placeholder="ឧ. ថ្នាំបំបាត់ការឈឺចាប់"
                            value={form.translations.km.name}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    name: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            នេះនឹងជាឈ្មោះផលិតផលចម្បងដែលបង្ហាញដល់អតិថិជន
                          </p>
                        </div>

                        {/* URL Slug (English) */}
                        <div>
                          <label
                            htmlFor="slug-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            URL Slug (English){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="slug-en"
                            required
                            placeholder="pain-relief-balm"
                            value={form.translations.en.Slug}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    Slug: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            URL-friendly version (you must enter it manually)
                          </p>
                        </div>

                        {/* URL Slug (Khmer) */}
                        <div>
                          <label
                            htmlFor="slug-kh"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            URL ស្លាក់ (ភាសាខ្មែរ){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="slug-kh"
                            required
                            placeholder="ឧ. ថ្នាំ-បំបាត់-ការឈឺចាប់"
                            value={form.translations.km.Slug}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    Slug: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            ជា URL ដែលអ្នកត្រូវបញ្ចូលដោយដៃ
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="product-size-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Product Size
                          </label>
                          <input
                            id="product-size-en"
                            placeholder="e.g., 7g, 80ml, 50 tablets"
                            value={form.translations.en.size || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    size: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Package size or quantity (optional)
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="product-size-kh"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            ទំហំផលិតផល
                          </label>
                          <input
                            id="product-size-kh"
                            placeholder="ឧ. 7g, 80ml, 50 គ្រាប់ថ្នាំ"
                            value={form.translations.km.size || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    size: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            ទំហំឬបរិមាណកញ្ចប់ (មិនចាំបាច់)
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="categoryId"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="categoryId"
                            required
                            value={form.categoryId}
                            onChange={(e) =>
                              setForm({ ...form, categoryId: e.target.value })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          >
                            <option value="">Choose a category</option>
                            {categories.map((c: ApiCategory) => (
                              <option key={c.id} value={c.id}>
                                {c.translations.en.name}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Select the category this product belongs to
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Images & Pricing */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              <strong>Step 2:</strong> Add product images and
                              set the price. Good product images help customers
                              make purchase decisions.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                            <label className="cursor-pointer">
                              <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 text-gray-400">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-medium text-orange-600">
                                    Click to upload images
                                  </span>{" "}
                                  or drag and drop
                                </div>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG up to 10MB each
                                </p>
                              </div>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUpload(e.target.files)}
                              />
                            </label>
                          </div>

                          {form.images.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 mb-3">
                                Uploaded Images:
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                                {form.images.map((url, index) => (
                                  <div key={url} className="relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={url}
                                      alt={`Product image ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(url)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price (USD) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                              $
                            </span>
                            <input
                              id="price"
                              type="number"
                              step="0.01"
                              required
                              placeholder="0.00"
                              value={form.price}
                              onChange={(e) =>
                                setForm({ ...form, price: e.target.value })
                              }
                              className="w-full border-2 border-gray-200 rounded-lg pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Set the selling price for this product
                          </p>
                        </div>

                        <div className="flex items-start space-x-3 pt-8">
                          <input
                            id="isTopSell"
                            type="checkbox"
                            checked={form.isTopSell}
                            onChange={(e) =>
                              setForm({ ...form, isTopSell: e.target.checked })
                            }
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <div>
                            <label
                              htmlFor="isTopSell"
                              className="text-sm font-medium text-gray-700"
                            >
                              Mark as Top Selling Product
                            </label>
                            <p className="text-xs text-gray-500">
                              Top selling products get featured placement on the
                              website
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Product Details (English) */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-purple-700">
                              <strong>Step 3:</strong> Add detailed product
                              information in English. Include description,
                              ingredients, usage instructions, and tags.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="desc-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Product Description (English){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="desc-en"
                            required
                            placeholder="Describe what this product does, its benefits, and why customers should buy it..."
                            value={form.translations.en.description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    description: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={5}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Write a compelling description that highlights the
                            product benefits
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="ingredient-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Active Ingredients (English)
                          </label>
                          <textarea
                            id="ingredient-en"
                            placeholder="List the main active ingredients and their benefits..."
                            value={form.translations.en.activeIngredient}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    activeIngredient: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={4}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            List key ingredients that make this product
                            effective
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="usage-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            How to Use (English)
                          </label>
                          <textarea
                            id="usage-en"
                            placeholder="Step 1: Clean the affected area&#10;Step 2: Apply a small amount&#10;Step 3: Massage gently..."
                            value={form.translations.en.usage.join("\n")}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    usage: e.target.value
                                      .split("\n")
                                      .filter(Boolean),
                                  },
                                },
                              })
                            }
                            rows={5}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Write each usage instruction on a new line. Press
                            Enter to start a new line.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="tags-en"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Best For (Tags)
                          </label>

                          <div className="space-y-2">
                            {form.translations.en.bestForTags.map(
                              (tag, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Enter a tag"
                                    value={tag}
                                    onChange={(e) => {
                                      const newTags = [
                                        ...form.translations.en.bestForTags,
                                      ];
                                      newTags[index] = e.target.value;
                                      setForm({
                                        ...form,
                                        translations: {
                                          ...form.translations,
                                          en: {
                                            ...form.translations.en,
                                            bestForTags: newTags,
                                          },
                                        },
                                      });
                                    }}
                                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                                  />
                                  {form.translations.en.bestForTags.length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTags =
                                          form.translations.en.bestForTags.filter(
                                            (_, i) => i !== index
                                          );
                                        setForm({
                                          ...form,
                                          translations: {
                                            ...form.translations,
                                            en: {
                                              ...form.translations.en,
                                              bestForTags: newTags,
                                            },
                                          },
                                        });
                                      }}
                                      className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  en: {
                                    ...form.translations.en,
                                    bestForTags: [
                                      ...form.translations.en.bestForTags,
                                      "",
                                    ],
                                  },
                                },
                              });
                            }}
                            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            ➕ Add Box
                          </button>

                          <p className="text-xs text-gray-500 mt-2">
                            Each box represents one tag. Add or remove as
                            needed.
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="tags-km"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            ល្អបំផុតសម្រាប់ (ស្លាក)
                          </label>

                          <div className="space-y-2">
                            {form.translations.km.bestForTags.map(
                              (tag, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="បញ្ចូលស្លាក"
                                    value={tag}
                                    onChange={(e) => {
                                      const newTags = [
                                        ...form.translations.km.bestForTags,
                                      ];
                                      newTags[index] = e.target.value;
                                      setForm({
                                        ...form,
                                        translations: {
                                          ...form.translations,
                                          km: {
                                            ...form.translations.km,
                                            bestForTags: newTags,
                                          },
                                        },
                                      });
                                    }}
                                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                                  />
                                  {form.translations.km.bestForTags.length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTags =
                                          form.translations.km.bestForTags.filter(
                                            (_, i) => i !== index
                                          );
                                        setForm({
                                          ...form,
                                          translations: {
                                            ...form.translations,
                                            km: {
                                              ...form.translations.km,
                                              bestForTags: newTags,
                                            },
                                          },
                                        });
                                      }}
                                      className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    bestForTags: [
                                      ...form.translations.km.bestForTags,
                                      "",
                                    ],
                                  },
                                },
                              });
                            }}
                            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            ➕ បន្ថែមប្រអប់
                          </button>

                          <p className="text-xs text-gray-500 mt-2">
                            ប្រអប់នីមួយៗតំណាងឲ្យស្លាកមួយ។ អ្នកអាចបន្ថែម ឬ
                            លុបបានតាមត្រូវការ។
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Product Details (Khmer) */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              <strong>Step 4:</strong> Add the same product
                              information in Khmer language. Translate all the
                              details from Step 3 into Khmer.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="desc-km"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Product Description (Khmer){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="desc-km"
                            required
                            placeholder="ពិពណ៌នាអំពីផលិតផលនេះ គុណប្រយោជន៍ និងហេតុផលដែលអតិថិជនគួរទិញ..."
                            value={form.translations.km.description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    description: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={5}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            សរសេរការពិពណ៌នាដែលបង្ហាញពីគុណប្រយោជន៍ផលិតផល
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="ingredient-km"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Active Ingredients (Khmer)
                          </label>
                          <textarea
                            id="ingredient-km"
                            placeholder="រាយបញ្ជីសមាសធាតុសកម្ម និងគុណប្រយោជន៍របស់វា..."
                            value={form.translations.km.activeIngredient}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    activeIngredient: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={4}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            រាយបញ្ជីសមាសធាតុសំខាន់ៗដែលធ្វើឱ្យផលិតផលនេះមានប្រសិទ្ធភាព
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="usage-km"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            How to Use (Khmer)
                          </label>
                          <textarea
                            id="usage-km"
                            placeholder="ជំហានទី១: សម្អាតកន្លែងដែលមានបញ្ហា&#10;ជំហានទី២: លាបបរិមាណតិចតួច&#10;ជំហានទី៣: ម៉ាសាហទន់ៗ..."
                            value={form.translations.km.usage.join("\n")}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    usage: e.target.value
                                      .split("\n")
                                      .filter(Boolean),
                                  },
                                },
                              })
                            }
                            rows={5}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none resize-none text-sm sm:text-base"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            សរសេរការណែនាំការប្រើប្រាស់នីមួយៗនៅលើបន្ទាត់ថ្មី។ ចុច
                            Enter ដើម្បីចាប់ផ្តើមបន្ទាត់ថ្មី។
                          </p>
                        </div>

                        <div>
                          {/* <label
                            htmlFor="tags-km"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Best For Tags (Khmer)
                          </label> */}
                          {/* <input
                            id="tags-km"
                            placeholder="ឈឺសាច់ដុំ, ឈឺសន្លាក់, របួសសកម្មភាព, ឈឺក្បាល"
                            value={form.translations.km.bestForTags.join(", ")}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  km: {
                                    ...form.translations.km,
                                    bestForTags: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  },
                                },
                              })
                            }
                            className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                          /> */}
                          {/* <p className="text-xs text-gray-500 mt-1">
                            បំបែកស្លាកដោយសញ្ញាក្បៀស។
                            ស្លាកទាំងនេះជួយអតិថិជនរកឃើញផលិតផលរបស់អ្នក។
                          </p> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex space-x-3">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                          ← Previous
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      {currentStep < totalSteps ? (
                        <div className="flex flex-col items-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (isCurrentStepValid()) {
                                setCurrentStep(currentStep + 1);
                              }
                            }}
                            disabled={!isCurrentStepValid()}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                              isCurrentStepValid()
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            Next →
                          </button>
                          {!isCurrentStepValid() && (
                            <div className="mt-2 text-xs text-red-600 text-right max-w-xs">
                              <p className="font-medium">
                                Please complete required fields:
                              </p>
                              <ul className="list-disc list-inside mt-1">
                                {getMissingFields().map((field, index) => (
                                  <li key={index}>{field}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setFormOpen(false);
                              setEditingId(undefined);
                              setCurrentStep(1);
                            }}
                            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                          >
                            {saving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <span>
                                {editingId
                                  ? "Update Product"
                                  : "Create Product"}
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
