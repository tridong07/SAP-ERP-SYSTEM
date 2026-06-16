"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Settings, Eye, Save, GripVertical, Plus, Copy, ArrowLeft, ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ALL_DATA_SOURCES, DOC_RULES } from "../../lib/data-sources";
import SapFormViewer from "./SapFormViewer";

type InputMode =
  | "MANUAL" // Nhập tay
  | "DROPDOWN" // Chọn từ danh mục (DBA)
  | "AUTO_GEN" // STT/Mã tự sinh
  | "SYSTEM_DATE" // Ngày hiện tại
  | "COMPUTED" // Cột tính toán (Công thức)
  | "RELATION"; // Lấy dữ liệu liên kết (Lookup từ bảng khác)

type Align = "left" | "center" | "right";

interface Column {
  id: string;
  code: string;
  label: string;
  type: "text" | "number" | "computed";
  formula: string;
  inputMode: InputMode;
  source?: string;
  fontSize?: number;       // Thêm dòng này (ví dụ: 12, 14, 16)
  align?: Align;
}

interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "TABLE";
  columns: Column[];
  inputMode: InputMode;
  source?: string;
  span?: 1 | 2 | 3;
  fontSize?: number;
  align?: Align;
  showLabel?: boolean;
}

// 1. Định nghĩa kiểu dữ liệu cho props
interface SapFormBuilderProps {
  formId: string | null;
  onBack: () => void;
  onSave: (data: any) => void;
}

// --- Component Card Kéo thả ---
const SortableCard = ({ f, onRemove, onSettings, onDuplicate }: any) => {
  const {attributes,listeners, setNodeRef, transform, transition, isDragging,} = useSortable({ id: f.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1,};

  return (
    <div ref={setNodeRef} style={style} className={`bg-white p-4 rounded-xl border ${isDragging ? "shadow-xl ring-2 ring-blue-400" : "shadow-sm hover:border-blue-300"} transition-all ${f.type === "TABLE" ? "col-span-3" : f.span === 3 ? "col-span-3" : f.span === 2 ? "col-span-2" : "col-span-1"}`}>
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab text-zinc-300 hover:text-zinc-600">
          <GripVertical size={18} />
        </div>
        <div className="flex-1 min-w-0">
          {/* Input tên trường hiển thị ngay trên card để sửa nhanh */}
          <input
            className="font-bold text-sm w-full outline-none bg-transparent"
            value={f.label}
            onChange={(e) => {
              /* Cần truyền hàm updateField xuống đây hoặc gọi hàm cha */
            }}
            placeholder="Tên trường..."
          />
        </div>

        <div className="flex gap-1">
          <button onClick={onDuplicate} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400">
            <Copy size={14} />
          </button>
          <button onClick={onSettings} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400" >
            <Settings size={14} />
          </button>
          <button onClick={onRemove} className="p-1.5 hover:bg-red-50 rounded text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Phần hiển thị tóm tắt Input Mode hoặc số lượng cột của Table */}
      <div className="bg-zinc-50 rounded-lg p-2 border border-dashed border-zinc-200">
        <p className="text-[10px] text-zinc-500 font-medium">
          {f.type === "TABLE"
            ? `Bảng chi tiết • ${f.columns.length} cột`
            : `Chế độ nhập: ${f.inputMode === "MANUAL" ? "Nhập tay" : f.inputMode === "DROPDOWN" ? "Danh mục" : f.inputMode === "AUTO_GEN" ? "Tự sinh" : "Ngày hiện tại"}`}
        </p>
      </div>
    </div>
  );
};

const InputModeSelector = ({col,onUpdate,getAvailableSources}: {
    col: any;
    onUpdate: (updates: Partial<any>) => void;
    getAvailableSources: () => any[]; // Khai báo kiểu cho hàm này
  }) => (
    <div className="space-y-3">
      {/* Dropdown chính */}
      <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.inputMode} onChange={(e) => onUpdate({ inputMode: e.target.value as InputMode })}>
        <optgroup label="Nhập liệu">
          <option value="MANUAL">Nhập tay</option>
          <option value="SYSTEM_DATE">Ngày hiện tại</option>
        </optgroup>
        <optgroup label="Dữ liệu hệ thống">
          <option value="DROPDOWN">Chọn từ danh mục (DBA)</option>
          <option value="RELATION">Dữ liệu liên kết</option>
        </optgroup>
        <optgroup label="Tự động">
          <option value="AUTO_GEN">Tự sinh mã</option>
          <option value="COMPUTED">Công thức tính toán</option>
        </optgroup>
      </select>

      {/* Dòng định dạng: Canh lề | Cỡ chữ | Đậm */}
      <div className="flex gap-1">
        {/* 1. Canh lề Dropdown */}
        <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.align || "left"} onChange={(e) => onUpdate({ align: e.target.value as Align })}>
          <option value="left">Trái</option>
          <option value="center">Giữa</option>
          <option value="right">Phải</option>
        </select>

        {/* 2. Cỡ chữ Dropdown */}
        <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.fontSize || 14} onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}>
          {[10, 12, 14, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}
        </select>

        {/* 3. Đậm/Nhạt (Sử dụng Select cho đồng bộ) */}
        <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.isBold ? "bold" : "normal"} onChange={(e) => onUpdate({ isBold: e.target.value === "bold" })}>
          <option value="normal">Thường</option>
          <option value="bold">Đậm</option>
        </select>
      </div>

      {/* Các bổ trợ hiển thị tùy theo mode */}
      {col.inputMode === "DROPDOWN" && (
        <select className="w-full p-2 border border-blue-200 rounded-lg text-xs bg-blue-50 text-blue-700 font-bold" value={col.source || ""} onChange={(e) => onUpdate({ source: e.target.value })} >
          <option value="">Chọn nguồn dữ liệu...</option>
          {ALL_DATA_SOURCES &&
            Object.entries(ALL_DATA_SOURCES).map(([id, ds]: any) => (
              <option key={id} value={id}>
                {ds.label || id}
              </option>
            ))}
        </select>
      )}

      {col.inputMode === "COMPUTED" && (
        <input className="w-full p-2 border border-amber-200 rounded-lg text-xs bg-amber-50 text-amber-800 placeholder-amber-400" placeholder="Nhập công thức (vd: col_01 * 0.1)" value={col.formula || ""} onChange={(e) => onUpdate({ formula: e.target.value })}/>
      )}
    </div>
  );

