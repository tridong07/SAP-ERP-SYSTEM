import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { InputModeSelector } from './InputModeSelector';
import { TableColumnsSection } from './TableColumnsSection'; // Đảm bảo bạn đã có file này hoặc để chung vào đây

export const ConfigurationPanel = ({ 
  isOpen, 
  onClose, 
  field, 
  updateField, 
  moveItem, 
  setFields, 
  fields, 
  addColumn, 
  getAvailableSources 
}: any) => {
  
  if (!isOpen || !field) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        className="fixed right-0 top-0 h-full w-[420px] bg-white z-50 shadow-2xl flex flex-col border-l border-zinc-200"
      >
        {/* Header Panel */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-100">
          <h3 className="font-bold text-lg text-zinc-900">
            Cấu hình: <span className="text-blue-600">{field.label}</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Nội dung cấu hình */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Bố cục (Span) - Chỉ hiện nếu không phải bảng */}
          {field.type !== "TABLE" && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase">Độ rộng (Span)</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => updateField(field.id, { span: s })} 
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      field.span === s 
                      ? "bg-blue-50 border-blue-500 text-blue-600" 
                      : "bg-white hover:border-zinc-300"
                    }`}
                  >
                    {s} cột
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sắp xếp vị trí */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase">Sắp xếp trường</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setFields(moveItem(fields, fields.findIndex((f: any) => f.id === field.id), "up"))} 
                className="flex-1 py-2 border rounded-lg hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <ArrowUp size={16} /> Lên
              </button>
              <button 
                onClick={() => setFields(moveItem(fields, fields.findIndex((f: any) => f.id === field.id), "down"))} 
                className="flex-1 py-2 border rounded-lg hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <ArrowDown size={16} /> Xuống
              </button>
            </div>
          </div>
          
          {/* Dòng định dạng cho trường đơn */}
          {field.type !== "TABLE" && (
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Định dạng</label>
                <div className="flex gap-2">
                <select className="flex-1 p-2 border rounded-lg text-sm" value={field.align || "left"} onChange={(e) => updateField(field.id, { align: e.target.value })}>
                    <option value="left">Trái</option>
                    <option value="center">Giữa</option>
                    <option value="right">Phải</option>
                </select>
                <select className="flex-1 p-2 border rounded-lg text-sm" value={field.fontSize || 14} onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) })}>
                    {[12, 14, 16, 18].map(s => <option key={s} value={s}>{s}px</option>)}
                </select>

                {/* 3. Đậm/Nhạt (Sử dụng Select cho đồng bộ) */}
                <select className="flex-1 p-2 border rounded-lg text-sm" value={field.fontSize || 14} onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) })}>
                    <option value="normal">Thường</option>
                    <option value="bold">Đậm</option>
                </select>
                </div>
            </div>
          )}

          {/* Cấu hình cột (Nếu là TABLE) */}
          {field.type === "TABLE" && (
            <TableColumnsSection 
              field={field} 
              updateField={updateField} 
              addColumn={addColumn} 
              moveItem={moveItem} 
              getAvailableSources={getAvailableSources} 
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};