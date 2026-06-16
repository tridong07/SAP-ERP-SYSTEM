import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  
  // Xóa cookie bằng cách đặt thời gian hết hạn về quá khứ (năm 1970)
  response.cookies.set("sap_session_token", "", {
    httpOnly: true,
    expires: new Date(0), // Lệnh xóa cookie chuẩn trình duyệt
    path: "/",
  });

  return response;
}