import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "Cryptonyk — AI Crypto Signals",
  description: "Real-time crypto insights, alerts, and predictions."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <header className="border-b border-bg-border sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/dashboard" className="font-bold tracking-wide text-lg">Cryptonyk</Link>
            <span className="badge">AI Signals • OTP Login</span>
            <nav className="ml-auto flex items-center gap-2">
              <Link className="btn" href="/dashboard">Dashboard</Link>
              <Link className="btn" href="/alerts">Alerts</Link>
              <Link className="btn" href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className={clsx("max-w-7xl mx-auto px-4 py-6")}>{children}</main>
        <footer className="max-w-7xl mx-auto px-4 py-8 opacity-70 text-sm">
          © Cryptonyk · <a href="https://cryptonyk.com" target="_blank">cryptonyk.com</a>
        </footer>
      </body>
    </html>
  );
}
