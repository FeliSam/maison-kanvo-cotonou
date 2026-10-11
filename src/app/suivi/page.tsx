"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Edit3,
  PackageCheck,
  Truck,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setEditingOrderId } from "@/store/appSlice";
import { formatPrice, getDeliveryLabel, getPaymentLabel } from "@/utils/currency";

function SuiviContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const dispatch = useAppDispatch();
  const { orders, currency } = useAppSelector((s) => s.app);
  const [query, setQuery] = useState(initialCode);

  useEffect(() => {
    if (initialCode) setQuery(initialCode);
  }, [initialCode]);

  const filteredOrders = orders.filter((o) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      o.trackingNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 overflow-x-hidden">
      {/* En-tête & Barre de recherche de suivi */}
      <div className="p-5 sm:p-8 rounded-2xl bg-luxury-card border border-luxury-border space-y-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
            Traçabilité Temps Réel & Modification Directe
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">
            Suivi de Commande & Service Après-Vente
          </h1>
          <p className="text-xs sm:text-sm text-luxury-muted max-w-2xl">
            Saisissez votre numéro de suivi (ex: <strong>LP-MODE-84920</strong>)
            ou votre numéro de téléphone. Tant que votre commande n&apos;est pas
            livrée, vous pouvez modifier la taille, la couleur, la date ou
            l&apos;adresse à Cotonou.
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par N° (ex: LP-MODE-84920), nom ou téléphone..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-luxury-border bg-luxury-bg text-sm font-medium"
          />
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-luxury-card border border-luxury-border text-center text-sm text-luxury-muted">
            Aucune commande trouvée pour « {query} ». Essayez avec LP-MODE-84920.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const canModify =
              order.status !== "Livrée" && order.status !== "Annulée";

            return (
              <div
                key={order.id}
                className="p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border space-y-5 shadow-sm"
              >
                {/* Ligne supérieure : Numéro, Statut & Bouton Modifier la Commande */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-luxury-border">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-serif text-lg sm:text-xl font-bold text-luxury-gold">
                        {order.trackingNumber}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Livrée"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : order.status === "Annulée"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-amber-500/20 text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-luxury-muted">
                      Client :{" "}
                      <strong className="text-luxury-text">
                        {order.customerName}
                      </strong>{" "}
                      ({order.customerPhone})
                    </p>
                  </div>

                  {canModify ? (
                    <button
                      type="button"
                      onClick={() => dispatch(setEditingOrderId(order.id))}
                      className="px-4 py-2.5 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Modifier la Commande</span>
                    </button>
                  ) : (
                    <span className="text-xs text-luxury-muted italic">
                      Commande {order.status.toLowerCase()} (verrouillée)
                    </span>
                  )}
                </div>

                {/* Articles de la commande */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-luxury-surface/60 border border-luxury-border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 rounded-lg object-cover shrink-0 border border-luxury-border"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-serif text-sm font-bold truncate">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-luxury-card border border-luxury-border font-semibold">
                            Taille : {item.size}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-luxury-card border border-luxury-border font-semibold">
                            Nuance : {item.color}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-luxury-card border border-luxury-border font-semibold">
                            Qté : {item.quantity}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-luxury-gold">
                          {formatPrice(
                            item.priceCFA * item.quantity,
                            currency
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Détails Livraison & Montant Total TTC */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-luxury-bg border border-luxury-border space-y-1">
                    <span className="text-luxury-muted flex items-center gap-1.5 font-semibold">
                      <Truck className="w-3.5 h-3.5 text-luxury-gold" />
                      Mode & Créneau
                    </span>
                    <p className="font-bold text-luxury-text">
                      {getDeliveryLabel(order.deliveryMethod)}
                    </p>
                    <p className="text-luxury-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.preferredDate} • {order.preferredTimeSlot}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-luxury-bg border border-luxury-border space-y-1">
                    <span className="text-luxury-muted flex items-center gap-1.5 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                      Adresse à Cotonou / Destination
                    </span>
                    <p className="font-bold text-luxury-text">
                      {order.cityQuarter}
                    </p>
                    <p className="text-luxury-muted">{order.addressDetails}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-luxury-bg border border-luxury-border flex flex-col justify-between">
                    <div>
                      <span className="text-luxury-muted flex items-center gap-1.5 font-semibold">
                        <ShoppingBag className="w-3.5 h-3.5 text-luxury-gold" />
                        Règlement ({getPaymentLabel(order.paymentMethod)})
                      </span>
                    </div>
                    <div className="pt-2 flex items-baseline justify-between border-t border-luxury-border mt-2">
                      <span className="font-bold">Total TTC :</span>
                      <span className="font-serif text-base font-bold text-luxury-gold">
                        {formatPrice(order.totalCFA, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function SuiviPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm">
          Chargement du suivi...
        </div>
      }
    >
      <SuiviContent />
    </Suspense>
  );
}
