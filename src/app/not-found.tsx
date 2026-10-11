"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductDetailClient from "@/components/ProductDetailClient";

export default function NotFoundPage() {
  const [dynamicSlug, setDynamicSlug] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const match = path.match(/\/collections\/([^/]+)\/?$/);
      if (match && match[1]) {
        setDynamicSlug(decodeURIComponent(match[1]));
      }
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return (
      <div className="max-w-5xl mx-auto p-10 text-center text-sm text-luxury-muted">
        Chargement de la pièce...
      </div>
    );
  }

  if (dynamicSlug) {
    return <ProductDetailClient slug={dynamicSlug} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
      <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
        Maison Kanvô Cotonou
      </span>
      <h1 className="font-serif text-3xl font-bold">Page Introuvable</h1>
      <p className="text-sm text-luxury-muted">
        La page ou la création que vous recherchez n&apos;est plus disponible à cette adresse.
      </p>
      <div className="pt-2">
        <Link
          href="/collections"
          className="inline-block px-6 py-3 rounded-xl bg-luxury-gold text-white text-xs uppercase tracking-wider font-bold"
        >
          Explorer les Collections
        </Link>
      </div>
    </div>
  );
}
