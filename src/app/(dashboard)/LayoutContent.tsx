"use client";

import React, { useState, useRef } from "react";
import SapHeader from "@/components/layout/SapHeader";
import SapNavbar from "@/components/layout/SapNavbar";
import { useView } from "@/context/ViewContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView } = useView();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false); 
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // LOGIC ĐÓNG MỞ
  const handleOpenDesktop = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsDesktopOpen(true);
  };

  const handleCloseDesktop = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsDesktopOpen(false);
    }, 200); // Delay nhẹ giúp trải nghiệm mượt hơn
  };
  
  console.log("LayoutContent - isDesktopOpen:", isDesktopOpen);

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
              isOpen={true} 
              isMobile={true}
            />
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {/* Container của Navbar desktop không nên có sự kiện hover làm đóng mở tự động 
          nếu bạn đã có cơ chế Click để mở menu ở Side Rail */}
      <aside className="hidden lg:block h-full shrink-0 z-50">
        <SapNavbar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isOpen={isDesktopOpen}
          onOpenDesktop={handleOpenDesktop} 
          onMouseLeave={handleCloseDesktop}
          isMobile={false}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300">
        <SapHeader 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          isCollapsed={!isDesktopOpen} 
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f5f6]">
          {children} 
        </main>
      </div>
    </div>
  );
}