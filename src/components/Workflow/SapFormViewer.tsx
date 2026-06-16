"use client";
import React from 'react';

export default function SapFormViewer({ fields, allDataSources }: { fields: any[], allDataSources: any }) {
  const alignClasses: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" };
  const fontClasses: Record<string, string> = { sans: "font-sans", serif: "font-serif", mono: "font-mono" };
  
  return (
    <div className="p-8 bg-white shadow-sm rounded-lg print:p-0 print:shadow-none">
      <div className="grid grid-cols-3 gap-8">
        {fields.map((f) => {
          const alignment = alignClasses[f.align || 'left'];
          const font = fontClasses[f.fontFamily || 'sans'];
          
          return (
            <div 
              key={f.id} 
              className={`mb-4 ${
                f.type === "TABLE" || f.span === 3 ? "col-span-3" : 
                f.span === 2 ? "col-span-2" : "col-span-1"
              } ${font}`}
            >
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
                          <th key={c.id} className="p-3 border-r last:border-r-0 text-center font-bold text-zinc-700">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b last:border-b-0">
                        {f.columns.map((c: any) => (
                          <td 
                            key={c.id} 
                            className="p-3 border-r last:border-r-0 text-zinc-600 h-12"
                            style={{
                              textAlign: c.align || "left",
                              fontSize: `${c.fontSize || 13}px`,
                              fontWeight: c.isBold ? "bold" : "normal"
                            }}
                          >
                            {c.inputMode === "DROPDOWN" && c.source 
                              ? (allDataSources?.[c.source]?.label || '...') 
                              : "......"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`flex items-center border-b border-zinc-300 pb-2 ${alignment}`}>
                  {f.inputMode === "DROPDOWN" && f.source ? (
                     <span className="text-blue-800 text-sm font-semibold">
                       {allDataSources?.[f.source]?.label || 'Nguồn dữ liệu'}
                     </span>
                  ) : (
                     <span className="text-zinc-300 italic w-full">......................................</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 print:hidden flex justify-end gap-3">
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-bold shadow hover:bg-zinc-700 transition-colors"
        >
          In Biểu Mẫu
        </button>
      </div>
    </div>
  );
}