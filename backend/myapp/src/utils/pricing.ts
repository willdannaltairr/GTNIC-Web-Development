import { env } from "../config/env.js";

export interface SplitResult {
  pctUp: number;
  pctJurusan: number;
  pctSiswa: number;
  amountUp: number;
  amountJurusan: number;
  amountSiswa: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcSplit(total: number): SplitResult {
  const pctUp = env.splitUp;
  const pctJurusan = env.splitJurusan;
  const pctSiswa = Math.max(0, 100 - pctUp - pctJurusan);
  const amountUp = round2((total * pctUp) / 100);
  const amountJurusan = round2((total * pctJurusan) / 100);
  // Sisa untuk siswa agar total pas (hindari selisih pembulatan)
  const amountSiswa = round2(total - amountUp - amountJurusan);
  return { pctUp, pctJurusan, pctSiswa, amountUp, amountJurusan, amountSiswa };
}

export function makeInvoiceNo(jurusanKode: string): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `UP-${jurusanKode}-${ymd}-${rand}`;
}

/** Estimasi komponen TE: jumlah komponen x harga satuan + jasa. */
export function estimateTeComponents(
  items: Array<{ nama: string; qty: number; hargaSatuan: number }>,
  jasa = 150000,
): { subtotal: number; jasa: number; total: number } {
  const subtotal = items.reduce((s, it) => s + it.qty * it.hargaSatuan, 0);
  return { subtotal, jasa, total: subtotal + jasa };
}
