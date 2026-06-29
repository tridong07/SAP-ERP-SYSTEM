'use client';

import { useState, useMemo, useCallback } from 'react';
import { X, Search, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import OrgTable from './OrgTable';
import OrgForm from './OrgForm';
import { useMenuContext } from "@/context/MenuContext";
import { toast, Toaster } from 'sonner';

// Hàm lọc đệ quy cho cây
const filterTreeData = (data: any[], query: string): any[] => {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.reduce((acc: any[], node: any) => {
    const matches = node.name?.toLowerCase().includes(q) || node.id?.toLowerCase().includes(q);
    if (matches) {
      acc.push(node);
    } else if (node.children?.length > 0) {
      const filteredChildren = filterTreeData(node.children, q);
      if (filteredChildren.length > 0) acc.push({ ...node, children: filteredChildren });
    }
    return acc;
  }, []);
};

export default function OrganizationPage() {
  const queryClient = useQueryClient();
  const { breadcrumbs } = useMenuContext();
  
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: 'CREATE' as 'CREATE' | 'VIEW' | 'EDIT',
    selectedNode: null as any,
    parentNode: null as any,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: treeData = [], isLoading } = useQuery({
    queryKey: ['org-tree'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      return res.json();
    }
  });

  const filteredData = useMemo(() => filterTreeData(treeData, searchTerm), [treeData, searchTerm]);

  const handleDelete = useCallback(async (node: any) => {
    const params = new URLSearchParams({
      level: node.level.toString(),
      fact_no: node.fact_no,
      dept_no: node.level === 1 ? node.id : node.code_main,
      ...(node.level >= 2 && { cls_no: node.level === 2 ? node.id : node.code_mid }),
      ...(node.level === 3 && { sec_no: node.id })
    });

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/nodes/${node.id}?${params}`, { method: 'DELETE' })
        .then(async (res) => { if (!res.ok) throw new Error((await res.json()).message || "Lỗi xóa"); }),
      {
        loading: 'Đang xóa...',
        success: () => { queryClient.invalidateQueries({ queryKey: ['org-tree'] }); setDeleteTarget(null); return `Đã xóa ${node.name}`; },
        error: (err) => err.message
      }
    );
  }, [queryClient]);

  const handleOpenForm = useCallback((mode: 'CREATE' | 'VIEW' | 'EDIT', node = null, parent = null) => {
    setFormState({ isOpen: true, mode, selectedNode: node, parentNode: parent });
  }, []);

  return (
    <div className="h-screen w-full p-8 bg-slate-50/50 flex flex-col overflow-hidden">
      <Toaster position="top-right" richColors />
      
      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h3 className="font-bold text-lg text-slate-900">Xác nhận xóa</h3>
            <p className="text-sm text-slate-500 my-4">Bạn chắc chắn muốn xóa <strong>{deleteTarget.name}</strong>? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700">Xác nhận</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-8">
        <nav className="flex items-center text-xs text-zinc-400 mb-3 select-none">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center">
              <span className={i === breadcrumbs.length - 1 ? "text-blue-600 font-semibold" : "hover:text-zinc-600 transition-colors"}>{crumb}</span>
              {i < breadcrumbs.length - 1 && <ChevronRight size={14} className="mx-2 opacity-50" />}
            </div>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Quản lý cơ cấu</h1>
            <p className="text-sm text-zinc-500 mt-1">Thiết lập và quản lý hệ thống Bộ phận, Khoa, Tổ</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                placeholder="Tìm kiếm mã hoặc tên..." 
                className="pl-9 pr-4 py-2 border border-zinc-200 bg-white rounded-lg text-sm w-full md:w-72 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <button onClick={() => handleOpenForm('CREATE')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]">
              <Plus size={16} strokeWidth={3} /> Thêm đơn vị
            </button>
          </div>
        </div>
      </header>

      {/* Main Table Container */}
      <div className="flex-1 overflow-hidden">
        <OrgTable data={filteredData} isLoading={isLoading} onAddChild={(node) => handleOpenForm('CREATE', null, node)} onDelete={setDeleteTarget} onSelect={(node) => handleOpenForm('VIEW', node)} />
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {formState.isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFormState(prev => ({...prev, isOpen: false}))} className="fixed inset-0 bg-black/20 z-[140] backdrop-blur-sm" />
            <motion.div key="side-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[150] p-6 border-l border-slate-100 flex flex-col rounded-l-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">{formState.mode === 'CREATE' ? "Tạo đơn vị" : formState.mode === 'VIEW' ? "Chi tiết" : "Chỉnh sửa"}</h3>
                <button onClick={() => setFormState(prev => ({...prev, isOpen: false}))} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <OrgForm 
                key={`${formState.mode}-${formState.selectedNode?.id}`}
                mode={formState.mode}
                parentNode={formState.parentNode}
                nodeToEdit={formState.selectedNode}
                onSuccess={() => { setFormState(prev => ({...prev, isOpen: false})); queryClient.invalidateQueries({ queryKey: ['org-tree'] }); }}
                onClose={() => setFormState(prev => ({...prev, isOpen: false}))}
                onSwitchToEdit={() => setFormState(prev => ({...prev, mode: 'EDIT'}))}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}