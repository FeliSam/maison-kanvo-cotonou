"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Ruler,
  Truck,
  ShieldCheck,
  Camera,
  Plus,
  X,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  addToCartAndOpenCheckout,
  addReview,
  setAnyModalOpen,
} from "@/store/appSlice";
import { SizeType, ProductReview } from "@/types";
import { formatPrice } from "@/utils/currency";
import ProductCard from "./ProductCard";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { products, reviews, currency, currentUser } = useAppSelector(
    (s) => s.app
  );

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeType>("M");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState("");
  const [activeTab, setActiveTab] = useState<
    "details" | "care" | "reviews"
  >("details");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // États du formulaire d'avis client + photos portées
  const [rating, setRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState("");
  const [authorLocation, setAuthorLocation] = useState("Cotonou, Bénin");
  const [reviewOrderedSize, setReviewOrderedSize] = useState<SizeType>("M");
  const [comment, setComment] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(
        currentUser?.defaultSize &&
          product.sizes.includes(currentUser.defaultSize)
          ? currentUser.defaultSize
          : product.sizes[0] || "M"
      );
      setSelectedColor(product.colors[0]?.name || "Classique");
      setReviewOrderedSize(product.sizes[0] || "M");
      setActiveImageIdx(0);
    }
  }, [product, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.name);
      setAuthorLocation(currentUser.cityQuarter);
    }
  }, [currentUser]);

  const toggleSizeGuide = (open: boolean) => {
    setIsSizeGuideOpen(open);
    dispatch(setAnyModalOpen(open));
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p>Pièce introuvable.</p>
        <Link href="/collections" className="text-luxury-gold underline">
          Retour aux collections
        </Link>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleOrderNow = () => {
    dispatch(
      addToCartAndOpenCheckout({
        product,
        size: selectedSize,
        color: selectedColor || product.colors[0]?.name || "Standard",
        quantity,
        openDrawer: true,
        customMeasurements:
          selectedSize === "Sur-Mesure" ? customMeasurements : undefined,
      })
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setUploadedPhotos((prev) => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput("");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      authorName: authorName.trim() || "Client Privilège Cotonou",
      authorLocation: authorLocation.trim() || "Cotonou, Bénin",
      rating,
      orderedSize: reviewOrderedSize,
      comment: comment.trim(),
      photos: uploadedPhotos,
      createdAt: new Date().toISOString().split("T")[0],
      verifiedPurchase: true,
    };

    dispatch(addReview(newReview));
    setComment("");
    setUploadedPhotos([]);
    setReviewSubmitted(true);
    setActiveTab("reviews");
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 overflow-x-hidden">
      {/* Fil d'Ariane */}
      <div className="flex items-center justify-between gap-2 text-xs text-luxury-muted">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 hover:text-luxury-gold font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Catalogue</span>
        </Link>
        <span className="truncate">{product.category}</span>
      </div>

      {/* SECTION PRINCIPALE : GALERIE & MODULE D'ACHAT (AVEC ORDRE MOBILE STRICT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLONNE GAUCHE (lg:col-span-7) : Galerie Multi-Images Interactive */}
        <div className="lg:col-span-7 space-y-4">
          {/* Photo Principale HD */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-luxury-surface border border-luxury-border">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={`${product.name} - vue ${activeImageIdx + 1}`}
              className="w-full h-full object-cover object-top transition-all duration-300"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold bg-black/80 text-white">
                {product.stockStatus}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} ({productReviews.length} avis)
              </span>
            </div>
          </div>

          {/* Grille de vignettes fixes : AUCUN défilement horizontal overflow-x-auto, grille grid-cols-4 sm:grid-cols-6 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIdx === idx
                    ? "border-luxury-gold ring-2 ring-luxury-gold/40 scale-[0.98]"
                    : "border-luxury-border opacity-75 hover:opacity-100"
                }`}
                aria-label={`Afficher la photo ${idx + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} vignette ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE (lg:col-span-5) : MODULE « ACHAT & COMMANDE DIRECTE » */}
        {/* Sur mobile (< lg), ce module apparaît OBLIGATOIREMENT AU-DESSUS de la section des onglets & avis clients, et reste sticky à droite sur grand écran */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border shadow-lg space-y-5">
          <div className="space-y-2 border-b border-luxury-border pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-luxury-gold font-bold">
                {product.category}
              </span>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} / 5 ({productReviews.length})
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
              {product.subtitle}
            </p>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-luxury-gold">
                {formatPrice(product.priceCFA, currency)}
              </span>
              {product.originalPriceCFA && (
                <span className="text-sm line-through text-luxury-muted">
                  {formatPrice(product.originalPriceCFA, currency)}
                </span>
              )}
              {currency !== "XOF" && (
                <span className="text-xs text-luxury-muted">
                  ({formatPrice(product.priceCFA, "XOF")})
                </span>
              )}
            </div>
          </div>

          {/* Sélecteur de Nuance / Couleur */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-luxury-text">
              Nuance d&apos;Étoffe :{" "}
              <span className="text-luxury-gold">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    selectedColor === c.name
                      ? "border-luxury-gold bg-luxury-surface ring-1 ring-luxury-gold"
                      : "border-luxury-border bg-luxury-bg hover:border-luxury-gold"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sélecteur de Taille & Guide des Mensurations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-bold text-luxury-text">
                Taille :{" "}
                <span className="text-luxury-gold">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleSizeGuide(true)}
                className="text-xs font-semibold text-luxury-gold hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                Guide des mensurations
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === sz
                      ? "bg-luxury-gold text-white border-luxury-gold shadow-sm"
                      : "bg-luxury-bg text-luxury-text border-luxury-border hover:border-luxury-gold"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {selectedSize === "Sur-Mesure" && (
              <div className="pt-2">
                <label className="block text-xs font-medium text-luxury-gold mb-1">
                  Vos mensurations ou souhait d&apos;essayage au Showroom :
                </label>
                <input
                  type="text"
                  value={customMeasurements}
                  onChange={(e) => setCustomMeasurements(e.target.value)}
                  placeholder="Ex: Poitrine 102cm, Épaules 46cm, Hauteur 1m80..."
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-bg text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* Quantité + Bouton Achat & Commande Directe */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-luxury-border rounded-xl bg-luxury-bg">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-sm font-bold hover:text-luxury-gold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-sm font-bold hover:text-luxury-gold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleOrderNow}
                className="flex-1 py-3.5 px-5 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Commander cette Pièce</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-luxury-surface/70 border border-luxury-border space-y-1.5 text-xs text-luxury-muted">
              <div className="flex items-center gap-2 text-luxury-text font-medium">
                <Truck className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>
                  Coursier Express 3h à Cotonou/Calavi ou Retrait Gratuit Haie Vive
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>
                  Paiement MTN MoMo, Celtiis Cash, Carte Visa ou Espèces FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU INTERACTIF À 3 ONGLETS SANS SCROLL HORIZONTAL + BOUTON D'ACTION INTÉGRÉ */}
      <section className="space-y-6">
        <div className="p-2 rounded-2xl bg-luxury-card border border-luxury-border grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center ${
              activeTab === "details"
                ? "bg-luxury-gold text-white"
                : "bg-luxury-surface text-luxury-text hover:border-luxury-gold"
            }`}
          >
            1. Détails & Coupe
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("care")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center ${
              activeTab === "care"
                ? "bg-luxury-gold text-white"
                : "bg-luxury-surface text-luxury-text hover:border-luxury-gold"
            }`}
          >
            2. Entretien & Livraison
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center ${
              activeTab === "reviews"
                ? "bg-luxury-gold text-white"
                : "bg-luxury-surface text-luxury-text hover:border-luxury-gold"
            }`}
          >
            3. Avis Clients & Photos ({productReviews.length})
          </button>

          {/* Bouton direct « Ajouter / Commander » intégré dans la barre du menu */}
          <button
            type="button"
            onClick={handleOrderNow}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 dark:bg-amber-500 text-white dark:text-neutral-950 hover:opacity-90 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Ajouter / Commander</span>
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === "details" && (
          <div className="p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">
                Étoffe & Composition
              </span>
              <h3 className="font-serif text-lg font-bold">Matière Première</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                {product.material}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">
                Traçabilité & Savoir-Faire
              </span>
              <h3 className="font-serif text-lg font-bold">Origine du Tissu</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                {product.origin}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">
                Architecture du Vêtement
              </span>
              <h3 className="font-serif text-lg font-bold">Coupe & Tombé</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                {product.cutDetails}
              </p>
            </div>
          </div>
        )}

        {activeTab === "care" && (
          <div className="p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">
                Préservation des Fibres
              </span>
              <h3 className="font-serif text-lg font-bold">
                Conseils de Lavage & Repassage
              </h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                {product.careInstructions}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">
                Logistique Bénin & Internationale
              </span>
              <h3 className="font-serif text-lg font-bold">
                Livraison Cotonou, Calavi, Porto-Novo & DHL
              </h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                {product.deliveryInfo}
              </p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Liste des avis et photos portées */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold">
                    Avis Vérifiés & Photos Portées ({productReviews.length})
                  </h3>
                  <p className="text-xs text-luxury-muted">
                    Note globale de cette pièce :{" "}
                    <strong className="text-luxury-gold">
                      ★ {product.rating.toFixed(1)} / 5
                    </strong>
                  </p>
                </div>
              </div>

              {productReviews.length === 0 ? (
                <div className="p-6 rounded-2xl bg-luxury-card border border-luxury-border text-center text-sm text-luxury-muted">
                  Soyez le premier client à partager votre avis et une photo portée de cette création.
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-luxury-text">
                          {rev.authorName}
                        </span>
                        <span className="text-xs text-luxury-muted ml-2">
                          • {rev.authorLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-luxury-surface border border-luxury-border text-[11px] font-semibold">
                          Taille commandée : {rev.orderedSize}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < Math.round(rev.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-luxury-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-luxury-text leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                        {rev.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="aspect-square rounded-xl overflow-hidden border border-luxury-border bg-luxury-surface"
                          >
                            <img
                              src={photo}
                              alt={`Vêtement porté par ${rev.authorName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] text-luxury-muted pt-1">
                      Publié le {rev.createdAt} • Achat Vérifié Maison Kanvô
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulaire d'ajout d'avis étoilé + photos portées (Base64 ou URL) */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Partagez votre expérience
                  </span>
                  <h3 className="font-serif text-lg font-bold">
                    Publier un Avis & Photo Portée
                  </h3>
                </div>

                {reviewSubmitted && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Votre avis et vos photos ont été publiés immédiatement !
                  </div>
                )}

                {/* Sélection Note 1 à 5 étoiles */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Votre note ({rating} / 5 ★)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1.5 rounded-lg border border-luxury-border bg-luxury-surface hover:border-luxury-gold"
                        aria-label={`Noter ${starVal} sur 5`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-luxury-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Sèna K."
                      className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-bg text-sm"
                    />
                  </div>
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Taille commandée
                    </label>
                    <select
                      value={reviewOrderedSize}
                      onChange={(e) =>
                        setReviewOrderedSize(e.target.value as SizeType)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-bg text-sm"
                    >
                      {product.sizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Votre appréciation (qualité du tissu, tombé, taille) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre ressenti sur la coupe, le confort du tissu Kanvô ou du lin..."
                    className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-bg text-sm"
                  />
                </div>

                {/* Ajout de photos du vêtement porté (FileReader Base64 ou URL) */}
                <div className="space-y-2.5 p-3 rounded-xl bg-luxury-surface/60 border border-luxury-border">
                  <label className="block text-xs font-bold text-luxury-gold flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    Ajouter des photos du vêtement porté
                  </label>

                  {/* Import fichier local */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-luxury-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-luxury-gold file:text-white hover:file:bg-luxury-goldHover cursor-pointer"
                  />

                  {/* Ou lien URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="Ou coller l'URL d'une photo..."
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-luxury-border bg-luxury-card text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border hover:border-luxury-gold text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter
                    </button>
                  </div>

                  {/* Prévisualisation des photos jointes */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {uploadedPhotos.map((ph, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-luxury-border"
                        >
                          <img
                            src={ph}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedPhotos(
                                uploadedPhotos.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs uppercase tracking-wider font-bold transition-colors shadow-md"
                >
                  Publier mon Avis & Mettre à jour la Note
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* SECTION PIÈCES COMPLÉMENTAIRES */}
      <section className="space-y-5 pt-4 border-t border-luxury-border">
        <h2 className="font-serif text-xl sm:text-2xl font-bold">
          Vous aimerez également
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* MODALE GUIDE DES MENSURATIONS */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-[130] overflow-x-hidden flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-luxury-card text-luxury-text border border-luxury-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-border pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold">
                  Atelier de Couture • Cotonou
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  Guide des Mensurations Maison Kanvô
                </h3>
              </div>
              <button
                type="button"
                onClick={() => toggleSizeGuide(false)}
                className="p-2 rounded-full border border-luxury-border hover:border-luxury-gold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-luxury-border text-luxury-gold">
                    <th className="py-2 font-bold">Taille</th>
                    <th className="py-2 font-bold">Poitrine (cm)</th>
                    <th className="py-2 font-bold">Taille (cm)</th>
                    <th className="py-2 font-bold">Hanches (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border">
                  <tr>
                    <td className="py-2 font-bold">XS</td>
                    <td className="py-2">82 – 86</td>
                    <td className="py-2">64 – 68</td>
                    <td className="py-2">88 – 92</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">S</td>
                    <td className="py-2">87 – 92</td>
                    <td className="py-2">69 – 74</td>
                    <td className="py-2">93 – 98</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">M</td>
                    <td className="py-2">93 – 98</td>
                    <td className="py-2">75 – 81</td>
                    <td className="py-2">99 – 104</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">L</td>
                    <td className="py-2">99 – 105</td>
                    <td className="py-2">82 – 89</td>
                    <td className="py-2">105 – 111</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">XL</td>
                    <td className="py-2">106 – 113</td>
                    <td className="py-2">90 – 98</td>
                    <td className="py-2">112 – 119</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">XXL</td>
                    <td className="py-2">114 – 122</td>
                    <td className="py-2">99 – 108</td>
                    <td className="py-2">120 – 128</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-luxury-muted">
              Choisissez l&apos;option <strong>Sur-Mesure</strong> pour saisir
              vos propres mesures ou bénéficier d&apos;un ajustement gratuit au
              Showroom Haie Vive.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
