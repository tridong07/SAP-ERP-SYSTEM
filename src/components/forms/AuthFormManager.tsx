"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import SapInput from "@/components/ui/SapInput";
import SapButton from "@/components/ui/SapButton";
import { useTranslation } from "@/hook/useTranslation";

type AuthMode = "login" | "forgot" | "reset";

export default function AuthFormManager() {
  const { t, loading } = useTranslation("vi"); // Giả định lang mặc định là vi
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  
  // State lưu trữ tạm thời cho quy trình reset
  const [resetData, setResetData] = useState({ username: "", otp: "" });
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("sap_remember_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. LOGIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const target = e.target as any;
    const usernameVal = target.elements.username.value;
    const passwordVal = target.elements.password.value;

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameVal, password: passwordVal }),
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      if (rememberMe) localStorage.setItem("sap_remember_username", usernameVal);
      else localStorage.removeItem("sap_remember_username");
      
      window.location.href = "/dashboard";
    } catch (error: any) {
      setMessage({ text: error.message || "Đăng nhập thất bại", isError: true });
      setIsLoading(false);
    }
  };

  // 2. FORGOT PASSWORD (Gửi yêu cầu OTP)
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const usernameVal = (e.target as any).elements.username.value;

    try {
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameVal }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResetData({ ...resetData, username: usernameVal });
      setMode("reset");
      setMessage({ text: data.message, isError: false });
    } catch (error: any) {
      setMessage({ text: error.message, isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. RESET PASSWORD (Đổi mật khẩu với OTP)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const target = e.target as any;
    const otp = target.elements.otp.value;
    const newPassword = target.elements.password.value;

    try {
      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: resetData.username, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMode("login");
      setMessage({ text: "Cập nhật mật khẩu thành công!", isError: false });
    } catch (error: any) {
      setMessage({ text: error.message, isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.15 } }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-sm mx-auto my-auto min-h-[360px] flex flex-col justify-center">
      {message.text && (
        <div className={`mb-4 rounded-lg p-3 text-xs font-medium border ${message.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
          {message.text}
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === "login" && (
          <motion.div key="login" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold text-[#222629] mb-1">{t("title", "auth", "System Sign In")}</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <SapInput icon={User} name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
              <SapInput icon={Lock} type="password" name="password" placeholder="Password" required />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  {t("rememberMe", "auth", "Remember me")}
                </label>
                <button type="button" onClick={() => setMode("forgot")} className="text-[#0a6ed1] font-medium">Forgot Password?</button>
              </div>
              <SapButton type="submit" isLoading={isLoading}>Sign In <ArrowRight className="h-4 w-4" /></SapButton>
            </form>
          </motion.div>
        )}

        {mode === "forgot" && (
          <motion.div key="forgot" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold mb-1">Forgot Password</h2>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <SapInput icon={User} name="username" placeholder="Enter your Username" required />
              <SapButton type="submit" isLoading={isLoading}>Send OTP</SapButton>
              <button type="button" onClick={() => setMode("login")} className="flex items-center gap-1 text-xs text-[#0a6ed1]"><ArrowLeft className="h-3 w-3" /> Back</button>
            </form>
          </motion.div>
        )}

        {mode === "reset" && (
          <motion.div key="reset" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold mb-1">Reset Password</h2>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <SapInput icon={KeyRound} name="otp" placeholder="Enter OTP Code" required />
              <SapInput icon={Lock} type="password" name="password" placeholder="New Password" required />
              <SapButton type="submit" isLoading={isLoading}>Update Password</SapButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}