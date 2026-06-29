import React from "react";

// 1. Import các component trang của bạn
import SapDashboardView from "@/components/dashboard/SapDashboardView";
import SapWorkflowForm from "@/components/Workflow/SapWorkflowForm";
import SapWorkflowMonitor from "@/components/Workflow/SapWorkflowMonitor";
import SapWorkflowTemplate from "@/components/Workflow/SapWorkflowTemplate";
import SapFormManager from "@/components/Workflow/SapFormManager";
import OrganizationPage from "@/components/organization/OrganizationPage";
// Thêm các import khác của bạn ở đây...

// 2. Định nghĩa kiểu dữ liệu cho Mapping
export interface ViewComponentProps {
  // Các props dùng chung cho mọi view nếu cần
  onQuickNavigate?: (targetView: string, metadataId?: string | null) => void;
}

// 3. Mapping: Key từ DB (winNo) -> Component tương ứng
// Sử dụng Record<string, React.ComponentType<any>> để linh hoạt
export const VIEW_MAP: Record<string, React.ComponentType<any>> = {
  "DASHBOARD": SapDashboardView,
  "WF_CREATE": SapWorkflowForm,
  "WF_MONITOR": SapWorkflowMonitor,
  "WF_TEMPLATE": SapWorkflowTemplate,
  "FORM_BUILDER": SapFormManager,
  "HR_DEPTM": OrganizationPage,
  
  // Bạn có thể thêm các default fallback hoặc trang báo lỗi nếu muốn
  "NOT_FOUND": () => React.createElement("div", null, "Trang chưa được cấu hình"),
};

/**
 * Hàm hỗ trợ lấy component theo ID.
 * Giúp tránh việc gọi trực tiếp VIEW_MAP ở mọi nơi, 
 * dễ dàng thêm logic fallback.
 */
export const getComponentByWinNo = (winNo: string) => {
  return VIEW_MAP[winNo] || VIEW_MAP["NOT_FOUND"];
};