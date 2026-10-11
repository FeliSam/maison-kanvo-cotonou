"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCartAndOpenCheckout } from "@/store/appSlice";
import { formatPrice } from "@/utils/currency";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.app.currency);
  const currentUser = useAppSelector((s) => s.app.currentUser);

  const handleQuickOrder = () => {
    const preferredSize =
      currentUser?.defaultSize &&
      product.sizes.includes(currentUser.defaultSize)
        ? currentUser.defaultSize
        : product.sizes[0] || "M";
    const defaultColor = product.colors[0]?.name || "Classique";

    dispatch(
      addToCartAndOpenCheckout({
        product,
        size: preferredSize,
        color: defaultColor,
        quantity: 1,
        openDrawer: true,
      })
    );
  };

  return (
    <article className="group bg-luxury-card border border-luxury-border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-luxury-gold hover:shadow-lg">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-luxury-surface">
          <Link href={`/collections/${product.slug}`} className="block w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Overlay badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/75 text-white backdrop-blur-sm">
              {product.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/80 text-amber-400 backdrop-blur-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          {product.stockStatus && (
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/90 text-neutral-900 shadow-sm">
                {product.stockStatus}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/collections/${product.slug}`}
              className="font-serif text-base sm:text-lg font-bold text-luxury-text hover:text-luxury-gold transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Prix en FCFA (ou devise active) */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-bold text-luxury-gold">
              {formatPrice(product.priceCFA, currency)}
            </span>
            {product.originalPriceCFA && (
              <span className="text-xs line-through text-luxury-muted">
                {formatPrice(product.originalPriceCFA, currency)}
              </span>
            )}
          </div>

          {/* Tailles disponibles */}
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {product.sizes.map((sz) => (
              <span
                key={sz}
                className="px-1.5 py-0.5 text-[10px] font-semibold rounded border border-luxury-border bg-luxury-surface text-luxury-text"
              >
                {sz}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Deux boutons d'action : Voir la Pièce & Commander */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={`/collections/${product.slug}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold hover:text-luxury-gold text-xs font-semibold transition-colors"
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span>Voir la Pièce</span>
        </Link>
        <button
          type="button"
          onClick={handleQuickOrder}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-semibold transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>Commander</span>
        </button>
      </div>
    </article>
  );
}
