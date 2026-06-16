import { NextResponse } from "next/server";
import { getOracleConnection } from "@/lib/oracle";
import oracledb from "oracledb";

// 1. Khai báo biến Cache nằm VÒNG NGOÀI của hàm (Lưu trên RAM của Server)
let cachedTranslations: any = null;
let lastFetchedTime: number = 0;

// Cấu hình thời gian hết hạn của Cache (Ví dụ: 30 phút = 30 * 60 * 1000 ms)
// Sau 30 phút, hệ thống mới tự động vào DB quét lại để cập nhật chữ mới nếu có thay đổi
const CACHE_TTL = 30 * 60 * 1000; 

export async function GET() {
  const currentTime = Date.now();

  // 2. KIỂM TRA CACHE (CACHE HIT)
  // Nếu đã có dữ liệu trong RAM VÀ chưa quá thời gian hết hạn (TTL) thì dùng luôn
  if (cachedTranslations && (currentTime - lastFetchedTime < CACHE_TTL)) {
    console.log("🚀 [Cache Hit] Trả dữ liệu ngôn ngữ trực tiếp từ RAM Server!");
    return NextResponse.json(cachedTranslations);
  }

  // 3. CACHE MISS (Lần đầu tiên hoặc khi Cache đã quá hạn)
  console.log("⏳ [Cache Miss] Kết nối Oracle DB để nạp dữ liệu ngôn ngữ mới...");
  let connection;
  try {
    connection = await getOracleConnection();
    
    const result = await connection.execute(
      `SELECT KEY_CODE, LANG_VI, LANG_EN FROM ERP_LOCALIZATION`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = result.rows as any[];

    const viTranslations: any = {};
    const enTranslations: any = {};

    rows.forEach((row) => {
      viTranslations[row.KEY_CODE] = row.LANG_VI;
      enTranslations[row.KEY_CODE] = row.LANG_EN;
    });

    // 4. GHI DỮ LIỆU VÀO BỘ NHỚ ĐỆM (RAM)
    cachedTranslations = {
      vi: viTranslations,
      en: enTranslations,
    };
    lastFetchedTime = currentTime; // Cập nhật lại mốc thời gian lưu cache

    return NextResponse.json(cachedTranslations);

  } catch (error) {
    console.error("Lỗi lấy ngôn ngữ từ DB:", error);
    
    // Chiến lược dự phòng (Fallback): Nếu DB lỗi nhưng trong RAM vẫn còn cache cũ đã hết hạn,
    // ta cứ trả về cache cũ cho User dùng tạm thay vì làm sập giao diện (Crash ứng dụng)
    if (cachedTranslations) {
      console.log("⚠️ DB lỗi, sử dụng tạm Cache cũ để cứu cánh hệ thống.");
      return NextResponse.json(cachedTranslations);
    }

    return NextResponse.json({ error: "Lỗi cấu hình hệ thống" }, { status: 500 });
  } finally {
    if (connection) await connection.close();
  }
}