"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "@/hook/useTranslation"; // Sử dụng hook đã tạo

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  // Hàm t bây giờ có đầy đủ 3 tham số để tự động đăng ký key mới
  t: (key: string, namespace?: string, defaultValue?: string) => string;
  toggleLanguage: () => void;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");
  
  // Sử dụng hook đã tích hợp logic API
  const { t, loading } = useTranslation(language);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}