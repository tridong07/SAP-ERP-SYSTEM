"use client";
import { ViewProvider } from "@/context/ViewContext";
import { useView } from "@/context/ViewContext"; // Import hook
import SapHeader from "@/components/layout/SapHeader";
import SapNavbar from "@/components/layout/SapNavbar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewProvider>
      <LayoutContent>{children}</LayoutContent>
    </ViewProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView } = useView();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden">
      {/* Desktop Sidebar (Giữ nguyên) */}
      <aside className="hidden lg:block h-full shrink-0">
        <SapNavbar currentView={currentView} onViewChange={setCurrentView} />
      </aside>

      {/* MOBILE SIDEBAR (Đây là phần thiếu) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop: Lớp phủ làm mờ nền */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
            />
            {/* Mobile Sidebar Content */}
            <motion.aside 
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-[100] lg:hidden"
            >
              <SapNavbar 
                currentView={currentView} 
                onViewChange={setCurrentView} 
                onCloseMobile={() => setIsSidebarOpen(false)} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <SapHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f5f6]">
          {children} 
        </main>
      </div>
    </div>
  );
}