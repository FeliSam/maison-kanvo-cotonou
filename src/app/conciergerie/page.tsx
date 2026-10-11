"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Edit3,
  Save,
  Package,
  Sparkles,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateUserProfile, setEditingOrderId } from "@/store/appSlice";
import { SizeType } from "@/types";
import { formatPrice, getDeliveryLabel } from "@/utils/currency";
import { DEMO_USERS } from "@/data/initialData";

const SIZES: SizeType[] = ["XS", "S", "M", "L", "XL", "XXL", "Sur-Mesure"];

export default function ConciergerieClientPage() {
  const dispatch = useAppDispatch();
  const { currentUser, orders } = useAppSelector((s) => s.app);

  const activeUser = currentUser || DEMO_USERS.CLIENT_VIP;
  const isStaff =
    activeUser.role === "ADMIN_ATELIER" ||
    activeUser.role === "DIRECTEUR_BOUTIQUE";

  const [name, setName] = useState(activeUser.name);
  const [phone, setPhone] = useState(activeUser.phone);
  const [email, setEmail] = useState(activeUser.email);
  const [defaultSize, setDefaultSize] = useState<SizeType>(
    activeUser.defaultSize
  );
  const [cityQuarter, setCityQuarter] = useState(activeUser.cityQuarter);
  const [address, setAddress] = useState(activeUser.address);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
      setDefaultSize(currentUser.defaultSize);
      setCityQuarter(currentUser.cityQuarter);
      setAddress(currentUser.address);
    }
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        name,
        phone,
        email,
        defaultSize,
        cityQuarter,
        address,
      })
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 overflow-x-hidden">
      {/* En-tête Espace Client VIP (Sans accès Admin pour les clients) */}
      <div className="p-5 sm:p-7 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-luxury-gold font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Client & Conciergerie VIP
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-luxury-surface border border-luxury-border text-[10px] font-bold">
              {activeUser.role === "CLIENT_VIP"
                ? "Membre Cercle d'Or"
                : activeUser.role}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Bienvenue, {activeUser.name}
          </h1>
          <p className="text-xs text-luxury-muted">
            Taille privilégiée : <strong>{activeUser.defaultSize}</strong> •{" "}
            {activeUser.cityQuarter}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isStaff && (
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard Admin</span>
            </Link>
          )}
          <Link
            href="/connexion"
            className="px-4 py-2.5 rounded-xl border border-luxury-border bg-luxury-surface text-xs font-semibold hover:border-luxury-gold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Changer de Compte</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche : Profil, Taille Habituelle & Adresse Cotonou */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border space-y-4">
          <div className="flex items-center gap-2 border-b border-luxury-border pb-3">
            <User className="w-5 h-5 text-luxury-gold" />
            <h2 className="font-serif text-lg sm:text-xl font-bold">
              Mon Profil & Mensurations
            </h2>
          </div>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Profil, taille habituelle et adresse mis à jour !
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1">
                Nom & Prénom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Téléphone (+229)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Taille Habituelle
                </label>
                <select
                  value={defaultSize}
                  onChange={(e) => setDefaultSize(e.target.value as SizeType)}
                  className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm font-bold text-luxury-gold"
                >
                  {SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Email de notification
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Quartier & Ville (Bénin)
              </label>
              <input
                type="text"
                value={cityQuarter}
                onChange={(e) => setCityQuarter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Adresse complète de livraison
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer mes Préférences</span>
            </button>
          </form>
        </div>

        {/* Colonne Droite : Historique & Modification des Commandes en cours */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-luxury-gold" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Mes Commandes ({orders.length})
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs font-bold text-luxury-gold hover:underline"
            >
              + Nouvelle Commande
            </Link>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const canEdit =
                order.status !== "Livrée" && order.status !== "Annulée";
              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-luxury-border">
                    <div>
                      <span className="font-serif text-base sm:text-lg font-bold text-luxury-gold">
                        {order.trackingNumber}
                      </span>
                      <span className="text-xs text-luxury-muted ml-2">
                        • {order.preferredDate} ({order.preferredTimeSlot})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.status === "Livrée"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : order.status === "Annulée"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-amber-500/20 text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => dispatch(setEditingOrderId(order.id))}
                          className="px-3 py-1.5 rounded-lg bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-xl bg-luxury-surface/60 border border-luxury-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-luxury-text truncate">
                              {item.name}
                            </p>
                            <p className="text-luxury-muted">
                              Taille : <strong>{item.size}</strong> • Nuance :{" "}
                              <strong>{item.color}</strong> • Qté :{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-luxury-gold shrink-0">
                          {formatPrice(item.priceCFA * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-luxury-muted">
                    <span>
                      {getDeliveryLabel(order.deliveryMethod)} —{" "}
                      {order.cityQuarter}
                    </span>
                    <span className="text-sm font-bold text-luxury-gold">
                      Total TTC : {formatPrice(order.totalCFA)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
