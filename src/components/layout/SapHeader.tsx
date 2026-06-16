"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Globe, Search, Bell, User, Settings, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import SapUserModal from "@/components/modals/SapUserModal"; // Import Modal chi tiết nhân sự

interface SapHeaderProps {
  onToggleSidebar: () => void;
}

export default function SapHeader({ onToggleSidebar }: SapHeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State điều khiển mở Modal công tác

  // Giả lập thông tin User lấy từ mã Token JWT
  const userProfile = {
    id: "NV_2026_09",
    name: "Lê Văn Admin",
    role: "Quản trị hệ thống",
    shortName: "AD",
    email: "admin.le@sap-company.com",
    phone: "+84 901 234 567",
    department: "Phòng Công Nghệ Thông Tin (IT)",
    joinDate: "01/03/2022"
  };

  // Hàm xử lý Đăng xuất đồng bộ từ Header
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.refresh();
        window.location.replace("/login");
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // Tự động đóng Dropdown khi click chuột ra ngoài vùng Menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-14 bg-[#1d2d3d] text-white flex items-center justify-between px-4 sticky top-0 z-30 shadow-md">
        {/* Cụm trái: Logo SAP */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden p-1.5 rounded-md text-zinc-300 hover:bg-zinc-800 focus:outline-none">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 select-none">
            <div className="h-6 w-12 bg-[#f0b400] rounded-sm flex items-center justify-center font-black text-black text-[10px] tracking-wider">SAP</div>
            <span className="font-light text-sm tracking-wider hidden sm:inline text-zinc-200">Intelligent Enterprise</span>
          </div>
        </div>

        {/* Cụm giữa: Tìm kiếm */}
        <div className="hidden md:flex items-center bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-1.5 w-80 focus-within:bg-white focus-within:border-white transition-all group">
          <Search className="h-3.5 w-3.5 text-zinc-400 group-focus-within:text-zinc-600" />
          <input type="text" placeholder={t.searchPlaceholder} className="bg-transparent text-xs w-full ml-2 outline-none text-zinc-200 group-focus-within:text-[#32363a]" />
        </div>

        {/* Cụm phải: Tiện ích & Avatar Dropdown List */}
        <div className="flex items-center gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white focus:outline-none" type="button">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "vi" ? "EN" : "VI"}</span>
          </button>

          <button className="relative text-zinc-300 hover:text-white transition-colors" type="button">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#f0b400] rounded-full" />
          </button>

          {/* KHỐI DROPDOWN USER LIST ICON */}
          <div className="relative border-l border-zinc-700 pl-4" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-zinc-800/60 p-1 rounded-lg transition-colors focus:outline-none cursor-pointer"
              type="button"
            >
              <div className="h-7 w-7 rounded-full bg-[#0a6ed1] flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-zinc-700 select-none">
                {userProfile.shortName}
              </div>
              <span className="text-xs font-medium text-zinc-300 hidden sm:inline max-w-[120px] truncate">
                {userProfile.name}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform hidden sm:inline ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MENU DANH SÁCH ICON THẢ XUỐNG */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 text-[#32363a] py-2 z-50 overflow-hidden origin-top-right"
                >
                  {/* 1. Header thu nhỏ chứa thông tin nhân sự cốt lõi */}
                  <div 
                    onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                    className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 mb-1 hover:bg-zinc-100/80 cursor-pointer transition-colors"
                    title="Click để xem chi tiết"
                  >
                    <div className="font-semibold text-sm text-zinc-800 truncate">{userProfile.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 flex flex-col gap-0.5">
                      <span><strong>{t.employeeId}:</strong> {userProfile.id}</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-[#0a6ed1]" /> 
                        {userProfile.role}
                      </span>
                    </div>
                  </div>

                  {/* 2. Danh sách các nút tính năng có Icon */}
                  <button 
                    onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-zinc-100 transition-colors text-left focus:outline-none cursor-pointer"
                    type="button"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    {t.profileInfo}
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-zinc-100 transition-colors text-left focus:outline-none" type="button">
                    <Settings className="h-4 w-4 text-zinc-500" />
                    {t.accountSettings}
                  </button>

                  <hr className="border-zinc-100 my-1" />

                  {/* Nút đăng xuất nhanh tích hợp luôn icon */}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left focus:outline-none cursor-pointer"
                    type="button"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    {t.menuLogout}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 3. HIỂN THỊ MODAL CHI TIẾT KHI STATE CHUYỂN THÀNH TRUE */}
      <AnimatePresence>
        {isModalOpen && (
          <SapUserModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            user={userProfile} 
          />
        )}
      </AnimatePresence>
    </>
  );
}