import { CurrencyCode } from "@/types";

const RATES: Record<CurrencyCode, number> = {
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 605.0,
};

export function formatPrice(amountCFA: number, currency: CurrencyCode = "XOF"): string {
  if (currency === "XOF") {
    return `${Math.round(amountCFA)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
  }
  if (currency === "EUR") {
    const val = amountCFA * RATES.EUR;
    return `${val.toFixed(0)} €`;
  }
  const val = amountCFA * RATES.USD;
  return `$${val.toFixed(0)}`;
}

export function getShippingCostCFA(method: string): number {
  switch (method) {
    case "SHOWROOM_COTONOU":
      return 0;
    case "EXPRESS_COTONOU_CALAVI":
      return 2500;
    case "DHL_INTERNATIONAL":
      return 18500;
    default:
      return 0;
  }
}

export function getDeliveryLabel(method: string): string {
  switch (method) {
    case "SHOWROOM_COTONOU":
      return "Retrait Gratuit au Showroom (Haie Vive, Cotonou)";
    case "EXPRESS_COTONOU_CALAVI":
      return "Coursier Express Cotonou / Calavi / Porto-Novo (2 500 FCFA)";
    case "DHL_INTERNATIONAL":
      return "Expédition Internationale DHL Express (18 500 FCFA)";
    default:
      return method;
  }
}

export function getPaymentLabel(method: string): string {
  switch (method) {
    case "MTN_MOMO":
      return "MTN Mobile Money (MoMo Bénin)";
    case "CELTIIS_CASH":
      return "Celtiis Cash Bénin";
    case "CARTE_BANCAIRE":
      return "Carte Bancaire (Visa / Mastercard)";
    case "ESPECES_LIVRAISON":
      return "Espèces FCFA (Livraison / Showroom)";
    default:
      return method;
  }
}
