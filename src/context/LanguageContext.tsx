"use client";

import React, { createContext, useContext, useState } from "react";

// Định nghĩa kho từ vựng dịch thuật chuẩn hệ thống SAP - Đồng bộ 100% hai bên
export const translations = {
  vi: {
    title: "Đăng nhập hệ thống",
    subtitle: "Nhập thông tin xác thực SAP Universal ID của bạn",
    usernamePlaceholder: "Tên đăng nhập hoặc Email",
    passwordPlaceholder: "Mật khẩu",
    emailPlaceholder: "Email nhân viên (@company.com)",
    newPasswordPlaceholder: "Mật khẩu mới",
    confirmPasswordPlaceholder: "Xác nhận mật khẩu mới",
    forgotPasswordLink: "Quên mật khẩu?",
    submitBtn: "Xác nhận",
    forgotTitle: "Quên mật khẩu?",
    forgotSubtitle: "Nhập email doanh nghiệp để nhận yêu cầu thiết lập lại mã truy cập.",
    forgotBtn: "Gửi liên kết khôi phục",
    backToLogin: "Quay lại Đăng nhập",
    resetTitle: "Đặt lại mật khẩu",
    resetSubtitle: "Tạo một mật khẩu mới có độ bảo mật cao cho tài khoản của bạn.",
    resetBtn: "Cập nhật mật khẩu",
    langText: "Tiếng Việt",
    helpText: "Trợ giúp",
    // Các phần mới bổ sung bắt buộc phải có mặt ở cả 2 bên
    rememberMe: "Ghi nhớ tài khoản",
    menuDashboard: "Bảng điều khiển",
    menuHR: "Quản lý Nhân sự",
    menuWorkflow: "Quy trình phê duyệt",
    menuLogout: "Đăng xuất",
    searchPlaceholder: "Tìm kiếm nhanh ứng dụng...",
    profileInfo: "Thông tin cá nhân",
    accountSettings: "Cài đặt tài khoản",
    employeeId: "Mã nhân viên",
    position: "Chức vụ",
    department: "Phòng ban",
    joinDate: "Ngày vào làm",
    phoneNumber: "Số điện thoại",
    accountStatus: "Trạng thái",
    activeStatus: "Đang hoạt động",
    closeBtn: "Đóng",
    dashWelcome: "Chào mừng trở lại,",
    dashSubtitle: "Dưới đây là tổng quan phân tích dữ liệu vận hành trong ngày của bạn.",
    statRevenue: "Doanh thu tháng",
    statHR: "Nhân sự mới",
    statTask: "Yêu cầu cần duyệt",
    statRate: "Tỷ lệ hoàn thành",
    recentActivity: "Hoạt động phê duyệt gần đây",
    colContent: "Nội dung yêu cầu",
    colRequester: "Người yêu cầu",
    colDate: "Ngày tạo",
    statusApproved: "Đã duyệt",
    statusPending: "Chờ duyệt",
  },
  en: {
    title: "System Sign In",
    subtitle: "Enter your SAP Universal ID credentials",
    usernamePlaceholder: "Username or Email",
    passwordPlaceholder: "Password",
    emailPlaceholder: "Employee Email (@company.com)",
    newPasswordPlaceholder: "New Password",
    confirmPasswordPlaceholder: "Confirm New Password",
    forgotPasswordLink: "Forgot password?",
    submitBtn: "Sign In",
    forgotTitle: "Forgot Password?",
    forgotSubtitle: "Enter your business email to receive access code reset instructions.",
    forgotBtn: "Send Reset Link",
    backToLogin: "Back to Sign In",
    resetTitle: "Reset Password",
    resetSubtitle: "Create a new highly secure password for your account.",
    resetBtn: "Update Password",
    langText: "English",
    helpText: "Help",
    // Đồng bộ tuyệt đối sang tiếng Anh
    rememberMe: "Remember me",
    menuDashboard: "Dashboard",
    menuHR: "Human Resources",
    menuWorkflow: "Approval Workflow",
    menuLogout: "Sign Out",
    searchPlaceholder: "Quick search apps...",
    profileInfo: "My Profile",
    accountSettings: "Account Settings",
    employeeId: "Employee ID",
    position: "Position",
    department: "Department",
    joinDate: "Join Date",
    phoneNumber: "Phone Number",
    accountStatus: "Status",
    activeStatus: "Active",
    closeBtn: "Close",
    dashWelcome: "Welcome back,",
    dashSubtitle: "Here is the operational data analysis overview for your day.",
    statRevenue: "Monthly Revenue",
    statHR: "New Employees",
    statTask: "Pending Approvals",
    statRate: "Completion Rate",
    recentActivity: "Recent Approval Activities",
    colContent: "Request Content",
    colRequester: "Requester",
    colDate: "Created Date",
    statusApproved: "Approved",
    statusPending: "Pending",
  }
};

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  t: typeof translations.vi;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}