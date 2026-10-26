import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Cookie,
  Instagram,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  readSharedCart,
  subscribeToSharedCart,
  writeSharedCart,
  type SharedCartItem,
} from "./sharedCart";

type Product = {
  id: string;
  name: string;
  detail: string;
  description: string;
  ingredients: string;
  texture: string;
  price: number;
  tone: string;
  chips: string;
};

const products: Product[] = [
  {
    id: "pepites",
    name: "Cookie Pépites de Chocolat",
    detail: "La recette signature, généreuse et fondante",
    description: "Notre grand classique : une pâte dorée au beurre doux, ponctuée de pépites de chocolat qui fondent encore légèrement au centre.",
    ingredients: "Farine de blé, beurre, sucre roux, œuf, pépites de chocolat, levure, fleur de sel.",
    texture: "Bords légèrement croustillants, cœur moelleux et généreux",
    price: 2.5,
    tone: "bg-[#D69A63]",
    chips: "bg-[#543328]",
  },
  {
    id: "chocolat",
    name: "Cookie Tout Chocolat",
    detail: "Un cœur intense pour les vrais amateurs",
    description: "Une pâte au cacao profond, des éclats de chocolat noir et un cœur tendre pour une pause résolument chocolatée.",
    ingredients: "Farine de blé, beurre, cacao, sucre roux, œuf, chocolat noir, levure, fleur de sel.",
    texture: "Moelleux dense, fondant au centre et riche en cacao",
    price: 2.8,
    tone: "bg-[#86604E]",
    chips: "bg-[#33201C]",
  },
  {
    id: "cacahuete",
    name: "Cookie Beurre de Cacahuète",
    detail: "Doux, toasté, avec une pointe de sel",
    description: "Le préféré des amateurs de notes grillées : un cookie tout en douceur, relevé par du beurre de cacahuète et une pointe de sel.",
    ingredients: "Farine de blé, beurre de cacahuète, beurre, sucre roux, œuf, cacahuètes, levure, fleur de sel.",
    texture: "Bords sablés, cœur tendre et éclats croquants",
    price: 3,
    tone: "bg-[#D8B46C]",
    chips: "bg-[#4E3427]",
  },
];

