import "./globals.css";

import type { Metadata } from "next";

import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { ApolloClientProvider } from "@/lib/apollo-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Library Reservation System",
  description: "Manage library books and reservations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ApolloClientProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
