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
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import ProductCard from "@/components/ProductCard";
import { CategoryType } from "@/types";

const CATEGORIES: ("Toutes" | CategoryType)[] = [
  "Toutes",
  "Femme",
  "Homme",
  "Édition Kanvô & Héritage",
  "Accessoires & Maroquinerie",
];

export default function HomePage() {
  const { products, reviews } = useAppSelector((s) => s.app);
  const [activeCategory, setActiveCategory] = useState<"Toutes" | CategoryType>(
    "Toutes"
  );

  const filteredProducts =
    activeCategory === "Toutes"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-14 sm:space-y-20 overflow-x-hidden">
      {/* HERO BANNER — Règle de contraste : overlay sombre dégradé + texte clair lisible quel que soit le thème actif */}
      <section className="relative min-h-[540px] sm:min-h-[640px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85"
          alt="Maison Kanvô Cotonou — Couture Contemporaine Bénin"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 w-full">
          <div className="max-w-2xl space-y-5 text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-400/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-amber-300 font-semibold">
                Cotonou • Haie Vive & Ganhi • République du Bénin
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              L&apos;Élégance du Kanvô & du Lin Contemporain.
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl">
              Silhouettes architecturales taillées à Cotonou : Kanvô royal
              d&apos;Abomey, lin lavé, coton glacé et bazin riche. Livrées en 3h à
              Cotonou/Calavi ou expédiées dans le monde entier.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/collections"
                className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                <span>Explorer la Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sur-mesure"
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm uppercase tracking-wider font-semibold backdrop-blur-sm transition-colors"
              >
                Salon Sur-Mesure
              </Link>
            </div>

            {/* Indicateurs Clés */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 max-w-lg">
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
                  100% Bénin
                </div>
                <div className="text-[11px] text-neutral-300">
                  Tissage Abomey & Atelier Cotonou
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
                  ★ 4.9 / 5
                </div>
                <div className="text-[11px] text-neutral-300">
                  Avis Clients & Photos Portées
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
                  MoMo & Visa
                </div>
                <div className="text-[11px] text-neutral-300">
                  MTN MoMo, Celtiis & Espèces FCFA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILIERS DE LA MAISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Scissors,
              title: "Étoffes Nobles du Bénin",
              desc: "Kanvô tissé main, coton bio peigné, lin frais et bazin riche glacé.",
            },
            {
              icon: Truck,
              title: "Coursier Express 3h",
              desc: "Livraison directe à Haie Vive, Ganhi, Cocotiers, Fidjrossè, Calavi & Porto-Novo.",
            },
            {
              icon: ShieldCheck,
              title: "Modification Libre",
              desc: "Changez la taille, la nuance ou le créneau de livraison en 1 clic avant remise.",
            },
            {
              icon: MapPin,
              title: "Retouches Offertes",
              desc: "Essayage privé et ajustement d'ourlet gratuit en 2h dans nos 2 showrooms.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-luxury-card border border-luxury-border flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-luxury-surface border border-luxury-border text-luxury-gold shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-sm sm:text-base font-bold text-luxury-text">
                    {item.title}
                  </h2>
                  <p className="text-xs text-luxury-muted mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SÉLECTION DU SHOWROOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
              Vestiaire Contemporain • Prix en FCFA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text mt-1">
              Pièces Signatures du Showroom
            </h2>
          </div>

          {/* Filtres rapides par catégorie */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  activeCategory === cat
                    ? "bg-luxury-gold text-white border-luxury-gold"
                    : "bg-luxury-card text-luxury-text border-luxury-border hover:border-luxury-gold"
                }`}
              >
                {cat}
              </button>
            ))}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-bold transition-colors"
          >
            <span>Accéder au Catalogue Complet & Filtres Avancés</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* BANNIÈRE SUR-MESURE & KANVÔ (Règle de contraste : overlay sombre dégradé + texte clair lisible) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden min-h-[340px] flex items-center p-6 sm:p-12">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
            alt="Atelier Sur-Mesure Cotonou"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/45" />

          <div className="relative z-10 max-w-xl space-y-4 text-white">
            <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-bold">
              Salon Privé Haie Vive & Ganhi
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Confection Sur-Mesure en 48 Heures.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              Choisissez votre tissage Kanvô d&apos;Abomey ou votre lin lavé,
              confiez vos mensurations à notre Maître Tailleur et recevez une
              pièce unique façonnée à vos mesures exactes.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/sur-mesure"
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Réserver un Essayage ou Sur-Mesure
              </Link>
              <Link
                href="/suivi"
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs uppercase tracking-wider font-semibold backdrop-blur-sm transition-colors"
              >
                Suivre ou Modifier une Commande
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* APERÇU AVIS CLIENTS & PHOTOS PORTÉES */}
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
                className="p-4 sm:p-5 rounded-xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4"
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
                    <span className="text-[11px] px-2 py-0.5 rounded bg-luxury-surface border border-luxury-border font-medium">
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
                        className="text-[11px] text-luxury-gold hover:underline font-medium block mt-0.5"
                      >
                        Voir : {prod.name}
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
