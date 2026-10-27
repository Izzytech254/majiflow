export type OrderStatus = "pending" | "confirmed" | "accepted" | "preparing" | "rider_assigned" | "in-transit" | "out_for_delivery" | "delivered" | "cancelled";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  open: boolean;
}

export interface BusinessProductOption {
  id: string;
  label: string;
  priceDelta: number;
  deposit?: number;
  stock?: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  unit: "can" | "bottle" | "refill" | "month";
  price: number;
  oldPrice?: number;
  description: string;
  category: "refill" | "bottled" | "remineralised" | "dispenser" | "accessory";
  stock: number;
  stockLow: number;
  popular?: boolean;
  image: string;
  options?: BusinessProductOption[];
}

export interface OperatingHours {
  open: string;
  close: string;
}

export interface WeeklyOperatingHours {
  monday: OperatingHours | null;
  tuesday: OperatingHours | null;
  wednesday: OperatingHours | null;
  thursday: OperatingHours | null;
  friday: OperatingHours | null;
  saturday: OperatingHours | null;
  sunday: OperatingHours | null;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  estates: string[];
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  avgDeliveryMinutes: number;
  deliveryRadiusKm?: number;
  nearbyDiscountPercent?: number;
  verified: boolean;
  paid: boolean;
  acceptsMpesa: boolean;
  acceptsCard: boolean;
  subscription: string;
  description: string;
  products: BusinessProduct[];
  accent: string;
  cover: import("next/image").StaticImageData;
  lat: number;
  lng: number;
  openingHours?: WeeklyOperatingHours;
  orderBlockReason?: string | null;
}

export interface CartItem {
  id: string;
  storeId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export type PaymentMethod = "mpesa" | "card" | "cod";

export type PaymentState = "unpaid" | "processing" | "paid" | "failed" | "refunded";

export interface DeliveryAddress {
  label?: string;
  name?: string;
  phone?: string;
  estate: string;
  apartment?: string;
  notes?: string;
  lat: number;
  lng: number;
  city?: string;
}

export interface Order {
  id: string;
  businessId: string;
  items: CartItem[];
  address: DeliveryAddress;
  payment: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentState: PaymentState;
  fulfillment: "delivery" | "pickup";
  createdAt: string;
  updatedAt: string;
  location?: { lat: number; lng: number; at: string } | null;
  locationHistory?: Array<{ lat: number; lng: number; at: string }>;
  consent?: { location?: boolean };
  customerUserId?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type FulfillmentActor = "customer" | "station" | "rider" | "admin";
