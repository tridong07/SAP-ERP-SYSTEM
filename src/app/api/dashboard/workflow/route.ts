import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getOracleConnection } from "@/lib/oracle";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// 1. GET: Lấy danh sách hoặc chi tiết đơn ký duyệt
export async function GET(req: Request) {
  let connection;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    connection = await getOracleConnection();

    if (id) {
      // Truy vấn chi tiết 1 đơn trình ký
      const result: any = await connection.execute(
        `SELECT id, title, requester, department, amount, description, status, 
                TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as date_str 
         FROM workflows WHERE id = :id`,
        { id: id }
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      // Lấy toàn bộ danh sách đơn (Sắp xếp mới nhất lên đầu, tương thích Oracle 11g)
      const result: any = await connection.execute(
        `SELECT id, title, requester, department, amount, status, 
                TO_CHAR(created_at, 'DD/MM/YYYY') as date_str 
         FROM workflows 
         ORDER BY created_at DESC`
      );
      
      // Chuyển Key từ viết HOA của Oracle sang viết thường cho Frontend
      const formattedData = result.rows.map((row: any) => ({
        id: row.ID,
        title: row.TITLE,
        requester: row.REQUESTER,
        department: row.DEPARTMENT,
        amount: row.AMOUNT,
        status: row.STATUS,
        date: row.DATE_STR
      }));

      return NextResponse.json({ success: true, data: formattedData });
    }
  } catch (error: any) {
    console.error("Oracle GET Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi kết nối database." }, { status: 500 });
  } finally {
    if (connection) await connection.close();
  }
}

// 2. POST: Khởi tạo/Đăng ký một tờ đơn trình ký mới vào Oracle 11g
export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const { title, requester, department, amount, description } = body;

    if (!title || !requester || !amount) {
      return NextResponse.json({ success: false, message: "Vui lòng điền đủ thông tin bắt buộc." }, { status: 400 });
    }

    connection = await getOracleConnection();

    // Sinh ID tuần tự ngẫu nhiên hoặc bạn có thể dùng Sequence của Oracle: your_sequence.NEXTVAL
    const randomId = Math.floor(100000 + Math.random() * 900000);

    await connection.execute(
      `INSERT INTO workflows (id, title, requester, department, amount, description, status, created_at) 
       VALUES (:id, :title, :requester, :department, :amount, :description, 'pending', SYSDATE)`,
      {
        id: randomId,
        title: title,
        requester: requester,
        department: department,
        amount: parseFloat(amount),
        description: description
      },
      { autoCommit: true } // Bắt buộc đối với Oracle 11g để lưu đĩa ngay
    );

    return NextResponse.json({ success: true, message: "Tờ đơn trình ký đã được nộp thành công!" });

  } catch (error: any) {
    console.error("Oracle POST Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi lưu tờ đơn vào hệ thống." }, { status: 500 });
  } finally {
    if (connection) await connection.close();
  }
}