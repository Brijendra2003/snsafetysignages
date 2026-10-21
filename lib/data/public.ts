import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import {
  seedCategories,
  seedClients,
  seedProducts,
  seedSettings,
  seedTestimonials,
} from "@/lib/seed";
import type {
  Category,
  Client,
  Product,
  ProductWithCategory,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/**
 * Cached reads for the public website. Every function is tagged so that admin
 * mutations can expire exactly what changed (see lib/revalidate.ts).
 * When Supabase is not configured, or a query fails, seed content is returned
 * so the site always renders.
 */

export const TAGS = {
  catalog: "catalog",
  clients: "clients",
  testimonials: "testimonials",
  settings: "settings",
} as const;

function normalizeProduct(row: Record<string, unknown>): Product {
  const p = row as unknown as Product;
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    features: Array.isArray(p.features) ? p.features : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    price: p.price === null || p.price === undefined ? null : Number(p.price),
  };
}

function withCategory(products: Product[], categories: Category[]): ProductWithCategory[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  return products.map((p) => {
    const c = p.category_id ? byId.get(p.category_id) : undefined;
    return { ...p, category: c ? { id: c.id, name: c.name, slug: c.slug } : null };
  });
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  if (!isSupabaseConfigured) return seedCategories;
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");
  if (error) {
    console.error("[getCategories]", error.message);
    return seedCategories;
  }
  return data as Category[];
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const categories = await getCategories();
  if (!isSupabaseConfigured) return withCategory(seedProducts, categories);

  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");
  if (error) {
    console.error("[getProducts]", error.message);
    return withCategory(seedProducts, seedCategories);
  }
  // Hide products whose category was deactivated.
  const activeIds = new Set(categories.map((c) => c.id));
  const products = data
    .map(normalizeProduct)
    .filter((p) => !p.category_id || activeIds.has(p.category_id));
  return withCategory(products, categories);
}

export async function getFeaturedProducts(limit = 8) {
  const products = await getProducts();
  // Featured first, topped up with the rest so the grid is always full.
  const featured = products.filter((p) => p.is_featured);
  return [...featured, ...products.filter((p) => !p.is_featured)].slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: ProductWithCategory, limit = 4) {
  const products = await getProducts();
  return products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .concat(products.filter((p) => p.category_id !== product.category_id))
    .slice(0, limit);
}

export async function getClients(): Promise<Client[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.clients);

  if (!isSupabaseConfigured) return seedClients;
  const { data, error } = await createPublicClient()
    .from("clients")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    console.error("[getClients]", error.message);
    return seedClients;
  }
  return data as Client[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  if (!isSupabaseConfigured) return seedTestimonials;
  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    console.error("[getTestimonials]", error.message);
    return seedTestimonials;
  }
  return data as Testimonial[];
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);

  if (!isSupabaseConfigured) return seedSettings;
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[getSettings]", error.message);
    return seedSettings;
  }
  // Fall back field-by-field so a half-filled settings row never blanks the site.
  const merged = { ...seedSettings };
  for (const [k, v] of Object.entries(data)) {
    if (v !== null && v !== "" && k in merged) (merged as Record<string, unknown>)[k] = v;
  }
  if (!Array.isArray(merged.stats) || merged.stats.length === 0) merged.stats = seedSettings.stats;
  return merged;
}
