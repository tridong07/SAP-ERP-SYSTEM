'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Building, Tag, Hash, Info } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, "Tên đơn vị phải có ít nhất 2 ký tự"),
  name_vn: z.string().optional(),
  code: z.string().min(1, "Mã đơn vị không hợp lệ"),
});

export default function OrgForm({ parentNode, nodeToEdit, mode, onSuccess, onClose, onSwitchToEdit }: any) {
  const isReadOnly = mode === 'VIEW';
  const isEdit = mode === 'EDIT';

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: nodeToEdit?.name || '', name_vn: nodeToEdit?.name_vn || '', code: nodeToEdit?.id || '' }
  });

  useEffect(() => { reset({ name: nodeToEdit?.name || '', name_vn: nodeToEdit?.name_vn || '', code: nodeToEdit?.id || '' }); }, [nodeToEdit, mode, reset]);

  const currentLevel = parentNode 
    ? parentNode.level + 1 
    : (nodeToEdit?.level || 1);

  const getLevelName = (level: number) => {
    switch(level) {
      case 1: return "Bộ phận";
      case 2: return "Khoa";
      case 3: return "Tổ";
      default: return "Bộ phận";
    }
  };

  const nextLevel = getLevelName(currentLevel);

  const onSubmit = async (data: any) => {
    if (isReadOnly) return;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL}/organization/nodes/${nodeToEdit.id}` : `${process.env.NEXT_PUBLIC_API_URL}/organization/nodes`;
    const currentLevel = parentNode ? (parentNode.level + 1) : (nodeToEdit?.level || 1);

    const payload = { 
        level: currentLevel, 
        code: data.code, name: data.name, name_vn: data.name_vn,
        fact_no: parentNode?.fact_no || nodeToEdit?.fact_no || '0000',
        code_main: parentNode?.level === 2 ? parentNode.code_main : (parentNode?.level === 1 ? parentNode.id : '0'),
        code_mid: parentNode?.level === 2 ? parentNode.id : undefined
    };

    toast.promise(fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) }).then(async res => { if(!res.ok) throw new Error((await res.json()).message); }), 
    { loading: 'Đang lưu...', success: () => { onSuccess(); return "Thành công!"; }, error: (err) => err.message });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        {(parentNode || isReadOnly) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 mt-0.5" size={16} />
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">{parentNode ? "Đơn vị cha" : "Chi tiết"}</p>
                <p className="text-sm font-medium text-blue-900">{parentNode?.name || nodeToEdit?.name}</p>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1"><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Building size={14} /> TÊN ĐƠN VỊ</label><input {...register("name")} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
          <div className="space-y-1"><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Tag size={14} /> TÊN TIẾNG VIỆT</label><input {...register("name_vn")} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Hash size={14} /> MÃ SỐ</label><input {...register("code")} disabled={isReadOnly || isEdit} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Loại & Cấp độ</label>
              <div className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 flex items-center justify-between">
                <span>{nextLevel}</span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                  Cấp {currentLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">{isReadOnly ? "Đóng" : "Hủy"}</button>
        {mode === 'VIEW' ? <button type="button" onClick={onSwitchToEdit} className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold">Chỉnh sửa</button> : <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold">Lưu thay đổi</button>}
      </div>
    </form>
  );
}