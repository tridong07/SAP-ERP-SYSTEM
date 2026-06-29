// @/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Permissions {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface AuthContextType {
  permissions: Permissions;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<Permissions>({
    canAdd: false, canEdit: false, canDelete: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy quyền của User hiện tại
    const fetchPermissions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/permissions`);
        if (res.ok) {
          const data = await res.json();
          // Giả sử API trả về { add: true, edit: false, delete: true }
          setPermissions({
            canAdd: data.add,
            canEdit: data.edit,
            canDelete: data.delete
          });
        }
      } catch (error) {
        console.error("Lỗi tải phân quyền:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <AuthContext.Provider value={{ permissions, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng trong AuthProvider");
  return context;
};