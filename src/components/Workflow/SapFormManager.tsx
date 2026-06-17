"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Eye, Trash2, Search } from "lucide-react";
import SapFormBuilder from "./form-builder/SapFormBuilder";
import SapFormViewer from "./SapFormViewer";

export default function SapFormManager() {
  const [view, setView] = useState<"LIST" | "EDITOR" | "PREVIEW">("LIST");
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  useEffect(() => {
    // Giả lập dữ liệu từ DBA
    setForms([
      {
        id: "1",
        title: "Đơn xin nghỉ phép",
        creator: "Nguyễn Trung Kiên (IT)",
        date: "14/06/2026",
        status: "Chờ duyệt",
        fields: [],
      },
      {
        id: "2",
        title: "Đơn đặt hàng",
        creator: "Trần Thị Hồng (HR)",
        date: "14/06/2026",
        status: "Đã duyệt",
        fields: [],
      },
      {
        id: "3",
        title: "Phiếu nhập kho",
        creator: "Phạm Minh Hoàng (Ops)",
        date: "13/06/2026",
        status: "Đã duyệt",
        fields: [],
      },
    ]);
  }, []);

  // Logic lọc dữ liệu
  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Tất cả" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- CÁC HÀM XỬ LÝ CHỨC NĂNG ---
  const handleEdit = (form: any) => {
    setSelectedForm(form);
    setView("EDITOR");
  };

  const handleView = (form: any) => {
    setSelectedForm(form);
    setView("PREVIEW");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mẫu đơn này không?")) {
      setForms(forms.filter((f) => f.id !== id));
    }
  };

  // Trong SapFormManager.tsx
const handleSave = (updatedFormData: any) => {
  if (selectedForm) {
    // Nếu là Sửa: Cập nhật mẫu đã có
    setForms(forms.map(f => f.id === selectedForm.id ? { ...f, ...updatedFormData } : f));
  } else {
    // Nếu là Thêm mới: Thêm mẫu mới vào danh sách
    const newForm = {
      id: Date.now().toString(), // ID giả lập
      ...updatedFormData,
      date: new Date().toLocaleDateString('vi-VN'),
      status: "Chờ duyệt"
    };
    setForms([...forms, newForm]);
  }
  setView('LIST'); // Sau khi lưu thì quay về danh sách
};
  // --- CÁC GIAO DIỆN VIEW ---
  if (view === 'EDITOR') return (
  <SapFormBuilder 
    formId={selectedForm?.id} 
    onBack={() => setView('LIST')} 
    onSave={handleSave} // Truyền hàm lưu
  />
);

  if (view === "PREVIEW")
    return (
      <div className="p-8 bg-zinc-50 min-h-screen">
        <button
          onClick={() => setView("LIST")}
          className="mb-4 text-sm font-bold text-zinc-600 hover:underline"
        >
          ← Quay lại danh sách
        </button>
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border rounded-xl">
          <SapFormViewer
            fields={selectedForm?.fields || []}
            allDataSources={{}}
          />
        </div>
      </div>
    );

  return (
    <div className="p-8 bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-zinc-800">Quản lý Mẫu biểu</h1>

          <div className="flex gap-3">
            <select
              className="py-2 px-3 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
            </select>

            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-zinc-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm mẫu đơn..."
                className="pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setSelectedForm(null);
                setView("EDITOR");
              }}
              className="bg-[#0a6ed1] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <Plus size={16} /> Tạo mẫu mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Mã số</th>
                <th className="px-6 py-4 font-bold">Loại đơn</th>
                <th className="px-6 py-4 font-bold">Người tạo</th>
                <th className="px-6 py-4 font-bold">Ngày tạo</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredForms.length > 0 ? (
                filteredForms.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-zinc-50 transition-colors text-sm"
                  >
                    <td className="px-6 py-4 font-bold text-blue-700">
                      WF-{f.id.padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {f.title}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{f.creator}</td>
                    <td className="px-6 py-4 text-zinc-500">{f.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${f.status === "Đã duyệt" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleView(f)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(f)}
                        className="p-2 hover:bg-zinc-100 text-zinc-600 rounded"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-zinc-400"
                  >
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
