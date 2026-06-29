"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useMenuData } from "@/hook/useMenuData";
import { MenuTreeItem } from "./MenuTreeItem";
import { useMenuContext } from "@/context/MenuContext";
import * as Icons from "lucide-react";

export default function SapNavbar({ currentView, onViewChange, onCloseMobile, isOpen = false, onMouseEnter = () => {}, onMouseLeave = () => {}, isMobile = false, onOpenDesktop }: any) {
  const { data: menuTree = [], isLoading } = useMenuData();
  const { setBreadcrumbs } = useMenuContext();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const activeModule = useMemo(() => menuTree[activeModuleIndex], [menuTree, activeModuleIndex]);
  
  const handleItemClick = (winNo: string, breadcrumbs: string[]) => {
    if (breadcrumbs?.length > 0) setBreadcrumbs(breadcrumbs);
    onViewChange(winNo);

    // Dùng Optional Chaining và kiểm tra hàm tồn tại
    if (isMobile) {
      onCloseMobile?.();
    } else {
      // Chỉ gọi nếu là desktop và hàm tồn tại
      onMouseLeave?.();
    }
  };

  useEffect(() => {
    console.log("SapNavbar nhận được isOpen là:", isOpen);
    const handleClickOutside = (event: MouseEvent) => {
      // Nếu click ra ngoài container VÀ menu đang MỞ (isOpen === true)
      if (navRef.current && !navRef.current.contains(event.target as Node) && isOpen) {
        if (isMobile) {
          onCloseMobile?.();
        } else {
          onMouseLeave?.();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onMouseLeave, isMobile, onCloseMobile]);

  return (
    <div 
      ref={navRef}
      className="flex h-screen relative z-[60]" // Đảm bảo z-index cao hơn Header
      onMouseLeave={onMouseLeave}
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
                onOpenDesktop?.();
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
          fixed left-16 top-0 h-screen w-64 bg-slate-950 text-slate-400 border-r border-slate-800 shadow-2xl
          transition-all duration-300 ease-in-out transform
          ${isOpen 
              ? "translate-x-0 opacity-100 pointer-events-auto"    // ĐÃ MỞ
              : "-translate-x-full opacity-0 pointer-events-none"  // ĐÃ ĐÓNG
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