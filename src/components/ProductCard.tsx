"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Eye, Check } from "lucide-react";
import { Product, SizeType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCartAndOpenCheckout } from "@/store/appSlice";
import { formatPrice } from "@/utils/currency";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.app.currentUser);

  const initialSize =
    currentUser?.defaultSize && product.sizes.includes(currentUser.defaultSize)
      ? currentUser.defaultSize
      : product.sizes[0] || "M";

  const [selectedSize, setSelectedSize] = useState<SizeType>(initialSize);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Classique"
  );
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleQuickOrder = () => {
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
    dispatch(
      addToCartAndOpenCheckout({
        product,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
        openDrawer: true,
      })
    );
  };

  return (
    <article className="group bg-luxury-card border border-luxury-border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-luxury-gold hover:shadow-xl">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-luxury-surface">
          <Link
            href={`/collections/${product.slug}`}
            className="block w-full h-full"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-black/80 text-white backdrop-blur-sm">
              {product.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/85 text-amber-400 backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          {product.stockStatus && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-neutral-900 shadow-sm">
                {product.stockStatus}
              </span>
              {product.colors.length > 1 && (
                <div className="flex items-center gap-1 bg-black/75 px-2 py-1 rounded-full pointer-events-auto">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedColor(c.name);
                      }}
                      title={`Nuance : ${c.name}`}
                      className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                        selectedColor === c.name
                          ? "scale-125 border-amber-400 ring-1 ring-amber-400"
                          : "border-white/50 opacity-80"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <Link
            href={`/collections/${product.slug}`}
            className="font-serif text-base sm:text-lg font-bold text-luxury-text hover:text-luxury-gold transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>

          <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Prix exclusivement en FCFA (XOF) */}
          <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-luxury-border/60">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-luxury-gold">
                {formatPrice(product.priceCFA)}
              </span>
              {product.originalPriceCFA && (
                <span className="text-xs line-through text-luxury-muted">
                  {formatPrice(product.originalPriceCFA)}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-muted">
              {selectedColor.split(" ")[0]}
            </span>
          </div>

          {/* Sélecteur interactif de taille sur la carte */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[10px] text-luxury-muted">
              <span className="uppercase tracking-wider font-bold">
                Choisir la taille :
              </span>
              <span className="font-bold text-luxury-gold">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all border ${
                    selectedSize === sz
                      ? "bg-luxury-gold text-white border-luxury-gold shadow-sm"
                      : "border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deux boutons d'action : Voir la Pièce & Commander */}
      <div className="p-4 pt-1 grid grid-cols-2 gap-2">
        <Link
          href={`/collections/${product.slug}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold hover:text-luxury-gold text-xs font-bold transition-colors"
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span>Voir la Pièce</span>
        </Link>
        <button
          type="button"
          onClick={handleQuickOrder}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold transition-colors shadow-sm"
        >
          {addedFeedback ? (
            <>
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>Ajouté</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Commander</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
