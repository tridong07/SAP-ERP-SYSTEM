"use client";
import React, { useState, useEffect } from "react";
import { Trash2, TableProperties, TextCursorInput, Save, FileText, Eye, ArrowUp, ArrowDown, Plus } from "lucide-react";
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
  const currentRule = DOC_RULES[docType];
  const [isInitialized, setIsInitialized] = useState(false); // Tránh ghi đè khi mới load

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
    <select className="p-1 border rounded text-xs bg-white" value={value} onChange={(e) => onChange(e.target.value as InputMode)}>
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
    <div className="p-6 bg-white border rounded-xl shadow-sm max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-6 border-b">
        <div><h2 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Thiết kế mẫu biểu</h2></div>
        <div className="flex gap-2">
           <button onClick={() => setIsPreview(!isPreview)} className="px-4 py-2 border rounded text-xs font-bold flex items-center gap-2">
             <Eye size={14} /> {isPreview ? "Quay lại thiết kế" : "Xem trước"}
           </button>
           <button onClick={() => alert("Đã lưu!")} className="px-4 py-2 bg-[#0a6ed1] text-white rounded text-xs font-bold flex items-center gap-2"><Save size={14} /> Lưu</button>
        </div>
      </div>
      
      {isPreview ? ( <SapFormViewer fields={fields} allDataSources={ALL_DATA_SOURCES} />) : (
        <div className="space-y-4">
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-2 border rounded font-bold bg-zinc-50 outline-none mb-4">
            {Object.entries(DOC_RULES).map(([key, rule]) => <option key={key} value={key}>{rule.label}</option>)}
          </select>

          <div className="grid grid-cols-3 gap-4 auto-rows-max" style={{ gridAutoFlow: 'dense' }}>
            <AnimatePresence>
              {fields.map((f, index) => (
                <motion.div key={f.id} layout 
                  className={`p-4 border rounded-xl bg-zinc-50 shadow-sm relative transition-all ${f.type === 'TABLE' ? 'col-span-3' : f.span === 3 ? 'col-span-3' : f.span === 2 ? 'col-span-2' : 'col-span-1'}`}>
                  
                  {/* Dòng 1: Label nằm riêng (Rộng nhất có thể) */}
                  <div className="flex gap-2 items-center mb-3">
                    <input 
                      className={`font-bold bg-transparent border-b border-zinc-300 outline-none w-full text-sm ${f.showLabel === false ? 'opacity-40 line-through' : ''}`}
                      value={f.label} 
                      onChange={(e) => updateField(f.id, { label: e.target.value })} />
                    <button onClick={() => updateField(f.id, { showLabel: !f.showLabel })} className="p-1 hover:bg-zinc-200 rounded">
                      {f.showLabel === false ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>

                  {/* Dòng 2: Control chính (InputMode + Action Buttons) */}
                  <div className="flex gap-2 items-center mb-3">
                    {/* Selector mode nhập */}
                    <div className="flex flex-1 gap-2">
                      <InputModeSelector value={f.inputMode} onChange={(v) => updateField(f.id, { inputMode: v, source: v === "DROPDOWN" ? f.source : "" })} />

                      {/* Chỉ hiện ô chọn Source khi mode là DROPDOWN */}
                      {f.inputMode === "DROPDOWN" && (
                        <select className="p-1 border rounded text-xs bg-white w-32" value={f.source || ""} onChange={(e) => updateField(f.id, { source: e.target.value })}>
                          <option value="">-- Chọn nguồn --</option>
                          {getAvailableSources().map(src => <option key={src.id} value={src.id}>{src.label}</option>)}
                        </select>
                      )}
                    </div>
                    
                    <div className="flex gap-1 border-l pl-2">
                      <button onClick={() => setFields(moveItem(fields, index, "up"))} className="text-zinc-400 hover:text-black"><ArrowUp size={14}/></button>
                      <button onClick={() => setFields(moveItem(fields, index, "down"))} className="text-zinc-400 hover:text-black"><ArrowDown size={14}/></button>
                      <button onClick={() => setFields(fields.filter(x => x.id !== f.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {/* Dòng 3: Công cụ định dạng (Span, Align, Font) */}
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm w-fit">
                    {f.type !== 'TABLE' && (
                      <div className="flex border-r pr-2 gap-0.5">
                        {[1, 2, 3].map(s => (
                          <button key={s} onClick={() => updateField(f.id, { span: s as any })} 
                            className={`w-6 h-6 text-[10px] rounded ${f.span === s ? 'bg-blue-600 text-white' : 'hover:bg-zinc-100'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-0.5 border-r pr-2">
                      {(["left", "center", "right"] as Align[]).map(a => (
                        <button key={a} onClick={() => updateField(f.id, { align: a })} 
                          className={`w-6 h-6 flex items-center justify-center rounded ${f.align === a ? 'bg-blue-100 text-blue-600' : 'hover:bg-zinc-100'}`}>
                          {a === 'left' ? '⬅️' : a === 'center' ? '↔️' : '➡️'}
                        </button>
                      ))}
                    </div>
                    <select className="text-[10px] p-1 border rounded bg-transparent outline-none" value={f.fontFamily || "sans"}
                      onChange={(e) => updateField(f.id, { fontFamily: e.target.value as FontFamily })}>
                      <option value="sans">Sans</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Mono</option>
                    </select>
                  </div>


                  {f.type === "TABLE" && (
                    <div className="mt-4 pl-6 border-l-2 border-[#0a6ed1]">
                      {f.columns.map((col, colIndex) => (
                        <div key={col.id} className="flex gap-2 mb-2 items-center bg-white p-2 rounded border shadow-sm text-xs">
                          <div className="flex flex-col">
                            <button onClick={() => setFields(fields.map(field => field.id === f.id ? {...field, columns: moveItem(field.columns, colIndex, "up")} : field))}><ArrowUp size={10}/></button>
                            <button onClick={() => setFields(fields.map(field => field.id === f.id ? {...field, columns: moveItem(field.columns, colIndex, "down")} : field))}><ArrowDown size={10}/></button>
                          </div>
                          <span className="font-mono bg-zinc-200 px-1 rounded">{col.code}</span>
                          <input className="border rounded p-1 w-20" value={col.label} onChange={(e) => setFields(fields.map(f => f.id === f.id ? {...f, columns: f.columns.map(c => c.id === col.id ? {...c, label: e.target.value} : c)} : f))} />
                          <InputModeSelector value={col.inputMode} onChange={(v) => setFields(fields.map(f => f.id === f.id ? {...f, columns: f.columns.map(c => c.id === col.id ? {...c, inputMode: v, source: v === "DROPDOWN" ? c.source : ""} : c)} : f))} />
                          {col.inputMode === "DROPDOWN" && (
                            <select className="border rounded p-1 w-24" value={col.source || ""} onChange={(e) => setFields(fields.map(f => f.id === f.id ? {...f, columns: f.columns.map(c => c.id === col.id ? {...c, source: e.target.value} : c)} : f))}>
                              <option value="">-- Chọn --</option>
                              {getAvailableSources().map(src => <option key={src.id} value={src.id}>{src.label}</option>)}
                            </select>
                          )}
                          <button onClick={() => setFields(fields.map(x => x.id === f.id ? {...x, columns: x.columns.filter(c => c.id !== col.id)} : x))} className="text-red-400 ml-auto">×</button>
                        </div>
                      ))}
                      <button onClick={() => addColumn(f.id)} className="text-xs text-[#0a6ed1] font-bold mt-2">+ Thêm cột</button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 pt-6 border-t">
            {currentRule.allowSingle && (<button onClick={() => addField(false)} disabled={fields.filter(f => f.type !== "TABLE").length >= 12} className="px-4 py-2 bg-zinc-800 text-white rounded text-xs font-bold">+ Trường đơn</button>)}
            {currentRule.allowTable && (<button onClick={() => addField(true)} disabled={fields.some(f => f.type === "TABLE")} className="px-4 py-2 bg-[#0a6ed1] text-white rounded text-xs font-bold">+ Bảng chi tiết</button>)}
          </div>
        </div>
      )}
    </div>
  );
}