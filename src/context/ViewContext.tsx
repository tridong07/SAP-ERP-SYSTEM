"use client";
import { createContext, useContext, useState } from "react";
import { SapViewType } from "@/components/layout/SapNavbar";

interface ViewContextType {
  currentView: SapViewType;
  metadata: string | null; // Thêm trường này để lưu ID hoặc thông tin bổ sung
  setCurrentView: (view: SapViewType, meta?: string | null) => void;
}

const ViewContext = createContext<ViewContextType>({
  currentView: "DASHBOARD",
  metadata: null,
  setCurrentView: () => {},
});

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentViewState] = useState<SapViewType>("DASHBOARD");
  const [metadata, setMetadata] = useState<string | null>(null);

  const setCurrentView = (view: SapViewType, meta: string | null = null) => {
    setCurrentViewState(view);
    setMetadata(meta);
  };

  return (
    <ViewContext.Provider value={{ currentView, metadata, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);