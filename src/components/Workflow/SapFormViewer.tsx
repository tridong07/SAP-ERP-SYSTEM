"use client";
import React from 'react';

export default function SapFormViewer({ fields, allDataSources }: { fields: any[], allDataSources: any }) {
  // Mapping các thuộc tính sang Tailwind CSS classes
  const alignClasses: Record<string, string> = { 
    left: "text-left", 
    center: "text-center", 
    right: "text-right" 
  };
  const fontClasses: Record<string, string> = { 
    sans: "font-sans", 
    serif: "font-serif", 
    mono: "font-mono" 
  };
  
  return (
    <div className="p-4 print:p-0">
      <div className="grid grid-cols-3 gap-6">
        {fields.map((f) => {
          // Lấy giá trị định dạng, mặc định là left và sans
          const alignment = alignClasses[f.align || 'left'];
          const font = fontClasses[f.fontFamily || 'sans'];
          
          return (
            <div 
              key={f.id} 
              className={`mb-4 ${
                f.type === "TABLE" ? "col-span-3" : 
                f.span === 3 ? "col-span-3" : 
                f.span === 2 ? "col-span-2" : "col-span-1"
              } ${font}`} // Áp dụng font vào container của trường
            >
              {/* Áp dụng căn lề vào label */}
              {f.showLabel !== false && (
                <label className={`block font-bold text-sm mb-2 text-zinc-700 ${alignment}`}>
                  {f.label}
                </label>
              )}
              
              {f.type === "TABLE" ? (
                <div className="border border-zinc-300 rounded overflow-hidden">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 border-b">
                        {f.columns.map((c: any) => (
                          <th key={c.id} className="p-2 border-r last:border-r-0 text-left font-semibold">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b last:border-b-0">
                        {f.columns.map((c: any) => (
                          <td key={c.id} className="p-2 border-r last:border-r-0 text-zinc-500 italic text-xs h-10">
                            {c.inputMode === "DROPDOWN" && c.source 
                              ? `[${allDataSources[c.source]?.label || '...'}]` 
                              : ".................."}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                // Áp dụng căn lề vào phần input/dữ liệu
                <div className={`flex items-center border-b border-zinc-300 pb-1 ${alignment}`}>
                  {f.inputMode === "DROPDOWN" && f.source ? (
                     <span className="text-blue-700 text-sm font-medium italic">
                       [{allDataSources[f.source]?.label || 'Nguồn dữ liệu'}]
                     </span>
                  ) : (
                     <span className="text-zinc-400 text-sm italic w-full">......................................</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 print:hidden flex justify-end">
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2 bg-black text-white rounded text-sm font-bold shadow-lg hover:bg-zinc-800"
        >
          In Biểu Mẫu
        </button>
      </div>
    </div>
  );
}