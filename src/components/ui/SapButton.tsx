"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// Sử dụng HTMLMotionProps và ghi đè/bổ sung thuộc tính isLoading
interface SapButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function SapButton({ isLoading, children, className = "", ...props }: SapButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      {...props}
      // Đảm bảo nút bị vô hiệu hóa khi đang tải hoặc khi chủ động truyền disabled từ ngoài vào
      disabled={isLoading || props.disabled}
      className={`w-full rounded-lg bg-[#0a6ed1] py-2.5 font-medium text-sm text-white hover:bg-[#085caf] active:bg-[#064b8f] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed select-none ${className}`}
    >
      {isLoading ? (
        // Hiệu ứng xoay tròn Loading chuẩn
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
}