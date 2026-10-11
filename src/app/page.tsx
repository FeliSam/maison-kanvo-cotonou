"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Scissors,
  Truck,
  Star,
  MapPin,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCartAndOpenCheckout } from "@/store/appSlice";
import ProductCard from "@/components/ProductCard";
import { CategoryType } from "@/types";
import { formatPrice } from "@/utils/currency";

const CATEGORIES: ("Toutes" | CategoryType)[] = [
  "Toutes",
  "Femme",
  "Homme",
  "Édition Kanvô & Héritage",
  "Accessoires & Maroquinerie",
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, reviews } = useAppSelector((s) => s.app);
  const [activeCategory, setActiveCategory] = useState<"Toutes" | CategoryType>(
    "Toutes"
  );
  const [heroIdx, setHeroIdx] = useState(0);

  const heroProducts = products.slice(0, 3);
  const activeHeroProduct = heroProducts[heroIdx] || products[0];

  const filteredProducts =
    activeCategory === "Toutes"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-14 sm:space-y-20 overflow-x-hidden">
      {/* 1. HERO INTERACTIF & STRUCTURÉ (Overlay sombre dégradé + Texte clair garanti) */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden">
        <img
          src={
            activeHeroProduct?.images[0] ||
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85"
          }
          alt={activeHeroProduct?.name || "Maison Kanvô Cotonou"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Colonne Gauche : Éditorial & Actions */}
          <div className="lg:col-span-7 space-y-5 text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-400/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-amber-300 font-semibold">
                Maison de Couture Contemporaine • Cotonou, Bénin
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              L&apos;Élégance du Kanvô & du Lin Contemporain.
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl">
              Silhouettes architecturales taillées à Cotonou : Kanvô royal
              tissé main d&apos;Abomey, lin lavé, coton glacé et bazin riche.
              Remise par coursier en 3h à Cotonou/Calavi ou retrait gratuit au
              Showroom Haie Vive.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/collections"
                className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                <span>Découvrir le Catalogue (XOF)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sur-mesure"
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm uppercase tracking-wider font-semibold backdrop-blur-sm transition-colors"
              >
                Salon Sur-Mesure 48h
              </Link>
            </div>

            {/* Sélecteur de Silhouette en Direct */}
            <div className="pt-4 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold block">
                Sélectionner une Pièce Phare en Aperçu Direct :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl">
                {heroProducts.map((hp, index) => (
                  <button
                    key={hp.id}
                    type="button"
                    onClick={() => setHeroIdx(index)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      heroIdx === index
                        ? "bg-amber-500/25 border-amber-400 text-white shadow-md"
                        : "bg-black/50 border-white/20 text-neutral-300 hover:border-white/50"
                    }`}
                  >
                    <img
                      src={hp.images[0]}
                      alt={hp.name}
                      className="w-10 h-12 rounded-lg object-cover shrink-0 border border-white/20"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-white">
                        {hp.name}
                      </div>
                      <div className="text-[11px] font-extrabold text-amber-400">
                        {formatPrice(hp.priceCFA)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne Droite : Carte Interactive de la Silhouette Active */}
          {activeHeroProduct && (
            <div className="lg:col-span-5">
              <div className="p-5 rounded-2xl bg-black/75 border border-white/20 backdrop-blur-md text-white space-y-4 shadow-2xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {activeHeroProduct.category}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {activeHeroProduct.rating.toFixed(1)} / 5
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={activeHeroProduct.images[0]}
                    alt={activeHeroProduct.name}
                    className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
                      {activeHeroProduct.name}
                    </h2>
                    <p className="text-xs text-neutral-300 line-clamp-2">
                      {activeHeroProduct.subtitle}
                    </p>
                    <div className="text-xl font-extrabold text-amber-400 pt-1">
                      {formatPrice(activeHeroProduct.priceCFA)}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Tailles : {activeHeroProduct.sizes.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/15">
                  <Link
                    href={`/collections/${activeHeroProduct.slug}`}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold text-center transition-colors"
                  >
                    Détails & Photos
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        addToCartAndOpenCheckout({
                          product: activeHeroProduct,
                          size: activeHeroProduct.sizes[0] || "M",
                          color:
                            activeHeroProduct.colors[0]?.name || "Classique",
                          quantity: 1,
                          openDrawer: true,
                        })
                      )
                    }
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. BARRE DES ENGAGEMENTS MAISON KANVÔ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Scissors,
              step: "01",
              title: "Étoffes Nobles du Bénin",
              desc: "Kanvô tissé main d'Abomey, coton bio peigné, lin frais et bazin riche glacé.",
            },
            {
              icon: Truck,
              step: "02",
              title: "Coursier Express 3h",
              desc: "Livraison directe à Haie Vive, Ganhi, Cocotiers, Fidjrossè, Calavi & Porto-Novo.",
            },
            {
              icon: ShieldCheck,
              step: "03",
              title: "Modification Libre",
              desc: "Changez la taille, la nuance ou le créneau de livraison en 1 clic avant remise.",
            },
            {
              icon: MapPin,
              step: "04",
              title: "Retouches Offertes",
              desc: "Essayage privé et ajustement d'ourlet gratuit en 2h dans nos 2 showrooms.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-luxury-card border border-luxury-border hover:border-luxury-gold transition-colors space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-luxury-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-xs font-bold text-luxury-gold px-2.5 py-0.5 rounded-full bg-luxury-surface border border-luxury-border">
                    Engagement {item.step}
                  </span>
                </div>
                <h2 className="font-serif text-base font-bold text-luxury-text">
                  {item.title}
                </h2>
                <p className="text-xs text-luxury-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CATALOGUE INTERACTIF DU SHOWROOM (TARIFS EXCLUSIFS EN FCFA / XOF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
              Vestiaire Contemporain • Prix Officiels en FCFA (XOF)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text mt-1">
              Pièces Signatures du Showroom
            </h2>
          </div>

          {/* Filtres par catégorie avec compteur dynamique */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "Toutes"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? "bg-luxury-gold text-white border-luxury-gold shadow-sm"
                      : "bg-luxury-surface text-luxury-text border-luxury-border hover:border-luxury-gold"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeCategory === cat
                        ? "bg-black/30 text-white"
                        : "bg-luxury-card text-luxury-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-bold transition-colors"
          >
            <span>Accéder au Catalogue Complet & Filtres par Taille</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. PARCOURS SAVOIR-FAIRE & SHOWROOMS COTONOU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Bannière Sur-Mesure 48h */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[360px] flex items-center p-6 sm:p-10">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Atelier Sur-Mesure Cotonou"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/45" />

          <div className="relative z-10 max-w-lg space-y-4 text-white">
            <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-bold">
              Salon Privé de Couture • Cotonou
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Confection Sur-Mesure en 48 Heures.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              Sélectionnez votre étoffe Kanvô d&apos;Abomey ou votre lin lavé,
              confiez vos mensurations à notre Maître Tailleur et recevez une
              création façonnée à vos mesures exactes.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/sur-mesure"
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Réserver un Essayage
              </Link>
              <Link
                href="/suivi"
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs uppercase tracking-wider font-semibold backdrop-blur-sm transition-colors"
              >
                Suivre une Commande
              </Link>
            </div>
          </div>
        </div>

        {/* Nos 2 Adresses à Cotonou */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between space-y-5">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
              Nos 2 Adresses à Cotonou
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Showrooms & Essayage Privé
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-luxury-surface border border-luxury-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-luxury-text">
                  1. Flagship Haie Vive
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-luxury-gold text-white">
                  Principal
                </span>
              </div>
              <p className="text-xs text-luxury-muted">
                Rue des Cocotiers, à 150m de la Place du Souvenir, Cotonou.
              </p>
              <p className="text-[11px] font-semibold text-luxury-gold flex items-center gap-1 pt-1">
                <Clock className="w-3.5 h-3.5" />
                Lun – Sam : 09h00 – 20h30 • Retrait Gratuit
              </p>
            </div>

            <div className="p-4 rounded-xl bg-luxury-surface border border-luxury-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-luxury-text">
                  2. Galerie Ganhi
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-luxury-border bg-luxury-card">
                  Quartier d&apos;Affaires
                </span>
              </div>
              <p className="text-xs text-luxury-muted">
                Avenue Steinmetz, Immeuble Horizon, Ganhi, Cotonou.
              </p>
              <p className="text-[11px] font-semibold text-luxury-gold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Retouches express offertes en 2 heures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AVIS CLIENTS VÉRIFIÉS & PHOTOS PORTÉES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
              Preuve Sociale & Photos Portées
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text mt-1">
              L&apos;Allure de nos Clients à Cotonou & à l&apos;International
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((rev) => {
            const prod = products.find((p) => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(rev.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-luxury-border"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold ml-1 text-luxury-text">
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-luxury-surface border border-luxury-border font-bold">
                      Taille {rev.orderedSize}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-luxury-text leading-relaxed italic">
                    « {rev.comment} »
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-luxury-border">
                  <div>
                    <div className="text-xs font-bold text-luxury-text">
                      {rev.authorName}
                    </div>
                    <div className="text-[11px] text-luxury-muted">
                      {rev.authorLocation}
                    </div>
                    {prod && (
                      <Link
                        href={`/collections/${prod.slug}`}
                        className="text-[11px] text-luxury-gold hover:underline font-semibold block mt-0.5"
                      >
                        Pièce : {prod.name}
                      </Link>
                    )}
                  </div>
                  {rev.photos[0] && (
                    <img
                      src={rev.photos[0]}
                      alt={`Photo portée par ${rev.authorName}`}
                      className="w-12 h-14 rounded-lg object-cover border border-luxury-border shrink-0"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
