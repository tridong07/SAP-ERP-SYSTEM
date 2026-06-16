"use client";

import React from "react";
import { Globe, HelpCircle } from "lucide-react";
import AuthFormManager from "@/components/forms/AuthFormManager"; // Gọi bộ quản lý form vừa gộp
import { useLanguage } from "@/context/LanguageContext"; // Import hook ngôn ngữ

export default function SapLoginPage() {
  const { language, toggleLanguage, t } = useLanguage(); // Lấy hàm đổi ngôn ngữ và chữ "Trợ giúp"
  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[#32363a] font-sans antialiased">
      {/* NỬA TRÁI: Đồ họa SAP (Giữ nguyên thương hiệu) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1d2d3d] to-[#0a1924] p-12 flex-col justify-between overflow-hidden">
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-8 w-16 bg-[#f0b400] rounded-sm flex items-center justify-center font-black text-black text-xs tracking-wider">
            SAP
          </div>
          <span className="text-white font-light text-xl tracking-wide">
            Intelligent Enterprise
          </span>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-light text-white leading-tight">
            Quản trị thông minh, <br />
            <span className="font-semibold text-[#4db1ff]">
              Vận hành tối ưu.
            </span>
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            Hệ thống quản lý nguồn lực doanh nghiệp tập trung.
          </p>
        </div>
        <div className="text-xs text-zinc-500">© 2026 Enterprise System.</div>
      </div>

      {/* NỬA PHẢI */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 bg-white shadow-2xl">
        {/* Top bar dịch vụ dịch ngôn ngữ động */}
        <div className="flex justify-end gap-6 text-sm text-[#556b82]">
          {/* Khi nhấn vào đây, nút sẽ tự động chuyển đổi chữ hiển thị Việt / Anh */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 font-medium text-[#0a6ed1] hover:text-[#085caf] transition-colors focus:outline-none"
          >
            <Globe className="h-4 w-4" />
            {language === "vi" ? "English" : "Tiếng Việt"}
          </button>

          <button className="flex items-center gap-1.5 select-none">
            <HelpCircle className="h-4 w-4" /> {t.helpText}
          </button>
        </div>

        {/* Khối quản lý Form tự động dịch */}
        <AuthFormManager />

        <div className="text-center text-xs text-zinc-400">
          SAP Cloud Identity Services
        </div>
      </div>
    </div>
  );
}
