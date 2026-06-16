// lib/data-sources.ts

// Tất cả nguồn dữ liệu có sẵn
export const ALL_DATA_SOURCES = {
  EMPLOYEES: { id: "EMPLOYEES", label: "Danh mục Nhân viên" },
  PRODUCTS: { id: "PRODUCTS", label: "Danh mục Sản phẩm" },
  PROJECTS: { id: "PROJECTS", label: "Danh mục Dự án" },
  DEPARTMENTS: { id: "DEPARTMENTS", label: "Danh mục Bộ phận" },
  VENDORS: { id: "VENDORS", label: "Danh mục Nhà cung cấp" }
};

// Định nghĩa quy tắc và nguồn dữ liệu cho từng loại đơn
// Thêm interface để TypeScript gợi ý tốt hơn
export interface DocRule {
  allowTable: boolean;
  allowSingle: boolean;
  label: string;
  sources: string[];
  defaultFields: { label: string; type: "text" | "number" }[];
}

export const DOC_RULES: Record<string, DocRule> = {
  LEAVE: { 
    allowTable: false, allowSingle: true, label: "Đơn xin nghỉ phép", 
    sources: ["EMPLOYEES", "DEPARTMENTS"],
    defaultFields: [{ label: "Lý do nghỉ", type: "text" }, { label: "Số ngày", type: "number" }]
  },
  PURCHASE: { 
    allowTable: true, allowSingle: true, label: "Đơn mua hàng", 
    sources: ["PRODUCTS", "VENDORS", "PROJECTS"],
    defaultFields: [{ label: "Người yêu cầu", type: "text" }]
  },
  EXPENSE: { 
    allowTable: true, allowSingle: false, label: "Đơn công tác phí", 
    sources: ["PROJECTS", "EMPLOYEES"],
    defaultFields: [] 
  }
};