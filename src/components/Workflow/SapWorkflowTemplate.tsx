"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Layers, ChevronRight, Trash2 } from "lucide-react";
import WorkflowPanel from "../dashboard/WorkflowPanel";

export default function SapWorkflowTemplate() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const loadTemplates = () => {
    const data = JSON.parse(localStorage.getItem("sap_templates") || "[]");
    setTemplates(data);
  };

  useEffect(() => {
    loadTemplates();
  }, [isPanelOpen]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa lưu trình này?")) {
      const updated = templates.filter((t: any) => t.id !== id);
      localStorage.setItem("sap_templates", JSON.stringify(updated));
      setTemplates(updated);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-8 bg-zinc-50/50">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Quản lý Lưu trình</h1>
          <p className="text-sm text-zinc-500">Thiết lập các cấp phê duyệt cho quy trình nghiệp vụ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
            <input
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm w-64 outline-none focus:border-[#0a6ed1] transition-colors"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setSelectedTemplate(null); setIsPanelOpen(true); }}
            className="bg-[#0a6ed1] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-[#085aae]"
          >
            <Plus size={16} /> Tạo lưu trình
          </button>
        </div>
      </div>

      {/* GRID TEMPLATES */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Mã số</th>
              <th className="px-6 py-4">Tên lưu trình</th>
              <th className="px-6 py-4">Số cấp phê duyệt</th>
              <th className="px-6 py-4">Ngày cập nhật</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredTemplates.map((tpl: any) => (
              <tr  key={tpl.id}  onClick={() => { setSelectedTemplate(tpl); setIsPanelOpen(true); }} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
                {/* Cột Mã số hiển thị CODE_NO */}
                <td className="px-6 py-4 font-mono font-bold text-[#0a6ed1]">
                  {tpl.code_no || "N/A"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-[#0a6ed1] rounded-lg flex items-center justify-center">
                      <Layers size={16} />
                    </div>
                    <span className="font-bold text-zinc-800">{tpl.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-bold">
                    {tpl.steps?.length || 0} cấp
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  {tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString('vi-VN') : '--/--/----'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={(e) => handleDelete(e, tpl.id)}  className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Thông báo nếu không có dữ liệu */}
        {filteredTemplates.length === 0 && (
          <div className="p-12 text-center text-zinc-400 text-sm">
            Chưa có lưu trình nào được tạo.
          </div>
        )}
      </div>

      <WorkflowPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}