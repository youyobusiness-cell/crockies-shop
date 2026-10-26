import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cookie,
  Gift,
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
  eyebrow: string;
  description: string;
  price: number;
  cookies: string;
  tone: string;
  ribbon: string;
  pair: string;
  pairReason: string;
};

type CookiePick = {
  id: string;
  name: string;
  detail: string;
  price: number;
  tone: string;
  flavor: string;
};

const boxes: GiftBox[] = [
  { id: "petite-attention", name: "La Petite Attention", eyebrow: "6 cookies · pour dire merci", description: "Deux de chaque recette signature, dans un petit écrin qui fait sourire.", price: 18, cookies: "6", tone: "#E5B477", ribbon: "#A65B45", pair: "Le Sablé Citron", pairReason: "Une note vive pour réveiller le petit geste.", },
  { id: "grand-moment", name: "Le Grand Moment", eyebrow: "12 cookies · à partager", description: "La grande boîte des réunions qui s'éternisent et des goûters à plusieurs.", price: 32, cookies: "12", tone: "#D38A69", ribbon: "#3C2923", pair: "Le Chocolat Fleur de Sel", pairReason: "Le compagnon officiel des grandes tablées.", },
  { id: "boite-bonheur", name: "La Boîte à Bonheur", eyebrow: "18 cookies · rien que pour eux", description: "Toutes nos recettes, une carte et assez de gourmandise pour marquer le coup.", price: 46, cookies: "18", tone: "#B5C7A8", ribbon: "#55715E", pair: "Le Praliné Noisette", pairReason: "La touche généreuse à glisser en plus.", },
];

const cookies: CookiePick[] = [
  { id: "cookie-citron", name: "Le Sablé Citron", detail: "zeste · beurre doux", price: 3.5, tone: "#E7B870", flavor: "citron" },
  { id: "cookie-chocolat", name: "Le Chocolat Fleur de Sel", detail: "cacao noir · sel marin", price: 4, tone: "#806052", flavor: "cacao" },
  { id: "cookie-praline", name: "Le Praliné Noisette", detail: "noisette · chocolat blond", price: 4.2, tone: "#C9825C", flavor: "noisette" },
];

const euro = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function BoxArt({ box }: { box: GiftBox }) {
  return (
    <div className="relative mx-auto h-48 w-56">
      <div className="absolute bottom-2 left-1/2 h-28 w-44 -translate-x-1/2 rotate-[-3deg] rounded-[12px] bg-[#F7E1BD] shadow-[9px_12px_0_rgba(60,41,35,.13)]">
        <div className="absolute inset-x-0 top-0 h-4" style={{ backgroundColor: box.ribbon }} />
        <div className="absolute bottom-0 left-1/2 h-full w-5 -translate-x-1/2 opacity-90" style={{ backgroundColor: box.ribbon }} />
        <div className="absolute bottom-4 left-5 right-5 flex justify-between">
          {[0, 1, 2, 3, 4].map((cookie) => <span key={cookie} className="grid h-6 w-6 place-items-center rounded-full shadow-[inset_-3px_-4px_0_rgba(70,40,25,.13)]" style={{ backgroundColor: box.tone }}><i className="h-1.5 w-2 rounded-full bg-[#5C3628]/50" /></span>)}
        </div>
      </div>
      <div className="absolute left-1/2 top-4 h-16 w-48 -translate-x-1/2 -rotate-3 rounded-[11px] bg-[#F3D5A5] shadow-[3px_6px_0_rgba(60,41,35,.08)]">
        <div className="absolute inset-x-0 bottom-0 h-3 opacity-90" style={{ backgroundColor: box.ribbon }} />
        <div className="absolute bottom-0 left-1/2 h-full w-5 -translate-x-1/2 opacity-90" style={{ backgroundColor: box.ribbon }} />
        <span className="absolute left-5 top-3 -rotate-2 font-serif text-lg text-[#684338]">pour toi</span>
      </div>
      <span className="absolute -right-1 top-0 grid h-12 w-12 rotate-12 place-items-center rounded-full bg-[#3C2923] text-center text-[8px] font-bold uppercase leading-3 tracking-[.12em] text-[#F6C77B]">{box.cookies}<br />cookies</span>
    </div>
  );
}