const euro = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function CookieArt({ product }: { product: Product }) {
  return (
    <div className={`relative mx-auto aspect-square w-[78%] rounded-full ${product.tone} shadow-[inset_-12px_-18px_0_rgba(83,45,26,.12),8px_12px_0_rgba(83,45,26,.12)] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105`}>
      <div className="absolute inset-[12%] rounded-full border border-white/20" />
      {[["22%", "28%"], ["62%", "22%"], ["48%", "56%"], ["24%", "66%"], ["72%", "64%"], ["54%", "36%"]].map(
        ([left, top], index) => (
          <span
            key={index}
            className={`absolute h-3 w-4 rotate-[25deg] rounded-full ${product.chips} shadow-[inset_2px_2px_2px_rgba(255,255,255,.16)]`}
            style={{ left, top }}
          />
        ),
      )}
      <span className="absolute left-[18%] top-[18%] h-8 w-14 -rotate-12 rounded-full bg-white/20 blur-[1px]" />
    </div>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} ${className}`}>{children}</div>;
}

export function Storefront() {
  const [cart, setCart] = useState<SharedCartItem[]>(() => readSharedCart());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  useEffect(() => {
    const syncCart = () => setCart(readSharedCart());
    return subscribeToSharedCart(syncCart);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
      if (event.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const add = (product: Product) => {
    const nextCart = (() => {
      const current = readSharedCart();
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, kind: "cookie" as const, quantity: 1 }];
    })();
    writeSharedCart(nextCart);
    setCart(nextCart);
    setOrdered(false);
  };
  const changeQuantity = (id: string, amount: number) => {
    const nextCart = readSharedCart().flatMap((item) => item.id === id
      ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : [])
      : [item]);
    writeSharedCart(nextCart);
    setCart(nextCart);
  };
  const checkout = () => {
    if (!cart.length) return;
    setOrdered(true);
    writeSharedCart([]);
    setCart([]);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#F8F0E5] text-[#3C2923]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E"); }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[.035] grain" />
      <header className="sticky top-0 z-40 border-b border-[#3C2923]/10 bg-[#F8F0E5]/90 px-5 backdrop-blur-md md:px-10">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="Délices Cookies, accueil">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#3C2923] text-[#F6C77B]"><Cookie size={21} strokeWidth={1.8} /></span>
            <span className="leading-none"><strong className="serif block text-lg">Délices Cookies</strong><small className="text-[9px] uppercase tracking-[.25em] text-[#9B6E55]">La pause gourmande</small></span>
          </a>
           <nav className={`${menuOpen ? "absolute left-0 right-0 top-[76px] flex" : "hidden"} flex-col gap-5 border-b border-[#3C2923]/10 bg-[#F8F0E5] px-5 py-6 text-sm md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}>
            <a href="#propos" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#B86942]">Notre histoire</a>
            <a href="#collabs" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#B86942]">Collaborations</a>
            <a href="#boutique" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#B86942]">La boutique</a>
             <a href="/__mockup/preview/delices-cookies/GiftBoxStorefront" onClick={() => setMenuOpen(false)} className="font-bold text-[#B86942] transition-colors hover:text-[#3C2923]">Coffrets cadeaux</a>
          </nav>
          <div className="flex items-center gap-2">
           <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 rounded-full bg-[#E7A26C] px-4 py-2.5 text-xs font-bold text-[#3C2923] transition-transform hover:-translate-y-0.5" aria-label={`Ouvrir le panier partagé, ${count} article${count > 1 ? "s" : ""}`}>
              <ShoppingBag size={16} /><span className="hidden sm:inline">Panier partagé</span><span className="grid min-w-5 place-items-center rounded-full bg-[#3C2923] px-1.5 py-0.5 text-[10px] text-[#F8F0E5]">{count}</span>
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 md:hidden" aria-label="Ouvrir le menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          </div>
        </div>
      </header>

      <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-16 md:grid-cols-[1.04fr_.96fr] md:px-10 md:pb-28 md:pt-24">
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] text-[#B86942]"><span className="h-px w-9 bg-[#B86942]" />Fait maison, fait avec cœur</div>
          <h1 className="serif max-w-2xl text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[.92] tracking-[-.055em] text-[#3C2923]">Les meilleurs<br /><em className="text-[#B86942]">cookies</em><br />faits maison&nbsp;!</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#76584A]">Croquants à l'extérieur, moelleux à l'intérieur.<br />Commandez dès maintenant.</p>
          <a href="#boutique" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#3C2923] px-6 py-3.5 text-sm font-bold text-[#FFF7ED] transition-all hover:-translate-y-1 hover:bg-[#B86942]">Voir nos cookies <ArrowRight size={17} /></a>
          <div className="mt-12 flex items-center gap-4 text-xs text-[#94715F]"><span className="flex -space-x-2"><i className="h-8 w-8 rounded-full border-2 border-[#F8F0E5] bg-[#D69A63]" /><i className="h-8 w-8 rounded-full border-2 border-[#F8F0E5] bg-[#86604E]" /><i className="h-8 w-8 rounded-full border-2 border-[#F8F0E5] bg-[#D8B46C]" /></span><span>Des fournées préparées<br />chaque semaine à la main</span></div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-[6%] rounded-[45%_55%_52%_48%/49%_44%_56%_51%] bg-[#F3C88D] rotate-6" />
          <div className="absolute inset-[12%] rounded-[48%_52%_44%_56%/54%_45%_55%_46%] bg-[#E9AA70] -rotate-6 shadow-[20px_25px_0_rgba(60,41,35,.1)]" />
          <div className="absolute inset-[20%] grid rotate-3 place-items-center rounded-full bg-[#B86942] shadow-[inset_-15px_-20px_0_rgba(60,41,35,.15)]"><Cookie size={125} strokeWidth={.8} className="text-[#F8D39B] opacity-90 md:h-[180px] md:w-[180px]" /><span className="absolute bottom-[18%] rounded-full bg-[#3C2923] px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#F8D39B]">La fournée du jour</span></div>
          <span className="absolute right-[4%] top-[6%] grid h-16 w-16 -rotate-12 place-items-center rounded-full bg-[#A9C6A5] text-center text-[9px] font-bold uppercase leading-3 tracking-widest text-[#365348] shadow-lg">100%<br />maison</span>
          <span className="serif absolute bottom-[4%] left-[2%] -rotate-12 text-3xl text-[#B86942]">miam.</span>
        </div>
        <a href="#propos" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#94715F] md:flex">Découvrir <ArrowDown size={14} /></a>
      </section>

      <section id="propos" className="bg-[#3C2923] px-5 py-20 text-[#F8F0E5] md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[.82fr_1.18fr] md:items-end">
          <Reveal><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#E7A26C]">01 — L'histoire</p><h2 className="serif max-w-md text-5xl leading-[.98] tracking-[-.04em] md:text-7xl">Une petite<br /><em className="text-[#E7A26C]">bouchée</em> de bonheur.</h2></Reveal>
          <Reveal className="md:pb-2"><p className="max-w-xl text-lg leading-8 text-[#E7D4C2]">Passionnés de pâtisserie, nous avons lancé cette aventure pour partager nos meilleures recettes de cookies gourmands. Chaque biscuit est préparé avec amour et des ingrédients de qualité.</p><div className="mt-8 grid grid-cols-2 gap-8 border-t border-[#F8F0E5]/20 pt-6 text-sm"><div><strong className="serif text-3xl text-[#E7A26C]">01</strong><p className="mt-2 text-[#C6A999]">Une pâte travaillée chaque matin</p></div><div><strong className="serif text-3xl text-[#E7A26C]">03</strong><p className="mt-2 text-[#C6A999]">Recettes à partager sans modération</p></div></div></Reveal>
        </div>
      </section>

      <section id="collabs" className="px-5 py-20 md:px-10 md:py-28">
        <Reveal className="mx-auto max-w-7xl"><div className="relative overflow-hidden rounded-[2rem] bg-[#A9C6A5] px-7 py-12 md:px-16 md:py-16"><Sparkles className="absolute right-10 top-8 text-[#365348]/40" size={32} /><p className="text-xs font-bold uppercase tracking-[.25em] text-[#365348]">02 — À venir</p><h2 className="serif mt-5 max-w-2xl text-4xl leading-tight text-[#365348] md:text-6xl">Des rencontres<br /><em>délicieuses</em> arrivent.</h2><p className="mt-5 max-w-md leading-7 text-[#466759]">Pas de collaborations pour le moment… Restez connectés, de belles surprises arrivent bientôt.</p><button onClick={() => alert("Merci ! Nous vous préviendrons de nos prochaines collaborations.")} className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#365348]/30 px-5 py-3 text-sm font-bold text-[#365348] transition-colors hover:bg-[#365348] hover:text-[#DCE8D7]">Rester connecté <ChevronRight size={16} /></button></div></Reveal>
      </section>

      <section id="boutique" className="bg-[#F1E2D1] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl"><Reveal><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#B86942]">03 — La boutique</p><h2 className="serif text-5xl tracking-[-.04em] md:text-7xl">Choisissez votre<br /><em>pause.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[#806657]">Des cookies généreux, cuits en petites fournées. À déguster seul ou à plusieurs.</p></div></Reveal>
           <div className="mt-12 grid gap-5 md:grid-cols-3">{products.map((product, index) => <Reveal key={product.id} className={index === 1 ? "md:translate-y-8" : ""}><article onClick={() => setSelectedProduct(product)} className="group cursor-pointer rounded-[1.6rem] bg-[#FBF5ED] p-5 shadow-[0_8px_0_rgba(60,41,35,.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_0_rgba(60,41,35,.08)]" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedProduct(product); } }} aria-label={`Voir la description de ${product.name}`}><div className="grid min-h-[275px] place-items-center overflow-hidden rounded-[1.25rem] bg-[#EAD4BF]"><CookieArt product={product} /></div><div className="px-1 pb-1 pt-6"><div className="flex items-start justify-between gap-3"><h3 className="serif text-2xl leading-tight">{product.name}</h3><span className="whitespace-nowrap text-sm font-bold text-[#B86942]">{euro(product.price)}</span></div><p className="mt-2 text-sm text-[#927362]">{product.detail}</p><p className="mt-4 text-[10px] font-bold uppercase tracking-[.18em] text-[#B86942]">Cliquer pour découvrir</p><button onClick={(event) => { event.stopPropagation(); add(product); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C2923] py-3 text-sm font-bold text-[#FFF7ED] transition-colors hover:bg-[#B86942]"><Plus size={16} /> Ajouter au panier</button></div></article></Reveal>)}</div>
        </div>
      </section>

      <footer className="bg-[#3C2923] px-5 pb-8 pt-16 text-[#F8F0E5] md:px-10">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-10 border-b border-[#F8F0E5]/15 pb-12 md:flex-row"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#E7A26C] text-[#3C2923]"><Cookie size={21} /></span><span className="serif text-2xl">Délices Cookies</span></div><p className="mt-5 max-w-xs text-sm leading-6 text-[#C6A999]">La pause gourmande qui rend les après-midis meilleurs.</p></div><div className="flex gap-10 text-sm text-[#E7D4C2]"><a href="#propos" className="hover:text-[#E7A26C]">Notre histoire</a><a href="#boutique" className="hover:text-[#E7A26C]">Boutique</a><Instagram size={18} aria-label="Instagram" /></div></div><div className="flex justify-between pt-6 text-[10px] uppercase tracking-[.18em] text-[#98796A]"><span>© 2026 Délices Cookies</span><span>Fait avec patience &amp; beurre doux</span></div></div>
      </footer>

       {selectedProduct && <div className="fixed inset-0 z-50 grid place-items-center bg-[#261914]/60 p-5 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }} role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="product-detail-title" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.8rem] bg-[#FBF5ED] p-6 shadow-2xl sm:p-9"><button onClick={() => setSelectedProduct(null)} className="absolute right-5 top-5 rounded-full p-2 text-[#684338] transition-colors hover:bg-[#F1E2D1]" aria-label="Fermer la fiche produit"><X size={20} /></button><div className="grid gap-7 sm:grid-cols-[.8fr_1.2fr] sm:items-center"><div className="grid min-h-[230px] place-items-center rounded-[1.35rem] bg-[#EAD4BF] p-8"><div className="w-full max-w-[220px]"><CookieArt product={selectedProduct} /></div></div><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B86942]">Fiche gourmande</p><h2 id="product-detail-title" className="serif mt-2 max-w-sm text-4xl leading-[.98]">{selectedProduct.name}</h2><p className="mt-4 text-base leading-7 text-[#76584A]">{selectedProduct.description}</p><div className="mt-6 grid gap-4 border-y border-[#3C2923]/10 py-5 text-sm"><div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B86942]">Texture</span><p className="mt-1 text-[#684338]">{selectedProduct.texture}</p></div><div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B86942]">Ingrédients</span><p className="mt-1 leading-6 text-[#684338]">{selectedProduct.ingredients}</p></div></div><div className="mt-6 flex items-center justify-between gap-4"><span className="serif text-3xl text-[#B86942]">{euro(selectedProduct.price)}</span><button onClick={() => { add(selectedProduct); setSelectedProduct(null); }} className="flex items-center gap-2 rounded-full bg-[#3C2923] px-5 py-3 text-sm font-bold text-[#FFF7ED] transition-colors hover:bg-[#B86942]"><Plus size={16} /> Ajouter au panier</button></div></div></div></div></div>}

       {cartOpen && <div className="fixed inset-0 z-50 bg-[#261914]/50 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }} role="presentation"><aside role="dialog" aria-modal="true" aria-labelledby="cart-title" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FBF5ED] p-6 shadow-2xl sm:p-8"><div className="flex items-center justify-between border-b border-[#3C2923]/10 pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B86942]">Sélection commune</p><h2 id="cart-title" className="serif mt-1 text-3xl">Mon panier</h2><p className="mt-1 text-xs text-[#927362]">Cookies et coffrets réunis au même endroit</p></div><button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-[#F1E2D1]" aria-label="Fermer le panier"><X size={20} /></button></div>{ordered ? <div className="flex flex-1 flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#A9C6A5] text-[#365348]"><Check size={28} /></span><h3 className="serif mt-6 text-3xl">C'est en route !</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#806657]">Merci pour votre commande. Votre pause gourmande sera bientôt prête.</p><button onClick={() => setCartOpen(false)} className="mt-8 rounded-full bg-[#3C2923] px-6 py-3 text-sm font-bold text-[#FFF7ED]">Retourner à la boutique</button></div> : cart.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag size={34} className="text-[#D3B7A1]" /><h3 className="serif mt-5 text-2xl">Votre panier est vide</h3><p className="mt-2 text-sm text-[#927362]">Une petite douceur vous attend.</p><button onClick={() => setCartOpen(false)} className="mt-7 rounded-full bg-[#3C2923] px-6 py-3 text-sm font-bold text-[#FFF7ED]">Découvrir les cookies</button></div> : <><div className="flex-1 space-y-4 overflow-y-auto py-6">{cart.map((item) => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-3 border-b border-[#3C2923]/10 pb-4"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${item.tone}`}><Cookie size={27} className="text-[#F8D39B]" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="serif truncate text-lg">{item.name}</p><span className="rounded-full bg-[#F1E2D1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#927362]">{item.kind === "gift-box" ? "Coffret" : "Cookie"}</span></div><p className="text-xs text-[#B86942]">{euro(item.price)}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => changeQuantity(item.id, -1)} className="grid h-6 w-6 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Retirer un ${item.name}`}><Minus size={12} /></button><span className="w-4 text-center text-xs font-bold">{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} className="grid h-6 w-6 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Ajouter un ${item.name}`}><Plus size={12} /></button></div></div><button onClick={() => { const nextCart = readSharedCart().filter((cartItem) => !(cartItem.id === item.id && cartItem.kind === item.kind)); writeSharedCart(nextCart); setCart(nextCart); }} className="rounded-full p-2 text-[#B86942] hover:bg-[#F1E2D1]" aria-label={`Supprimer ${item.name}`}><Trash2 size={16} /></button></div>)}</div><div className="border-t border-[#3C2923]/10 pt-5"><div className="flex justify-between text-sm text-[#806657]"><span>Sous-total</span><strong className="text-lg text-[#3C2923]">{euro(total)}</strong></div><button onClick={checkout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#B86942] py-4 text-sm font-bold text-[#FFF7ED] transition-colors hover:bg-[#3C2923]">Passer la commande <ArrowRight size={17} /></button><p className="mt-3 text-center text-[10px] text-[#927362]">Cookies & coffrets · commande préparée avec amour</p></div></>}</aside></div>}
    </main>
  );
}