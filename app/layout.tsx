import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const font = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  title: "Ruang Pattimura – status & pemesanan ruang",
  description: "Lihat ruang kosong dan pesan ruang diskusi di Gedung Pattimura, UPN “Veteran” Yogyakarta.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#14213d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={font.variable}>
      <body>
        <header className="site">
          <div className="site-in">
            <Link href="/" className="brand"><span className="mark">P</span>Ruang Pattimura</Link>
            <nav><Link href="/petugas">Petugas</Link></nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
