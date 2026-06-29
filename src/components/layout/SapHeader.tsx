"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Globe, Search, Bell, User, Settings, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hook/useTranslation";
import SapUserModal from "@/components/modals/SapUserModal";
import { useMenuContext } from "@/context/MenuContext";

interface SapHeaderProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

const MOCK_USER = {
  id: "NV_2026_09",
  name: "Lê Văn Admin",
  role: "Quản trị hệ thống",
  shortName: "AD",
  email: "admin.le@sap-company.com",
  phone: "+84 901 234 567",
  department: "Phòng Công Nghệ Thông Tin (IT)",
  joinDate: "01/03/2022"
};

export default function SapHeader({ onToggleSidebar, isCollapsed }: SapHeaderProps) {
  const router = useRouter();
  const { language, toggleLanguage, t } = useTranslation("vi");
  const { breadcrumbs } = useMenuContext(); // Lấy từ Context
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  return (
    <>
      <header 
        className={`h-14 bg-[#1d2d3d] text-white flex items-center justify-between px-4 sticky top-0 z-[10] shadow-md transition-all duration-300 ease-in-out
          ${isCollapsed ? "pl-20" : "pl-4"}`}
      >
        {/* Left Side: Logo & Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSidebar(); }}
            className="lg:hidden p-1.5 rounded-md text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-6 w-12 bg-[#f0b400] rounded-sm flex items-center justify-center font-black text-black text-[10px] tracking-wider">SAP</div>
          </div>

          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center text-[11px] text-zinc-400 gap-2 truncate">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className={`truncate ${index === breadcrumbs.length - 1 ? "text-white font-medium" : "hover:text-zinc-200"}`}>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && <span className="text-zinc-600">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Search bar ẩn bớt trên màn hình nhỏ */}
          <div className="hidden lg:flex items-center bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-1 w-64">
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <input type="text" placeholder={t("searchPlaceholder")} className="bg-transparent text-xs w-full ml-2 outline-none text-zinc-200" />
          </div>

          <button onClick={toggleLanguage} className="text-xs font-medium text-zinc-300 hover:text-white">
            {language === "vi" ? "EN" : "VI"}
          </button>

          <button className="relative text-zinc-300 hover:text-white transition-colors" type="button">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#f0b400] rounded-full" />
          </button>

          {/* User Dropdown */}
          <div className="relative border-l border-zinc-700 pl-2 sm:pl-4 z-[110]" ref={dropdownRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center gap-2 hover:bg-zinc-800/60 p-1 rounded-lg transition-colors"
              type="button"
            >
              <div className="h-7 w-7 rounded-full bg-[#0a6ed1] flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-zinc-700">
                {MOCK_USER.shortName}
              </div>
              <span className="text-xs font-medium text-zinc-300 hidden sm:inline truncate max-w-[100px]">
                {MOCK_USER.name}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 text-[#32363a] py-2 z-[120] overflow-hidden"
                >
                  <div 
                    onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                    className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 mb-1 hover:bg-zinc-100 cursor-pointer"
                  >
                    <div className="font-semibold text-sm text-zinc-800">{MOCK_USER.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      <strong>{t("employeeId")}:</strong> {MOCK_USER.id}
                      <div className="flex items-center gap-1 mt-1 text-[#0a6ed1]">
                        <ShieldCheck className="h-3 w-3" /> {MOCK_USER.role}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-xs hover:bg-zinc-100 text-left">
                    <User className="h-4 w-4 text-zinc-500" /> {t("profileInfo")}
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-xs hover:bg-zinc-100 text-left">
                    <Settings className="h-4 w-4 text-zinc-500" /> {t("accountSettings")}
                  </button>

                  <div className="border-t border-zinc-100 my-1" />

                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left">
                    <LogOut className="h-4 w-4 text-red-500" /> {t("menuLogout")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <SapUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={MOCK_USER} />
    </>
  );
}