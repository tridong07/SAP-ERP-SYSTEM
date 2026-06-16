"use client";
import { createContext, useContext, useState } from "react";
import { SapViewType } from "@/components/layout/SapNavbar";

const ViewContext = createContext<{
  currentView: SapViewType;
  setCurrentView: (view: SapViewType) => void;
}>({
  currentView: "DASHBOARD",
  setCurrentView: () => {},
});

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<SapViewType>("DASHBOARD");
  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);