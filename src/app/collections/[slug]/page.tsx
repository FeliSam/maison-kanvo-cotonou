import React from "react";
import { INITIAL_PRODUCTS } from "@/data/initialData";
import ProductDetailClient from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProductDetailClient slug={params.slug} />;
}
