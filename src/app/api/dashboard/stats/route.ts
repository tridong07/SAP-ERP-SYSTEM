import { NextResponse } from "next/server";
import oracledb from "oracledb";
// Import hàm lấy kết nối từ lib/oracle của bạn
import { getOracleConnection } from "@/lib/oracle"; 

// Ép cấu trúc dữ liệu xuất ra dạng Object
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function GET() {
  let connection;

  try {
    // Mượn kết nối từ Pool toàn cục
    connection = await getOracleConnection();

    // 1. TRUY VẤN DOANH THU THÁNG (Cú pháp chuẩn Oracle 11g)
    const revenueResult: any = await connection.execute(
      `SELECT SUM(amount) AS TOTAL_REV 
       FROM orders 
       WHERE EXTRACT(MONTH FROM month_date) = EXTRACT(MONTH FROM SYSDATE)
         AND EXTRACT(YEAR FROM month_date) = EXTRACT(YEAR FROM SYSDATE)`
    );

    // 2. TÍNH NHÂN SỰ MỚI (Trong vòng 30 ngày gần đây)
    const hrResult: any = await connection.execute(
      `SELECT COUNT(*) AS TOTAL_HR 
       FROM employees 
       WHERE created_at >= SYSDATE - 30`
    );

    // 3. ĐẾM SỐ YÊU CẦU CHỜ DUYỆT
    const workflowCountResult: any = await connection.execute(
      `SELECT COUNT(*) AS PENDING_COUNT 
       FROM workflows 
       WHERE status = 'pending'`
    );

    // 4. LẤY TOP 5 HOẠT ĐỘNG MỚI NHẤT (Cấu trúc tương thích 100% với Oracle 11g bằng ROWNUM)
    const recentWorkflowsResult: any = await connection.execute(
      `SELECT * FROM (
         SELECT id, content, requester, TO_CHAR(created_at, 'DD/MM/YYYY') as date_str, status 
         FROM workflows 
         ORDER BY created_at DESC
       ) WHERE ROWNUM <= 5`
    );

    // Xử lý dữ liệu thô (Oracle viết HOA tên thuộc tính trả về)
    const revenue = revenueResult.rows[0]?.TOTAL_REV || 0;
    const newEmployees = hrResult.rows[0]?.TOTAL_HR || 0;
    const pendingTasks = workflowCountResult.rows[0]?.PENDING_COUNT || 0;
    
    // Khớp dữ liệu mảng về chữ thường để đẩy xuống Client (SapDashboardView)
    const recentActivities = recentWorkflowsResult.rows.map((row: any) => ({
      id: row.ID,
      content: row.CONTENT,
      requester: row.REQUESTER,
      date: row.DATE_STR,
      status: row.STATUS
    }));

    return NextResponse.json({
      success: true,
      data: {
        revenue,
        newEmployees,
        pendingTasks,
        completionRate: 94.2, 
        recentActivities
      }
    });

  } catch (error: any) {
    console.error("❌ Lỗi truy vấn Oracle 11g DB:", error);
    return NextResponse.json(
      { success: false, message: "Hệ thống trục trặc khi kết nối dữ liệu vận hành." },
      { status: 500 }
    );
  } finally {
    // Trả kết nối lại cho Pool, tránh treo DB
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Lỗi đóng kết nối Oracle:", err);
      }
    }
  }
}