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
  MapPin,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleTheme, setCheckoutOpen } from "@/store/appSlice";
import { formatPrice } from "@/utils/currency";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const {
    theme,
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
  const totalCartCFA = cart.reduce(
    (acc, item) => acc + item.priceCFA * item.quantity,
    0
  );

  // Seuls le Directeur de Boutique et le Chef d'Atelier ont accès au Dashboard Admin
  const isStaff =
    currentUser?.role === "ADMIN_ATELIER" ||
    currentUser?.role === "DIRECTEUR_BOUTIQUE";

  const navLinks = [
    { href: "/", label: "Accueil", mobileLabel: "Accueil", icon: Home },
    {
      href: "/collections",
      label: "Collections",
      mobileLabel: "Collections",
      icon: Sparkles,
    },
    {
      href: "/sur-mesure",
      label: "Lookbook & Sur-Mesure",
      mobileLabel: "Sur-Mesure",
      icon: Scissors,
    },
    {
      href: "/suivi",
      label: "Suivi & SAV",
      mobileLabel: "Suivi & SAV",
      icon: PackageSearch,
    },
    ...(isStaff
      ? [
          {
            href: "/admin",
            label: "Dashboard Admin",
            mobileLabel: "Admin",
            icon: ShieldCheck,
          },
        ]
      : [
          {
            href: currentUser ? "/conciergerie" : "/connexion",
            label: currentUser ? "Mon Espace VIP" : "Connexion",
            mobileLabel: currentUser ? "Mon Profil" : "Compte",
            icon: User,
          },
        ]),
  ];

  // Masquer automatiquement la barre basse mobile dès que le tiroir de commande ou une modale est ouvert
  const hideMobileBottomNav =
    isCheckoutOpen || Boolean(editingOrderId) || isAnyModalOpen;

  return (
    <>
      {/* BARRE DE NAVIGATION HAUTE (SMART STICKY NAVBAR STRUCTURÉE) */}
      <header
        className={`fixed top-0 left-0 right-0 z-[90] transition-transform duration-300 border-b border-luxury-border bg-luxury-card/95 backdrop-blur-md shadow-sm ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Bandeau supérieur d'information Showroom Cotonou sur grand écran */}
        <div className="hidden lg:block bg-neutral-950 text-neutral-200 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between text-[11px] tracking-wider">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              Showrooms Cotonou : Haie Vive & Ganhi • République du Bénin
            </span>
            <span className="text-neutral-300">
              Livraison Express 3h Cotonou / Calavi • Paiement MTN MoMo, Celtiis Cash & Espèces FCFA
            </span>
            <span className="font-semibold text-amber-400">
              Devise officielle : Franc CFA (XOF)
            </span>
          </div>
        </div>

        {/* Barre principale */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 lg:h-20 flex items-center justify-between gap-4">
          {/* Bloc Gauche : Identité Maison Kanvô */}
          <Link href="/" className="flex flex-col group shrink-0">
            <span className="font-serif text-lg sm:text-2xl tracking-[0.18em] font-bold text-luxury-text group-hover:text-luxury-gold transition-colors">
              MAISON KANVÔ
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-luxury-gold font-semibold">
              Cotonou • Haute Confection
            </span>
          </Link>

          {/* Bloc Central Desktop : Navigation structurée en capsule */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-luxury-surface/90 border border-luxury-border shadow-inner"
          >
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.12em] font-bold transition-all ${
                    active
                      ? "bg-luxury-gold text-white shadow-sm"
                      : "text-luxury-text hover:text-luxury-gold hover:bg-luxury-card/70"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bloc Droite : Thème, Compte/Rôle & Panier FCFA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Switch Mode Clair / Sombre */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={
                theme === "dark"
                  ? "Passer en mode clair"
                  : "Passer en mode sombre"
              }
              className="p-2.5 rounded-full border border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold hover:text-luxury-gold transition-colors"
              title={
                theme === "dark"
                  ? "Activer le thème clair"
                  : "Activer le thème sombre"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-luxury-gold" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Accès au Compte / Changement de profil */}
            <Link
              href="/connexion"
              aria-label="Accès au compte"
              className="p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center gap-2"
              title={
                currentUser
                  ? `${currentUser.name} (Changer de profil)`
                  : "Connexion / Profil"
              }
            >
              <User className="w-4 h-4 text-luxury-gold shrink-0" />
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-[11px] font-bold truncate max-w-[110px]">
                  {currentUser ? currentUser.name.split(" ")[0] : "Connexion"}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-luxury-muted">
                  {isStaff ? "Direction / Atelier" : "Client VIP"}
                </span>
              </div>
            </Link>

            {/* Bouton Panier / Commande avec badge et montant XOF */}
            <button
              type="button"
              onClick={() => dispatch(setCheckoutOpen({ open: true }))}
              aria-label="Ouvrir le panier et tunnel de commande"
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-luxury-gold text-white hover:bg-luxury-goldHover transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  Commande
                </span>
                <span className="text-[11px] font-extrabold">
                  {totalCartCFA > 0 ? formatPrice(totalCartCFA) : "0 FCFA"}
                </span>
              </div>
              <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-neutral-950 text-amber-400 text-xs font-extrabold flex items-center justify-center border border-amber-400/40">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* BARRE DE NAVIGATION BASSE SUR TÉLÉPHONE (MOBILE BOTTOM NAV HAUTE VISIBILITÉ) */}
      <nav
        aria-label="Navigation mobile"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[85] border-t-2 border-luxury-gold/50 bg-luxury-card shadow-[0_-8px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 ${
          hideMobileBottomNav
            ? "translate-y-full pointer-events-none"
            : "translate-y-0"
        }`}
      >
        <div className="grid grid-cols-5 h-[70px] max-w-lg mx-auto px-1.5 py-1">
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
                className={`relative flex flex-col items-center justify-center gap-1 rounded-xl mx-0.5 transition-all ${
                  active
                    ? "bg-luxury-gold text-white font-extrabold shadow-md"
                    : "text-luxury-text hover:bg-luxury-surface font-semibold"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-white" : "text-luxury-gold"
                  }`}
                />
                <span className="text-[11px] leading-none tracking-tight truncate max-w-[68px]">
                  {item.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
