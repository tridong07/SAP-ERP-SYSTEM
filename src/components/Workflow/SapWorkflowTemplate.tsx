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
    <div className="h-full flex flex-col p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-800">Cấu hình lưu trình</h1>
          <p className="text-sm text-zinc-500">Quản lý các quy trình phê duyệt doanh nghiệp</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
            <input
              placeholder="Tìm lưu trình..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-[#0a6ed1] outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setSelectedTemplate(null); setIsPanelOpen(true); }}
            className="bg-[#0a6ed1] hover:bg-[#085aae] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md"
          >
            <Plus size={16} /> Tạo mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTemplates.map((tpl: any) => (
          <div
            key={tpl.id}
            onClick={() => { setSelectedTemplate(tpl); setIsPanelOpen(true); }}
            className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group relative"
          >
            <button
              onClick={(e) => handleDelete(e, tpl.id)}
              className="absolute top-3 right-3 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <div>
              <div className="w-10 h-10 bg-blue-50 text-[#0a6ed1] rounded-lg flex items-center justify-center mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-zinc-800 mb-1">{tpl.name}</h3>
              <p className="text-xs text-zinc-500">{tpl.steps.length} cấp phê duyệt</p>
            </div>
            <div className="mt-4 flex items-center text-[#0a6ed1] text-xs font-bold group-hover:underline">
              Xem chi tiết <ChevronRight size={14} />
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