"use client";
import { useState, useEffect } from "react";
import { getTranslations } from "@/services/translationService";

export function useTranslation(lang: "vi" | "en") {
  const [tData, setTData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const data = await getTranslations(lang);
        // Đảm bảo data luôn là object, nếu không phải thì gán {}
        setTData(data && typeof data === 'object' ? data : {});
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch:", error);
        setTData({});
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [lang]);

  // Hàm dịch (t) luôn trả về một string (để tránh lỗi React Child)
  const t = (key: string, namespace: string = 'common', defaultValue?: string): string => {
    const nsData = tData[namespace];
    
    // Nếu không tìm thấy namespace hoặc key
    if (!nsData || typeof nsData[key] !== 'string') {
      // Đăng ký tự động
      if (process.env.NODE_ENV === 'development') {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/translations/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            key, 
            namespace, 
            defaultValue: defaultValue || key 
          })
        }).catch(() => {});
      }
      
      // LUÔN TRẢ VỀ STRING
      return (defaultValue || key) as string;
    }

    return nsData[key] as string;
  };

  return { t, loading };
}