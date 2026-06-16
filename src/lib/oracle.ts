import oracledb from "oracledb";

// Đảm bảo thư viện chạy ở chế độ Thin Mode (Không cần Instant Client)
oracledb.initOracleClient(); 

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  poolMin: 2,   // Số lượng kết nối tối thiểu luôn mở sẵn
  poolMax: 10,  // Số lượng kết nối tối đa hệ thống cho phép tạo ra
  poolIncrement: 1,
};

// Khai báo một biến toàn cục ngầm để giữ Pool khi Next.js reload code
const globalForOracle = global as unknown as {
  oraclePool: oracledb.Pool | undefined;
};

export async function getOracleConnection() {
  // Nếu chưa có Pool nào được khởi tạo, tiến hành tạo mới
  if (!globalForOracle.oraclePool) {
    globalForOracle.oraclePool = await oracledb.createPool(dbConfig);
    console.log("⚡ Oracle Connection Pool đã được khởi tạo thành công!");
  }

  // Mượn một đường kết nối (Connection) từ trong Pool ra để dùng
  return globalForOracle.oraclePool.getConnection();
}