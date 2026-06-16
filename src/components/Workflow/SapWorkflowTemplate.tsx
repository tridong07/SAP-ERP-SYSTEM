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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((tpl: any) => (
          <div
            key={tpl.id}
            onClick={() => { setSelectedTemplate(tpl); setIsPanelOpen(true); }}
            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:border-blue-200 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0a6ed1] rounded-xl flex items-center justify-center">
                <Layers size={24} />
              </div>
              <button onClick={(e) => handleDelete(e, tpl.id)} className="text-zinc-300 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="font-bold text-zinc-800 text-lg mb-1">{tpl.name}</h3>
            <p className="text-xs text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded w-fit mb-4">
              {tpl.steps?.length || 0} cấp phê duyệt
            </p>
            <div className="flex items-center text-[#0a6ed1] text-sm font-bold group-hover:gap-2 transition-all">
              Xem chi tiết <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <WorkflowPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}