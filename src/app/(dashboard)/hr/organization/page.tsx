'use client'; // Đánh dấu đây là Client Component vì chúng ta dùng hooks/state

import OrganizationPage from '@/components/organization/OrganizationPage';

/**
 * File page.tsx ở đây chỉ đóng vai trò là "Cổng vào" (Entry point).
 * Nó gọi Component cha là OrganizationPage để giữ file này luôn gọn gàng.
 */
export default function OrganizationRoute() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Cấu trúc Tổ chức Nhân sự
        </h1>
        <p className="text-gray-500">
          Quản lý sơ đồ cơ cấu phòng ban, lớp học và tổ đội.
        </p>
      </div>

      {/* Gọi component từ thư mục components */}
      <OrganizationPage />
    </div>
  );
}