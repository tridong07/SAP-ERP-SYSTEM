"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext({
  breadcrumbs: [] as string[],
  setBreadcrumbs: (val: string[]) => {}
});

export function MenuProvider({ children }: any) {
  // Lấy dữ liệu từ localStorage để "hồi sinh" dữ liệu khi F5
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sap_breadcrumbs');
    if (saved) setBreadcrumbs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (breadcrumbs.length > 0) {
      localStorage.setItem('sap_breadcrumbs', JSON.stringify(breadcrumbs));
    }
  }, [breadcrumbs]);

  return (
    <MenuContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);