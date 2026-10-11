import type { Metadata, Viewport } from "next";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import EditOrderModal from "@/components/EditOrderModal";

export const metadata: Metadata = {
  title: "MAISON KANVÔ COTONOU | Prêt-à-Porter, Couture Contemporaine & Mode Bénin",
  description:
    "Maison de Prêt-à-Porter chic, Kanvô tissé main du Bénin, lin lavé, coton glacé et bazin riche. Showrooms à Haie Vive & Ganhi, Cotonou.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen flex flex-col bg-luxury-bg text-luxury-text overflow-x-hidden">
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20 overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <CheckoutDrawer />
          <EditOrderModal />
        </StoreProvider>
      </body>
    </html>
  );
}
