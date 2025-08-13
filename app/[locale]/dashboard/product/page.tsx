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
    };
    km: {
      name: string;
      description: string;
      size: string;
      activeIngredient: string;
      usage: string[];
      bestForTags: string[];
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
      },
      km: {
        name: "",
        description: "",
        size: "",
        activeIngredient: "",
        usage: [],
        bestForTags: [],
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
        },
        km: {
          name: p.translations.km.name || "",
          description: p.translations.km.description || "",
          size: p.translations.km.size || "",
          activeIngredient: p.translations.km.activeIngredient || "",
          usage: p.translations.km.usage || [],
          bestForTags: p.translations.km.bestForTags || [],
        },
      },
      categoryId: p.categoryId,
    });
    setEditingId(p.id);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: form.slug,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <button
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
            placeholder="Search by slug or name..."
            className="w-full md:w-96 border rounded-md px-3 py-2"
          />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loadingProducts ? Array.from({ length: 6 }) : filteredProducts).map(
            (p, idx) => (
              <div
                key={(p as any)?.id ?? idx}
                className="bg-white rounded-lg shadow p-4"
              >
                {p ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h2
                        className="text-lg font-semibold text-gray-800 truncate"
                        title={(p as ApiProduct).slug}
                      >
                        {(p as ApiProduct).slug}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ${(p as ApiProduct).price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto mb-3">
                      {(p as ApiProduct).images?.slice(0, 3).map((img) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img}
                          src={img}
                          alt="img"
                          className="h-14 w-14 object-cover rounded"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100">
                        {(p as ApiProduct).isTopSell ? "Top" : "Regular"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100">
                        {(p as ApiProduct).categoryId.slice(-6)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p as ApiProduct)}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this product?"))
                            deleteMutation.mutate((p as ApiProduct).id);
                        }}
                        className="px-3 py-1.5 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse h-40 bg-gray-100 rounded" />
                )}
              </div>
            )
          )}
        </div>

        {formOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="bg-white w-full max-w-4xl rounded-lg p-4 md:p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Product" : "Create Product"}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>


              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium mb-1"
                    >
                      Slug
                    </label>
                    <input
                      id="slug"
                      required
                      placeholder="unique-product-slug"
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="categoryId"
                      required
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((c: ApiCategory) => (
                        <option key={c.id} value={c.id}>
                          {c.slug} – {c.translations.en.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium mb-1"
                    >
                      Price
                    </label>
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
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      id="isTopSell"
                      type="checkbox"
                      checked={form.isTopSell}
                      onChange={(e) =>
                        setForm({ ...form, isTopSell: e.target.checked })
                      }
                    />
                    <label htmlFor="isTopSell" className="text-sm">
                      Top Sell
                    </label>
                  </div>
                </div>


                <div>
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium mb-1"
                  >
                    Images
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((url) => (
                      <div key={url} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-16 w-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {(["en", "km"] as const).map((lang) => (
                  <fieldset key={lang} className="border rounded-md p-3">
                    <legend className="text-sm font-semibold">
                      {lang.toUpperCase()} Translation
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`name-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <input
                          id={`name-${lang}`}
                          required
                          placeholder={
                            lang === "en"
                              ? "Product name (English)"
                              : "ឈ្មោះ​ផលិតផល (ខ្មែរ)"
                          }
                          value={form.translations[lang].name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  name: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full border rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`size-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Size
                        </label>
                        <input
                          id={`size-${lang}`}
                          placeholder={
                            lang === "en"
                              ? "e.g., 7g / 80g"
                              : "ឧ. ៧ក្រាម / ៨០ក្រាម"
                          }
                          value={form.translations[lang].size}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  size: e.target.value,
                                },
                              },

                            })
                          }
                          className="w-full border rounded-md px-3 py-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`description-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id={`description-${lang}`}
                          required
                          placeholder={
                            lang === "en"
                              ? "Describe the product"
                              : "ពិពណ៌នា​ពី​ផលិតផល"
                          }
                          value={form.translations[lang].description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  description: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full border rounded-md px-3 py-2 min-h-24"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`activeIngredient-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Active Ingredient
                        </label>
                        <input
                          id={`activeIngredient-${lang}`}
                          placeholder={
                            lang === "en"
                              ? "e.g., Wintergreen Oil"
                              : "ឧ. ប្រេង Wintergreen"
                          }
                          value={form.translations[lang].activeIngredient}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  activeIngredient: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full border rounded-md px-3 py-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`usage-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Usage (one per line)
                        </label>
                        <textarea
                          id={`usage-${lang}`}
                          placeholder={
                            lang === "en"
                              ? "One point per line"
                              : "មួយចំណុចក្នុងមួយបន្ទាត់"
                          }
                          value={form.translations[lang].usage.join("\n")}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  usage: e.target.value
                                    .split("\n")
                                    .filter(Boolean),

                                },
                              },
                            })
                          }
                          className="w-full border rounded-md px-3 py-2 min-h-24"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`bestFor-${lang}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Best For Tags (comma separated)
                        </label>
                        <input
                          id={`bestFor-${lang}`}
                          placeholder={
                            lang === "en"
                              ? "tag1, tag2, tag3"
                              : "ស្លាក១, ស្លាក២, ស្លាក៣"
                          }
                          value={form.translations[lang].bestForTags.join(", ")}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              translations: {
                                ...form.translations,
                                [lang]: {
                                  ...form.translations[lang],
                                  bestForTags: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                },
                              },
                            })
                          }
                          className="w-full border rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  </fieldset>
                ))}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormOpen(false);
                      setEditingId(undefined);
                    }}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
