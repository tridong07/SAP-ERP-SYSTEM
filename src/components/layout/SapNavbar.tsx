"use client";

import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Users,
  UserCheck,
  LogOut,
  Settings,
  FileText, // Đã bổ sung import này
} from "lucide-react";

export type SapViewType =
  | "DASHBOARD"
  | "HR_EMPLOYEES"
  | "HR_ATTENDANCE"
  | "WF_CREATE"
  | "WF_MONITOR"
  | "WF_TEMPLATE"
  | "FORM_BUILDER";

interface SapNavbarProps {
  currentView: SapViewType;
  onViewChange: (view: SapViewType) => void;
  onCloseMobile?: () => void;
}

export default function SapNavbar({ currentView, onViewChange, onCloseMobile }: SapNavbarProps) {
  
  const menuGroups = [
    {
      groupName: "Hệ thống lõi",
      items: [
        { id: "DASHBOARD", label: "Tổng quan chung", icon: LayoutDashboard },
      ],
    },
    {
      groupName: "Quản lý nhân sự (HR)",
      items: [
        { id: "HR_EMPLOYEES", label: "Hồ sơ nhân viên", icon: Users },
        { id: "HR_ATTENDANCE", label: "Chấm công & Phép", icon: UserCheck },
      ],
    },
    {
      groupName: "Lưu trình ký duyệt",
      items: [
        { id: "WF_TEMPLATE", label: "Cấu hình lưu trình", icon: Settings },
        { id: "FORM_BUILDER", label: "Thiết kế biểu mẫu", icon: FileText },
        { id: "WF_CREATE", label: "Đăng ký trình ký", icon: FilePlus },
        { id: "WF_MONITOR", label: "Theo dõi đơn ký", icon: ClipboardList },
      ],
    },
  ];

  const handleItemClick = (id: SapViewType) => {
    onViewChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="w-64 h-full bg-[#1c2434] text-zinc-300 flex flex-col justify-between border-r border-zinc-800 font-sans text-xs">
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 bg-[#0a6ed1] rounded flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-bold tracking-wider text-white text-sm">SAP ENTERPRISE</span>
        </div>
      </div>

      <div className="flex-1 py-4 space-y-6 px-3 overflow-y-auto">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
              {group.groupName}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id as SapViewType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#0a6ed1] text-white shadow-md font-bold"
                      : "hover:bg-zinc-800/60 hover:text-white text-zinc-400"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-[#121926]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-all font-medium">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </div>
  );
}