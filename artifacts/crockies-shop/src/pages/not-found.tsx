import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F0E5] px-5 text-[#3C2923]">
      <div className="w-full max-w-md rounded-[1.6rem] bg-[#FBF5ED] p-8 text-center shadow-[0_8px_0_rgba(60,41,35,.06)]">
        <AlertCircle className="mx-auto h-10 w-10 text-[#B86942]" aria-hidden="true" />
        <h1 className="serif mt-5 text-4xl">Page introuvable</h1>
        <p className="mt-3 text-sm leading-6 text-[#76584A]">
          Cette page n'existe pas ou n'est plus disponible.
        </p>
        <a href="/" className="mt-7 inline-flex rounded-full bg-[#3C2923] px-5 py-3 text-sm font-bold text-[#FFF7ED]">
          Retourner à la boutique
        </a>
      </div>
    </div>
  );
}
