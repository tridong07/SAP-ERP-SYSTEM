
import { Trash2, Settings, Copy} from "lucide-react";

export const FieldCard = ({ f, onSettings, onRemove, onDuplicate, onUpdate }: any) => {
  return (
    <div className={`bg-white p-4 rounded-xl border shadow-sm hover:border-blue-300 transition-all ${f.type === "TABLE" ? "col-span-3" : f.span === 3 ? "col-span-3" : f.span === 2 ? "col-span-2" : "col-span-1"}`}>
      <div className="flex items-center gap-3">
        <input className="font-bold text-sm w-full outline-none bg-transparent" value={f.label} onChange={(e) => onUpdate(e.target.value)} />
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400"><Copy size={14} /></button>
          <button onClick={onSettings} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400"><Settings size={14} /></button>
          <button onClick={onRemove} className="p-1.5 hover:bg-red-50 rounded text-red-400"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="bg-zinc-50 rounded-lg p-2 border border-dashed border-zinc-200 mt-2">
        <p className="text-[10px] text-zinc-500 font-medium">{f.type === "TABLE" ? `Bảng • ${f.columns.length} cột` : `Mode: ${f.inputMode}`}</p>
      </div>
    </div>
  );
};