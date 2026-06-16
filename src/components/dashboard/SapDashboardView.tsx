"use client";

import React from "react";
import { DollarSign, Users, ClipboardCheck, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
// Import type để đảm bảo an toàn dữ liệu (kiểm tra lại đường dẫn file điều hướng của bạn nhé)
import { SapViewType } from "@/components/layout/SapNavbar";

interface SapDashboardViewProps {
  onQuickNavigate: (view: SapViewType, metadata?: string | null) => void;
}

export default function SapDashboardView({ onQuickNavigate }: SapDashboardViewProps) {
  const { t } = useLanguage();

  // Dữ liệu các thẻ KPI kèm theo mục tiêu điều hướng (targetView)
  const stats = [
    { title: t.statRevenue, value: "$142,500", change: "+12.4%", isUp: true, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", targetView: "DASHBOARD" as SapViewType },
    { title: t.statHR, value: "32", change: "+4.8%", isUp: true, icon: Users, color: "text-[#0a6ed1]", bg: "bg-blue-50", targetView: "HR_EMPLOYEES" as SapViewType }, // Bấm nhảy sang phân hệ nhân sự
    { title: t.statTask, value: "09", change: "-2 chủ nhật", isUp: false, icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50", targetView: "WF_MONITOR" as SapViewType }, // Bấm nhảy sang theo dõi đơn ký
    { title: t.statRate, value: "94.2%", change: "+1.5%", isUp: true, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", targetView: "DASHBOARD" as SapViewType },
  ];

  // Dữ liệu Bảng hoạt động gần đây
  const recentWorkflows = [
    { id: "WF-092", content: "Phê duyệt ngân sách dự án SAP Cloud v4", requester: "Nguyễn Trung Kiên (IT)", date: "14/06/2026", status: "pending" },
    { id: "WF-091", content: "Yêu cầu cấp phát Laptop Dev - Kỹ sư mới", requester: "Trần Thị Hồng (HR)", date: "14/06/2026", status: "approved" },
    { id: "WF-089", content: "Đề xuất tăng ca ON-SIGHT hệ thống Oracle DB", requester: "Phạm Minh Hoàng (Ops)", date: "13/06/2026", status: "approved" },
  ];

  return (
    <div className="space-y-6 text-[#32363a] w-full">
      {/* 1. KHỐI TIÊU ĐỀ CHÀO MỪNG */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-800">
          {t.dashWelcome} <span className="text-[#0a6ed1]">Administrator</span> 👋
        </h1>
        <p className="text-xs text-zinc-500 mt-1">{t.dashSubtitle}</p>
      </div>

      {/* 2. LƯỚI THẺ KPI - ĐÃ THÊM TÍNH NĂNG ĐIỀU HƯỚNG NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              onClick={() => onQuickNavigate(item.targetView, null)}
              className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-[#0a6ed1] cursor-pointer group"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block group-hover:text-zinc-600 transition-colors">{item.title}</span>
                <span className="text-2xl font-bold tracking-tight block text-zinc-800">{item.value}</span>
                <span className={`text-[11px] font-medium flex items-center gap-1 ${item.isUp ? "text-emerald-600" : "text-zinc-400"}`}>
                  {item.change} {item.isUp && "▲"}
                </span>
              </div>
              <div className={`p-3 rounded-lg transition-transform group-hover:scale-105 ${item.bg} ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PHÂN HỆ BIỂU ĐỒ & BẢNG SỐ LIỆU TỔNG HỢP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BIỂU ĐỒ SẢN LƯỢNG SVG */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-zinc-800">Xu hướng hiệu năng hệ thống</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Dữ liệu phân tích đồng bộ thời gian thực</p>
            </div>
            <span 
              onClick={() => onQuickNavigate("WF_MONITOR", null)}
              className="text-xs text-[#0a6ed1] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
            >
              Chi tiết <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>

          <div className="w-full pt-6">
            <svg viewBox="0 0 500 150" className="w-full overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a6ed1" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#0a6ed1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f4f4f5" strokeWidth="1" />
              <path d="M0,130 Q80,60 160,90 T320,40 T500,10 L500,130 L0,130 Z" fill="url(#chart-grad)" />
              <path d="M0,130 Q80,60 160,90 T320,40 T500,10" fill="none" stroke="#0a6ed1" strokeWidth="2.5" />
              <circle cx="160" cy="90" r="4" fill="#fff" stroke="#0a6ed1" strokeWidth="2" />
              <circle cx="320" cy="40" r="4" fill="#fff" stroke="#0a6ed1" strokeWidth="2" />
              <circle cx="500" cy="10" r="4" fill="#fff" stroke="#0a6ed1" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-2 px-1">
              <span>Thứ 2</span><span>Thứ 4</span><span>Thứ 6</span><span>Chủ nhật</span>
            </div>
          </div>
        </div>

        {/* TRẠNG THÁI HẠ TẦNG */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-800">Trạng thái hạ tầng Oracle</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Tải trọng RAM & Connection Pool</p>
          </div>
          
          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Buffer Cache Hit Ratio</span>
                <span className="text-emerald-600">99.2%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.2%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Active Connections</span>
                <span className="text-[#0a6ed1]">42 / 100</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0a6ed1] rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Log Nội Bộ (Redo Log)</span>
                <span className="text-amber-600">65%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PHẦN BẢNG DỮ LIỆU WORKFLOWS - BẤM TRỰC TIẾP ĐỂ XEM CHI TIẾT ĐƠN */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-zinc-800">{t.recentActivity}</h3>
          <button 
            onClick={() => onQuickNavigate("WF_CREATE", null)}
            className="text-xs text-[#0a6ed1] hover:text-blue-700 font-bold flex items-center gap-1"
          >
            + Tạo đơn mới
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100/40 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-3 pl-4">Mã số</th>
                <th className="p-3">{t.colContent}</th>
                <th className="p-3">{t.colRequester}</th>
                <th className="p-3">{t.colDate}</th>
                <th className="p-3 pr-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentWorkflows.map((wf) => (
                <tr 
                  key={wf.id} 
                  onClick={() => onQuickNavigate("WF_MONITOR", wf.id)} // Truyền trực tiếp ID đơn để nhảy vào trang chi tiết đơn ký
                  className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                >
                  <td className="p-3 pl-4 font-mono font-bold text-[#0a6ed1] group-hover:underline">{wf.id}</td>
                  <td className="p-3 font-medium text-zinc-700 max-w-xs truncate">{wf.content}</td>
                  <td className="p-3 text-zinc-500">{wf.requester}</td>
                  <td className="p-3 text-zinc-400">{wf.date}</td>
                  <td className="p-3 pr-4 text-center">
                    {wf.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {t.statusApproved}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                        <Clock className="h-2.5 w-2.5" /> {t.statusPending}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}