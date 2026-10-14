"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../lib/api";
import CheckoutWizard from "../../components/CheckoutWizard";
import { CardSkeleton } from "../../components/Skeleton";

function CheckoutInner() {
  const params = useSearchParams();
  const initialId = params.get("layanan") ?? "";
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api.catalog().then(setCatalog).catch((e) => toast.error(e.message));
  }, []);

  if (catalog.length === 0) return <main className="mx-auto w-[min(720px,92%)] py-6"><CardSkeleton /></main>;
  return (
    <main className="mx-auto w-[min(720px,92%)] py-6">
      <h1 className="text-2xl font-black text-[#0F172A]">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">Form menyesuaikan jurusan otomatis.</p>
      <div className="mt-4"><CheckoutWizard catalog={catalog} initialId={initialId} /></div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="mx-auto w-[min(720px,92%)] py-6"><CardSkeleton /></main>}>
      <CheckoutInner />
    </Suspense>
  );
}
