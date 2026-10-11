import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, Order, ProductReview } from "@/types";
import {
  AppState,
  upsertProduct,
  deleteProduct,
  updateOrder,
  createOrder,
  addReview,
} from "./appSlice";

export const maisonApi = createApi({
  reducerPath: "maisonApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products", "Orders", "Reviews"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: (_arg, api) => {
        const state = api.getState() as { app: AppState };
        return { data: state.app.products };
      },
      providesTags: ["Products"],
    }),
    getOrders: builder.query<Order[], void>({
      queryFn: (_arg, api) => {
        const state = api.getState() as { app: AppState };
        return { data: state.app.orders };
      },
      providesTags: ["Orders"],
    }),
    saveProduct: builder.mutation<Product, Product>({
      queryFn: (product, api) => {
        api.dispatch(upsertProduct(product));
        return { data: product };
      },
      invalidatesTags: ["Products"],
    }),
    removeProduct: builder.mutation<string, string>({
      queryFn: (id, api) => {
        api.dispatch(deleteProduct(id));
        return { data: id };
      },
      invalidatesTags: ["Products"],
    }),
    submitOrder: builder.mutation<Order, Order>({
      queryFn: (order, api) => {
        api.dispatch(createOrder(order));
        return { data: order };
      },
      invalidatesTags: ["Orders"],
    }),
    modifyOrder: builder.mutation<Order, Order>({
      queryFn: (order, api) => {
        api.dispatch(updateOrder(order));
        return { data: order };
      },
      invalidatesTags: ["Orders"],
    }),
    submitReview: builder.mutation<ProductReview, ProductReview>({
      queryFn: (review, api) => {
        api.dispatch(addReview(review));
        return { data: review };
      },
      invalidatesTags: ["Reviews", "Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOrdersQuery,
  useSaveProductMutation,
  useRemoveProductMutation,
  useSubmitOrderMutation,
  useModifyOrderMutation,
  useSubmitReviewMutation,
} = maisonApi;
