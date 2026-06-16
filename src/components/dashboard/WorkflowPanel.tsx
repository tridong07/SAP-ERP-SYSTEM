"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ArrowRight, Save, Info } from "lucide-react";

interface ApprovalStep {
  id: string;
  role: string;
}

interface WorkflowPanelProps {
  isOpen: boolean;
  onClose: () => void;
  template: any | null; // null nếu là tạo mới, có dữ liệu nếu là xem chi tiết
}

export default function WorkflowPanel({ isOpen, onClose, template }: WorkflowPanelProps) {
  const [templateName, setTemplateName] = useState("");
  const [steps, setSteps] = useState<ApprovalStep[]>([{ id: "1", role: "Nhân viên" }]);

  // Reset/Load dữ liệu khi panel mở hoặc template thay đổi
  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setSteps(template.steps);
    } else {
      setTemplateName("");
      setSteps([{ id: Date.now().toString(), role: "Nhân viên" }]);
    }
  }, [template, isOpen]);

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), role: "Sếp mới" }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStepRole = (id: string, newRole: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, role: newRole } : s)));
  };

  const handleSave = () => {
    // Logic lưu vào localStorage
    const newTemplate = { id: template?.id || Date.now().toString(), name: templateName, steps };
    const existing = JSON.parse(localStorage.getItem("sap_templates") || "[]");
    
    let updated;
    if (template) {
      updated = existing.map((t: any) => (t.id === template.id ? newTemplate : t));
    } else {
      updated = [...existing, newTemplate];
    }
    
    localStorage.setItem("sap_templates", JSON.stringify(updated));
    alert("Đã lưu thành công!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b flex justify-between items-center bg-zinc-50">
          <h2 className="font-bold text-zinc-800">{template ? "Chi tiết lưu trình" : "Tạo lưu trình mới"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hướng dẫn */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800">
            <Info size={20} className="shrink-0" />
            <p className="text-xs"><strong>Hướng dẫn:</strong> Định nghĩa thứ tự các cấp duyệt (Nhân viên → Trưởng phòng → Giám đốc). Đơn sẽ tự động chuyển cấp khi bước trước đó được duyệt.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2">Tên lưu trình</label>
            <input 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="VD: Quy trình nghỉ phép"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-4">Các bước phê duyệt</label>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex-1 p-2 bg-zinc-50 border rounded-md flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200 px-1.5 py-0.5 rounded">B{index + 1}</span>
                    <input
                      value={step.role}
                      onChange={(e) => updateStepRole(step.id, e.target.value)}
                      className="bg-transparent text-sm w-full outline-none"
                    />
                  </div>
                  <button onClick={() => removeStep(step.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={addStep} className="w-full py-2 border-2 border-dashed border-zinc-200 rounded-md text-xs text-zinc-500 flex items-center justify-center gap-2 hover:border-[#0a6ed1] hover:text-[#0a6ed1]">
                <Plus size={14} /> Thêm bước duyệt
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200">Hủy</button>
          <button onClick={handleSave} className="flex-1 py-2 text-sm font-bold text-white bg-[#0a6ed1] rounded-lg hover:bg-[#085aae] flex items-center justify-center gap-2">
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}