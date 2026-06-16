import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INNOVATION CENTER at BusinessHUB / District.org",
  description: "Your operational cockpit for building a startup - 100 tasks from idea to unicorn.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen antialiased`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
