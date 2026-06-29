"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ViewProvider } from "@/context/ViewContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { MenuProvider } from "@/context/MenuContext"; // 1. Import Provider mới

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ViewProvider>
          <MenuProvider> {/* 2. Bọc nội dung bằng MenuProvider */}
            {children}
          </MenuProvider>
        </ViewProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}