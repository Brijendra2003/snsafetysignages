export const site = {
  name: "SN Safety & Signages",
  shortName: "SN Safety",
  legalName: "S.N. Safety Signages",
  tagline: "Your trusted partner in industrial safety solutions",
  description:
    "Manufacturer of ISO 7010 compliant safety signages, emergency & exit lights, photoluminescent signs, evacuation plans and safety tapes. Direct from our Vasai factory with pan-India delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  founded: 2021,
  serviceArea: "Mumbai factory · Pan-India delivery",
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const standards = ["ISO 7010", "IS 9457", "BIS", "NBC 2016", "IMO"] as const;

export function whatsappLink(number: string, text = "Hi SN Safety, I'd like a quote for safety signages.") {
  let digits = number.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) digits = `91${digits}`; // Indian mobile without country code
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
