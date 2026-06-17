"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Users, ClipboardCheck, TrendingUp, ArrowUpRight, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
// Import type để đảm bảo an toàn dữ liệu (kiểm tra lại đường dẫn file điều hướng của bạn nhé)
import { SapViewType } from "@/components/layout/SapNavbar";
import { AreaChart, Area, XAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SapDashboardViewProps {
  onQuickNavigate: (view: SapViewType, metadata?: string | null) => void;
}

interface DashboardResponse {
  stats: any[];
  recentWorkflows: any[];
  infrastructure: {
    bufferCache: number;
    activeConnections: number;
    redoLogUsage: number;
  };
  chartData: { label: string; value: number }[];
}

// Sub-component để code gọn hơn
function KPIKeyCard({ item, onClick }: { item: any; onClick: () => void }) {
  const Icon = item.icon || DollarSign;
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between cursor-pointer group hover:border-[#0a6ed1]">
      <div>
        <span className="text-xs font-semibold text-zinc-400 uppercase">{item.title}</span>
        <span className="text-2xl font-bold block text-zinc-800">{item.value}</span>
        <span className={`text-[11px] font-medium ${item.isUp ? "text-emerald-600" : "text-zinc-400"}`}>{item.change}</span>
      </div>
      <div className={`p-3 rounded-lg ${item.bg || 'bg-zinc-100'} ${item.color || 'text-zinc-600'}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

export default function SapDashboardView({ onQuickNavigate }: SapDashboardViewProps) {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const controller = new AbortController();
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${baseUrl}/dashboard/summary`, { credentials: 'include' });
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [baseUrl]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#0a6ed1]" /></div>;
  if (!dashboardData) return <div>Không thể tải dữ liệu</div>;

  // Cấu hình metadata cố định cho các thẻ KPI
  const statsConfig = [
    { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", targetView: "DASHBOARD" },
    { icon: Users, color: "text-[#0a6ed1]", bg: "bg-blue-50", targetView: "HR_EMPLOYEES" },
    { icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50", targetView: "WF_MONITOR" },
    { icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", targetView: "DASHBOARD" },
  ];

  // Sử dụng Optional Chaining (?.) để tránh lỗi "undefined reading map"
  const stats = (dashboardData?.stats || []).map((item: any, index: number) => ({
    ...item,
    ...(statsConfig[index] || {}), // Kết hợp cấu hình mặc định nếu index tồn tại
  }));

  // 3. Dữ liệu bảng (Dùng trực tiếp từ API)
  const recentWorkflows = dashboardData?.recentWorkflows || [];

  return (
    <div className="space-y-6 text-[#32363a] w-full">
      {/* 1. KHỐI TIÊU ĐỀ CHÀO MỪNG */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h1 className="text-xl font-bold tracking-tight text-zinc-800">
          {t.dashWelcome} <span className="text-[#0a6ed1]">Administrator</span> 👋
        </h1>
        <p className="text-xs text-zinc-500 mt-1">{t.dashSubtitle}</p>
      </div>

      {/* 2. LƯỚI THẺ KPI - ĐÃ THÊM TÍNH NĂNG ĐIỀU HƯỚNG NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <KPIKeyCard key={idx} item={item} onClick={() => onQuickNavigate(item.targetView as SapViewType, null)} />
        ))}
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
            <span onClick={() => onQuickNavigate("WF_MONITOR", null)} className="text-xs text-[#0a6ed1] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
              Chi tiết <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          {/* Đảm bảo div bao quanh có chiều cao cố định (ví dụ: h-48 tương đương 192px) */}
          <div style={{ height: '192px', width: '100%', position: 'relative' }}>
            {hasMounted && dashboardData?.chartData ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={dashboardData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a6ed1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0a6ed1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f4f4f5" />
                {/* 1. Hiệu ứng hiển thị khi rê chuột (Tooltip) */}
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} cursor={{ stroke: '#0a6ed1', strokeWidth: 1 }}/>
                {/* 2. Tiêu đề phía dưới (Trục X) */}
                <XAxis dataKey="label"  axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold' }} dy={10} />
                <Area type="monotone" dataKey="value" stroke="#0a6ed1" fill="#0a6ed1" fillOpacity={0.2} activeDot={{ r: 5, fill: '#fff', stroke: '#0a6ed1', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-50 animate-pulse rounded-lg text-xs text-zinc-400">
              Đang tải biểu đồ...
            </div>
            )}
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

