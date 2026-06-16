"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Settings, Eye, Save, FileText, Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_DATA_SOURCES, DOC_RULES } from "../../lib/data-sources"; 
import SapFormViewer from "./SapFormViewer"; // Import viewer

type InputMode = "MANUAL" | "DROPDOWN" | "AUTO_GEN" | "SYSTEM_DATE";
type Align = "left" | "center" | "right";
type FontFamily = "sans" | "serif" | "mono";

interface Column {
  id: string; code: string; label: string; type: "text" | "number" | "computed";
  formula: string; inputMode: InputMode; source?: string;
}

interface Field {
  id: string; label: string; type: "text" | "number" | "TABLE";
  columns: Column[]; inputMode: InputMode; source?: string; span?: 1 | 2 | 3;
  align?: Align; fontFamily?: FontFamily; showLabel?: boolean; 
}

export default function SapFormBuilder() {
  const [isPreview, setIsPreview] = useState(false);
  const [docType, setDocType] = useState<string>("LEAVE");
  const [fields, setFields] = useState<Field[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // Tránh ghi đè khi mới load
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  // Slide-over state
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const currentRule = DOC_RULES[docType];
  const selectedField = fields.find(f => f.id === selectedFieldId);

  useEffect(() => {
    setIsInitialized(false);
    const saved = localStorage.getItem(`config_${docType}`);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      const normalized = parsed.fields.map((f: any) => ({
        ...f,
        span: f.type === "TABLE" ? 3 : (f.span && f.span >= 1 && f.span <= 3 ? f.span : 1)
      }));
      setFields(normalized);
    } else {
      setFields(DOC_RULES[docType].defaultFields.map((d: any) => ({
        id: Date.now().toString() + Math.random(),
        label: d.label, type: d.type, columns: [], inputMode: "MANUAL", source: "", 
        span: d.type === "TABLE" ? 3 : 1
      })));
    }
    setIsInitialized(true);
  }, [docType]);

  // 2. Tự động SAVE mỗi khi fields thay đổi (Tránh mất dữ liệu)
  useEffect(() => {
    if (isInitialized) {
      const config = { docType, fields, updatedAt: new Date().toISOString() };
      localStorage.setItem(`config_${docType}`, JSON.stringify(config));
    }
  }, [fields, docType, isInitialized]);

  const moveItem = (arr: any[], index: number, direction: "up" | "down") => {
    const newArr = [...arr];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newArr.length) {
      [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
    }
    return newArr;
  };

  const getAvailableSources = () => 
    currentRule.sources.map(sId => ALL_DATA_SOURCES[sId as keyof typeof ALL_DATA_SOURCES]);

  const InputModeSelector = ({ value, onChange }: { value: InputMode, onChange: (v: InputMode) => void }) => (
    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={value} onChange={(e) => onChange(e.target.value as InputMode)}>
      <option value="MANUAL">Nhập tay</option>
      <option value="DROPDOWN">Chọn từ danh mục</option>
      <option value="AUTO_GEN">STT tự sinh</option>
      <option value="SYSTEM_DATE">Ngày hiện tại</option>
    </select>
  );
  
  const saveFormConfig = () => {
    const config = { 
      docType, 
      fields, // Đảm bảo lấy đúng state 'fields' mới nhất
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(`config_${docType}`, JSON.stringify(config));
    alert(`Đã lưu cấu hình cho: ${docType}`);
  };

  const addField = (isTable: boolean) => {
    // Kiểm tra quy tắc dựa trên currentRule từ DOC_RULES
    if (isTable && !currentRule.allowTable) {
      alert(`Loại đơn "${currentRule.label}" không cho phép thêm Bảng chi tiết.`);
      return;
    }
    if (!isTable && !currentRule.allowSingle) {
      alert(`Loại đơn "${currentRule.label}" không cho phép thêm Trường đơn.`);
      return;
    }
    // GIỚI HẠN: Ví dụ chỉ cho phép tối đa 1 Bảng chi tiết
    if (isTable && fields.some(f => f.type === "TABLE")) {
      alert("Chỉ được phép có 1 bảng chi tiết!");
      return;
    }

    // GIỚI HẠN: Ví dụ chỉ cho phép tối đa 12 trường đơn
    if (!isTable && fields.filter(f => f.type !== "TABLE").length >= 12) {
      alert("Đã đạt giới hạn số lượng trường đơn!");
      return;
    }
    const newField: Field = isTable
      ? { 
          id: Date.now().toString(), 
          label: "Bảng chi tiết", 
          type: "TABLE", 
          columns: [], 
          inputMode: "MANUAL", 
          span: 3 // Bảng luôn chiếm 3 cột
        }
      : { 
          id: Date.now().toString(), 
          label: "Trường mới", 
          type: "text", 
          columns: [], 
          inputMode: "MANUAL", 
          source: "", 
          span: 1 // Ép buộc mặc định là 1
        };
    
    setFields([...fields, newField]);
  };

  const addColumn = (fieldId: string) => {
    setFields(fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          // Đảm bảo span luôn được giữ nguyên, nếu chưa có thì gán mặc định là 1
          span: f.span || 1, 
          columns: [
            ...f.columns,
            {
              id: Date.now().toString(),
              code: `col_${(f.columns.length + 1).toString().padStart(2, '0')}`,
              label: "Tên cột",
              type: "text",
              formula: "",
              inputMode: "MANUAL",
              source: "",
            },
          ],
        };
      }
      return f;
    }));
  };
  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        // Kết hợp trường hiện tại với các thay đổi mới
        const updatedField = { ...f, ...updates };

        // Đảm bảo span luôn là 1, 2, hoặc 3 (không bao giờ để undefined)
        // Nếu là TABLE, mặc định span phải là 3
        if (updatedField.type === "TABLE") {
          return { ...updatedField, span: 3 };
        }

        // Nếu không phải TABLE, đảm bảo span nằm trong khoảng 1-3
        return { 
          ...updatedField, 
          span: (updatedField.span && updatedField.span >= 1 && updatedField.span <= 3) 
                ? updatedField.span 
                : 1 
        };
      }
      return f;
    }));
  };

  return (
    <div className="p-6 bg-zinc-50 min-h-screen">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Thiết kế mẫu biểu</h2>
        <div className="flex gap-2">
           <button onClick={() => setIsPreview(!isPreview)} className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-2">
             <Eye size={14} /> {isPreview ? "Chỉnh sửa" : "Xem trước"}
           </button>
           <button onClick={() => alert("Đã lưu!")} className="px-4 py-2 bg-[#0a6ed1] text-white rounded-lg text-xs font-bold flex items-center gap-2"><Save size={14} /> Lưu</button>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        {!isPreview && (
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-3 mb-6 border rounded-xl font-bold bg-white outline-none shadow-sm">
            {Object.entries(DOC_RULES).map(([key, rule]: any) => <option key={key} value={key}>{rule.label}</option>)}
          </select>
        )}

        {isPreview ? <SapFormViewer fields={fields} allDataSources={ALL_DATA_SOURCES} /> : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {fields.map((f, index) => (
                  <motion.div key={f.id} layout className={`p-4 border bg-white rounded-xl shadow-sm relative group ${f.type === 'TABLE' ? 'col-span-3' : f.span === 3 ? 'col-span-3' : f.span === 2 ? 'col-span-2' : 'col-span-1'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <input className="font-bold outline-none text-sm w-full" value={f.label} onChange={(e) => updateField(f.id, { label: e.target.value })} />
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedFieldId(f.id); setIsPanelOpen(true); }} className="p-1 hover:bg-zinc-100 rounded"><Settings size={14}/></button>
                        <button onClick={() => setFields(fields.filter(x => x.id !== f.id))} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400 bg-zinc-50 p-2 rounded border border-dashed">
                      {f.type === "TABLE" ? `Bảng chi tiết (${f.columns.length} cột)` : `Chế độ: ${f.inputMode}`}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Add Field Buttons */}
            <div className="flex gap-2 pt-6">
              {currentRule.allowSingle && <button onClick={() => addField(false)} className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold">+ Trường đơn</button>}
              {currentRule.allowTable && <button onClick={() => addField(true)} className="px-4 py-2 bg-[#0a6ed1] text-white rounded-lg text-xs font-bold">+ Bảng chi tiết</button>}
            </div>
          </div>
        )}
      </div>

      {/* Cấu hình Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedField && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsPanelOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Cấu hình: {selectedField.label}</h3>
                <button onClick={() => setIsPanelOpen(false)}><X size={20}/></button>
              </div>
              
              <div className="space-y-6">
                {/* 1. Span & Position */}
                {selectedField.type !== 'TABLE' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Độ dài (Span)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(s => (
                        <button key={s} onClick={() => updateField(selectedField.id, { span: s as any })} 
                          className={`w-10 h-10 rounded-lg font-bold ${selectedField.span === s ? 'bg-[#0a6ed1] text-white' : 'bg-zinc-100'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Move Item */}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Di chuyển</label>
                  <div className="flex gap-2">
                    <button onClick={() => setFields(moveItem(fields, fields.findIndex(f => f.id === selectedFieldId), "up"))} className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2"><ArrowUp size={16}/> Lên</button>
                    <button onClick={() => setFields(moveItem(fields, fields.findIndex(f => f.id === selectedFieldId), "down"))} className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2"><ArrowDown size={16}/> Xuống</button>
                  </div>
                </div>

                {/* 4. Table Columns (Nếu là TABLE) */}
                {selectedField.type === 'TABLE' && (
                  <div className="pt-6 border-t border-zinc-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-zinc-800">Cấu hình cột</h4>
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
                        {selectedField.columns.length} cột
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedField.columns.map((col, idx) => (
                        <div key={col.id} className="group bg-white p-3 rounded-lg border border-zinc-200 shadow-sm hover:border-blue-400 transition-colors">
                          <div className="flex items-center gap-3">
                            {/* Nút di chuyển (ẩn khi không hover) */}
                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => updateField(selectedField.id, { columns: moveItem(selectedField.columns, idx, "up") })} disabled={idx === 0} className="hover:text-blue-600 disabled:text-zinc-200"><ArrowUp size={12}/></button>
                              <button onClick={() => updateField(selectedField.id, { columns: moveItem(selectedField.columns, idx, "down") })} disabled={idx === selectedField.columns.length - 1} className="hover:text-blue-600 disabled:text-zinc-200"><ArrowDown size={12}/></button>
                            </div>
                            
                            {/* Input Tên cột */}
                            <div className="flex-1">
                              <input 
                                className="w-full text-sm font-medium outline-none bg-transparent"
                                placeholder="Nhập tên cột..."
                                value={col.label}
                                onChange={(e) => updateField(selectedField.id, { 
                                  columns: selectedField.columns.map(c => c.id === col.id ? {...c, label: e.target.value} : c) 
                                })}
                              />
                              
                              {/* Select Chế độ nhập (Đặt ngay dưới tên cột) */}
                              <select 
                                className="w-full mt-1 text-[11px] text-zinc-500 bg-zinc-50 hover:bg-zinc-100 rounded px-1 py-0.5 outline-none cursor-pointer" 
                                value={col.inputMode} 
                                onChange={(e) => updateField(selectedField.id, { 
                                  columns: selectedField.columns.map(c => c.id === col.id ? {...c, inputMode: e.target.value as InputMode} : c) 
                                })}
                              >
                                <option value="MANUAL">Nhập tay</option>
                                <option value="DROPDOWN">Danh mục</option>
                                <option value="AUTO_GEN">Tự sinh</option>
                                <option value="SYSTEM_DATE">Ngày</option>
                              </select>
                            </div>

                            {/* Nút xóa */}
                            <button onClick={() => updateField(selectedField.id, { columns: selectedField.columns.filter(c => c.id !== col.id) })} 
                              className="text-zinc-300 hover:text-red-500 transition-colors p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={() => addColumn(selectedField.id)} 
                      className="w-full mt-3 py-2 border border-dashed border-zinc-300 rounded-lg text-xs font-bold text-zinc-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                      + Thêm cột mới
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}