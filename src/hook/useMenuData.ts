import { useQuery } from '@tanstack/react-query';

export interface MenuNode {
  menuNo: string;
  menuName: string;
  winNo?: string;
  iconName?: string;
  children: MenuNode[];
}

export function useMenuData() {
  return useQuery<MenuNode[]>({
    queryKey: ['menuTree'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      return data; // Trả về trực tiếp vì Backend đã xử lý xong
    },
    staleTime: 3600000,
  });
}