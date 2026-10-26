export type SharedCartKind = "cookie" | "gift-box";

export type SharedCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  kind: SharedCartKind;
  tone: string;
  detail?: string;
  note?: string;
};

const STORAGE_KEY = "delices-cookies-shared-cart";
const CART_EVENT = "delices-cookies-cart-updated";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readSharedCart(): SharedCartItem[] {
  if (!canUseStorage()) return [];

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SharedCartItem => {
      if (!item || typeof item !== "object") return false;
      const value = item as Record<string, unknown>;
      return (
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        typeof value.price === "number" &&
        typeof value.quantity === "number" &&
        (value.kind === "cookie" || value.kind === "gift-box") &&
        typeof value.tone === "string"
      );
    });
  } catch {
    return [];
  }
}

export function writeSharedCart(cart: SharedCartItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function subscribeToSharedCart(onChange: () => void) {
  if (!canUseStorage()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  const handleCustomEvent = () => onChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CART_EVENT, handleCustomEvent);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CART_EVENT, handleCustomEvent);
  };
}