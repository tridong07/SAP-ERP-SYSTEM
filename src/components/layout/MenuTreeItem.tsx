'use client';

import React, { useState } from "react";
import { 
  LayoutDashboard, Users, UserCheck, Settings, 
  FileText, FilePlus, ClipboardList, LucideIcon,
  ChevronDown 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Users, UserCheck, Settings, FileText, FilePlus, ClipboardList
};

export function MenuTreeItem({ item, currentView, onToggle, depth = 0, parentBreadcrumbs = [] }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const children = item.children || [];
  const hasChildren = children.length > 0;
  
  const Icon = ICON_MAP[item.iconName || ''] || FileText;
  const isActive = !hasChildren && currentView === item.winNo;

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const currentBreadcrumbs = [...parentBreadcrumbs, item.menuName || item.winName];
    
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (item.winNo) {
      onToggle(item.winNo, currentBreadcrumbs);
    }
  };

  return (
    <div className="select-none">
      <button
        onClick={handleItemClick}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-[11px] group
          ${isActive 
            ? "bg-blue-600/10 text-blue-400 font-medium" 
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }
          ${depth > 0 ? "ml-2" : ""}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
          <span className="truncate">{item.menuName}</span>
        </div>
        
        {hasChildren && (
          <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-300 text-slate-600 ${isOpen ? "" : "-rotate-90"}`} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-l border-slate-800 ml-5 pl-1"
          >
            {children.map((child: any) => (
              <MenuTreeItem 
                key={child.winNo || child.menuNo} 
                item={child} 
                currentView={currentView} 
                onToggle={onToggle}
                depth={depth + 1}
                parentBreadcrumbs={[...parentBreadcrumbs, item.menuName]}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}