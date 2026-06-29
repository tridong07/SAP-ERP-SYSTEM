"use client";

import React, { useState } from "react";
import SapHeader from "@/components/layout/SapHeader";
import SapNavbar from "@/components/layout/SapNavbar";
import { useView } from "@/context/ViewContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView } = useView();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden relative">
      
      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <aside className="relative w-64 bg-slate-950 h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <SapNavbar 
              currentView={currentView} 
              onViewChange={setCurrentView} 
              onCloseMobile={() => setIsSidebarOpen(false)}
              isMobile={true}
            />
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR: SapNavbar giờ tự quản lý state của chính nó */}
      <aside className="hidden lg:block h-full shrink-0 z-50">
        <SapNavbar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isMobile={false}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300">
        <SapHeader 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          isCollapsed={true} // Bạn có thể chỉnh lại logic này nếu cần
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f5f6]">
          {children} 
        </main>
      </div>
    </div>
  );
}