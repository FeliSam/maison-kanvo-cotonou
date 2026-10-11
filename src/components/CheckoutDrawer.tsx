"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  Sparkles,
  Edit3,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setCheckoutOpen,
  updateCartItem,
  removeCartItem,
  createOrder,
  setEditingOrderId,
} from "@/store/appSlice";
import {
  DeliveryMethod,
  PaymentMethod,
  SizeType,
  Order,
} from "@/types";
import { formatPrice, getShippingCostCFA } from "@/utils/currency";

const ALL_SIZES: SizeType[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Sur-Mesure",
];

export default function CheckoutDrawer() {
  const dispatch = useAppDispatch();
  const {
    isCheckoutOpen,
    cart,
    highlightedCartItemId,
    currency,
    currentUser,
    products,
  } = useAppSelector((s) => s.app);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+229 01 ");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cityQuarter, setCityQuarter] = useState("Haie Vive, Cotonou");
  const [addressDetails, setAddressDetails] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    "EXPRESS_COTONOU_CALAVI"
  );
  const [preferredDate, setPreferredDate] = useState("2026-10-14");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(
    "Après-midi (14h-18h)"
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("MTN_MOMO");
  const [momoPhone, setMomoPhone] = useState("+229 01 97 44 12 88");
  const [notes, setNotes] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone);
      setCustomerEmail(currentUser.email);
      setCityQuarter(currentUser.cityQuarter);
      setAddressDetails(currentUser.address);
      setMomoPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isCheckoutOpen) {
      setConfirmedOrder(null);
      setStep(1);
      setErrorMsg("");
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const subtotalCFA = cart.reduce(
    (sum, item) => sum + item.priceCFA * item.quantity,
    0
  );
  const shippingCFA =
    cart.length > 0 ? getShippingCostCFA(deliveryMethod) : 0;
  const totalCFA = subtotalCFA + shippingCFA;

  const handleConfirmAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Votre sélection est vide.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Veuillez renseigner votre nom et numéro de téléphone (+229).");
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg(
        "Veuillez cocher la case de validation avant de confirmer la commande."
      );
      return;
    }

    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `LP-MODE-${randomCode}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingNumber,
      userId: currentUser?.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || "client@maison-kanvo.bj",
      cityQuarter: cityQuarter.trim() || "Cotonou",
      addressDetails:
        deliveryMethod === "SHOWROOM_COTONOU"
          ? "Retrait Showroom Haie Vive / Ganhi, Cotonou"
          : addressDetails.trim() || "Livraison Cotonou",
      deliveryMethod,
      preferredDate,
      preferredTimeSlot,
      paymentMethod,
      momoPhone:
        paymentMethod === "MTN_MOMO" || paymentMethod === "CELTIIS_CASH"
          ? momoPhone
          : undefined,
      items: [...cart],
      subtotalCFA,
      shippingCFA,
      totalCFA,
      status: "Confirmée",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    dispatch(createOrder(newOrder));
    setConfirmedOrder(newOrder);
    setStep(3);
  };

  return (
    <div
      className="fixed inset-0 z-[120] overflow-x-hidden flex justify-end bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Panier et Tunnel de Commande"
    >
      {/* Zone clic extérieur */}
      <div
        className="flex-1"
        onClick={() => dispatch(setCheckoutOpen({ open: false }))}
      />

      {/* Conteneur Tiroir sans aucun défilement horizontal */}
      <div className="w-full max-w-lg bg-luxury-card text-luxury-text h-full flex flex-col justify-between overflow-x-hidden shadow-2xl border-l border-luxury-border">
        {/* En-tête du Tiroir */}
        <div className="p-4 sm:p-5 border-b border-luxury-border flex items-center justify-between bg-luxury-surface/60">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-bold block">
              Conciergerie & Commande Directe
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold">
              {confirmedOrder
                ? `Commande ${confirmedOrder.trackingNumber}`
                : step === 1
                ? "1. Votre Sélection & Tailles"
                : "2. Livraison Cotonou & Paiement"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setCheckoutOpen({ open: false }))}
            className="p-2 rounded-full border border-luxury-border bg-luxury-card hover:border-luxury-gold text-luxury-text transition-colors"
            aria-label="Fermer le tiroir de commande"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilable verticalement uniquement */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-5">
          {confirmedOrder ? (
            <div className="space-y-5 py-4">
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold">
                  Commande Confirmée avec Succès
                </p>
                <h3 className="font-serif text-2xl font-bold">
                  N° {confirmedOrder.trackingNumber}
                </h3>
                <p className="text-xs text-luxury-muted">
                  Un SMS de confirmation a été envoyé au{" "}
                  <strong className="text-luxury-text">
                    {confirmedOrder.customerPhone}
                  </strong>
                  . Notre atelier à Cotonou prépare vos pièces.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-luxury-surface border border-luxury-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Client :</span>
                  <span className="font-semibold">
                    {confirmedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Date & Créneau :</span>
                  <span className="font-semibold">
                    {confirmedOrder.preferredDate} •{" "}
                    {confirmedOrder.preferredTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Lieu :</span>
                  <span className="font-semibold text-right">
                    {confirmedOrder.cityQuarter}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-luxury-border text-sm font-bold text-luxury-gold">
                  <span>Montant Total TTC :</span>
                  <span>
                    {formatPrice(confirmedOrder.totalCFA, currency)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const orderId = confirmedOrder.id;
                    dispatch(setCheckoutOpen({ open: false }));
                    dispatch(setEditingOrderId(orderId));
                  }}
                  className="w-full py-3 px-4 rounded-lg border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier la Commande
                </button>
                <Link
                  href={`/suivi?code=${confirmedOrder.trackingNumber}`}
                  onClick={() => dispatch(setCheckoutOpen({ open: false }))}
                  className="w-full py-3 px-4 rounded-lg bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
                >
                  Suivre ma Commande
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="font-serif text-lg text-luxury-muted">
                Votre panier de commande est actuellement vide.
              </p>
              <Link
                href="/collections"
                onClick={() => dispatch(setCheckoutOpen({ open: false }))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-luxury-gold text-white text-xs uppercase tracking-wider font-semibold"
              >
                Découvrir les Collections
              </Link>
            </div>
          ) : step === 1 ? (
            <>
              {/* Liste des articles avec mise en avant de l'article cliqué */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const isHighlighted = item.id === highlightedCartItemId;
                  const productRef = products.find(
                    (p) => p.id === item.productId
                  );
                  const availableSizes = productRef?.sizes || ALL_SIZES;
                  const availableColors = productRef?.colors.map(
                    (c) => c.name
                  ) || [item.color];

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isHighlighted
                          ? "border-luxury-gold bg-luxury-surface/90 ring-1 ring-luxury-gold"
                          : "border-luxury-border bg-luxury-bg"
                      }`}
                    >
                      {isHighlighted && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-luxury-gold mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pièce sélectionnée pour commande</span>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 rounded-lg object-cover shrink-0 border border-luxury-border"
                        />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif font-bold text-sm truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => dispatch(removeCartItem(item.id))}
                              className="text-luxury-muted hover:text-red-500 p-1"
                              aria-label="Retirer l'article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs font-bold text-luxury-gold">
                            {formatPrice(item.priceCFA, currency)}
                          </p>

                          {/* Sélecteurs directs Taille & Couleur dans le tiroir */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="block text-[10px] uppercase text-luxury-muted mb-0.5">
                                Taille
                              </label>
                              <select
                                value={item.size}
                                onChange={(e) =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      size: e.target.value as SizeType,
                                    })
                                  )
                                }
                                className="w-full bg-luxury-card border border-luxury-border rounded px-2 py-1 text-xs font-medium"
                              >
                                {availableSizes.map((sz) => (
                                  <option key={sz} value={sz}>
                                    {sz}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase text-luxury-muted mb-0.5">
                                Nuance
                              </label>
                              <select
                                value={item.color}
                                onChange={(e) =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      color: e.target.value,
                                    })
                                  )
                                }
                                className="w-full bg-luxury-card border border-luxury-border rounded px-2 py-1 text-xs font-medium"
                              >
                                {availableColors.map((col) => (
                                  <option key={col} value={col}>
                                    {col}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Quantité */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-luxury-muted">
                              Quantité :
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      quantity: item.quantity - 1,
                                    })
                                  )
                                }
                                className="w-7 h-7 rounded border border-luxury-border bg-luxury-card flex items-center justify-center hover:border-luxury-gold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                                className="w-7 h-7 rounded border border-luxury-border bg-luxury-card flex items-center justify-center hover:border-luxury-gold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ÉTAPE 2 : LIVRAISON COTONOU / INTERNATIONAL & PAIEMENT BÉNIN */
            <form
              id="checkout-form"
              onSubmit={handleConfirmAndPay}
              className="space-y-4 overflow-x-hidden"
            >
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/40 text-red-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Coordonnées Client */}
              <div className="space-y-3 p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border">
                <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold">
                  Coordonnées du Client
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Fifamè Hountondji"
                      className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                    />
                  </div>
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Téléphone Bénin / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+229 01 97 00 00 00"
                      className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Mode de Livraison / Retrait */}
              <div className="space-y-3 p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border">
                <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  Mode de Réception
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      id: "SHOWROOM_COTONOU",
                      title: "Retrait Gratuit en Showroom (Cotonou)",
                      desc: "Flagship Haie Vive ou Galerie Ganhi • Essayage sur place",
                      price: "Gratuit",
                    },
                    {
                      id: "EXPRESS_COTONOU_CALAVI",
                      title: "Livraison Express Coursier (Cotonou / Calavi)",
                      desc: "Remise en main propre en 2h à 4h",
                      price: "2 500 FCFA",
                    },
                    {
                      id: "DHL_INTERNATIONAL",
                      title: "Expédition Internationale DHL Express",
                      desc: "Afrique de l'Ouest, Europe, Amérique du Nord (72h)",
                      price: "18 500 FCFA",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        deliveryMethod === opt.id
                          ? "border-luxury-gold bg-luxury-card"
                          : "border-luxury-border bg-luxury-bg"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === opt.id}
                          onChange={() =>
                            setDeliveryMethod(opt.id as DeliveryMethod)
                          }
                          className="mt-1 accent-amber-600"
                        />
                        <div>
                          <div className="text-xs font-bold">{opt.title}</div>
                          <div className="text-[11px] text-luxury-muted">
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-luxury-gold shrink-0">
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Date & Créneau souhaités : grid-cols-1 sm:grid-cols-2 avec min-w-0 max-w-full overflow-hidden */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full min-w-0 max-w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                    />
                  </div>
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Créneau horaire
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full min-w-0 max-w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                    >
                      <option value="Matin (09h-13h)">Matin (09h-13h)</option>
                      <option value="Après-midi (14h-18h)">
                        Après-midi (14h-18h)
                      </option>
                      <option value="Soir (18h-20h)">Soir (18h-20h)</option>
                    </select>
                  </div>
                </div>

                {deliveryMethod !== "SHOWROOM_COTONOU" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="min-w-0 max-w-full overflow-hidden">
                      <label className="block text-xs font-medium mb-1">
                        Quartier / Ville
                      </label>
                      <input
                        type="text"
                        value={cityQuarter}
                        onChange={(e) => setCityQuarter(e.target.value)}
                        placeholder="Haie Vive, Ganhi, Calavi..."
                        className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                      />
                    </div>
                    <div className="min-w-0 max-w-full overflow-hidden">
                      <label className="block text-xs font-medium mb-1">
                        Adresse ou Repère
                      </label>
                      <input
                        type="text"
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        placeholder="Rue, Villa, Immeuble..."
                        className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mode de Paiement Bénin */}
              <div className="space-y-3 p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border">
                <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold">
                  Mode de Règlement Sécurisé
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: "MTN_MOMO",
                      label: "MTN Mobile Money",
                      sub: "MoMo Bénin (+229 01...)",
                      icon: Smartphone,
                    },
                    {
                      id: "CELTIIS_CASH",
                      label: "Celtiis Cash",
                      sub: "Portefeuille Bénin",
                      icon: Smartphone,
                    },
                    {
                      id: "CARTE_BANCAIRE",
                      label: "Carte Visa / Mastercard",
                      sub: "Paiement 3D Secure",
                      icon: CreditCard,
                    },
                    {
                      id: "ESPECES_LIVRAISON",
                      label: "Espèces FCFA",
                      sub: "À la livraison / Boutique",
                      icon: Banknote,
                    },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === pm.id
                            ? "border-luxury-gold bg-luxury-card"
                            : "border-luxury-border bg-luxury-bg"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === pm.id}
                          onChange={() =>
                            setPaymentMethod(pm.id as PaymentMethod)
                          }
                          className="accent-amber-600"
                        />
                        <Icon className="w-4 h-4 text-luxury-gold shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {pm.label}
                          </div>
                          <div className="text-[10px] text-luxury-muted truncate">
                            {pm.sub}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {(paymentMethod === "MTN_MOMO" ||
                  paymentMethod === "CELTIIS_CASH") && (
                  <div className="pt-1 min-w-0 max-w-full overflow-hidden">
                    <label className="block text-xs font-medium mb-1">
                      Numéro {paymentMethod === "MTN_MOMO" ? "MTN MoMo" : "Celtiis Cash"} (+229 01...)
                    </label>
                    <input
                      type="tel"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="+229 01 97 44 12 88"
                      className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                    />
                  </div>
                )}

                <div className="pt-1 min-w-0 max-w-full overflow-hidden">
                  <label className="block text-xs font-medium mb-1">
                    Instructions Atelier / Retouche souhaitée (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Ourlet pantalon, paquet cadeau..."
                    className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                  />
                </div>
              </div>

              {/* Validation explicite obligatoire */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-luxury-gold/50 bg-luxury-surface/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-amber-600 shrink-0"
                />
                <span className="text-xs text-luxury-text leading-snug">
                  Je confirme l&apos;exactitude des tailles choisies, des coordonnées
                  de livraison et j&apos;accepte le règlement de{" "}
                  <strong>{formatPrice(totalCFA, currency)}</strong>.
                </span>
              </label>
            </form>
          )}
        </div>

        {/* Pied du Tiroir (Récapitulatif & Actions) */}
        {!confirmedOrder && cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-luxury-border bg-luxury-surface/80 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span>Sous-total articles :</span>
                <span>{formatPrice(subtotalCFA, currency)}</span>
              </div>
              <div className="flex justify-between text-luxury-muted">
                <span>Livraison / Remise :</span>
                <span>
                  {shippingCFA === 0
                    ? "Gratuit (Showroom)"
                    : formatPrice(shippingCFA, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-luxury-text pt-1 border-t border-luxury-border">
                <span>Total TTC :</span>
                <span className="text-luxury-gold">
                  {formatPrice(totalCFA, currency)}
                </span>
              </div>
            </div>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors shadow-md"
              >
                Poursuivre vers Livraison & Paiement →
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-3 rounded-xl border border-luxury-border bg-luxury-card text-xs font-semibold hover:border-luxury-gold transition-colors"
                >
                  ← Retour Panier
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="sm:col-span-2 py-3.5 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Confirmer & Payer la Commande</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
