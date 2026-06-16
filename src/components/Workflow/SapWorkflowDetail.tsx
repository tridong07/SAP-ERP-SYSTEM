"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, XCircle, Clock, ArrowLeft, ShieldAlert } from "lucide-react";

interface WorkflowDetailProps {
  workflowId: string;
  onBack: () => void;
  onRefresh: () => void;
}

export default function SapWorkflowDetail({ workflowId, onBack, onRefresh }: WorkflowDetailProps) {
  const [loading, setLoading] = useState(false);

  // Giả lập dữ liệu chi tiết lưu trình từ DB đổ lên
  const workflowData = {
    id: workflowId,
    title: "Phê duyệt ngân sách dự án SAP Cloud v4",
    requester: "Nguyễn Trung Kiên (IT Department)",
    amount: "$45,000",
    description: "Chi phí mua bản quyền Cloud ERP và hạ tầng máy chủ dự phòng cho quý III/2026.",
    currentStep: 2, // Đang ở bước Giám đốc ký
    steps: [
      { step: 1, name: "Khởi tạo yêu cầu", Actor: "Nguyễn Trung Kiên", status: "completed", date: "14/06/2026 09:15" },
      { step: 2, name: "Trưởng phòng CNTT duyệt", Actor: "Lê Văn Admin", status: "completed", date: "14/06/2026 11:30" },
      { step: 3, name: "Giám đốc tài chính (CFO) ký", Actor: "Trần Tổng", status: "pending", date: "Đang chờ..." },
      { step: 4, name: "Kế toán trưởng giải ngân", Actor: "Phòng Kế Toán", status: "waiting", date: "---" },
    ]
  };

  // Hàm xử lý nút Phê duyệt / Từ chối gửi lên API Oracle
  const handleAction = async (actionType: "APPROVE" | "REJECT") => {
    if (!window.confirm(`Bạn có chắc chắn muốn thực hiện hành động này?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/workflow-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workflowId, action: actionType }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Thao tác xử lý lưu trình thành công!");
        onRefresh();
        onBack();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 text-[#32363a] w-full space-y-6">
      {/* HEADER CHI TIẾT */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-[#0a6ed1] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
        </button>
        <span className="text-xs font-mono bg-blue-50 text-[#0a6ed1] px-2.5 py-1 rounded-md font-bold">Mã số: {workflowId}</span>
      </div>

      {/* THÔNG TIN CHI TIẾT HỒ SƠ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 p-4 rounded-lg border border-zinc-100">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Tên quy trình yêu cầu</label>
          <p className="text-sm font-bold text-zinc-800">{workflowData.title}</p>
          <label className="text-[11px] font-bold text-zinc-400 uppercase block mt-3">Nội dung giải trình</label>
          <p className="text-xs text-zinc-600 leading-relaxed">{workflowData.description}</p>
        </div>
        <div className="space-y-3 border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 md:pl-6">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Người đề xuất</label>
            <p className="text-xs font-semibold text-zinc-700">{workflowData.requester}</p>
          </div>
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Giá trị phê duyệt</label>
            <p className="text-sm font-black text-emerald-600">{workflowData.amount}</p>
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ SƠ ĐỒ LƯU TRÌNH DẠNG "STEPS" */}
      <div className="py-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase mb-6 tracking-wider">Tiến trình các bước ký duyệt</h3>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative">
          
          {/* Đường line kết nối các bước */}
          <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 z-0" />

          {workflowData.steps.map((node, index) => (
            <div key={node.step} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 flex-1 z-10">
              {/* Icon Trạng Thái */}
              <div className="shrink-0">
                {node.status === "completed" ? (
                  <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : node.status === "pending" ? (
                  <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md ring-4 ring-amber-100 animate-bounce">
                    <Clock className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-200 text-zinc-400 flex items-center justify-center">
                    <Circle className="h-4 w-4 fill-zinc-200" />
                  </div>
                )}
              </div>

              {/* Văn bản mô tả bước */}
              <div>
                <p className={`text-xs font-bold ${node.status === "pending" ? "text-amber-600 font-extrabold" : "text-zinc-700"}`}>
                  {node.name}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{node.Actor}</p>
                <p className="text-[10px] font-mono text-zinc-400 italic">{node.date}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* THANH THAO TÁC (ACTION BUTTONS) */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 bg-zinc-50/30 -mx-6 -mb-6 p-4 rounded-b-xl">
        <button
          onClick={() => handleAction("REJECT")}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all focus:outline-none flex items-center gap-1.5 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" /> Từ chối yêu cầu
        </button>
        <button
          onClick={() => handleAction("APPROVE")}
          disabled={loading}
          className="px-5 py-2 text-xs font-bold text-white bg-[#0a6ed1] hover:bg-[#0856a4] rounded-lg shadow-sm transition-all focus:outline-none flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" /> Phê duyệt hồ sơ
        </button>
      </div>
    </div>
  );
}