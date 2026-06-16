import { ALL_DATA_SOURCES } from "../../../lib/data-sources";

type InputMode =
  | "MANUAL" // Nhập tay
  | "DROPDOWN" // Chọn từ danh mục (DBA)
  | "AUTO_GEN" // STT/Mã tự sinh
  | "SYSTEM_DATE" // Ngày hiện tại
  | "COMPUTED" // Cột tính toán (Công thức)
  | "RELATION"; // Lấy dữ liệu liên kết (Lookup từ bảng khác)

export const InputModeSelector = ({ col, onUpdate }: any) => (
  <div className="space-y-3">
    <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.inputMode} onChange={(e) => onUpdate({ inputMode: e.target.value as InputMode })}>
      <optgroup label="Nhập liệu">
        <option value="MANUAL">Nhập tay</option>
        <option value="SYSTEM_DATE">Ngày hiện tại</option>
      </optgroup>
      <optgroup label="Dữ liệu hệ thống">
        <option value="DROPDOWN">Chọn từ danh mục (DBA)</option>
        <option value="RELATION">Dữ liệu liên kết</option>
      </optgroup>
      <optgroup label="Tự động">
        <option value="AUTO_GEN">Tự sinh mã</option>
        <option value="COMPUTED">Công thức tính toán</option>
      </optgroup>
    </select>

    {/* Dòng định dạng: Canh lề | Cỡ chữ | Đậm */}
    <div className="flex gap-1">
      {/* 1. Canh lề Dropdown */}
      <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.align || "left"} onChange={(e) => onUpdate({ align: e.target.value as Align })}>
        <option value="left">Trái</option>
        <option value="center">Giữa</option>
        <option value="right">Phải</option>
      </select>

      {/* 2. Cỡ chữ Dropdown */}
      <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.fontSize || 14} onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}>
        {[10, 12, 14, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}
      </select>

      {/* 3. Đậm/Nhạt (Sử dụng Select cho đồng bộ) */}
      <select className="w-full p-1.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={col.isBold ? "bold" : "normal"} onChange={(e) => onUpdate({ isBold: e.target.value === "bold" })}>
        <option value="normal">Thường</option>
        <option value="bold">Đậm</option>
      </select>
    </div>

    {col.inputMode === "DROPDOWN" && (
      <select className="w-full p-2 border rounded-lg text-xs" value={col.source || ""} onChange={(e) => onUpdate({ source: e.target.value })}>
        <option value="">Chọn nguồn...</option>
        {Object.entries(ALL_DATA_SOURCES).map(([id, ds]: any) => (
          <option key={id} value={id}>{ds.label}</option>
        ))}
      </select>
    )}
    
    {col.inputMode === "COMPUTED" && (
      <input className="w-full p-2 border rounded-lg text-xs" placeholder="Công thức (vd: col_01 * 0.1)" value={col.formula || ""} onChange={(e) => onUpdate({ formula: e.target.value })}/>
    )}
  </div>
);