import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getOracleConnection } from "@/lib/oracle"; // Import hàm lấy kết nối vừa viết
import oracledb from "oracledb";

export async function POST(request: Request) {
  let connection;
  try {
    // 1. Lấy dữ liệu username và password từ Form gửi lên
    const { username, password } = await request.json();
    /*
    // 1. Lấy một đường kết nối từ Pool ra
    connection = await getOracleConnection();

    // 2. Viết câu lệnh SQL truy vấn (Giả định bạn có bảng NHAN_VIEN với các cột tuơng ứng)
    // Sử dụng Bind Variables (:user và :pass) để chống tấn công SQL Injection phá hoại DB
    const sql = `
      SELECT MANV, TENNV, CHUCVU, MATKHAU 
      FROM NHAN_VIEN 
      WHERE (USERNAME = :user OR EMAIL = :user) AND MATKHAU = :pass
    `;

    // 执行 SQL Query
    const result = await connection.execute(
      sql,
      { user: username, pass: password }, // Truyền tham số an toàn
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // Trả kết quả về dạng Object { MANV: '...', TENNV: '...' }
    );

    // 3. Kiểm tra kết quả trả về từ Oracle
    const userRows = result.rows as any[];
    
    if (!userRows || userRows.length === 0) {
      return NextResponse.json(
        { message: "Tài khoản hoặc mật khẩu không chính xác trên hệ thống." },
        { status: 401 }
      );
    }

    const employee = userRows[0]; // Lấy thông tin người dùng tìm thấy đầu tiên

    // 4. XÁC THỰC THÀNH CÔNG -> Đóng gói thông tin thật từ Oracle vào Token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
        userId: employee.MANV, 
        fullName: employee.TENNV, 
        role: employee.CHUCVU 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(secret);

    // 5. Cấp Cookie HttpOnly đưa về trình duyệt
    const response = NextResponse.json({ success: true });
    response.cookies.set("sap_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;*/

    // 2. GIẢ LẬP: Kiểm tra thông tin xác thực (Sau này đoạn này sẽ gọi fetch sang Server riêng hoặc Oracle DB)
    // Mình giả lập tài khoản admin hệ thống để bạn test thử nhé
    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "123456";

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return NextResponse.json(
        { message: "Tài khoản hoặc mật khẩu không chính xác." },
        { status: 401 } // Mã lỗi Unauthorized
      );
    }

    // 3. XÁC THỰC THÀNH CÔNG -> Tạo JSON Web Token (JWT)
    // Mã hóa thông tin cơ bản của User (Id, Role) vào trong Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: "USR_001", role: "ADMIN", username: username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m") // Token có hiệu lực trong 15 phút ngầm bảo mật
      .sign(secret);

    // 4. ĐÓNG GÓI TOKEN VÀO HTTPONLY COOKIE
    const response = NextResponse.json({ 
      success: true, 
      message: "Đăng nhập hệ thống thành công!" 
    });

    // Cấu hình cookie bảo mật tối đa ngăn chặn hacker đọc trộm qua Javascript
    response.cookies.set("sap_session_token", token, {
      httpOnly: true,                                      // Trình duyệt không cho phép JS tiếp cận
      secure: process.env.NODE_ENV === "production",       // Chỉ chạy qua HTTPS khi lên môi trường thật
      sameSite: "strict",                                  // Ngăn chặn các cuộc tấn công giả mạo CSRF
      maxAge: 15 * 60,                                     // Thời gian sống bằng thời gian Token (15 phút)
      path: "/",                                           // Có hiệu lực trên toàn bộ các trang con của hệ thống
    });

    return response;

  } catch (error) {
    console.error("❌ Lỗi kết nối hoặc thực thi Oracle DB:", error);
    return NextResponse.json(
      { message: "Hệ thống trục trặc, không thể xác thực tài khoản lúc này." },
      { status: 500 }
    );
  }/*finally {
    // NGUYÊN TẮC QUAN TRỌNG: Dù thành công hay lỗi, luôn phải giải phóng kết nối
    // để trả nó lại vào Pool cho người khác mượn dùng tiếp.
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Lỗi khi đóng kết nối:", closeError);
      }
    }
  } Tạm close vì chưa database*/
}