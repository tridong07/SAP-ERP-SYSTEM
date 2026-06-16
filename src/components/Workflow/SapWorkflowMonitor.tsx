"use client";
import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export default function SapWorkflowMonitor() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sap_requests") || "[]");
    setRequests(data);
  }, []);

  const getStatusUI = (status: string) => {
    if (status === "PENDING") return <span className="text-amber-600 flex items-center gap-1 font-bold text-[10px]"><Clock size={12}/> CHỜ DUYỆT</span>;
    if (status === "APPROVED") return <span className="text-emerald-600 flex items-center gap-1 font-bold text-[10px]"><CheckCircle2 size={12}/> ĐÃ DUYỆT</span>;
    return <span className="text-red-600 flex items-center gap-1 font-bold text-[10px]"><XCircle size={12}/> TỪ CHỐI</span>;
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-6">Danh sách đơn trình ký</h2>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-3 text-left">LOẠI ĐƠN</th>
              <th className="p-3 text-left">NGÀY GỬI</th>
              <th className="p-3 text-left">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req: any) => (
              <tr key={req.id} className="border-b hover:bg-zinc-50">
                <td className="p-3 font-bold">{req.docType}</td>
                <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{getStatusUI(req.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}