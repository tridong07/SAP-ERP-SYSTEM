"use client";
import { createContext, useContext, useState } from "react";

type SapViewType = string; 

interface ViewContextType {
  currentView: SapViewType;
  metadata: string | null;
  setCurrentView: (view: SapViewType, meta?: string | null) => void;
  // Thêm hàm này để các component (như Navbar) có thể cập nhật view mặc định
  setInitialView: (view: SapViewType) => void; 
}

const DEFAULT_VIEW = "DASHBOARD";

const ViewContext = createContext<ViewContextType>({
  currentView: DEFAULT_VIEW,
  metadata: null,
  setCurrentView: () => {},
  setInitialView: () => {}, // Khởi tạo hàm mặc định
});

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentViewState] = useState<SapViewType>(DEFAULT_VIEW);
  const [metadata, setMetadata] = useState<string | null>(null);

  // Hàm để set view lần đầu (thường dùng khi nhận dữ liệu từ API)
  const setInitialView = (firstView: SapViewType) => {
    setCurrentViewState(firstView);
  };

  const setCurrentView = (view: SapViewType, meta: string | null = null) => {
    setCurrentViewState(view);
    setMetadata(meta);
  };

  return (
    // Truyền đầy đủ các hàm vào Provider
    <ViewContext.Provider value={{ currentView, metadata, setCurrentView, setInitialView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView phải được sử dụng trong ViewProvider");
  }
  return context;
};