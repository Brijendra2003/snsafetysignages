export type Spec = { label: string; value: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  images: string[];
  features: string[];
  specs: Spec[];
  price: number | null;
  unit: string | null;
  min_order_qty: number;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ["contact", "quote", "product", "home", "manual"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type LeadItem = {
  product_id: string | null;
  name: string;
  slug?: string | null;
  quantity: number;
};

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  company: string | null;
  city: string | null;
  subject: string | null;
  message: string | null;
  items: LeadItem[];
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "in_production",
  "dispatched",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["unpaid", "partial", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type OrderItem = {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  line_total?: number;
  sort_order?: number;
};

export type Order = {
  id: string;
  order_number: string;
  lead_id: string | null;
  customer_name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  shipping_address: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  shipping_fee: number;
  total: number;
  amount_paid: number;
  expected_dispatch: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Stat = { value: number; suffix?: string; label: string };

export type SiteSettings = {
  phone: string;
  phone_alt: string | null;
  whatsapp: string;
  email: string;
  address: string;
  map_query: string;
  hours: string;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  catalog_url: string | null;
  stats: Stat[];
  announcement: string | null;
};

/** Standard return shape for server actions used with useActionState. */
export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Submitted values, echoed back so fields keep their input after a failed submit. */
  values?: Record<string, string>;
};
