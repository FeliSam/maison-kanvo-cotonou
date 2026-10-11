"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setEditingOrderId, updateOrder } from "@/store/appSlice";
import {
  CartItem,
  DeliveryMethod,
  OrderStatus,
  SizeType,
} from "@/types";
import { formatPrice, getShippingCostCFA } from "@/utils/currency";

const SIZES: SizeType[] = ["XS", "S", "M", "L", "XL", "XXL", "Sur-Mesure"];

export default function EditOrderModal() {
  const dispatch = useAppDispatch();
  const {
    editingOrderId,
    orders,
    products,
    currency,
    currentUser,
  } = useAppSelector((s) => s.app);

  const orderToEdit = orders.find((o) => o.id === editingOrderId);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cityQuarter, setCityQuarter] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    "EXPRESS_COTONOU_CALAVI"
  );
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  const [status, setStatus] = useState<OrderStatus>("Confirmée");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customerName);
      setCustomerPhone(orderToEdit.customerPhone);
      setCityQuarter(orderToEdit.cityQuarter);
      setAddressDetails(orderToEdit.addressDetails);
      setDeliveryMethod(orderToEdit.deliveryMethod);
      setPreferredDate(orderToEdit.preferredDate);
      setPreferredTimeSlot(orderToEdit.preferredTimeSlot);
      setStatus(orderToEdit.status);
      setNotes(orderToEdit.notes || "");
      setItems(orderToEdit.items.map((item) => ({ ...item })));
      setSavedBanner(false);
    }
  }, [orderToEdit]);

  if (!editingOrderId || !orderToEdit) return null;

  const isStaff =
    currentUser?.role === "ADMIN_ATELIER" ||
    currentUser?.role === "DIRECTEUR_BOUTIQUE";

  const subtotalCFA = items.reduce(
    (sum, item) => sum + item.priceCFA * item.quantity,
    0
  );
  const shippingCFA = getShippingCostCFA(deliveryMethod);
  const totalCFA = subtotalCFA + shippingCFA;

  const handleItemProductChange = (index: number, newProductId: string) => {
    const prod = products.find((p) => p.id === newProductId);
    if (!prod) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      slug: prod.slug,
      name: prod.name,
      category: prod.category,
      priceCFA: prod.priceCFA,
      image: prod.images[0] || "",
      size: prod.sizes[0] || "M",
      color: prod.colors[0]?.name || "Classique",
    };
    setItems(updated);
  };

  const handleAddAnotherItem = () => {
    const firstProd = products[0];
    if (!firstProd) return;
    setItems([
      ...items,
      {
        id: `${firstProd.id}-${Date.now()}`,
        productId: firstProd.id,
        slug: firstProd.slug,
        name: firstProd.name,
        category: firstProd.category,
        priceCFA: firstProd.priceCFA,
        image: firstProd.images[0] || "",
        size: firstProd.sizes[0] || "M",
        color: firstProd.colors[0]?.name || "Classique",
        quantity: 1,
      },
    ]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    dispatch(
      updateOrder({
        ...orderToEdit,
        customerName,
        customerPhone,
        cityQuarter,
        addressDetails,
        deliveryMethod,
        preferredDate,
        preferredTimeSlot,
        status,
        notes,
        items,
        subtotalCFA,
        shippingCFA,
        totalCFA,
        updatedAt: new Date().toISOString(),
      })
    );
    setSavedBanner(true);
    setTimeout(() => {
      dispatch(setEditingOrderId(null));
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-[130] overflow-x-hidden flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Modifier la Commande"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-luxury-card text-luxury-text border border-luxury-border rounded-2xl shadow-2xl flex flex-col overflow-x-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-luxury-border flex items-center justify-between bg-luxury-surface/70">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold block">
              Modification Dynamique • Recalcul Temps Réel
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold">
              Modifier la Commande {orderToEdit.trackingNumber}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setEditingOrderId(null))}
            className="p-2 rounded-full border border-luxury-border bg-luxury-card hover:border-luxury-gold"
            aria-label="Fermer la modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-5"
        >
          {savedBanner && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Modifications enregistrées et montant TTC recalculé avec succès !
            </div>
          )}

          {/* Articles de la commande */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold">
                1. Articles, Tailles & Couleurs
              </h3>
              <button
                type="button"
                onClick={handleAddAnotherItem}
                className="text-xs font-semibold text-luxury-gold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter une pièce
              </button>
            </div>

            {items.map((item, idx) => {
              const prod = products.find((p) => p.id === item.productId);
              const colorList = prod?.colors.map((c) => c.name) || [item.color];
              const sizeList = prod?.sizes || SIZES;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="p-3.5 rounded-xl border border-luxury-border bg-luxury-surface/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemProductChange(idx, e.target.value)
                      }
                      className="flex-1 min-w-0 bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatPrice(p.priceCFA, currency)}
                        </option>
                      ))}
                    </select>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        title="Retirer cet article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] uppercase text-luxury-muted mb-1">
                        Taille
                      </label>
                      <select
                        value={item.size}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx] = {
                            ...next[idx],
                            size: e.target.value as SizeType,
                          };
                          setItems(next);
                        }}
                        className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      >
                        {sizeList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-luxury-muted mb-1">
                        Couleur / Nuance
                      </label>
                      <select
                        value={item.color}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx] = { ...next[idx], color: e.target.value };
                          setItems(next);
                        }}
                        className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      >
                        {colorList.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-luxury-muted mb-1">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = Math.max(1, Number(e.target.value) || 1);
                          const next = [...items];
                          next[idx] = { ...next[idx], quantity: qty };
                          setItems(next);
                        }}
                        className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Livraison, Date & Créneau (Règle stricte mobile : grid-cols-1 sm:grid-cols-2 min-w-0 max-w-full overflow-hidden) */}
          <div className="space-y-3 p-3.5 rounded-xl border border-luxury-border bg-luxury-surface/40">
            <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold">
              2. Livraison, Date & Adresse à Cotonou
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Mode de livraison
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) =>
                    setDeliveryMethod(e.target.value as DeliveryMethod)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-xs sm:text-sm"
                >
                  <option value="SHOWROOM_COTONOU">
                    Retrait Showroom Cotonou (0 FCFA)
                  </option>
                  <option value="EXPRESS_COTONOU_CALAVI">
                    Coursier Cotonou / Calavi (2 500 FCFA)
                  </option>
                  <option value="DHL_INTERNATIONAL">
                    DHL International (18 500 FCFA)
                  </option>
                </select>
              </div>

              {isStaff && (
                <div className="min-w-0 max-w-full overflow-hidden">
                  <label className="block text-xs font-medium mb-1">
                    Statut de la Commande (Admin)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-luxury-gold bg-luxury-card text-xs sm:text-sm font-bold"
                  >
                    <option value="Confirmée">Confirmée</option>
                    <option value="En préparation Atelier">
                      En préparation Atelier
                    </option>
                    <option value="Prête / En coursier">
                      Prête / En coursier
                    </option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Date de livraison / retrait
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Quartier / Ville
                </label>
                <input
                  type="text"
                  value={cityQuarter}
                  onChange={(e) => setCityQuarter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                />
              </div>
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Adresse exacte
                </label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                />
              </div>
            </div>
          </div>

          {/* Coordonnées du client */}
          <div className="space-y-3 p-3.5 rounded-xl border border-luxury-border bg-luxury-surface/40">
            <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-gold">
              3. Coordonnées du Client & Notes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                />
              </div>
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Téléphone (+229)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Instructions spécifiques (ourlet, mensurations...)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-luxury-border bg-luxury-card text-sm"
              />
            </div>
          </div>

          {/* Nouveau Total Recalculé */}
          <div className="p-4 rounded-xl bg-luxury-surface border border-luxury-gold/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-luxury-muted block">
                Nouveau Montant Total TTC Recalculé
              </span>
              <span className="font-serif text-xl font-bold text-luxury-gold">
                {formatPrice(totalCFA, currency)}{" "}
                <span className="text-xs text-luxury-muted font-sans font-normal">
                  ({formatPrice(totalCFA, "XOF")})
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(setEditingOrderId(null))}
                className="px-4 py-2.5 rounded-lg border border-luxury-border bg-luxury-card text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                Enregistrer les Modifications
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
