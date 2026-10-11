import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  ProductReview,
  CartItem,
  Order,
  UserProfile,
  CurrencyCode,
  BespokeRequest,
  SizeType,
} from "@/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  DEMO_USERS,
  INITIAL_BESPOKE,
} from "@/data/initialData";

const STORAGE_KEY = "maison_kanvo_cotonou_state_v1";

export interface AppState {
  hydrated: boolean;
  theme: "light" | "dark";
  currency: CurrencyCode;
  products: Product[];
  reviews: ProductReview[];
  cart: CartItem[];
  orders: Order[];
  bespokeRequests: BespokeRequest[];
  currentUser: UserProfile | null;
  isCheckoutOpen: boolean;
  highlightedCartItemId: string | null;
  editingOrderId: string | null;
  isAnyModalOpen: boolean;
}

const initialState: AppState = {
  hydrated: false,
  theme: "light",
  currency: "XOF",
  products: INITIAL_PRODUCTS,
  reviews: INITIAL_REVIEWS,
  cart: [
    {
      id: "prod-kanvo-royal-01-L-Ocre Royal & Écru",
      productId: "prod-kanvo-royal-01",
      slug: "ensemble-kanvo-royal-abomey",
      name: "Ensemble Kanvô Royal « Danxomè »",
      category: "Édition Kanvô & Héritage",
      priceCFA: 95000,
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
      size: "L",
      color: "Ocre Royal & Écru",
      quantity: 1,
    },
  ],
  orders: INITIAL_ORDERS,
  bespokeRequests: INITIAL_BESPOKE,
  currentUser: DEMO_USERS.CLIENT_VIP,
  isCheckoutOpen: false,
  highlightedCartItemId: null,
  editingOrderId: null,
  isAnyModalOpen: false,
};

export function saveStateToStorage(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify({
      theme: state.theme,
      currency: state.currency,
      products: state.products,
      reviews: state.reviews,
      cart: state.cart,
      orders: state.orders,
      bespokeRequests: state.bespokeRequests,
      currentUser: state.currentUser,
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore storage errors
  }
}

export function loadStateFromStorage(): Partial<AppState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hydrateFromStorage(state, action: PayloadAction<Partial<AppState> | null>) {
      if (action.payload) {
        if (action.payload.theme) state.theme = action.payload.theme;
        if (action.payload.currency) state.currency = action.payload.currency;
        if (action.payload.products?.length)
          state.products = action.payload.products;
        if (action.payload.reviews) state.reviews = action.payload.reviews;
        if (action.payload.cart) state.cart = action.payload.cart;
        if (action.payload.orders?.length) state.orders = action.payload.orders;
        if (action.payload.bespokeRequests)
          state.bespokeRequests = action.payload.bespokeRequests;
        if (action.payload.currentUser !== undefined)
          state.currentUser = action.payload.currentUser;
      }
      state.hydrated = true;
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
      saveStateToStorage(state);
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      saveStateToStorage(state);
    },
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
      saveStateToStorage(state);
    },
    setCheckoutOpen(
      state,
      action: PayloadAction<{ open: boolean; highlightId?: string | null }>
    ) {
      state.isCheckoutOpen = action.payload.open;
      if (action.payload.highlightId !== undefined) {
        state.highlightedCartItemId = action.payload.highlightId;
      } else if (!action.payload.open) {
        state.highlightedCartItemId = null;
      }
    },
    setEditingOrderId(state, action: PayloadAction<string | null>) {
      state.editingOrderId = action.payload;
    },
    setAnyModalOpen(state, action: PayloadAction<boolean>) {
      state.isAnyModalOpen = action.payload;
    },
    addToCartAndOpenCheckout(
      state,
      action: PayloadAction<{
        product: Product;
        size: SizeType;
        color: string;
        quantity: number;
        openDrawer?: boolean;
        customMeasurements?: string;
      }>
    ) {
      const { product, size, color, quantity, openDrawer = true, customMeasurements } =
        action.payload;
      const itemId = `${product.id}-${size}-${color}`;
      const existing = state.cart.find((item) => item.id === itemId);
      if (existing) {
        existing.quantity += quantity;
        if (customMeasurements) existing.customMeasurements = customMeasurements;
      } else {
        state.cart.unshift({
          id: itemId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          priceCFA: product.priceCFA,
          image: product.images[0] || "",
          size,
          color,
          quantity,
          customMeasurements,
        });
      }
      state.highlightedCartItemId = itemId;
      if (openDrawer) {
        state.isCheckoutOpen = true;
      }
      saveStateToStorage(state);
    },
    updateCartItem(
      state,
      action: PayloadAction<{
        id: string;
        size?: SizeType;
        color?: string;
        quantity?: number;
      }>
    ) {
      const item = state.cart.find((c) => c.id === action.payload.id);
      if (!item) return;
      if (action.payload.size) item.size = action.payload.size;
      if (action.payload.color) item.color = action.payload.color;
      if (action.payload.quantity !== undefined) {
        if (action.payload.quantity <= 0) {
          state.cart = state.cart.filter((c) => c.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      saveStateToStorage(state);
    },
    removeCartItem(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((c) => c.id !== action.payload);
      saveStateToStorage(state);
    },
    clearCart(state) {
      state.cart = [];
      saveStateToStorage(state);
    },
    createOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      state.cart = [];
      state.highlightedCartItemId = null;
      saveStateToStorage(state);
    },
    updateOrder(state, action: PayloadAction<Order>) {
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) {
        state.orders[idx] = action.payload;
        saveStateToStorage(state);
      }
    },
    deleteOrder(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      saveStateToStorage(state);
    },
    addReview(state, action: PayloadAction<ProductReview>) {
      state.reviews.unshift(action.payload);
      // Recalculate product average rating & count
      const productReviews = state.reviews.filter(
        (r) => r.productId === action.payload.productId
      );
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      );
      if (product && productReviews.length > 0) {
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        product.rating = Number((sum / productReviews.length).toFixed(1));
        product.reviewCount = productReviews.length;
      }
      saveStateToStorage(state);
    },
    upsertProduct(state, action: PayloadAction<Product>) {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      } else {
        state.products.unshift(action.payload);
      }
      saveStateToStorage(state);
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      saveStateToStorage(state);
    },
    setCurrentUser(state, action: PayloadAction<UserProfile | null>) {
      state.currentUser = action.payload;
      saveStateToStorage(state);
    },
    updateUserProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        saveStateToStorage(state);
      }
    },
    addBespokeRequest(state, action: PayloadAction<BespokeRequest>) {
      state.bespokeRequests.unshift(action.payload);
      saveStateToStorage(state);
    },
  },
});

export const {
  hydrateFromStorage,
  setTheme,
  toggleTheme,
  setCurrency,
  setCheckoutOpen,
  setEditingOrderId,
  setAnyModalOpen,
  addToCartAndOpenCheckout,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  updateOrder,
  deleteOrder,
  addReview,
  upsertProduct,
  deleteProduct,
  setCurrentUser,
  updateUserProfile,
  addBespokeRequest,
} = appSlice.actions;

export default appSlice.reducer;
