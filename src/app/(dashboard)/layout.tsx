"use client";
import { ViewProvider } from "@/context/ViewContext";
import { useView } from "@/context/ViewContext"; // Import hook
import SapHeader from "@/components/layout/SapHeader";
import SapNavbar from "@/components/layout/SapNavbar";
import { useState } from "react";

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
      <aside className="hidden lg:block h-full shrink-0">
        <SapNavbar currentView={currentView} onViewChange={setCurrentView} />
      </aside>
      
      {/* ... code sidebar mobile tương tự, nhớ dùng currentView và setCurrentView ... */}
      
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <SapHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f5f6]">
          {children} 
        </main>
      </div>
    </div>
  );
}