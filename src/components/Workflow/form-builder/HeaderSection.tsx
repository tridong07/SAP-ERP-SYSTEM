import { ArrowLeft, Eye, Save } from "lucide-react";
import { DOC_RULES } from "../../../lib/data-sources";

export const HeaderSection = ({ onBack, onSave, isPreview, setIsPreview, docType, setDocType }: any) => (
  <div className="bg-white border-b border-zinc-200 sticky top-0 z-50">
    <div className="px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-zinc-600 bg-zinc-100 px-4 py-2 rounded-lg">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <h2 className="text-lg font-bold text-zinc-800">Thiết kế mẫu biểu</h2>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2 px-5 py-2.5 border rounded-lg text-sm font-bold">
          <Eye size={16} /> {isPreview ? "Chỉnh sửa" : "Xem trước"}
        </button>
        <button onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 bg-[#0a6ed1] text-white rounded-lg text-sm font-bold">
          <Save size={16} /> Lưu thay đổi
        </button>
      </div>
    </div>
    
    <div className="px-8 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-bold text-zinc-400 uppercase">Loại chứng từ</label>
        <select value={docType} onChange={(e) => setDocType(e.target.value)} className="font-bold text-sm bg-white border px-3 py-1.5 rounded-lg outline-none">
          {Object.entries(DOC_RULES).map(([key, rule]: any) => (
            <option key={key} value={key}>{rule.label}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);