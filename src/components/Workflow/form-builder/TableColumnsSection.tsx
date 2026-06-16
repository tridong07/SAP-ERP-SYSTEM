import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { InputModeSelector } from './InputModeSelector';



export const TableColumnsSection = ({ field, updateField, addColumn, moveItem, getAvailableSources }: any) => {
  
  // Thêm hàm xóa cột
  const removeColumn = (colId: string) => {
    updateField(field.id, { 
      columns: field.columns.filter((c: any) => c.id !== colId) 
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-zinc-800">Danh sách cột</h4>
        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
          {field.columns.length} cột
        </span>
      </div>

      <div className="space-y-3">
        {field.columns.map((col: any, idx: number) => (
          <div key={col.id} className="group relative bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:border-blue-200 transition-all">
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <input 
                  className="w-full text-sm font-semibold bg-transparent outline-none border-b border-transparent focus:border-blue-400" 
                  value={col.label} 
                  onChange={(e) => updateField(field.id, { 
                    columns: field.columns.map((c: any) => c.id === col.id ? { ...c, label: e.target.value } : c) 
                  })} 
                  placeholder="Tên cột..." 
                />
                
                <InputModeSelector 
                  col={col} 
                  onUpdate={(updates: any) => {
                    updateField(field.id, { 
                      columns: field.columns.map((c: any) => c.id === col.id ? { ...c, ...updates } : c) 
                    });
                  }} 
                  getAvailableSources={getAvailableSources}
                />
              </div>

              {/* Nhóm điều khiển: Di chuyển & Xóa */}
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => updateField(field.id, { columns: moveItem(field.columns, idx, "up") })}
                  disabled={idx === 0} 
                  className="p-1 hover:bg-zinc-200 rounded disabled:text-zinc-300"
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  onClick={() => updateField(field.id, { columns: moveItem(field.columns, idx, "down") })}
                  disabled={idx === field.columns.length - 1} 
                  className="p-1 hover:bg-zinc-200 rounded disabled:text-zinc-300"
                >
                  <ArrowDown size={14} />
                </button>
                <button 
                  onClick={() => removeColumn(col.id)}
                  className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => addColumn(field.id)} 
        className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-sm font-bold text-zinc-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
      >
        + Thêm cột mới
      </button>
    </div>
  );
};