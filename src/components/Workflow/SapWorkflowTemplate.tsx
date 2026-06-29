"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Layers, Trash2, X } from "lucide-react";
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
    // Thay đổi 1: Sử dụng flex để quản lý layout cho Side Panel
    <div className="h-full flex overflow-hidden bg-zinc-50/50">
      
      {/* KHU VỰC BẢNG (Bên trái) */}
      <div className={`flex-1 transition-all duration-300 p-8 ${isPanelOpen ? 'mr-[400px]' : ''}`}>
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
                className="pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm w-64 outline-none focus:border-[#0a6ed1]"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setSelectedTemplate(null); setIsPanelOpen(true); }}
              className="bg-[#0a6ed1] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-[#085aae]"
            >
              <Plus size={16} /> Tạo lưu trình
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-bold uppercase">
                <th className="px-6 py-4">Mã số</th>
                <th className="px-6 py-4">Tên lưu trình</th>
                <th className="px-6 py-4">Số cấp phê duyệt</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTemplates.map((tpl: any) => (
                <tr key={tpl.id} onClick={() => { setSelectedTemplate(tpl); setIsPanelOpen(true); }} 
                    className="hover:bg-blue-50/50 cursor-pointer group">
                  <td className="px-6 py-4 font-mono font-bold text-[#0a6ed1]">{tpl.code_no || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-[#0a6ed1] rounded-lg flex items-center justify-center">
                        <Layers size={16} />
                      </div>
                      <span className="font-bold text-zinc-800">{tpl.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-bold">{tpl.steps?.length || 0} cấp</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => handleDelete(e, tpl.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KHUNG BÊN PHẢI (Side Panel) */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[150] pointer-events-none">
          {/* Overlay làm mờ */}
          <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={() => setIsPanelOpen(false)} />
          
          {/* Panel content */}
          <div className="absolute top-0 right-0 h-full w-[400px] bg-white border-l border-zinc-200 shadow-2xl pointer-events-auto z-[160] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0 sticky top-0 bg-white">
              <h2 className="text-lg font-bold">
                {selectedTemplate ? "Chỉnh sửa lưu trình" : "Tạo lưu trình mới"}
              </h2>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <WorkflowPanel
                //isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}