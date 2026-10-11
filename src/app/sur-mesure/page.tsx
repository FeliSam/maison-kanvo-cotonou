"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addBespokeRequest } from "@/store/appSlice";

export default function SurMesurePage() {
  const dispatch = useAppDispatch();
  const { bespokeRequests, currentUser } = useAppSelector((s) => s.app);

  const [clientName, setClientName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "+229 01 ");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [garmentType, setGarmentType] = useState(
    "Ensemble Kanvô & Lin Sur-Mesure"
  );
  const [fabricPreference, setFabricPreference] = useState(
    "Kanvô Royal Tissé Main (Abomey)"
  );
  const [appointmentDate, setAppointmentDate] = useState("2026-10-16");
  const [appointmentTime, setAppointmentTime] = useState("15:00");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) return;

    dispatch(
      addBespokeRequest({
        id: `bsp-${Date.now()}`,
        clientName: clientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        garmentType,
        fabricPreference,
        appointmentDate,
        appointmentTime,
        notes: notes.trim(),
        status: "Confirmé au Showroom",
        createdAt: new Date().toISOString().split("T")[0],
      })
    );
    setSubmitted(true);
    setNotes("");
  };

  const lookbookItems = [
    {
      title: "Silhouette I — L'Architecte d'Abomey",
      fabric: "Kanvô Ocre Royal & Lin Lavé",
      desc: "Coupe structurée à col officier asymétrique pour réceptions et sommets officiels.",
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
      slug: "ensemble-kanvo-royal-abomey",
    },
    {
      title: "Silhouette II — Soirée sur la Marina",
      fabric: "Bazin Riche Glacé & Organza de Soie",
      desc: "Drapé sculptural brodé au fil d'or dans notre atelier de Ganhi.",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
      slug: "robe-sculpturale-ganhi-bazin-soie",
    },
    {
      title: "Silhouette III — Saharienne Diplomatique",
      fabric: "Pur Lin & Coton Peigné du Nord-Bénin",
      desc: "Allure croisée légère pensée pour le climat tropical de Cotonou.",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      slug: "costume-croise-lin-haie-vive",
    },
  ];

  return (
    <div className="space-y-12 pb-12 overflow-x-hidden">
      {/* Bannière avec overlay sombre dégradé et texte clair */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
          alt="Lookbook & Salon Sur-Mesure Cotonou"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto text-white space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Lookbook 2026 & Salon Privé de Couture
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Lookbook Éditorial & Sur-Mesure
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 max-w-xl leading-relaxed">
            Découvrez nos silhouettes phares et réservez votre séance de prise
            de mesures au Showroom Haie Vive ou Ganhi à Cotonou.
          </p>
        </div>
      </section>

      {/* Galerie Lookbook */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold">
            Édition Cotonou • Abomey • Porto-Novo
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            Silhouettes Contemporaines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-luxury-card border border-luxury-border flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                    {item.fabric}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-200 mt-1">{item.desc}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <Link
                  href={`/collections/${item.slug}`}
                  className="text-xs font-bold text-luxury-gold hover:underline flex items-center gap-1.5"
                >
                  <span>Commander cette silhouette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire de Rendez-vous Essayage & Sur-Mesure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border space-y-5">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold flex items-center gap-1.5">
              <Scissors className="w-4 h-4" />
              Prise de Mesures & Essayage Privé
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              Réserver un Créneau au Showroom (Cotonou)
            </h2>
          </div>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Votre rendez-vous Sur-Mesure est confirmé au Showroom Haie Vive !
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Marc-Aurèle Soglo"
                  className="w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Téléphone WhatsApp (+229) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+229 01 97 00 00 00"
                  className="w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Type de création souhaitée
                </label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                >
                  <option value="Ensemble Kanvô & Lin Sur-Mesure">
                    Ensemble Kanvô & Lin Sur-Mesure
                  </option>
                  <option value="Robe de Gala Bazin & Soie">
                    Robe de Gala Bazin & Soie
                  </option>
                  <option value="Costume Saharienne Haie Vive">
                    Costume Saharienne Haie Vive
                  </option>
                  <option value="Kaftan Impérial Cérémonie">
                    Kaftan Impérial Cérémonie
                  </option>
                </select>
              </div>
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Étoffe privilégiée
                </label>
                <select
                  value={fabricPreference}
                  onChange={(e) => setFabricPreference(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                >
                  <option value="Kanvô Royal Tissé Main (Abomey)">
                    Kanvô Royal Tissé Main (Abomey)
                  </option>
                  <option value="Bazin Riche Glacé 1er Choix">
                    Bazin Riche Glacé 1er Choix
                  </option>
                  <option value="Lin Belge & Coton Bio Bénin">
                    Lin Belge & Coton Bio Bénin
                  </option>
                  <option value="Soie Lavée & Broderie Fil d'Or">
                    Soie Lavée & Broderie Fil d&apos;Or
                  </option>
                </select>
              </div>
            </div>

            {/* Règle stricte mobile : Date & Heure empilées en grid-cols-1 sm:grid-cols-2 avec min-w-0 max-w-full overflow-hidden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Date du rendez-vous essayage
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full min-w-0 max-w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>
              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="block text-xs font-medium mb-1">
                  Heure souhaitée
                </label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full min-w-0 max-w-full px-3 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Mensurations connues ou précisions événement
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Mariage à Ouidah, réception diplomatique, mensurations habituelles..."
                className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors shadow-md"
            >
              Confirmer mon Rendez-vous Sur-Mesure
            </button>
          </form>
        </div>

        {/* Liste des rendez-vous programmés */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border space-y-4">
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-luxury-gold" />
              <span>Vos Séances Programmées</span>
            </h3>
            <div className="space-y-3">
              {bespokeRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-luxury-surface border border-luxury-border space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-luxury-text">
                      {req.clientName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold font-semibold text-[10px]">
                      {req.status}
                    </span>
                  </div>
                  <p className="font-medium text-luxury-text">
                    {req.garmentType} • {req.fabricPreference}
                  </p>
                  <p className="text-luxury-muted">
                    Date : {req.appointmentDate} à {req.appointmentTime}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-luxury-bg border border-luxury-border text-xs space-y-1">
              <div className="font-bold text-luxury-gold flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Salon Privé Haie Vive, Cotonou
              </div>
              <p className="text-luxury-muted">
                Accueil personnalisé avec rafraîchissement, présentation de la
                tissuthèque Kanvô et prise de 18 mesures corporelles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
