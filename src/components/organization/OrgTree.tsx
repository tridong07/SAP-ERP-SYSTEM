'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Briefcase, Users } from 'lucide-react';

interface OrgTreeProps {
  onSelect: (node: any) => void;
}

// Hàm lấy icon theo cấp
const getIcon = (level: number) => {
  if (level === 0) return <Building2 size={16} className="text-blue-500" />;
  if (level === 1) return <Briefcase size={16} className="text-green-500" />;
  return <Users size={16} className="text-orange-500" />;
};

const NodeItem = ({ node, onSelect, expandedNodes, toggleNode, level = 0 }: any) => {
  const isExpanded = expandedNodes[node.id];
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li className="relative">
      <div 
        className={`flex items-center px-3 py-2 cursor-pointer rounded-lg transition-all text-sm
                    hover:bg-slate-50 ${isExpanded ? 'text-blue-700' : 'text-slate-600'}`}
        onClick={() => onSelect(node)}
      >
        {/* Nút mở rộng */}
        <button 
          onClick={(e) => toggleNode(e, node.id)} 
          className="mr-1 hover:bg-slate-200 rounded p-0.5 transition-colors"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <span className="w-[14px]" />}
        </button>

        {/* Icon theo cấp */}
        <span className="mr-2">{getIcon(level)}</span>
        <span className="truncate">{node.name}</span>
      </div>
      
      {/* Container con với đường kẻ nối */}
      {isExpanded && hasChildren && (
        <ul className="ml-4 border-l border-slate-200 pl-2 mt-0.5 space-y-0.5">
          {node.children.map((child: any) => (
            <NodeItem 
              key={child.id} 
              node={child} 
              onSelect={onSelect} 
              expandedNodes={expandedNodes} 
              toggleNode={toggleNode}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function OrgTree({ onSelect }: OrgTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const toggleNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const { data: treeData, isLoading } = useQuery({
    queryKey: ['org-tree'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization`);
      return res.json();
    }
  });

  if (isLoading) return <div className="p-4 text-xs text-slate-400 italic">Đang tải cấu trúc...</div>;

  return (
    <ul className="space-y-0.5 select-none">
      {treeData?.map((dept: any) => (
        <NodeItem 
          key={dept.id} 
          node={dept} 
          onSelect={onSelect} 
          expandedNodes={expandedNodes} 
          toggleNode={toggleNode}
          level={0}
        />
      ))}
    </ul>
  );
}