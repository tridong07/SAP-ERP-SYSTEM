"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useMenuData } from "@/hook/useMenuData";
import { MenuTreeItem } from "./MenuTreeItem";
import { useMenuContext } from "@/context/MenuContext";
import * as Icons from "lucide-react";

export default function SapNavbar({ currentView, onViewChange, onCloseMobile, isMobile = false }: any) {
  const { data: menuTree = [], isLoading } = useMenuData();
  const { setBreadcrumbs } = useMenuContext();
  
  // Tự quản lý state đóng/mở tại đây
  const [isOpen, setIsOpen] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const activeModule = useMemo(() => menuTree[activeModuleIndex], [menuTree, activeModuleIndex]);
  
  const handleItemClick = (winNo: string, breadcrumbs: string[]) => {
    if (breadcrumbs?.length > 0) setBreadcrumbs(breadcrumbs);
    onViewChange(winNo);
    
    // Đóng sau khi chọn item
    if (isMobile) {
      onCloseMobile?.();
    } else {
      setIsOpen(false);
    }
  };

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div 
      ref={navRef}
      className="flex h-screen relative z-[60]" // Đảm bảo z-index cao hơn Header
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      {/* SIDE RAIL: Luôn hiển thị */}
      <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-4 z-20">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white mb-2">S</div>
        {menuTree.map((group: any, idx: number) => {
          const Icon = (Icons as any)[group.iconName] || Icons.LayoutDashboard;
          const isActive = activeModuleIndex === idx;
          
          return (
            <button 
              key={group.menuNo}
              onClick={(e) => {
                e.stopPropagation();
                setActiveModuleIndex(idx);
                setIsOpen(true);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all 
              ${isActive ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* MENU TREE POPUP: Chỉ xuất hiện khi isCollapsed là false */}
      <div className={`
            fixed top-0 h-screen bg-slate-950 text-slate-400 border-r border-slate-800 shadow-2xl z-[90]
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isMobile 
              ? "left-0 w-64"           // Mobile: nằm sát mép trái
              : "left-16 w-64"          // Desktop: nằm sau Side Rail (16*4 = 64px)
            }
            ${isOpen 
              ? "translate-x-0 opacity-100 pointer-events-auto" 
              : "-translate-x-full opacity-0 pointer-events-none"
            }
        `}>
        <div className="px-6 py-8 border-b border-slate-800/50">
          <h2 className="text-white font-bold text-sm tracking-widest uppercase truncate">
            {activeModule?.menuName || "MENU"}
          </h2>
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto">
          {activeModule?.children?.map((item: any) => (
            <MenuTreeItem 
              key={item.winNo || item.menuNo} 
              item={item} 
              currentView={currentView} 
              onToggle={handleItemClick}
              depth={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}