function CookieArt({ item }: { item: CookiePick }) {
  return <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-[#F2DEC1]"><span className="grid h-10 w-10 place-items-center rounded-full shadow-[inset_-4px_-4px_0_rgba(70,40,25,.12)]" style={{ backgroundColor: item.tone }}><span className="h-2 w-2 rounded-full bg-[#5C3628]/60" /></span><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#F7F0E4]" /></div>;
}

export function GiftBoxCookiePairing() {
  const [cart, setCart] = useState<SharedCartItem[]>(() => readSharedCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<GiftBox | null>(null);
  const [note, setNote] = useState("");
  const [ordered, setOrdered] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  useEffect(() => subscribeToSharedCart(() => setCart(readSharedCart())), []);

  const changeCart = (item: SharedCartItem, delta: number) => {
    const next = readSharedCart().flatMap((current) => current.id === item.id && current.kind === item.kind
      ? (current.quantity + delta > 0 ? [{ ...current, quantity: current.quantity + delta }] : [])
      : [current]);
    writeSharedCart(next); setCart(next);
  };
  const add = (item: SharedCartItem) => {
    const current = readSharedCart();
    const existing = current.find((entry) => entry.id === item.id && entry.kind === item.kind);
    const next = existing ? current.map((entry) => entry.id === item.id && entry.kind === item.kind ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, item];
    writeSharedCart(next); setCart(next); setOrdered(false);
  };
  const addBox = () => {
    if (!selectedBox) return;
    add({ id: selectedBox.id, name: selectedBox.name, price: selectedBox.price, quantity: 1, kind: "gift-box", tone: selectedBox.tone, detail: selectedBox.eyebrow, note });
    setSelectedBox(null); setNote(""); setCartOpen(true);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#F8F0E5] text-[#3C2923]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`.pair-serif{font-family:'Playfair Display',Georgia,serif}.pair-hand{font-family:cursive}.pair-grain:after{content:'';pointer-events:none;position:fixed;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E')}`}</style>
      <div className="pair-grain">
        <header className="sticky top-0 z-30 border-b border-[#3C2923]/10 bg-[#F8F0E5]/90 px-4 backdrop-blur-md md:px-10">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between md:h-[76px]">
            <a href="#top" className="flex min-w-0 items-center gap-2.5" aria-label="Délices Cookies, accueil"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3C2923] text-[#F6C77B] md:h-10 md:w-10"><Cookie size={19} /></span><span className="min-w-0 leading-none"><strong className="pair-serif block truncate text-base md:text-lg">Délices Cookies</strong><small className="hidden text-[9px] uppercase tracking-[.25em] text-[#9B6E55] sm:block">Les cadeaux qui se mangent</small></span></a>
            <nav className="hidden items-center gap-8 text-sm md:flex"><a href="#coffrets">Les coffrets</a><a href="#accords">Les accords parfaits</a><a href="#mot">Le petit mot</a></nav>
            <button onClick={() => setCartOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#E7A26C] px-3 py-2.5 text-xs font-bold md:gap-2 md:px-4" aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}><ShoppingBag size={15} /><span className="hidden sm:inline">Panier</span><span className="grid min-w-5 place-items-center rounded-full bg-[#3C2923] px-1.5 py-0.5 text-[10px] text-[#F8F0E5]">{count}</span></button>
          </div>
        </header>

        <section id="top" className="mx-auto grid max-w-7xl items-center gap-7 px-4 pb-14 pt-10 md:gap-10 md:px-10 md:pb-24 md:pt-24">
          <div><p className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#B86942] md:mb-6 md:gap-3 md:text-xs md:tracking-[.24em]"><span className="h-px w-7 bg-[#B86942] md:w-9" />Coffrets + petites attentions</p><h1 className="pair-serif max-w-2xl text-[clamp(2.8rem,13vw,6.5rem)] font-medium leading-[.92] tracking-[-.055em] md:text-[clamp(3.2rem,7vw,6.5rem)]">Le cadeau.<br /><em className="text-[#B86942]">Le cookie</em><br />qui va avec.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#76584A] md:mt-7 md:text-base md:leading-7">Choisissez une boîte à offrir, puis glissez-y la douceur qui lui ressemble. Tout arrive ensemble, dans le même panier.</p><a href="#coffrets" className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#3C2923] px-5 py-3 text-sm font-bold text-[#FFF7ED] md:mt-9 md:gap-3 md:px-6 md:py-3.5">Trouver le bon duo <ArrowRight size={16} /></a></div>
          <div className="relative mx-auto aspect-square w-full max-w-[330px] md:max-w-[470px]"><div className="absolute inset-[8%] rotate-6 rounded-[42%_58%_48%_52%] bg-[#E7A26C]" /><div className="absolute inset-[15%] -rotate-6 rounded-[55%_45%_52%_48%] bg-[#F3C88D] shadow-[18px_20px_0_rgba(60,41,35,.1)]" /><div className="absolute inset-[24%] grid place-items-center rounded-[1.4rem] bg-[#F8E5C4] shadow-[inset_0_-9px_0_rgba(60,41,35,.08)] md:rounded-[2rem]"><Gift size={68} strokeWidth={1} className="text-[#B86942] md:h-[85px] md:w-[85px]" /><span className="pair-hand absolute bottom-[17%] rotate-[-6deg] text-xl text-[#B86942] md:text-2xl">avec amour</span></div><span className="absolute right-[2%] top-[10%] grid h-14 w-14 -rotate-12 place-items-center rounded-full bg-[#A9C6A5] text-center text-[8px] font-bold uppercase leading-3 tracking-widest text-[#365348] md:h-16 md:w-16 md:text-[9px]">et un<br />extra</span><Cookie className="absolute bottom-[9%] left-[4%] rotate-[-18deg] text-[#B86942]" size={28} /></div>
        </section>

        <section id="coffrets" className="bg-[#3C2923] px-4 py-14 text-[#F8F0E5] md:px-10 md:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#E7A26C] md:mb-4 md:text-xs md:tracking-[.25em]">01 — Commencer par une boîte</p><h2 className="pair-serif text-[2.8rem] leading-[.95] tracking-[-.04em] md:text-7xl">Pour chaque<br /><em className="text-[#E7A26C]">attention.</em></h2></div><p className="max-w-xs text-xs leading-5 text-[#C6A999] md:text-sm md:leading-6">Un coffret pensé pour l'occasion, avec son cookie complice juste en dessous.</p></div><div className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-6">{boxes.map((box, index) => <article key={box.id} className={`rounded-[1.35rem] bg-[#FBF5ED] p-4 text-[#3C2923] shadow-[0_7px_0_rgba(0,0,0,.16)] md:rounded-[1.7rem] md:p-5 md:shadow-[0_9px_0_rgba(0,0,0,.16)] ${index === 1 ? "lg:-translate-y-5" : ""}`}><div className="rounded-[1.1rem] bg-[#EAD4BF] p-2 md:rounded-[1.25rem] md:p-3"><BoxArt box={box} /></div><div className="px-0.5 pb-1 pt-5 md:px-1 md:pb-2 md:pt-6"><div className="flex items-start justify-between gap-2"><div><h3 className="pair-serif text-xl leading-tight md:text-2xl">{box.name}</h3><p className="mt-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#B86942] md:text-xs md:tracking-[.12em]">{box.eyebrow}</p></div><span className="whitespace-nowrap text-sm font-bold text-[#B86942]">{euro(box.price)}</span></div><p className="mt-2 text-sm leading-5 text-[#806657] md:mt-3 md:leading-6">{box.description}</p><div className="mt-3 flex items-center gap-2 rounded-xl bg-[#F1E2D1] px-3 py-2 md:mt-4 md:py-2.5"><Cookie size={14} className="shrink-0 text-[#B86942]" /><p className="min-w-0 text-[11px] leading-4 text-[#806657] md:text-xs"><span className="font-bold text-[#684338]">À glisser avec :</span> {box.pair}</p></div><button onClick={() => setSelectedBox(box)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C2923] py-3 text-xs font-bold text-[#FFF7ED] hover:bg-[#B86942] md:mt-5 md:text-sm">Personnaliser le duo <Sparkles size={14} /></button></div></article>)}</div></div></section>

        <section id="accords" className="px-4 py-14 md:px-10 md:py-28"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#B86942] md:mb-4 md:text-xs md:tracking-[.25em]">02 — Le cookie qui complète</p><h2 className="pair-serif max-w-xl text-[2.8rem] leading-[.95] tracking-[-.04em] md:text-7xl">Le détail<br />qui fait <em className="text-[#B86942]">mouche.</em></h2></div><button onClick={() => setShowAll(!showAll)} className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#B86942] sm:flex">{showAll ? "Réduire" : "Voir les 3 recettes"} <ChevronDown size={15} className={showAll ? "rotate-180" : ""} /></button></div><div className="mt-8 grid gap-3 md:mt-12 md:grid-cols-3 md:gap-4">{cookies.map((item, index) => <article key={item.id} className={`${!showAll && index > 1 ? "hidden md:flex" : ""} flex items-center gap-3 rounded-[1.2rem] border border-[#3C2923]/10 bg-[#F3E4D2] p-3 md:gap-4 md:rounded-[1.4rem] md:p-4`}><CookieArt item={item} /><div className="min-w-0 flex-1"><p className="pair-serif text-lg md:text-xl">{item.name}</p><p className="mt-1 text-[11px] text-[#8E6C5B] md:text-xs">{item.detail}</p><div className="mt-2 flex items-center justify-between md:mt-3"><span className="text-sm font-bold text-[#B86942]">{euro(item.price)}</span><button onClick={() => add({ id: item.id, name: item.name, price: item.price, quantity: 1, kind: "cookie", tone: item.tone, detail: item.detail })} className="grid h-9 w-9 place-items-center rounded-full bg-[#3C2923] text-[#FFF7ED]" aria-label={`Ajouter ${item.name}`}><Plus size={15} /></button></div></div></article>)}</div><button onClick={() => setShowAll(!showAll)} className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#B86942] sm:hidden">{showAll ? "Réduire" : "Voir les 3 recettes"} <ChevronDown size={15} /></button></div></section>

        <section id="mot" className="bg-[#E7A26C] px-4 py-14 md:px-10 md:py-24"><div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-10"><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#3C2923]/65 md:mb-4 md:text-xs md:tracking-[.25em]">03 — Et le petit mot</p><h2 className="pair-serif text-[2.8rem] leading-[.95] tracking-[-.04em] md:text-7xl">Les mots restent.<br /><em>Les miettes aussi.</em></h2></div><div className="rotate-[-1deg] bg-[#F4D8A9] p-6 shadow-[6px_8px_0_rgba(60,41,35,.13)] md:rotate-[-2deg] md:p-12"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9B6E55] md:text-xs md:tracking-[.22em]">Une carte dans chaque boîte</p><p className="pair-hand mt-5 text-xl leading-6 text-[#684338] md:mt-7 md:text-2xl md:leading-7">« Pour une personne<br />vraiment chouette… »</p><div className="mt-5 flex items-center justify-between border-t border-[#684338]/20 pt-4 text-[11px] text-[#9B6E55] md:mt-7 md:pt-5 md:text-xs"><span>Votre message, écrit avec soin</span><Cookie size={18} /></div></div></div></section>
      </div>

      {selectedBox && <div className="fixed inset-0 z-50 grid place-items-center bg-[#261914]/55 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && setSelectedBox(null)}><div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[1.4rem] bg-[#FBF5ED] p-5 shadow-2xl sm:rounded-[1.7rem] sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B86942]">Composer le duo</p><h2 className="pair-serif mt-1 text-2xl sm:text-3xl">{selectedBox.name}</h2></div><button onClick={() => setSelectedBox(null)} className="rounded-full p-2 hover:bg-[#F1E2D1]" aria-label="Fermer"><X size={20} /></button></div><div className="mt-5 rounded-2xl bg-[#F1E2D1] p-3.5 sm:mt-6 sm:p-4"><p className="text-[10px] uppercase tracking-[.16em] text-[#9B6E55] sm:text-xs">Notre accord conseillé</p><div className="mt-2 flex items-start justify-between gap-3"><span className="pair-serif text-lg sm:text-xl">{selectedBox.pair}</span><span className="whitespace-nowrap text-xs font-bold text-[#B86942] sm:text-sm">+ 4,00 €</span></div><p className="mt-1 text-xs leading-5 text-[#806657]">{selectedBox.pairReason}</p></div><label className="mt-5 block text-sm font-bold text-[#684338] sm:mt-6">Votre petit mot <span className="font-normal text-[#9B6E55]">(facultatif)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Écrivez quelque chose de doux…" className="pair-hand mt-2 h-24 w-full resize-none rounded-xl border border-[#3C2923]/15 bg-[#F4D8A9] p-3.5 text-lg outline-none focus:border-[#B86942] sm:mt-3 sm:p-4" /></label><button onClick={addBox} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#B86942] py-3.5 text-sm font-bold text-[#FFF7ED] sm:mt-6 sm:py-4">Ajouter le duo · {euro(selectedBox.price + 4)} <ArrowRight size={17} /></button></div></div>}

      {cartOpen && <div className="fixed inset-0 z-50 bg-[#261914]/50 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}><aside className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-[#FBF5ED] p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-[#3C2923]/10 pb-4 sm:pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#B86942] sm:tracking-[.22em]">Coffret + cookie, même panier</p><h2 className="pair-serif mt-1 text-2xl sm:text-3xl">Votre sélection</h2></div><button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-[#F1E2D1]" aria-label="Fermer"><X size={20} /></button></div>{ordered ? <div className="flex flex-1 flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#A9C6A5] text-[#365348]"><Check size={28} /></span><h3 className="pair-serif mt-6 text-3xl">C'est emballé !</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#806657]">Votre commande gourmande est prête à partir.</p></div> : cart.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><Gift size={36} className="text-[#D3B7A1]" /><h3 className="pair-serif mt-5 text-2xl">Le panier est encore sage</h3><button onClick={() => setCartOpen(false)} className="mt-7 min-h-11 rounded-full bg-[#3C2923] px-6 py-3 text-sm font-bold text-[#FFF7ED]">Choisir une douceur</button></div> : <><div className="flex-1 space-y-3 overflow-y-auto py-5 sm:space-y-4 sm:py-6">{cart.map((item) => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-2.5 border-b border-[#3C2923]/10 pb-3 sm:gap-3 sm:pb-4"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 ${item.kind === "cookie" ? "bg-[#F2DEC1]" : "bg-[#EAD4BF]"}`}>{item.kind === "gift-box" ? <Gift size={22} className="text-[#B86942]" /> : <Cookie size={22} className="text-[#B86942]" />}</div><div className="min-w-0 flex-1"><p className="pair-serif truncate text-base sm:text-lg">{item.name}</p><p className="text-[11px] text-[#B86942] sm:text-xs">{item.kind === "gift-box" ? "Coffret" : "Cookie"} · {euro(item.price)}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => changeCart(item, -1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Retirer un ${item.name}`}><Minus size={12} /></button><span className="w-4 text-center text-xs font-bold">{item.quantity}</span><button onClick={() => changeCart(item, 1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#3C2923]/20" aria-label={`Ajouter un ${item.name}`}><Plus size={12} /></button></div></div><button onClick={() => { const next = readSharedCart().filter((entry) => !(entry.id === item.id && entry.kind === item.kind)); writeSharedCart(next); setCart(next); }} className="rounded-full p-2 text-[#B86942] hover:bg-[#F1E2D1]" aria-label={`Supprimer ${item.name}`}><Trash2 size={16} /></button></div>)}</div><div className="border-t border-[#3C2923]/10 pt-4 sm:pt-5"><div className="flex justify-between text-sm text-[#806657]"><span>Total</span><strong className="text-lg text-[#3C2923]">{euro(total)}</strong></div><button onClick={() => { setOrdered(true); writeSharedCart([]); setCart([]); }} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#B86942] py-3.5 text-sm font-bold text-[#FFF7ED] sm:mt-5 sm:py-4">Valider la commande <ArrowRight size={17} /></button></div></>}</aside></div>}
    </main>
  );
}