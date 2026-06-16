"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ArrowRight, Save, Info, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkflowPanel({ isOpen, onClose, template }: any) {
  const [templateName, setTemplateName] = useState("");
  const [steps, setSteps] = useState([{ id: "1", role: "Nhân viên" }]);

  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setSteps(template.steps);
    } else {
      setTemplateName("");
      setSteps([{ id: Date.now().toString(), role: "Nhân viên" }]);
    }
  }, [template, isOpen]);

  const handleSave = () => {
    const newTemplate = { id: template?.id || Date.now().toString(), name: templateName, steps };
    const existing = JSON.parse(localStorage.getItem("sap_templates") || "[]");
    const updated = template 
      ? existing.map((t: any) => (t.id === template.id ? newTemplate : t))
      : [...existing, newTemplate];
    
    localStorage.setItem("sap_templates", JSON.stringify(updated));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} 
            onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
          
          {/* Slide-over */}
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <h2 className="font-bold text-zinc-800 text-lg">{template ? "Chi tiết lưu trình" : "Tạo lưu trình mới"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-700">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed"><strong>Hướng dẫn:</strong> Định nghĩa thứ tự các cấp duyệt. Hệ thống sẽ tự động chuyển tiếp đơn từ bước 1 đến bước cuối cùng.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Tên lưu trình</label>
                <input 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full p-3 border border-zinc-200 rounded-lg text-sm focus:border-[#0a6ed1] outline-none transition-all"
                  placeholder="Ví dụ: Quy trình nghỉ phép"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">Luồng phê duyệt</label>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="relative group">
                      {index < steps.length - 1 && (
                        <div className="absolute left-6 top-10 h-6 border-l-2 border-dashed border-zinc-300" />
                      )}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-zinc-500 text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 p-3 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 hover:border-blue-300 transition-colors shadow-sm">
                          <GripVertical size={16} className="text-zinc-300 cursor-grab" />
                          <input
                            value={step.role}
                            onChange={(e) => setSteps(steps.map(s => s.id === step.id ? {...s, role: e.target.value} : s))}
                            className="flex-1 text-sm outline-none font-medium"
                          />
                          <button onClick={() => setSteps(steps.filter(s => s.id !== step.id))} 
                            className="text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={() => setSteps([...steps, { id: Date.now().toString(), role: "Cấp duyệt mới" }])} 
                    className="ml-[64px] w-[calc(100%-64px)] py-3 border-2 border-dashed border-zinc-200 rounded-xl text-xs font-bold text-zinc-500 flex items-center justify-center gap-2 hover:border-[#0a6ed1] hover:text-[#0a6ed1] transition-all">
                    <Plus size={14} /> Thêm cấp duyệt
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-zinc-50 flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50">Hủy</button>
              <button onClick={handleSave} className="flex-1 py-3 text-sm font-bold text-white bg-[#0a6ed1] rounded-lg hover:bg-[#085aae] flex items-center justify-center gap-2 shadow-md">
                <Save size={16} /> Lưu cấu hình
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}