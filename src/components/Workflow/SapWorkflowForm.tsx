"use client";
import React, { useState, useEffect } from "react";
// Import để làm fallback nếu prop không được truyền
import { ALL_DATA_SOURCES as DEFAULT_DATA_SOURCES } from "../../lib/data-sources";

export default function SapWorkflowForm({ docType, allDataSources }: { docType: string, allDataSources?: any }) {
  const [config, setConfig] = useState<{ fields: any[] } | null>(null);
  
  // Ưu tiên dùng dữ liệu từ prop, nếu không có thì dùng import mặc định
  const dataSources = allDataSources || DEFAULT_DATA_SOURCES;

  const alignClasses: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" };
  const fontClasses: Record<string, string> = { sans: "font-sans", serif: "font-serif", mono: "font-mono" };

  useEffect(() => {
    const saved = localStorage.getItem(`config_${docType}`);
    if (saved) setConfig(JSON.parse(saved));
  }, [docType]);

  if (!config) return <div className="p-8 text-center text-zinc-500">Đang tải biểu mẫu...</div>;

  return (
    <div className="p-8 bg-white shadow-lg border max-w-4xl mx-auto print:shadow-none print:border-none">
      
      {/* HEADER CÔNG TY */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border border-zinc-300 rounded flex items-center justify-center text-[10px] text-zinc-400 font-bold bg-zinc-50">LOGO</div>
          <div className="space-y-0.5">
            <h2 className="font-bold text-base uppercase leading-tight">CÔNG TY TNHH AAAA</h2>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">ĐỊA CHỈ: QUẬN 1, TP. HỒ CHÍ MINH</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider bg-zinc-100 px-3 py-1 rounded">
            Phiếu: <span className="underline">.../2026/ĐXNP</span>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-10 text-center uppercase underline underline-offset-4 decoration-1">
        {docType === "LEAVE" ? "Đơn xin nghỉ phép" : docType === "PURCHASE" ? "Đơn mua hàng" : "Đơn công tác"}
      </h1>
      
      <div className="grid grid-cols-3 gap-8">
        {config.fields.map((f: any) => {
          const alignment = alignClasses[f.align || 'left'];
          const font = fontClasses[f.fontFamily || 'sans'];
          
          return (
            <div key={f.id} className={`mb-6 ${f.type === "TABLE" || f.span === 3 ? "col-span-3" : f.span === 2 ? "col-span-2" : "col-span-1"} ${font}`}>
              
              {f.showLabel !== false && (
                <label className={`font-bold text-sm block mb-2 text-zinc-600 ${alignment}`}>
                  {f.label}
                </label>
              )}
              
              {f.type === "TABLE" ? (
                <div className="border border-zinc-300 rounded overflow-hidden">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-zinc-100">
                        {f.columns.map((c: any) => <th key={c.id} className="border p-2 text-left text-xs font-semibold">{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map(rIdx => (
                        <tr key={rIdx}>
                          {f.columns.map((c: any) => (
                            <td key={c.id} className="border p-2 h-10 italic text-zinc-400 text-xs">
                              {/* Sử dụng Optional Chaining ?. để tránh lỗi undefined */}
                              {c.inputMode === "DROPDOWN" ? `[${dataSources?.[c.source]?.label || '...'}]` : ".................."}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`border-b border-zinc-300 pb-1 italic text-zinc-500 ${alignment}`}>
                  {f.inputMode === "DROPDOWN" ? (
                    <span className="text-blue-700 font-medium">
                      [{dataSources?.[f.source]?.label || "Nguồn dữ liệu lỗi"}]
                    </span>
                  ) : (
                    <span>....................................................................</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex justify-between text-sm">
        <div className="text-center font-bold">Người làm đơn<br/><br/><br/><br/><br/>(Ký, ghi rõ họ tên)</div>
        <div className="text-center font-bold">Phê duyệt<br/><br/><br/><br/><br/>(Ký, ghi rõ họ tên)</div>
      </div>
    </div>
  );
}