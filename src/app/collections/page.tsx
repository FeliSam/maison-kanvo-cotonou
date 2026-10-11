"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Search, RotateCcw } from "lucide-react";
import { useAppSelector } from "@/store/store";
import ProductCard from "@/components/ProductCard";
import { CategoryType, SizeType } from "@/types";

const CATEGORIES: ("Toutes" | CategoryType)[] = [
  "Toutes",
  "Femme",
  "Homme",
  "Édition Kanvô & Héritage",
  "Accessoires & Maroquinerie",
];

const SIZES: ("Toutes" | SizeType)[] = [
  "Toutes",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Sur-Mesure",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

export default function CollectionsPage() {
  const { products } = useAppSelector((s) => s.app);

  const [selectedCategory, setSelectedCategory] = useState<
    "Toutes" | CategoryType
  >("Toutes");
  const [selectedSize, setSelectedSize] = useState<"Toutes" | SizeType>(
    "Toutes"
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSorted = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "Toutes" && p.category !== selectedCategory) {
          return false;
        }
        if (selectedSize !== "Toutes" && !p.sizes.includes(selectedSize)) {
          return false;
        }
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchMat = p.material.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          if (!matchName && !matchMat && !matchSub) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceCFA - b.priceCFA;
        if (sortBy === "price-desc") return b.priceCFA - a.priceCFA;
        if (sortBy === "rating-desc") return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, selectedSize, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("Toutes");
    setSelectedSize("Toutes");
    setSortBy("featured");
    setSearchQuery("");
  };

  return (
    <div className="space-y-8 pb-10 overflow-x-hidden">
      {/* Bannière Collections avec overlay sombre dégradé et texte clair */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
          alt="Collections Maison Kanvô Cotonou"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto text-white space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-amber-400 font-bold">
            Catalogue Officiel • Cotonou, République du Bénin
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Collections Prêt-à-Porter & Éditions Kanvô
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 max-w-xl">
            Filtrez par coupe, taille ou étoffe et commandez directement avec
            livraison express à Cotonou ou retrait au Showroom Haie Vive.
          </p>
        </div>
      </section>

      {/* Barre de Filtres Dynamiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Recherche */}
            <div className="relative min-w-0 max-w-full overflow-hidden">
              <Search className="w-4 h-4 text-luxury-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher : Kanvô, Bazin, Lin, Saharienne..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            {/* Tri par Prix FCFA ou Note Étoilée */}
            <div className="min-w-0 max-w-full overflow-hidden flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-luxury-gold shrink-0" />
              <select
                aria-label="Trier les articles"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm font-medium"
              >
                <option value="featured">Tri : Sélection du Showroom</option>
                <option value="rating-desc">
                  Tri : Meilleure Note Étoilée (★)
                </option>
                <option value="price-asc">
                  Tri : Prix FCFA Croissant (Moins cher)
                </option>
                <option value="price-desc">
                  Tri : Prix FCFA Décroissant (Prestige)
                </option>
              </select>
            </div>

            {/* Compteur & Reset */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs font-semibold text-luxury-muted">
                {filteredAndSorted.length} pièce
                {filteredAndSorted.length > 1 ? "s" : ""} disponible
                {filteredAndSorted.length > 1 ? "s" : ""}
              </span>
              {(selectedCategory !== "Toutes" ||
                selectedSize !== "Toutes" ||
                searchQuery !== "" ||
                sortBy !== "featured") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-lg border border-luxury-border bg-luxury-surface text-xs font-semibold hover:border-luxury-gold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Filtres Catégorie */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-luxury-muted font-bold block">
              Catégorie
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    selectedCategory === cat
                      ? "bg-luxury-gold text-white border-luxury-gold"
                      : "bg-luxury-bg text-luxury-text border-luxury-border hover:border-luxury-gold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres Taille */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-luxury-muted font-bold block">
              Taille Disponible
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                    selectedSize === sz
                      ? "bg-luxury-gold text-white border-luxury-gold"
                      : "bg-luxury-bg text-luxury-text border-luxury-border hover:border-luxury-gold"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille des Produits */}
        {filteredAndSorted.length === 0 ? (
          <div className="p-10 rounded-2xl bg-luxury-card border border-luxury-border text-center space-y-3">
            <p className="font-serif text-lg">
              Aucune pièce ne correspond exactement à ces critères.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-luxury-gold text-white text-xs font-bold uppercase tracking-wider"
            >
              Afficher toute la collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
