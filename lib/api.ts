"use client";

import { getAccessToken } from "./auth";

export interface TranslationFields {
  name: string;
  description: string;
  size?: string;
  activeIngredient?: string;
  usage?: string[];
  bestForTags?: string[];
}

export interface ApiProduct {
  id: string;
  slug: string;
  images: string[];
  price: number;
  isTopSell: boolean;
  translations: {
    en: TranslationFields;
    km: TranslationFields;
  };
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  slug: string;
  translations: {
    en: { name: string };
    km: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type":
        init?.body instanceof FormData
          ? (undefined as any)
          : "application/json",
      ...(init?.headers || {}),
      ...(shouldAttachAuth(init) ? authHeader() : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }
  return res.json();
}

function shouldAttachAuth(init?: RequestInit) {
  const method = (init?.method || "GET").toUpperCase();
  // Attach auth for non-GET or for upload endpoint
  return method !== "GET";
}

function authHeader() {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Products
export async function apiGetProducts() {
  return request<{ success: boolean; data: ApiProduct[]; count: number }>(
    `/api/products`
  );
}

export async function apiGetProduct(id: string) {
  return request<{ success: boolean; data: ApiProduct }>(`/api/products/${id}`);
}

export async function apiCreateProduct(
  payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiProduct }>(`/api/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateProduct(
  id: string,
  payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiProduct }>(
    `/api/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteProduct(id: string) {
  return request<{ success: boolean; message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

// Categories
export async function apiGetCategories() {
  return request<{ success: boolean; data: ApiCategory[]; count: number }>(
    `/api/categories`
  );
}

export async function apiCreateCategory(
  payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiCategory }>(`/api/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateCategory(
  id: string,
  payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiCategory }>(
    `/api/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteCategory(id: string) {
  return request<{ success: boolean; message: string }>(
    `/api/categories/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Upload
export async function apiUploadImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const res = await fetch(`/api/upload`, {
    method: "POST",
    body: formData,
    headers: {
      ...authHeader(),
    },
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error || `Upload failed: ${res.status}`);
  }
  return res.json() as Promise<{ success: boolean; data: { urls: string[] } }>;
}