export default function SapFormBuilder({ formId, onBack, onSave }: SapFormBuilderProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [docType, setDocType] = useState<string>("LEAVE");
  const [fields, setFields] = useState<Field[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const currentRule = DOC_RULES[docType];
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(`config_${docType}`);
    if (saved) {
      setFields(JSON.parse(saved).fields);
    } else {
      setFields(currentRule.defaultFields.map((d: any) => ({
        ...d,
        id: Date.now().toString() + Math.random(),
        columns: [],
        inputMode: "MANUAL",
        span: d.type === "TABLE" ? 3 : 1
      })));
    }
    setIsInitialized(true);
  }, [docType, currentRule.defaultFields]);

  // Save data - Tối ưu bằng cách chỉ lưu khi cần
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`config_${docType}`, JSON.stringify({ fields, updatedAt: new Date().toISOString() }));
    }
  }, [fields, docType, isInitialized]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const canAddField = (type: "text" | "number" | "TABLE") => {
    const isTable = type === "TABLE";

    // 1. Kiểm tra rule cho phép hay không
    if (isTable && !currentRule.allowTable)
      return { allowed: false, message: "Loại đơn không cho phép thêm Bảng." };
    if (!isTable && !currentRule.allowSingle)
      return {
        allowed: false,
        message: "Loại đơn không cho phép thêm Trường đơn.",
      };

    // 2. Kiểm tra giới hạn số lượng
    if (isTable && fields.some((f) => f.type === "TABLE"))
      return { allowed: false, message: "Chỉ được phép có 1 bảng chi tiết!" };
    if (!isTable && fields.filter((f) => f.type !== "TABLE").length >= 12)
      return { allowed: false, message: "Đã đạt giới hạn 12 trường đơn!" };

    return { allowed: true };
  };

  const moveItem = useCallback((arr: any[], index: number, direction: "up" | "down") => {
    const newArr = [...arr];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < newArr.length) {
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    }
    return newArr;
  }, []);

  const getAvailableSources = () =>
    currentRule.sources.map(
      (sId) => ALL_DATA_SOURCES[sId as keyof typeof ALL_DATA_SOURCES],
    );

  const saveFormConfig = () => {
    const config = {
      docType,
      fields, // Đảm bảo lấy đúng state 'fields' mới nhất
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`config_${docType}`, JSON.stringify(config));
    alert(`Đã lưu cấu hình cho: ${docType}`);
  };

  const addField = (isTable: boolean) => {
    const type = isTable ? "TABLE" : "text";
    const check = canAddField(type);

    if (!check.allowed) {
      alert(check.message);
      return;
    }

    const newField: Field = {
      id: Date.now().toString(),
      label: isTable ? "Bảng chi tiết" : "Trường mới",
      type: isTable ? "TABLE" : "text",
      columns: [],
      inputMode: "MANUAL",
      span: isTable ? 3 : 1
    };
    setFields(prev => [...prev, newField]);
  };

  const addColumn = (fieldId: string) => {
    setFields(
      fields.map((f) => {
        if (f.id === fieldId) {
          return {
            ...f,
            // Đảm bảo span luôn được giữ nguyên, nếu chưa có thì gán mặc định là 1
            span: f.span || 1,
            columns: [
              ...f.columns,
              {
                id: Date.now().toString(),
                code: `col_${(f.columns.length + 1).toString().padStart(2, "0")}`,
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
      }),
    );
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(
      fields.map((f) => {
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
            span:
              updatedField.span &&
              updatedField.span >= 1 &&
              updatedField.span <= 3
                ? updatedField.span
                : 1,
          };
        }
        return f;
      }),
    );
  };

  const duplicateField = (fieldId: string) => {
    const fieldToCopy = fields.find((f) => f.id === fieldId);
    if (!fieldToCopy) return;

    // Gọi hàm kiểm tra trước khi nhân bản
    const check = canAddField(fieldToCopy.type);
    if (!check.allowed) {
      alert(check.message);
      return;
    }

    setFields([
      ...fields,
      {
        ...fieldToCopy,
        id: Date.now().toString(),
        label: `${fieldToCopy.label} (copy)`,
      },
    ]);
  };

  return (
    <div className="p-6 bg-zinc-50 min-h-screen">
      {/* Header & Controls */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        {/* 1. Thanh công cụ chính */}
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors bg-zinc-100 px-4 py-2 rounded-lg">
              <ArrowLeft size={16} /> Quay lại
            </button>
            <h2 className="text-lg font-bold text-zinc-800">Thiết kế mẫu biểu</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2 px-5 py-2.5 border border-zinc-200 rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-50">
              <Eye size={16} /> {isPreview ? "Chỉnh sửa" : "Xem trước"}
            </button>
            <button onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 bg-[#0a6ed1] text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm">
              <Save size={16} /> Lưu thay đổi
            </button>
          </div>
        </div>

        {/* 2. Thanh ngữ cảnh (Loại chứng từ) - Dùng màu nền xám rất nhạt và bỏ shadow */}
        <div className="px-8 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loại chứng từ</label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)} 
                className="font-bold text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer text-sm hover:border-blue-300 transition-colors focus:ring-2 focus:ring-blue-100"
              >
                {Object.entries(DOC_RULES).map(([key, rule]: any) => (
                  <option key={key} value={key}>{rule.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Đang hoạt động</span>
          </div>
        </div>
      </div>
        {/* 2. Vùng làm việc (Canvas) */}
        <div className="max-w-6xl mx-auto p-8">
          {isPreview ? (<SapFormViewer fields={fields} allDataSources={ALL_DATA_SOURCES} />) : (
            <div className="space-y-6">
              {/* Vùng kéo thả */}
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-6">
                  <SortableContext items={fields} strategy={rectSortingStrategy}>
                    {fields.map((f) => (
                      <SortableCard 
                        key={f.id} 
                        f={f} 
                        onSettings={() => { setSelectedFieldId(f.id); setIsPanelOpen(true);}} 
                        onRemove={() => setFields(fields.filter((x) => x.id !== f.id))} 
                        onDuplicate={() => duplicateField(f.id)} 
                        onUpdate={(val: string) => updateField(f.id, { label: val })}
                      />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>

              {/* VÙNG NÚT THÊM TRƯỜNG - Đã đưa ra khỏi DndContext để luôn hiển thị */}
              <div className="mt-10 border-t border-zinc-200 pt-8 flex gap-4">
                {currentRule.allowSingle && (
                  <button onClick={() => addField(false)} className="px-6 py-4 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-500 font-bold hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-2">
                    <Plus size={16} /> Thêm trường đơn
                  </button>
                )}
                {currentRule.allowTable && (
                  <button onClick={() => addField(true)} className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-700 transition-all flex items-center gap-2">
                    <Plus size={16} /> Thêm bảng chi tiết
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      {/* Cấu hình Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedField && (
          <>
            {/* Overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsPanelOpen(false)} className="fixed inset-0 bg-zinc-900/50 z-40 backdrop-blur-sm"/>
            {/* Panel */}
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-[420px] bg-white z-50 shadow-2xl flex flex-col" >
              {/* Header - Sticky */}
              <div className="flex justify-between items-center p-6 border-b border-zinc-100">
                <h3 className="font-bold text-lg text-zinc-900">
                  Cấu hình:{" "}
                  <span className="text-blue-600">{selectedField.label}</span>
                </h3>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Nội dung - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Section: Bố cục */}
                {selectedField.type !== "TABLE" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Độ rộng (Span)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((s) => (
                        <button key={s} onClick={() => updateField(selectedField.id, { span: s as any })} className={`py-2 rounded-lg font-bold border transition-all ${selectedField.span === s ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white hover:border-zinc-300"}`}>
                          {s} cột
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section: Thứ tự */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Sắp xếp
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setFields( moveItem( fields, fields.findIndex((f) => f.id === selectedFieldId),"up",),)} className="flex-1 py-2 border rounded-lg hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm font-medium">
                      <ArrowUp size={16} /> Lên
                    </button>
                    <button onClick={() =>setFields(moveItem(fields,fields.findIndex((f) => f.id === selectedFieldId),"down",),)}className="flex-1 py-2 border rounded-lg hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm font-medium">
                      <ArrowDown size={16} /> Xuống
                    </button>
                  </div>
                </div>

                {/* Section: Cấu hình Bảng (nếu có) */}
                {selectedField.type === "TABLE" && (
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-zinc-800">
                        Danh sách cột
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                        {selectedField.columns.length} cột
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedField.columns.map((col, idx) => (
                        <div key={col.id} className="group relative bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:border-blue-200 transition-all">
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                              {/* Input tên cột */}
                              <input className="w-full text-sm font-semibold bg-transparent outline-none" value={col.label} onChange={(e) => updateField(selectedField.id, {columns: selectedField.columns.map((c) => c.id === col.id ? { ...c, label: e.target.value }: c, ),})} placeholder="Tên cột..." />
                             {/* Gọi component đã tách */}
                              <InputModeSelector col={col} onUpdate={(updates) => {updateField(selectedField.id, { columns: selectedField.columns.map(c => c.id === col.id ? {...c, ...updates} : c) });}} getAvailableSources={getAvailableSources}/>
                            </div>

                            {/* Nút di chuyển */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() =>updateField(selectedField.id, {columns: moveItem(selectedField.columns,idx,"up",),})}disabled={idx === 0} className="p-1 hover:bg-zinc-200 rounded disabled:text-zinc-300">
                                <ArrowUp size={14} />
                              </button>
                              <button onClick={() =>updateField(selectedField.id, {columns: moveItem(selectedField.columns,idx, "down",),})}disabled={idx === selectedField.columns.length - 1} className="p-1 hover:bg-zinc-200 rounded disabled:text-zinc-300">
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => addColumn(selectedField.id)} className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-sm font-bold text-zinc-500 hover:border-blue-400 hover:text-blue-500 transition-all">
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
