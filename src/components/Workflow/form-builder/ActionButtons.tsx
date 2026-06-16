import { Plus } from "lucide-react";

export const ActionButtons = ({ addField, currentRule }: any) => (
  <div className="mt-10 border-t pt-8 flex gap-4">
    {currentRule.allowSingle && (
      <button onClick={() => addField(false)} className="px-6 py-4 border-2 border-dashed rounded-2xl font-bold flex items-center gap-2 hover:border-blue-400">
        <Plus size={16} /> Thêm trường đơn
      </button>
    )}
    {currentRule.allowTable && (
      <button onClick={() => addField(true)} className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-2">
        <Plus size={16} /> Thêm bảng chi tiết
      </button>
    )}
  </div>
);