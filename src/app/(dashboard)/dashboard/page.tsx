"use client";

import React, { useState } from "react";
import { useView } from "@/context/ViewContext"; // Import hook
// --- TỔNG QUAN ---
import SapDashboardView from "@/components/dashboard/SapDashboardView";

// --- PHÂN HỆ WORKFLOW (LƯU TRÌNH) ---
import SapWorkflowForm from "@/components/Workflow/SapWorkflowForm";
import SapWorkflowMonitor from "@/components/Workflow/SapWorkflowMonitor";
import SapWorkflowDetail from "@/components/Workflow/SapWorkflowDetail";
import SapWorkflowTemplate from "@/components/Workflow/SapWorkflowTemplate";
import SapFormBuilder from "@/components/Workflow/SapFormBuilder";
// Định nghĩa Type đồng bộ với hệ thống menu của SapNavbar
import { SapViewType } from "@/components/layout/SapNavbar";

interface DashboardPageProps {
  currentView?: SapViewType;
  setCurrentView?: (view: SapViewType) => void;
}

export default function DashboardPage() {
  // Trạng thái lưu trữ ID đơn trình ký khi người dùng bấm xem chi tiết luồng duyệt
  const { currentView, setCurrentView } = useView(); // Lấy trực tiếp từ Context
  const [selectedWfId, setSelectedWfId] = useState<string | null>(null);

  // Hàm xử lý điều phối tập trung
  const handleQuickNavigate = (targetView: SapViewType, metadataId: string | null = null) => {
    if (metadataId) {
      // Nếu có ID (bấm vào dòng trong bảng), chuyển sang màn hình Monitor và mở chi tiết đơn
      setSelectedWfId(metadataId);
      setCurrentView?.("WF_MONITOR");
    } else {
      // Nếu chỉ là chuyển tab thông thường
      setSelectedWfId(null);
      setCurrentView?.(targetView);
    }
  };

  switch (currentView) {
    
    // ==========================================
    // LƯU TRÌNH KÝ DUYỆT (WORKFLOW)
    // ==========================================
    case "WF_CREATE":
      return <SapWorkflowForm docType="LEAVE"/>;
    case "WF_TEMPLATE":
      return <SapWorkflowTemplate />;
    case "FORM_BUILDER":
      return <SapFormBuilder />;
    case "WF_MONITOR":
      // Nếu có selectedWfId, hiển thị trang chi tiết đơn
      if (selectedWfId) {
        return (
          <SapWorkflowDetail 
            workflowId={selectedWfId} 
            onBack={() => setSelectedWfId(null)} 
            onRefresh={() => {}} 
          />
        );
      }
      // Nếu không, hiển thị bảng danh sách theo dõi
      return (
        <SapWorkflowMonitor />
      );

    // ==========================================
    // TỔNG QUAN CHUNG (DASHBOARD)
    // ==========================================
    case "DASHBOARD":
    default:
      return (
        <SapDashboardView onQuickNavigate={handleQuickNavigate} 
        />
      );
  }
}