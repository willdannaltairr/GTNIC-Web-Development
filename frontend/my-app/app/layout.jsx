import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "../components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UP Taruna Bhakti — Production Unit Digital",
  description: "Marketplace 6 jurusan SMK Taruna Bhakti Depok: DKV, TKJ, RPL, BC, Animasi, TE.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F8FAFC] text-slate-900">
        <div className="pt-3">
          <Navbar />
        </div>
        <div className="flex-1">{children}</div>
        <footer className="mx-auto w-[min(1120px,92%)] py-8 text-center text-xs text-slate-400">
          UP SMK Taruna Bhakti Depok • DKV • TKJ • RPL • BC • Animasi • TE — Teaching Factory
        </footer>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
