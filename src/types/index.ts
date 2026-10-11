export type CategoryType =
  | "Femme"
  | "Homme"
  | "Édition Kanvô & Héritage"
  | "Accessoires & Maroquinerie";

export type SizeType =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "Sur-Mesure";

export type CurrencyCode = "XOF" | "EUR" | "USD";

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation: string;
  rating: number; // 1 to 5
  orderedSize: SizeType;
  comment: string;
  photos: string[]; // Base64 or URLs of worn photos
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategoryType;
  priceCFA: number;
  originalPriceCFA?: number;
  rating: number;
  reviewCount: number;
  sizes: SizeType[];
  colors: { name: string; hex: string }[];
  material: string;
  origin: string;
  cutDetails: string;
  careInstructions: string;
  deliveryInfo: string;
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  stockStatus: "En Stock Atelier" | "Édition Limitée" | "Confection 48h";
}

export interface CartItem {
  id: string; // unique line item id: `${productId}-${size}-${color}`
  productId: string;
  slug: string;
  name: string;
  category: CategoryType;
  priceCFA: number;
  image: string;
  size: SizeType;
  color: string;
  quantity: number;
  customMeasurements?: string;
}

export type DeliveryMethod =
  | "SHOWROOM_COTONOU"
  | "EXPRESS_COTONOU_CALAVI"
  | "DHL_INTERNATIONAL";

export type PaymentMethod =
  | "MTN_MOMO"
  | "CELTIIS_CASH"
  | "CARTE_BANCAIRE"
  | "ESPECES_LIVRAISON";

export type OrderStatus =
  | "Confirmée"
  | "En préparation Atelier"
  | "Prête / En coursier"
  | "Livrée"
  | "Annulée";

export interface Order {
  id: string;
  trackingNumber: string; // e.g., LP-MODE-84920
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cityQuarter: string; // ex: Haie Vive, Ganhi, Calavi, Porto-Novo
  addressDetails: string;
  deliveryMethod: DeliveryMethod;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string; // Matin (09h-13h) | Après-midi (14h-18h) | Soir (18h-20h)
  paymentMethod: PaymentMethod;
  momoPhone?: string;
  items: CartItem[];
  subtotalCFA: number;
  shippingCFA: number;
  totalCFA: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type UserRole = "CLIENT_VIP" | "DIRECTEUR_BOUTIQUE" | "ADMIN_ATELIER";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  defaultSize: SizeType;
  cityQuarter: string;
  address: string;
  memberSince: string;
  vipCode?: string;
}

export interface BespokeRequest {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  garmentType: string;
  fabricPreference: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: "En attente" | "Confirmé au Showroom";
  createdAt: string;
}
