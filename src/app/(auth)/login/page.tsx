"use client";

import React from "react";
import { Globe, HelpCircle } from "lucide-react";
import AuthFormManager from "@/components/forms/AuthFormManager";
import { useTranslation } from "@/hook/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

export default function SapLoginPage() {
  const { language, toggleLanguage } = useLanguage();
  const { t, loading } = useTranslation(language);

  // Hiển thị loading nhẹ nếu đang chờ fetch từ DB (tùy chọn)
  if (loading && !t("title", "page_login")) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[#32363a] font-sans antialiased">
      {/* NỬA TRÁI: Đồ họa SAP */}
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
            {t("main_title", "page_login", "Quản trị thông minh,")} <br />
            <span className="font-semibold text-[#4db1ff]">
              {t("main_subtitle", "page_login", "Vận hành tối ưu.")}
            </span>
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            {t("main_desc", "page_login", "Hệ thống quản lý nguồn lực doanh nghiệp tập trung.")}
          </p>
        </div>
        <div className="text-xs text-zinc-500">© 2026 Enterprise System.</div>
      </div>

      {/* NỬA PHẢI */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 bg-white shadow-2xl">
        <div className="flex justify-end gap-6 text-sm text-[#556b82]">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 font-medium text-[#0a6ed1] hover:text-[#085caf] transition-colors focus:outline-none"
          >
            <Globe className="h-4 w-4" />
            {language === "vi" ? "English" : "Tiếng Việt"}
          </button>

          <button className="flex items-center gap-1.5 select-none hover:text-[#0a6ed1] transition-colors">
            <HelpCircle className="h-4 w-4" /> 
            {t("helpText", "page_login", "Help & Support")}
          </button>
        </div>

        {/* Khối quản lý Form tự động dịch */}
        <AuthFormManager />

        <div className="text-center text-xs text-zinc-400">
          {t("footer_text", "common", "SAP Cloud Identity Services")}
        </div>
      </div>
    </div>
  );
}