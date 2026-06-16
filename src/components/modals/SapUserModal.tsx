"use client";

import React from "react";
import { X, Calendar, Building, Phone, Mail, Award, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface SapUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    role: string;
    shortName: string;
    email: string;
    phone: string;
    department: string;
    joinDate: string;
  };
}

export default function SapUserModal({ isOpen, onClose, user }: SapUserModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ tối */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Khung Hộp thoại Chi tiết */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-md overflow-hidden relative z-10 text-[#32363a]"
      >
        {/* Nút X đóng nhanh ở góc */}
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer">
          <X className="h-4 w-4" />
        </button>

        {/* Phần Header Modal: Banner màu SAP Horizon */}
        <div className="bg-[#1d2d3d] p-6 text-white flex flex-col items-center">
          <div className="h-16 w-16 bg-[#0a6ed1] rounded-full flex items-center justify-center text-xl font-bold border-2 border-zinc-700 shadow-inner mb-3 select-none">
            {user.shortName}
          </div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
            <Award className="h-3 w-3 text-[#f0b400]" /> {user.role}
          </p>
        </div>

        {/* Phần Thân Modal: Danh sách thông tin chi tiết */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
            <div className="p-2 bg-zinc-100 rounded-md text-zinc-500"><Building className="h-4 w-4" /></div>
            <div>
              <div className="text-zinc-400 font-medium">{t.department}</div>
              <div className="font-semibold text-zinc-700 mt-0.5">{user.department}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
            <div className="p-2 bg-zinc-100 rounded-md text-zinc-500"><Calendar className="h-4 w-4" /></div>
            <div>
              <div className="text-zinc-400 font-medium">{t.joinDate}</div>
              <div className="font-semibold text-zinc-700 mt-0.5">{user.joinDate}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
            <div className="p-2 bg-zinc-100 rounded-md text-zinc-500"><Mail className="h-4 w-4" /></div>
            <div>
              <div className="text-zinc-400 font-medium">Email</div>
              <div className="font-semibold text-zinc-700 mt-0.5 truncate max-w-[280px]">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
            <div className="p-2 bg-zinc-100 rounded-md text-zinc-500"><Phone className="h-4 w-4" /></div>
            <div>
              <div className="text-zinc-400 font-medium">{t.phoneNumber}</div>
              <div className="font-semibold text-zinc-700 mt-0.5">{user.phone}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-zinc-400 font-medium">{t.accountStatus}</div>
            <span className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md border border-green-200">
              <CheckCircle className="h-3 w-3" /> {t.activeStatus}
            </span>
          </div>

        </div>

        {/* Phần Footer Modal: Nút đóng */}
        <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-medium rounded-md transition-colors text-xs focus:outline-none cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>

      </motion.div>
    </div>
  );
}