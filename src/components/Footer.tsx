"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-luxury-border bg-luxury-card text-luxury-text pb-20 lg:pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Colonne 1 : Identité */}
        <div className="space-y-3">
          <div className="font-serif text-xl tracking-[0.2em] font-bold">
            MAISON KANVÔ
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold">
            Haute Confection & Prêt-à-Porter • Cotonou
          </p>
          <p className="text-sm text-luxury-muted leading-relaxed">
            Silhouettes architecturales en Kanvô tissé main d&apos;Abomey, lin lavé,
            coton glacé et bazin riche. Taillé avec exigence au Bénin.
          </p>
        </div>

        {/* Colonne 2 : Showrooms Cotonou */}
        <div className="space-y-2.5 text-sm">
          <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-luxury-gold">
            Showrooms & Ateliers (Bénin)
          </h3>
          <p className="flex items-start gap-2 text-luxury-muted">
            <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
            <span>
              <strong className="text-luxury-text">Flagship Haie Vive :</strong>{" "}
              Rue des Cocotiers, à 150m de la Place du Souvenir, Cotonou
            </span>
          </p>
          <p className="flex items-start gap-2 text-luxury-muted">
            <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
            <span>
              <strong className="text-luxury-text">Galerie Ganhi :</strong>{" "}
              Avenue Steinmetz, Quartier d&apos;Affaires Ganhi, Cotonou
            </span>
          </p>
          <p className="flex items-center gap-2 text-luxury-muted">
            <Clock className="w-4 h-4 text-luxury-gold shrink-0" />
            <span>Lun – Sam : 09h00 à 20h30 (Essayage Privé)</span>
          </p>
        </div>

        {/* Colonne 3 : Navigation rapide */}
        <div className="space-y-2.5 text-sm">
          <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-luxury-gold">
            Maison & Services
          </h3>
          <ul className="space-y-2 text-luxury-muted">
            <li>
              <Link
                href="/collections"
                className="hover:text-luxury-gold transition-colors"
              >
                Catalogue & Collections Prêt-à-Porter
              </Link>
            </li>
            <li>
              <Link
                href="/sur-mesure"
                className="hover:text-luxury-gold transition-colors"
              >
                Lookbook & Salon Sur-Mesure
              </Link>
            </li>
            <li>
              <Link
                href="/suivi"
                className="hover:text-luxury-gold transition-colors"
              >
                Suivi de Commande & Modification Directe
              </Link>
            </li>
            <li>
              <Link
                href="/conciergerie"
                className="hover:text-luxury-gold transition-colors"
              >
                Espace Client VIP & Mensurations
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:text-luxury-gold transition-colors"
              >
                Portail Direction & Chef d&apos;Atelier
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Paiements & Livraison Bénin */}
        <div className="space-y-3 text-sm">
          <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-luxury-gold">
            Conciergerie & Règlement
          </h3>
          <p className="flex items-center gap-2 text-luxury-muted">
            <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
            <span>Direct Atelier : +229 01 97 44 12 88</span>
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-luxury-surface border border-luxury-border">
              MTN MoMo Bénin
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-luxury-surface border border-luxury-border">
              Celtiis Cash
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-luxury-surface border border-luxury-border">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded bg-luxury-surface border border-luxury-border">
              Espèces FCFA
            </span>
          </div>
          <p className="text-xs text-luxury-muted flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0" />
            Coursier 3h Cotonou/Calavi & DHL International
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-luxury-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-luxury-muted">
        <p>© 2026 MAISON KANVÔ COTONOU — République du Bénin. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
          Tissage Kanvô & Savoir-Faire Béninois Contemporain
        </p>
      </div>
    </footer>
  );
}
