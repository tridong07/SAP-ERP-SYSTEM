import { useReactTable, getCoreRowModel, flexRender, getExpandedRowModel, Row, Cell } from '@tanstack/react-table';
import { Skeleton } from '../ui/Skeleton';
import { ChevronRight, Building2, Briefcase, Users, Plus, Trash2 } from 'lucide-react';

const ORG_LEVEL_CONFIG: any = {
  0: { label: 'Bộ phận', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  1: { label: 'Khoa',    icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  2: { label: 'Tổ',      icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
};

interface OrgTableProps {
  data: any[];
  isLoading?: boolean;
  onAddChild: (node: any) => void;
  onDelete: (node: any) => void;
  onSelect: (node: any) => void;
}

export default function OrgTable({ data, isLoading, onAddChild, onDelete, onSelect }: OrgTableProps) {
  const columns = [
    { 
      header: 'Tên đơn vị', 
      accessorKey: 'name',
      cell: ({ row, getValue }: any) => {
        const config = ORG_LEVEL_CONFIG[row.depth] || ORG_LEVEL_CONFIG[0];
        const Icon = config.icon;
        return (
          <div className="flex items-center" style={{ paddingLeft: `${row.depth * 28}px` }}>
            {row.getCanExpand() ? (
              <button 
                onClick={(e) => { e.stopPropagation(); row.getToggleExpandedHandler()(); }} 
                className="mr-2 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${row.getIsExpanded() ? 'rotate-90' : ''}`} />
              </button>
            ) : <div className="w-[26px]" />}
            
            <div className={`mr-3 p-2 rounded-lg bg-white border shadow-sm ${config.color}`}>
              <Icon size={14} />
            </div>
            <span className="font-semibold text-slate-700">{getValue()}</span>
          </div>
        );
      }
    },
    { 
      header: 'Mã số', 
      accessorKey: 'id', 
      cell: (info: any) => (
        <span 
          onClick={(e) => { e.stopPropagation(); onSelect(info.row.original); }}
          className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100 transition-all border border-blue-100"
        >
          {info.getValue()}
        </span>
      ) 
    },
    { 
      header: 'Loại hình', 
      accessorKey: 'type',
      cell: ({ row }: any) => {
        const config = ORG_LEVEL_CONFIG[row.depth] || ORG_LEVEL_CONFIG[0];
        return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${config.bg} ${config.color}`}>{config.label}</span>;
      }
    },
    {
      header: 'Thao tác',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {row.depth < 2 && (
            <button onClick={(e) => { e.stopPropagation(); onAddChild(row.original); }} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <Plus size={16} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(row.original); }} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getExpandedRowModel: getExpandedRowModel(), getSubRows: (row) => row.children });

  if (isLoading) return <div className="p-4"><Skeleton className="h-10 w-full" /></div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-50">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}