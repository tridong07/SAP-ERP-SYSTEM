"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface SapInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export default function SapInput({ icon: Icon, type = "text", ...props }: SapInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-3 focus-within:border-[#0a6ed1] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0a6ed1] transition-all w-full">
      <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
      <input
        type={inputType}
        {...props}
        className="w-full bg-transparent py-2.5 pl-2.5 pr-8 text-sm outline-none text-[#32363a]"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}