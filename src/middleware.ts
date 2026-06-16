import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lấy mã Token từ Cookie bảo mật ra
  const token = request.cookies.get("sap_session_token")?.value;

  let isTokenValid = false;

  if (token) {
    try {
      // 2. Giải mã và kiểm tra xem Token có bị giả mạo hoặc hết hạn hay không
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isTokenValid = true; // Token hoàn toàn hợp lệ
    } catch (error) {
      // Nếu Token hết hạn hoặc sai chữ ký bí mật, coi như không hợp lệ
      isTokenValid = false;
    }
  }

  // TÌNH HUỐNG 1: Người dùng cố vào khu vực Dashboard bí mật
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/hr") || pathname.startsWith("/workflow")) {
    if (!isTokenValid) {
      // Chưa đăng nhập -> Ép quay xe về trang Login ngay lập tức
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // TÌNH HUỐNG 2: Người dùng ĐÃ đăng nhập thành công nhưng lại cố tình gõ URL quay lại trang /login
  if (pathname === "/login") {
    if (isTokenValid) {
      // Đã đăng nhập rồi -> Tự động đẩy thẳng vào trang nội bộ, không cho xem lại form Login
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 👉 THÊM NGAY 3 DÒNG NÀY: Nếu là đường dẫn API thì bỏ qua luôn, cho đi thẳng
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Cấu hình danh sách các đường dẫn kích hoạt Middleware này quét qua
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};