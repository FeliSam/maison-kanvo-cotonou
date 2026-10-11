"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Sun,
  Moon,
  User,
  Home,
  Sparkles,
  Scissors,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  toggleTheme,
  setCurrency,
  setCheckoutOpen,
} from "@/store/appSlice";
import { CurrencyCode } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const {
    theme,
    currency,
    cart,
    currentUser,
    isCheckoutOpen,
    editingOrderId,
    isAnyModalOpen,
  } = useAppSelector((s) => s.app);

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 40) {
        setVisible(true);
      } else if (currentY > lastScrollY + 8) {
        setVisible(false);
      } else if (currentY < lastScrollY - 6) {
        setVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isStaff =
    currentUser?.role === "ADMIN_ATELIER" ||
    currentUser?.role === "DIRECTEUR_BOUTIQUE";

  const navLinks = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/collections", label: "Collections", icon: Sparkles },
    { href: "/sur-mesure", label: "Lookbook / Sur-Mesure", icon: Scissors },
    { href: "/suivi", label: "Suivi & SAV", icon: PackageSearch },
    {
      href: isStaff ? "/admin" : currentUser ? "/conciergerie" : "/connexion",
      label: isStaff
        ? "Admin Atelier"
        : currentUser
        ? "Mon Profil"
        : "Connexion",
      icon: isStaff ? ShieldCheck : User,
    },
  ];

  // Masquer automatiquement la barre basse mobile dès que le tiroir de commande ou une modale est ouvert
  const hideMobileBottomNav =
    isCheckoutOpen || Boolean(editingOrderId) || isAnyModalOpen;

  return (
    <>
      {/* BARRE DE NAVIGATION HAUTE (SMART STICKY NAVBAR) */}
      <header
        className={`fixed top-0 left-0 right-0 z-[90] transition-transform duration-300 border-b border-luxury-border bg-luxury-bg/95 backdrop-blur-md ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo Maison */}
          <Link href="/" className="flex flex-col group shrink-0">
            <span className="font-serif text-lg sm:text-2xl tracking-[0.2em] font-bold text-luxury-text group-hover:text-luxury-gold transition-colors">
              MAISON KANVÔ
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.26em] text-luxury-muted">
              Cotonou • Haie Vive & Ganhi
            </span>
          </Link>

          {/* Liens Desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors py-1 border-b-2 ${
                    active
                      ? "border-luxury-gold text-luxury-gold font-semibold"
                      : "border-transparent text-luxury-text hover:text-luxury-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {currentUser && !isStaff && (
              <Link
                href="/admin"
                className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border border-luxury-border text-luxury-muted hover:text-luxury-gold hover:border-luxury-gold transition-colors"
              >
                Atelier Admin
              </Link>
            )}
          </nav>

          {/* Contrôles Droite (Devise, Thème, Compte, Panier) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Sélecteur de devise FCFA / EUR / USD */}
            <select
              aria-label="Sélecteur de devise"
              value={currency}
              onChange={(e) =>
                dispatch(setCurrency(e.target.value as CurrencyCode))
              }
              className="bg-luxury-surface text-luxury-text text-xs font-medium px-2 py-1.5 rounded border border-luxury-border focus:outline-none focus:border-luxury-gold cursor-pointer"
            >
              <option value="XOF">FCFA</option>
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
            </select>

            {/* Switch Mode Clair / Sombre */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={
                theme === "dark"
                  ? "Passer en mode clair"
                  : "Passer en mode sombre"
              }
              className="p-2 rounded-full border border-luxury-border bg-luxury-card text-luxury-text hover:border-luxury-gold hover:text-luxury-gold transition-colors"
              title={
                theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-luxury-gold" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Accès au Compte / Connexion */}
            <Link
              href={currentUser ? "/conciergerie" : "/connexion"}
              aria-label="Accès au compte"
              className="p-2 sm:px-3 sm:py-2 rounded-full border border-luxury-border bg-luxury-card text-luxury-text hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center gap-1.5"
              title={currentUser ? currentUser.name : "Connexion / Profil"}
            >
              <User className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-medium truncate max-w-[100px]">
                {currentUser ? currentUser.name.split(" ")[0] : "Compte"}
              </span>
            </Link>

            {/* Bouton Panier / Commande avec badge */}
            <button
              type="button"
              onClick={() => dispatch(setCheckoutOpen({ open: true }))}
              aria-label="Ouvrir le panier et tunnel de commande"
              className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-luxury-gold text-white hover:bg-luxury-goldHover transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">
                Panier
              </span>
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-black/80 text-white text-[11px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* BARRE DE NAVIGATION BASSE SUR TÉLÉPHONE (MOBILE BOTTOM NAV) */}
      <nav
        aria-label="Navigation mobile"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[85] border-t border-luxury-border bg-luxury-card/95 backdrop-blur-md transition-transform duration-300 ${
          hideMobileBottomNav ? "translate-y-full pointer-events-none" : "translate-y-0"
        }`}
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-luxury-gold font-semibold"
                    : "text-luxury-muted hover:text-luxury-text"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-[68px]">
                  {item.label.split(" / ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
