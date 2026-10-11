"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  ShieldCheck,
  Store,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCurrentUser } from "@/store/appSlice";
import { DEMO_USERS } from "@/data/initialData";
import { SizeType, UserRole } from "@/types";

export default function ConnexionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.app.currentUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+229 01 ");
  const [role, setRole] = useState<UserRole>("CLIENT_VIP");
  const [defaultSize, setDefaultSize] = useState<SizeType>("M");
  const [cityQuarter, setCityQuarter] = useState("Haie Vive, Cotonou");

  const handleQuickDemoLogin = (key: keyof typeof DEMO_USERS) => {
    const profile = DEMO_USERS[key];
    dispatch(setCurrentUser(profile));
    if (
      profile.role === "ADMIN_ATELIER" ||
      profile.role === "DIRECTEUR_BOUTIQUE"
    ) {
      router.push("/admin");
    } else {
      router.push("/conciergerie");
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    dispatch(
      setCurrentUser({
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        defaultSize,
        cityQuarter,
        address: cityQuarter,
        memberSince: "Octobre 2026",
        vipCode: "CERCLE-OR-229",
      })
    );

    if (role === "ADMIN_ATELIER" || role === "DIRECTEUR_BOUTIQUE") {
      router.push("/admin");
    } else {
      router.push("/conciergerie");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 overflow-x-hidden">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.22em] text-luxury-gold font-bold">
          Portail d&apos;Accès Multi-Rôles • Maison Kanvô Cotonou
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          Connexion & Accès Démonstration 1-Clic
        </h1>
        <p className="text-xs sm:text-sm text-luxury-muted">
          Basculez instantanément entre l&apos;espace Client VIP, le profil
          Directeur de Boutique ou le Dashboard Chef d&apos;Atelier.
        </p>
      </div>

      {/* Cartes de Connexion Rapide 1-Clic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Client VIP */}
        <div className="p-5 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4 hover:border-luxury-gold transition-all">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-luxury-surface border border-luxury-border flex items-center justify-center text-luxury-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
              Rôle 1 • Espace Clientèle
            </span>
            <h2 className="font-serif text-lg font-bold">
              Client VIP (Cotonou)
            </h2>
            <p className="text-xs text-luxury-muted leading-relaxed">
              Accédez au suivi de vos commandes, modifiez une taille ou une date
              de livraison, et gérez vos mensurations habituelles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("CLIENT_VIP")}
            className="w-full py-3 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Connexion 1-Clic Client VIP
          </button>
        </div>

        {/* 2. Directeur / Gérant de Boutique */}
        <div className="p-5 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4 hover:border-luxury-gold transition-all">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-luxury-surface border border-luxury-border flex items-center justify-center text-luxury-gold">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
              Rôle 2 • Gestion Showroom
            </span>
            <h2 className="font-serif text-lg font-bold">
              Directeur / Gérant de Boutique
            </h2>
            <p className="text-xs text-luxury-muted leading-relaxed">
              Pilotez le chiffre d&apos;affaires en FCFA, validez les commandes
              clients et supervisez les livraisons Cotonou / DHL.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("DIRECTEUR_BOUTIQUE")}
            className="w-full py-3 px-4 rounded-xl border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Connexion 1-Clic Directeur
          </button>
        </div>

        {/* 3. Administrateur / Chef d'Atelier */}
        <div className="p-5 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4 hover:border-luxury-gold transition-all">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-luxury-surface border border-luxury-border flex items-center justify-center text-luxury-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
              Rôle 3 • Administration & Atelier
            </span>
            <h2 className="font-serif text-lg font-bold">
              Administrateur / Chef d&apos;Atelier
            </h2>
            <p className="text-xs text-luxury-muted leading-relaxed">
              CRUD complet du catalogue d&apos;articles (ajout photos, prix
              FCFA, tailles), gestion des commandes et suivi de production.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("ADMIN_ATELIER")}
            className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Connexion 1-Clic Chef d&apos;Atelier
          </button>
        </div>
      </div>

      {/* Formulaire de connexion / création de compte personnalisé */}
      <div className="p-5 sm:p-8 rounded-2xl bg-luxury-card border border-luxury-border space-y-5">
        <div className="flex items-center justify-between border-b border-luxury-border pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              <LogIn className="w-5 h-5 text-luxury-gold" />
              <span>Inscription ou Connexion Personnalisée</span>
            </h3>
            {currentUser && (
              <p className="text-xs text-luxury-muted mt-1">
                Actuellement connecté en tant que :{" "}
                <strong className="text-luxury-gold">{currentUser.name}</strong>{" "}
                ({currentUser.role})
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                Nom Complet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sèna Ahouandjinou"
                className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@benin-luxe.bj"
                className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                Téléphone (+229)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Taille Habituelle
              </label>
              <select
                value={defaultSize}
                onChange={(e) => setDefaultSize(e.target.value as SizeType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              >
                {["XS", "S", "M", "L", "XL", "XXL", "Sur-Mesure"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Rôle souhaité
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              >
                <option value="CLIENT_VIP">Client VIP</option>
                <option value="DIRECTEUR_BOUTIQUE">
                  Directeur / Gérant de Boutique
                </option>
                <option value="ADMIN_ATELIER">
                  Administrateur / Chef d&apos;Atelier
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Quartier / Adresse à Cotonou
            </label>
            <input
              type="text"
              value={cityQuarter}
              onChange={(e) => setCityQuarter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Ouvrir ma Session</span>
          </button>
        </form>
      </div>
    </div>
  );
}
