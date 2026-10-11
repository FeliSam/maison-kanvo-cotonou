"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Search,
  Upload,
  X,
  Save,
  Layers,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setEditingOrderId,
  updateOrder,
  upsertProduct,
  deleteProduct,
  setAnyModalOpen,
} from "@/store/appSlice";
import {
  CategoryType,
  OrderStatus,
  Product,
  SizeType,
} from "@/types";
import { formatPrice } from "@/utils/currency";

const ALL_CATEGORIES: CategoryType[] = [
  "Femme",
  "Homme",
  "Édition Kanvô & Héritage",
  "Accessoires & Maroquinerie",
];

const ALL_SIZES: SizeType[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Sur-Mesure",
];

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { orders, products, currentUser } = useAppSelector((s) => s.app);

  const [activeTab, setActiveTab] = useState<"orders" | "catalogue">("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TOUTES");

  // États Modale CRUD Produit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodSubtitle, setProdSubtitle] = useState("");
  const [prodCategory, setProdCategory] = useState<CategoryType>(
    "Édition Kanvô & Héritage"
  );
  const [prodPriceCFA, setProdPriceCFA] = useState<number>(85000);
  const [prodSizes, setProdSizes] = useState<SizeType[]>([
    "S",
    "M",
    "L",
    "XL",
    "Sur-Mesure",
  ]);
  const [prodMaterial, setProdMaterial] = useState(
    "Kanvô tissé main d'Abomey & Lin lavé"
  );
  const [prodOrigin, setProdOrigin] = useState(
    "Atelier Haie Vive, Cotonou, République du Bénin"
  );
  const [prodCutDetails, setProdCutDetails] = useState("");
  const [prodCare, setProdCare] = useState(
    "Nettoyage à sec ou lavage main 30°C."
  );
  const [prodDelivery, setProdDelivery] = useState(
    "Retrait Showroom Cotonou, Coursier Express 3h ou DHL."
  );
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Contrôle d'accès strict : Le client n'a pas accès au Dashboard Admin
  const isAuthorizedStaff =
    currentUser?.role === "ADMIN_ATELIER" ||
    currentUser?.role === "DIRECTEUR_BOUTIQUE";

  if (!isAuthorizedStaff) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-5">
        <div className="p-6 sm:p-8 rounded-2xl bg-luxury-card border border-luxury-border shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-luxury-gold font-bold block">
            Accès Restreint • Direction & Atelier
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Espace Réservé à l&apos;Administration
          </h1>
          <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
            Les comptes <strong>Clients</strong> n&apos;ont pas accès au
            Dashboard Administrateur. Pour gérer vos commandes ou votre profil,
            rendez-vous dans votre Espace Client VIP, ou connectez-vous avec un
            profil <strong>Directeur / Chef d&apos;Atelier</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/conciergerie"
              className="py-3 px-4 rounded-xl border border-luxury-border bg-luxury-surface text-luxury-text text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-luxury-gold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Mon Espace Client</span>
            </Link>
            <Link
              href="/connexion"
              className="py-3 px-4 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center justify-center"
            >
              Changer de Rôle (Admin)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistiques Temps Réel
  const validOrders = orders.filter((o) => o.status !== "Annulée");
  const totalRevenueCFA = validOrders.reduce((acc, o) => acc + o.totalCFA, 0);
  const confirmedCount = orders.filter((o) => o.status === "Confirmée").length;
  const prepCount = orders.filter(
    (o) =>
      o.status === "En préparation Atelier" ||
      o.status === "Prête / En coursier"
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "Livrée").length;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "TOUTES" && o.status !== statusFilter) return false;
    if (orderSearch.trim() !== "") {
      const q = orderSearch.toLowerCase();
      return (
        o.trackingNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.cityQuarter.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    dispatch(
      updateOrder({
        ...target,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  const openCreateProductModal = () => {
    setEditingProdId(null);
    setProdName("");
    setProdSubtitle("");
    setProdCategory("Édition Kanvô & Héritage");
    setProdPriceCFA(90000);
    setProdSizes(["S", "M", "L", "XL", "Sur-Mesure"]);
    setProdMaterial("Kanvô tissé main du Bénin & Coton glacé");
    setProdOrigin("Atelier Maison Kanvô — Haie Vive, Cotonou");
    setProdCutDetails(
      "Coupe contemporaine structurée avec finitions main en atelier."
    );
    setProdCare("Lavage délicat à froid ou pressing.");
    setProdDelivery(
      "Disponible au Showroom Cotonou et par coursier express."
    );
    setProdImages([
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    ]);
    setIsProductModalOpen(true);
    dispatch(setAnyModalOpen(true));
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProdId(prod.id);
    setProdName(prod.name);
    setProdSubtitle(prod.subtitle);
    setProdCategory(prod.category);
    setProdPriceCFA(prod.priceCFA);
    setProdSizes(prod.sizes);
    setProdMaterial(prod.material);
    setProdOrigin(prod.origin);
    setProdCutDetails(prod.cutDetails);
    setProdCare(prod.careInstructions);
    setProdDelivery(prod.deliveryInfo);
    setProdImages(prod.images);
    setIsProductModalOpen(true);
    dispatch(setAnyModalOpen(true));
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    dispatch(setAnyModalOpen(false));
  };

  const toggleProdSize = (sz: SizeType) => {
    if (prodSizes.includes(sz)) {
      if (prodSizes.length > 1) {
        setProdSizes(prodSizes.filter((s) => s !== sz));
      }
    } else {
      setProdSizes([...prodSizes, sz]);
    }
  };

  const handleLocalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProdImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setProdImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const existing = products.find((p) => p.id === editingProdId);
    const slug =
      existing?.slug ||
      prodName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Math.floor(100 + Math.random() * 900);

    const savedProduct: Product = {
      id: editingProdId || `prod-${Date.now()}`,
      slug,
      name: prodName.trim(),
      subtitle:
        prodSubtitle.trim() ||
        "Création contemporaine confectionnée à Cotonou.",
      category: prodCategory,
      priceCFA: Number(prodPriceCFA) || 65000,
      rating: existing?.rating || 5.0,
      reviewCount: existing?.reviewCount || 1,
      sizes: prodSizes,
      colors: existing?.colors || [
        { name: "Ocre Royal", hex: "#C28840" },
        { name: "Ivoire Solaire", hex: "#F5EFE6" },
        { name: "Noir Obsidienne", hex: "#191919" },
      ],
      material: prodMaterial,
      origin: prodOrigin,
      cutDetails: prodCutDetails,
      careInstructions: prodCare,
      deliveryInfo: prodDelivery,
      images:
        prodImages.length > 0
          ? prodImages
          : [
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
            ],
      stockStatus: "En Stock Atelier",
    };

    dispatch(upsertProduct(savedProduct));
    closeProductModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 overflow-x-hidden">
      {/* En-tête Dashboard Admin */}
      <div className="p-5 sm:p-6 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-luxury-gold font-bold">
            Direction Showroom & Atelier de Confection • Cotonou
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
            Dashboard Administrateur & Chef d&apos;Atelier
          </h1>
          <p className="text-xs text-luxury-muted mt-1">
            Session active :{" "}
            <strong className="text-luxury-text">{currentUser?.name}</strong> •
            Pilotage temps réel des ventes en FCFA (XOF) et du catalogue.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "orders"
                ? "bg-luxury-gold text-white"
                : "bg-luxury-surface text-luxury-text border border-luxury-border"
            }`}
          >
            Commandes ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalogue")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "catalogue"
                ? "bg-luxury-gold text-white"
                : "bg-luxury-surface text-luxury-text border border-luxury-border"
            }`}
          >
            Catalogue Articles CRUD ({products.length})
          </button>
        </div>
      </div>

      {/* KPIs Temps Réel en FCFA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-1">
          <div className="flex items-center justify-between text-xs text-luxury-muted">
            <span>Chiffre d&apos;Affaires (XOF)</span>
            <TrendingUp className="w-4 h-4 text-luxury-gold" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-luxury-gold">
            {formatPrice(totalRevenueCFA)}
          </div>
          <div className="text-[11px] text-luxury-muted">
            Total TTC hors annulations
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-1">
          <div className="flex items-center justify-between text-xs text-luxury-muted">
            <span>Commandes Confirmées</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-luxury-muted">
            Nouvelles commandes à lancer
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-1">
          <div className="flex items-center justify-between text-xs text-luxury-muted">
            <span>En Préparation Atelier</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold">
            {prepCount}
          </div>
          <div className="text-[11px] text-luxury-muted">
            Coupe, retouches & coursier
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-1">
          <div className="flex items-center justify-between text-xs text-luxury-muted">
            <span>Commandes Livrées</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-500">
            {deliveredCount}
          </div>
          <div className="text-[11px] text-luxury-muted">
            Remises à Cotonou & DHL
          </div>
        </div>
      </div>

      {/* ONGLET 1 : GESTION DES COMMANDES */}
      {activeTab === "orders" ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Rechercher une commande (LP-MODE-..., client, téléphone, quartier)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-luxury-border bg-luxury-bg text-xs sm:text-sm font-semibold"
            >
              <option value="TOUTES">Tous les statuts ({orders.length})</option>
              <option value="Confirmée">Confirmée</option>
              <option value="En préparation Atelier">
                En préparation Atelier
              </option>
              <option value="Prête / En coursier">Prête / En coursier</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-luxury-border">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg font-bold text-luxury-gold">
                        {order.trackingNumber}
                      </span>
                      <span className="text-xs font-bold text-luxury-text">
                        • {order.customerName} ({order.customerPhone})
                      </span>
                    </div>
                    <p className="text-xs text-luxury-muted mt-0.5">
                      Lieu : {order.cityQuarter} ({order.addressDetails}) •
                      Créneau : {order.preferredDate} -{" "}
                      {order.preferredTimeSlot}
                    </p>
                  </div>

                  {/* Actions Admin : Changer Statut ou Ouvrir Modale Modification Complète */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label="Statut de la commande"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="px-3 py-2 rounded-xl border border-luxury-border bg-luxury-surface text-xs font-bold"
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

                    <button
                      type="button"
                      onClick={() => dispatch(setEditingOrderId(order.id))}
                      className="px-3.5 py-2 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier la Commande</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-luxury-surface/50 border border-luxury-border text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-12 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold truncate">{item.name}</div>
                          <div className="text-luxury-muted">
                            Taille {item.size} • {item.color} • x{item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-luxury-gold shrink-0">
                        {formatPrice(item.priceCFA * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-luxury-muted">
                    {order.notes
                      ? `Note atelier : « ${order.notes} »`
                      : "Aucune consigne particulière"}
                  </span>
                  <span className="font-serif text-base font-bold text-luxury-gold">
                    Total TTC : {formatPrice(order.totalCFA)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ONGLET 2 : GESTION DU CATALOGUE ARTICLES (CRUD COMPLET) */
        <div className="space-y-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-luxury-gold" />
                <span>Catalogue Prêt-à-Porter ({products.length} articles)</span>
              </h2>
              <p className="text-xs text-luxury-muted">
                Ajoutez, modifiez ou supprimez des articles (synchronisation
                immédiate sur toute la boutique).
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateProductModal}
              className="px-4 py-2.5 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Nouvel Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-luxury-card border border-luxury-border flex flex-col justify-between gap-4"
              >
                <div className="flex gap-3.5">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-20 h-24 rounded-xl object-cover shrink-0 border border-luxury-border"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold block truncate">
                      {prod.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-bold truncate">
                      {prod.name}
                    </h3>
                    <p className="text-sm font-bold text-luxury-gold">
                      {formatPrice(prod.priceCFA)}
                    </p>
                    <p className="text-[11px] text-luxury-muted truncate">
                      Tailles : {prod.sizes.join(", ")}
                    </p>
                    <p className="text-[11px] text-luxury-muted">
                      Galerie : {prod.images.length} photo(s) • ★{" "}
                      {prod.rating.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-luxury-border">
                  <button
                    type="button"
                    onClick={() => openEditProductModal(prod)}
                    className="py-2 px-3 rounded-lg border border-luxury-border bg-luxury-surface hover:border-luxury-gold text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Éditer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteProduct(prod.id))}
                    className="py-2 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALE CRUD CRÉATION / ÉDITION ARTICLE */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-[130] overflow-x-hidden flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl max-h-[90vh] bg-luxury-card text-luxury-text border border-luxury-border rounded-2xl shadow-2xl flex flex-col overflow-x-hidden">
            <div className="p-4 sm:p-5 border-b border-luxury-border flex items-center justify-between bg-luxury-surface/70">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold block">
                  Catalogue Maison Kanvô Cotonou
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  {editingProdId
                    ? "Modifier l'Article de Prêt-à-Porter"
                    : "Ajouter un Nouvel Article au Showroom"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeProductModal}
                className="p-2 rounded-full border border-luxury-border hover:border-luxury-gold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Nom de la Pièce *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Ex: Veste Kanvô Impériale"
                    className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) =>
                      setProdCategory(e.target.value as CategoryType)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Prix en FCFA (XOF) *
                  </label>
                  <input
                    type="number"
                    required
                    min={5000}
                    step={500}
                    value={prodPriceCFA}
                    onChange={(e) => setProdPriceCFA(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm font-bold text-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Matière & Tissage
                  </label>
                  <input
                    type="text"
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Sous-titre descriptif court
                </label>
                <input
                  type="text"
                  value={prodSubtitle}
                  onChange={(e) => setProdSubtitle(e.target.value)}
                  placeholder="Ex: Tissage artisanal d'Abomey et coupe contemporaine..."
                  className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>

              {/* Sélection des tailles disponibles */}
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Tailles Disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((sz) => {
                    const active = prodSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleProdSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          active
                            ? "bg-luxury-gold text-white border-luxury-gold"
                            : "bg-luxury-bg text-luxury-muted border-luxury-border"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Détails de la coupe
                </label>
                <textarea
                  rows={2}
                  value={prodCutDetails}
                  onChange={(e) => setProdCutDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-luxury-border bg-luxury-bg text-sm"
                />
              </div>

              {/* Galerie Multi-Photos (Fichier local Base64 ou URL) */}
              <div className="p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border space-y-3">
                <label className="block text-xs font-bold text-luxury-gold flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  Galerie Photos de l&apos;Article (Fichier local ou URL)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLocalPhotoUpload}
                  className="block w-full text-xs text-luxury-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-luxury-gold file:text-white cursor-pointer"
                />

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Ou ajouter une URL d'image HD..."
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-luxury-border bg-luxury-card text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border hover:border-luxury-gold text-xs font-semibold shrink-0"
                  >
                    + Ajouter URL
                  </button>
                </div>

                {prodImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {prodImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden border border-luxury-border"
                      >
                        <img
                          src={img}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProdImages(
                              prodImages.filter((_, idx) => idx !== i)
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-luxury-border">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-4 py-2.5 rounded-xl border border-luxury-border bg-luxury-card text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-luxury-gold text-white hover:bg-luxury-goldHover text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer l&apos;Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
