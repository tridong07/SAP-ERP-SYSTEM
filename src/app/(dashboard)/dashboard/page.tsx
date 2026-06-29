"use client";

import React from "react";
import { useView } from "@/context/ViewContext";
import { getComponentByWinNo } from "@/components/layout/menuConfig";

export default function DashboardPage() {
  const { currentView } = useView();
  
  // Lấy component động dựa trên winNo từ DB
  if (currentView === "LOADING") {
    return <div className="flex items-center justify-center h-full">Đang tải cấu hình hệ thống...</div>;
  }

  const ActiveComponent = getComponentByWinNo(currentView);

  return (
    <div className="h-full w-full animate-in fade-in duration-300">
      <ActiveComponent />
    </div>
  );
}