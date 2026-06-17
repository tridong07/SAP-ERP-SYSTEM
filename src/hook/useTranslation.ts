"use client";
import { useState, useEffect } from "react";
import { getTranslations } from "@/services/translationService";

export function useTranslation(lang: "vi" | "en") {
  const [tData, setTData] = useState<any>(null); // Đổi tên cho rõ nghĩa
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Sử dụng tham số lang được truyền từ component cha vào
      const data = await getTranslations(lang);
      setTData(data || {});
      setLoading(false);
    };
    init();
  }, [lang]); // Hook sẽ chạy lại bất cứ khi nào 'lang' thay đổi

  // Hàm dịch (t)
  const t = (key: string, namespace: string = 'common', defaultValue?: string) => {
    // 1. Nếu chưa load xong thì hiện tạm hoặc chuỗi defaultValue
    if (!tData) return defaultValue || key;

    const nsData = tData[namespace];
    
    // 2. Nếu không tìm thấy bản dịch
    if (!nsData || !nsData[key]) {
      
      // Tự động đăng ký với Backend nếu đang ở môi trường Dev
      if (process.env.NODE_ENV === 'development') {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/translations/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            key, 
            namespace, 
            defaultValue: defaultValue || key // Gửi giá trị mặc định lên để lưu vào DB
          })
        }).catch(() => {});
      }
      
      return defaultValue || key;
    }

    // 3. Trả về bản dịch từ DB
    return nsData[key];
  };

  return { t, loading };
}