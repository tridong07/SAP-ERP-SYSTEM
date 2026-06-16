"use client";
import React, { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";

export default function SapDocumentConfig() {
  const [templates, setTemplates] = useState<any[]>([]);
  // Lưu cấu hình: { docType: string, templateId: string }
  const [configs, setConfigs] = useState<any>({});

  // Các loại đơn có sẵn trong hệ thống của bạn
  const docTypes = [
    { id: "LEAVE", name: "Đơn xin nghỉ phép" },
    { id: "PAYMENT", name: "Đơn tạm ứng" },
    { id: "PURCHASE", name: "Đơn mua hàng" },
  ];

  useEffect(() => {
    // 1. Load các template đã tạo
    const savedTemplates = JSON.parse(localStorage.getItem("sap_templates") || "[]");
    setTemplates(savedTemplates);

    // 2. Load các cấu hình đã gán trước đó
    const savedConfigs = JSON.parse(localStorage.getItem("sap_doc_configs") || "{}");
    setConfigs(savedConfigs);
  }, []);

  const handleSave = () => {
    localStorage.setItem("sap_doc_configs", JSON.stringify(configs));
    alert("Đã lưu cấu hình liên kết thành công!");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Settings className="text-[#0a6ed1]" />
        Cấu hình Loại đơn & Lưu trình
      </h2>

      <div className="space-y-4">
        {docTypes.map((doc) => (
          <div key={doc.id} className="grid grid-cols-2 gap-4 items-center p-4 bg-zinc-50 rounded-lg border">
            <span className="font-medium text-sm text-zinc-700">{doc.name}</span>
            <select
              className="p-2 border rounded text-sm bg-white"
              value={configs[doc.id] || ""}
              onChange={(e) => setConfigs({ ...configs, [doc.id]: e.target.value })}
            >
              <option value="">-- Chọn lưu trình --</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.steps.length} bước)
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-[#0a6ed1] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
      >
        <Save size={16} /> Lưu cấu hình
      </button>
    </div>
  );
}