export type CartKind = "cookie" | "gift-box";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  kind: CartKind;
  tone: string;
  detail?: string;
  note?: string;
};

const STORAGE_KEY = "crockies-shared-cart";
const CART_EVENT = "crockies-cart-updated";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const value = item as Record<string, unknown>;
      return typeof value.id === "string" && typeof value.name === "string" && typeof value.price === "number" && typeof value.quantity === "number" && (value.kind === "cookie" || value.kind === "gift-box") && typeof value.tone === "string";
    }) : [];
  } catch { return []; }
}

export function writeCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function subscribeToCart(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const storageHandler = (event: StorageEvent) => { if (event.key === STORAGE_KEY) onChange(); };
  window.addEventListener("storage", storageHandler);
  window.addEventListener(CART_EVENT, onChange);
  return () => { window.removeEventListener("storage", storageHandler); window.removeEventListener(CART_EVENT, onChange); };
}