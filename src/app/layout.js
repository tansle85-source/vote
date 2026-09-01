import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({
  variable: "--font-family",
  subsets: ["latin"],
});

export const metadata = {
  title: "APTS 2026 Penang Chapter",
  description: "Voting system for technical paper competition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <nav className="navbar">
          <Link href="/" className="nav-brand">🏆 APTS 2026 Penang Chapter</Link>
          <div className="nav-links">
            <Link href="/judge">Judge Portal</Link>
            <Link href="/admin">Admin Dashboard</Link>
          </div>
        </nav>
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
