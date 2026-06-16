// src/app/(dashboard)/LayoutContent.tsx
"use client"; // Bắt buộc phải có vì dùng Hooks

import React, { useState } from "react";
import SapHeader from "@/components/layout/SapHeader";
import SapNavbar from "@/components/layout/SapNavbar";
import { useView } from "@/context/ViewContext"; // Import hook vừa tạo

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView } = useView(); // Lấy từ Context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block h-full shrink-0">
        <SapNavbar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
      </aside>

      {/* Sidebar Mobile (giống cũ) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-xl">
            <SapNavbar 
              currentView={currentView} 
              onViewChange={setCurrentView} 
              onCloseMobile={() => setIsSidebarOpen(false)} 
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <SapHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f5f6]">
          {children} 
        </main>
      </div>
    </div>
  );
}