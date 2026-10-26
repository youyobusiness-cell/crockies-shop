import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Cookie,
  Gift,
  Heart,
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

type GiftBox = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  cookies: string;
  tone: string;
  ribbon: string;
  note: string;
};

const boxes: GiftBox[] = [
  {
    id: "petite-attention",
    name: "La Petite Attention",
    subtitle: "6 cookies · pour dire merci",
    description: "Un petit geste qui arrive avec le sourire. Deux de chaque recette signature.",
    price: 18,
    cookies: "6",
    tone: "bg-[#E6B879]",
    ribbon: "bg-[#A95C43]",
    note: "« Pour toi, parce que tu le mérites. »",
  },
  {
    id: "grand-moment",
    name: "Le Grand Moment",
    subtitle: "12 cookies · à partager",
    description: "La grande boîte des réunions qui s'éternisent et des goûters à plusieurs.",
    price: 32,
    cookies: "12",
    tone: "bg-[#D48D68]",
    ribbon: "bg-[#3C2923]",
    note: "« À ouvrir quand l'envie de douceur arrive. »",
  },
  {
    id: "sur-mesure",
    name: "La Boîte à Bonheur",
    subtitle: "18 cookies · rien que pour eux",
    description: "Toutes nos recettes, une jolie carte, et assez de gourmandise pour marquer le coup.",
    price: 46,
    cookies: "18",
    tone: "bg-[#B7C9A8]",
    ribbon: "bg-[#55715E]",
    note: "« Un peu de douceur dans ta journée. »",
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function BoxIllustration({ box }: { box: GiftBox }) {
  return (
    <div className="relative mx-auto h-52 w-56">
      <div className="absolute bottom-2 left-1/2 h-32 w-44 -translate-x-1/2 rotate-[-3deg] rounded-[0.7rem] bg-[#F8E5C4] shadow-[8px_12px_0_rgba(60,41,35,.13)]">
        <div className={`absolute inset-x-0 top-0 h-5 ${box.ribbon} opacity-90`} />
        <div className={`absolute bottom-0 left-1/2 h-full w-5 -translate-x-1/2 ${box.ribbon} opacity-90`} />
        <div className="absolute left-4 top-10 text-[9px] font-bold uppercase tracking-[.23em] text-[#765244]">Délices</div>
        <div className="absolute bottom-4 left-5 right-5 flex justify-between">
          {[0, 1, 2, 3, 4].map((cookie) => (
            <span key={cookie} className={`h-6 w-6 rounded-full ${box.tone} shadow-[inset_-3px_-4px_0_rgba(70,40,25,.13)]`}>
              <i className="mx-auto mt-2 block h-1.5 w-2 rounded-full bg-[#5C3628]/60" />
            </span>
          ))}
        </div>
      </div>
      <div className="absolute left-1/2 top-4 h-20 w-48 -translate-x-1/2 -rotate-3 rounded-[.7rem] bg-[#F4D8A9] shadow-[3px_6px_0_rgba(60,41,35,.08)]">
        <div className={`absolute inset-x-0 bottom-0 h-4 ${box.ribbon} opacity-90`} />
        <div className={`absolute bottom-0 left-1/2 h-full w-5 -translate-x-1/2 ${box.ribbon} opacity-90`} />
        <span className="serif absolute left-5 top-4 -rotate-2 text-xl text-[#684338]">pour toi</span>
      </div>
      <span className="absolute -right-1 top-0 grid h-12 w-12 rotate-12 place-items-center rounded-full bg-[#3C2923] text-center text-[8px] font-bold uppercase leading-3 tracking-[.15em] text-[#F6C77B]">
        {box.cookies}<br />cookies
      </span>
    </div>
  );
}

export function GiftBoxStorefront() {
  const [selected, setSelected] = useState<GiftBox | null>(null);
  const [cart, setCart] = useState<SharedCartItem[]>(() => readSharedCart());
  const [note, setNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  useEffect(() => subscribeToSharedCart(() => setCart(readSharedCart())), []);

  const addBox = (box: GiftBox) => {
    const current = readSharedCart();
    const existing = current.find((item) => item.id === box.id && item.kind === "gift-box");
    const nextCart = existing
      ? current.map((item) => item.id === box.id && item.kind === "gift-box" ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...box, kind: "gift-box" as const, quantity: 1, detail: box.subtitle }];
    writeSharedCart(nextCart);
    setCart(nextCart);
    setSelected(null);
    setCartOpen(true);
    setOrdered(false);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#F8F0E5] text-[#3C2923]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .hand { font-family: 'cursive'; }
        .paper-lines { background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(92,54,40,.16) 28px); }
      `}</style>
      <header className="sticky top-0 z-30 border-b border-[#3C2923]/10 bg-[#F8F0E5]/90 px-5 backdrop-blur-md md:px-10">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between">
          <a href="#cadeau" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#3C2923] text-[#F6C77B]"><Cookie size={21} /></span>
            <span className="leading-none"><strong className="serif block text-lg">Délices Cookies</strong><small className="text-[9px] uppercase tracking-[.25em] text-[#9B6E55]">Les cadeaux qui se mangent</small></span>
          </a>
           <nav className="hidden items-center gap-8 text-sm md:flex"><a href="#idees">Nos idées cadeaux</a><a href="#mot">Le petit mot</a><a href="/__mockup/preview/delices-cookies/Storefront" className="font-bold text-[#B86942] transition-colors hover:text-[#3C2923]">La boutique classique</a></nav>
           <div className="flex items-center gap-2">
             <a href="/__mockup/preview/delices-cookies/Storefront" className="rounded-full border border-[#3C2923]/20 px-3 py-2 text-[11px] font-bold text-[#B86942] transition-colors hover:border-[#B86942] hover:bg-[#F1E2D1] sm:px-4 sm:text-xs">Boutique cookies</a>
             <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 rounded-full bg-[#E7A26C] px-4 py-2.5 text-xs font-bold"><ShoppingBag size={16} /> <span className="hidden sm:inline">Panier</span> <span className="grid min-w-5 place-items-center rounded-full bg-[#3C2923] px-1.5 py-0.5 text-[10px] text-[#F8F0E5]">{cart.length}</span></button>
           </div>
        </div>
      </header>

      <section id="cadeau" className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-16 md:grid-cols-[1fr_.88fr] md:px-10 md:pb-28 md:pt-24">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] text-[#B86942]"><span className="h-px w-9 bg-[#B86942]" />À offrir, à partager</p>
          <h1 className="serif max-w-2xl text-[clamp(3.3rem,7vw,6.7rem)] font-medium leading-[.9] tracking-[-.055em]">Un cadeau<br />qui dit <em className="text-[#B86942]">je pense</em><br />à toi.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#76584A]">Des cookies tout juste cuits, une jolie boîte, et votre message écrit à la main. Pour les grandes occasions comme les petits « juste parce que ».</p>
          <a href="#idees" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#3C2923] px-6 py-3.5 text-sm font-bold text-[#FFF7ED]">Choisir un coffret <ArrowRight size={17} /></a>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[500px]">
          <div className="absolute inset-[8%] rotate-6 rounded-[42%_58%_48%_52%] bg-[#E7A26C]" />
          <div className="absolute inset-[15%] -rotate-6 rounded-[55%_45%_52%_48%] bg-[#F3C88D] shadow-[18px_20px_0_rgba(60,41,35,.1)]" />
          <div className="absolute inset-[24%] grid place-items-center rounded-[2rem] bg-[#F8E5C4] shadow-[inset_0_-9px_0_rgba(60,41,35,.08)]"><Gift size={92} strokeWidth={1} className="text-[#B86942]" /><span className="hand absolute bottom-[18%] rotate-[-6deg] text-2xl text-[#B86942]">avec amour</span></div>
          <span className="absolute right-[2%] top-[10%] grid h-16 w-16 -rotate-12 place-items-center rounded-full bg-[#A9C6A5] text-center text-[9px] font-bold uppercase leading-3 tracking-widest text-[#365348]">prêt à<br />offrir</span>
          <Heart className="absolute bottom-[8%] left-[3%] rotate-[-18deg] text-[#B86942]" size={32} fill="currentColor" />
        </div>
      </section>

      <section id="idees" className="bg-[#3C2923] px-5 py-20 text-[#F8F0E5] md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#E7A26C]">01 — Les coffrets</p><h2 className="serif text-5xl leading-[.95] tracking-[-.04em] md:text-7xl">Pour chaque<br /><em className="text-[#E7A26C]">attention.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[#C6A999]">Choisissez la taille, ajoutez un mot doux, nous nous occupons du reste.</p></div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">{boxes.map((box, index) => <article key={box.id} className={`relative rounded-[1.7rem] bg-[#FBF5ED] p-5 text-[#3C2923] shadow-[0_9px_0_rgba(0,0,0,.16)] ${index === 1 ? "lg:-translate-y-5" : ""}`}><div className="rounded-[1.25rem] bg-[#EAD4BF] p-3"><BoxIllustration box={box} /></div><div className="px-1 pb-2 pt-6"><div className="flex items-start justify-between gap-3"><div><h3 className="serif text-2xl leading-tight">{box.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#B86942]">{box.subtitle}</p></div><span className="text-sm font-bold text-[#B86942]">{formatPrice(box.price)}</span></div><p className="mt-3 text-sm leading-6 text-[#806657]">{box.description}</p><button onClick={() => setSelected(box)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C2923] py-3 text-sm font-bold text-[#FFF7ED] transition-colors hover:bg-[#B86942]">Personnaliser <Sparkles size={15} /></button></div></article>)}</div>
        </div>
      </section>

      <section id="mot" className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#B86942]">02 — Le petit mot</p><h2 className="serif text-5xl leading-[.95] tracking-[-.04em] md:text-7xl">Les mots<br />restent.<br /><em className="text-[#B86942]">Les miettes aussi.</em></h2></div>
          <div className="relative rotate-[-2deg] bg-[#F4D8A9] p-8 shadow-[8px_10px_0_rgba(60,41,35,.1)] md:p-12"><div className="absolute -top-4 left-10 h-8 w-24 rotate-[-4deg] bg-[#D48D68]/70" /><p className="text-xs font-bold uppercase tracking-[.22em] text-[#9B6E55]">Une carte dans chaque boîte</p><p className="hand paper-lines mt-7 min-h-[105px] pb-3 text-2xl leading-7 text-[#684338]">« Pour une personne<br />vraiment chouette… »</p><div className="mt-7 flex items-center justify-between border-t border-[#684338]/20 pt-5 text-xs text-[#9B6E55]"><span>Votre message, écrit avec soin</span><Cookie size={20} /></div></div>
        </div>
      </section>

      {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-[#261914]/55 p-5 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="w-full max-w-md rounded-[1.7rem] bg-[#FBF5ED] p-7 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B86942]">Personnaliser le cadeau</p><h2 className="serif mt-1 text-3xl">{selected.name}</h2></div><button onClick={() => setSelected(null)} aria-label="Fermer"><X size={20} /></button></div><label className="mt-7 block text-sm font-bold text-[#684338]">Votre petit mot <span className="font-normal text-[#9B6E55]">(facultatif)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.note} className="hand mt-3 h-28 w-full resize-none rounded-xl border border-[#3C2923]/15 bg-[#F4D8A9] p-4 text-lg outline-none placeholder:text-[#9B6E55]/70 focus:border-[#B86942]" /></label><button onClick={() => addBox(selected)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#B86942] py-4 text-sm font-bold text-[#FFF7ED]">Ajouter ce cadeau · {formatPrice(selected.price)} <ArrowRight size={17} /></button></div></div>}

       {cartOpen && <div className="fixed inset-0 z-50 bg-[#261914]/50 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}><aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FBF5ED] p-7 shadow-2xl"><div className="flex items-center justify-between border-b border-[#3C2923]/10 pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B86942]">Sélection commune</p><h2 className="serif mt-1 text-3xl">Le panier</h2><p className="mt-1 text-xs text-[#927362]">Cookies et coffrets réunis au même endroit</p></div><button onClick={() => setCartOpen(false)} aria-label="Fermer"><X size={20} /></button></div>{ordered ? <div className="flex flex-1 flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#A9C6A5] text-[#365348]"><Check size={28} /></span><h3 className="serif mt-6 text-3xl">C'est emballé !</h3><p className="mt-3 text-sm leading-6 text-[#806657]">Votre commande gourmande est prête à partir.</p></div> : cart.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><Gift size={36} className="text-[#D3B7A1]" /><h3 className="serif mt-5 text-2xl">Encore aucune douceur</h3><button onClick={() => setCartOpen(false)} className="mt-7 rounded-full bg-[#3C2923] px-6 py-3 text-sm font-bold text-[#FFF7ED]">Choisir un coffret</button></div> : <><div className="flex-1 space-y-4 overflow-y-auto py-6">{cart.map((item) => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-3 border-b border-[#3C2923]/10 pb-4"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${item.tone}`}>{item.kind === "gift-box" ? <Gift size={25} className="text-[#F8E5C4]" /> : <Cookie size={25} className="text-[#F8D39B]" />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="serif truncate text-lg">{item.name}</p><span className="rounded-full bg-[#F1E2D1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#927362]">{item.kind === "gift-box" ? "Coffret" : "Cookie"}</span></div><p className="text-xs text-[#B86942]">{formatPrice(item.price)}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => { const nextCart = readSharedCart().flatMap((cartItem) => cartItem.id === item.id && cartItem.kind === item.kind ? (cartItem.quantity > 1 ? [{ ...cartItem, quantity: cartItem.quantity - 1 }] : []) : [cartItem]); writeSharedCart(nextCart); setCart(nextCart); }} className="grid h-6 w-6 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Retirer un ${item.name}`}><Minus size={12} /></button><span className="w-4 text-center text-xs font-bold">{item.quantity}</span><button onClick={() => { const nextCart = readSharedCart().map((cartItem) => cartItem.id === item.id && cartItem.kind === item.kind ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem); writeSharedCart(nextCart); setCart(nextCart); }} className="grid h-6 w-6 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Ajouter un ${item.name}`}><Plus size={12} /></button></div></div><button onClick={() => { const nextCart = readSharedCart().filter((cartItem) => !(cartItem.id === item.id && cartItem.kind === item.kind)); writeSharedCart(nextCart); setCart(nextCart); }} className="rounded-full p-2 text-[#B86942] hover:bg-[#F1E2D1]" aria-label={`Supprimer ${item.name}`}><Trash2 size={16} /></button></div>)}</div><div className="border-t border-[#3C2923]/10 pt-5"><div className="flex justify-between text-sm text-[#806657]"><span>Total</span><strong className="text-lg text-[#3C2923]">{formatPrice(total)}</strong></div><button onClick={() => { setOrdered(true); writeSharedCart([]); setCart([]); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#B86942] py-4 text-sm font-bold text-[#FFF7ED]">Valider la commande <ArrowRight size={17} /></button></div></>}</aside></div>}
    </main>
  );
}