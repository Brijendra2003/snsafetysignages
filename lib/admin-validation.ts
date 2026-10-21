import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/types";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

const money = z.coerce.number().min(0).max(1e10);
const url = z
  .string()
  .trim()
  .max(500)
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .transform((v) => v ?? null)
  .refine((v) => v === null || /^https?:\/\//i.test(v), "Must start with http:// or https://");

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug is required")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(160),
  slug: slugSchema,
  category_id: z
    .string()
    .uuid()
    .or(z.literal(""))
    .transform((v) => v || null),
  sku: text(60),
  short_description: text(300),
  description: text(5000),
  images: z.array(z.string().url()).max(12),
  features: z.array(z.string().trim().min(1).max(120)).max(20),
  specs: z.array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(200) })).max(30),
  price: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Enter a valid price"),
  unit: text(30),
  min_order_qty: z.coerce.number().int().min(1).max(100000),
  badge: text(40),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(10000),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  slug: slugSchema,
  tagline: text(120),
  description: text(600),
  image_url: url,
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_active: z.boolean(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  notes: text(4000),
});

export const manualLeadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z
    .string()
    .trim()
    .max(160)
    .transform((v) => (v === "" ? null : v))
    .pipe(z.email("Enter a valid email").nullable()),
  company: text(120),
  city: text(80),
  subject: text(160),
  message: text(2000),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES),
});

export const orderItemSchema = z.object({
  product_id: z
    .string()
    .uuid()
    .or(z.literal(""))
    .nullable()
    .transform((v) => v || null),
  product_name: z.string().trim().min(1, "Item name is required").max(200),
  description: text(300),
  quantity: z.coerce.number().int().min(1, "Qty must be at least 1").max(1000000),
  unit_price: money,
});

export const orderSchema = z.object({
  lead_id: z
    .string()
    .uuid()
    .or(z.literal(""))
    .transform((v) => v || null),
  customer_name: z.string().trim().min(2, "Customer name is required").max(120),
  company: text(120),
  email: z
    .string()
    .trim()
    .max(160)
    .transform((v) => (v === "" ? null : v))
    .pipe(z.email("Enter a valid email").nullable()),
  phone: text(20),
  gstin: text(20),
  shipping_address: text(600),
  status: z.enum(ORDER_STATUSES),
  payment_status: z.enum(PAYMENT_STATUSES),
  tax_rate: z.coerce.number().min(0).max(100),
  shipping_fee: money,
  amount_paid: money,
  expected_dispatch: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), "Invalid date"),
  notes: text(4000),
  items: z.array(orderItemSchema).min(1, "Add at least one item").max(100),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  logo_url: url,
  website: url,
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_active: z.boolean(),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  role: text(100),
  company: text(120),
  quote: z.string().trim().min(10, "Quote is too short").max(800),
  rating: z.coerce.number().int().min(1).max(5),
  avatar_url: url,
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_active: z.boolean(),
});

export const settingsSchema = z.object({
  phone: z.string().trim().min(6, "Phone is required").max(30),
  phone_alt: text(30),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Enter the number with country code, e.g. 918530072419")),
  email: z.email("Enter a valid email"),
  address: z.string().trim().min(5).max(400),
  map_query: z.string().trim().min(3).max(200),
  hours: z.string().trim().min(3).max(120),
  announcement: text(200),
  facebook_url: url,
  instagram_url: url,
  linkedin_url: url,
  youtube_url: url,
  catalog_url: url,
  stats: z
    .array(z.object({ value: z.coerce.number().min(0), suffix: z.string().max(4).optional(), label: z.string().trim().min(1).max(40) }))
    .max(6),
});
