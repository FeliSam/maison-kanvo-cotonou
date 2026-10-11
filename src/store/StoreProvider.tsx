"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "./store";
import { hydrateFromStorage, loadStateFromStorage } from "./appSlice";

function ThemeAndStorageInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.app.theme);
  const hydrated = useAppSelector((s) => s.app.hydrated);

  useEffect(() => {
    const saved = loadStateFromStorage();
    dispatch(hydrateFromStorage(saved));
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute("content", theme);
    }
  }, [theme, hydrated]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeAndStorageInitializer>{children}</ThemeAndStorageInitializer>
    </Provider>
  );
}
