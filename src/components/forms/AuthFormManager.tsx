"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import SapInput from "@/components/ui/SapInput";
import SapButton from "@/components/ui/SapButton";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import hook ngôn ngữ

type AuthMode = "login" | "forgot" | "reset";

export default function AuthFormManager() {
  const { t } = useLanguage(); // 2. Lấy bộ từ dịch thuật ra
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Khai báo State cho tính năng Ghi nhớ
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // useEffect này chạy khi vừa mở trang để kiểm tra xem lần trước có lưu không
  useEffect(() => {
    const savedUsername = localStorage.getItem("sap_remember_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // 1. Xử lý Logic Đăng Nhập
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    const target = e.target as any;
    const username = target.elements.username.value;
    const password = target.elements.password.value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ text: data.message || "Đăng nhập thất bại", isError: true });
      } else {
        // XỬ LÝ GHI NHỚ TÀI KHOẢN KHI ĐĂNG NHẬP THÀNH CÔNG
        if (rememberMe) {
          localStorage.setItem("sap_remember_username", username);
        } else {
          localStorage.removeItem("sap_remember_username");
        }

        window.location.href = "/dashboard";
      }
    } catch (error) {
      setMessage({ text: "Lỗi kết nối server.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Xử lý Logic Quên Mật Khẩu
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    // Giả lập gọi API gửi mã OTP/Link khôi phục của Backend
    setTimeout(() => {
      setIsLoading(false);
      setMode("reset"); // Chuyển sang bước tiếp theo
      setMessage({ text: "Hệ thống xác thực thành công! Vui lòng đặt mật khẩu mới.", isError: false });
    }, 1500);
  };

  // 3. Xử lý Logic Đặt Lại Mật Khẩu
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const target = e.target as any;
    const password = target.elements.password.value;
    const confirmPassword = target.elements.confirmPassword.value;

    if (password !== confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không trùng khớp.", isError: true });
      setIsLoading(false);
      return;
    }

    // Giả lập cập nhật mật khẩu mới vào Oracle DB thông qua API Backend
    setTimeout(() => {
      setIsLoading(false);
      setMode("login"); // Đổi xong quay về màn hình Login
      setMessage({ text: "Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.", isError: false });
    }, 1500);
  };

  // Cấu hình animation mượt mà khi đổi form
  const fadeVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.15 } }
  };

  return (
    <div className="w-full max-w-sm mx-auto my-auto min-h-[360px] flex flex-col justify-center">
      {message.text && (
        <div className={`mb-4 rounded-lg p-3 text-xs font-medium border ${message.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
          {message.text}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* CHỂ ĐỘ 1: FORM ĐĂNG NHẬP */}
        {mode === "login" && (
          <motion.div key="login" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold text-[#222629] mb-1">{t.title}</h2>
            <p className="text-xs text-[#6a6d70] mb-6">{t.subtitle}</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <SapInput icon={User} type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernamePlaceholder} autoComplete="username" required />
              <SapInput icon={Lock} type="password" name="password" placeholder={t.passwordPlaceholder} autoComplete="current-password" required />
              
              {/* Khu vực chức năng: Ghi nhớ & Quên mật khẩu */}
              <div className="flex items-center justify-between text-xs select-none">
                <label className="flex items-center gap-2 text-[#556b82] cursor-pointer">
                  <input type="checkbox"  checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-[#0a6ed1] focus:ring-[#0a6ed1] cursor-pointer transition-colors"/>
                  {t.rememberMe}
                </label>

                <button type="button" onClick={() => { setMode("forgot"); setMessage({text:"", isError:false}); }} className="text-[#0a6ed1] hover:underline focus:outline-none font-medium">
                  {t.forgotPasswordLink}
                </button>
              </div>

              <SapButton type="submit" isLoading={isLoading}>
                {t.submitBtn} <ArrowRight className="h-4 w-4" />
              </SapButton>
            </form>
          </motion.div>
        )}

        {/* CHẾ ĐỘ 2: FORM QUÊN MẬT KHẨU */}
        {mode === "forgot" && (
          <motion.div key="forgot" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold text-[#222629] mb-1">{t.forgotTitle}</h2>
            <p className="text-xs text-[#6a6d70] mb-6">{t.forgotSubtitle}</p>
            
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <SapInput icon={Mail} type="email" name="email" placeholder={t.emailPlaceholder} required />
              <SapButton type="submit" isLoading={isLoading}>{t.forgotBtn}</SapButton>
              <div className="text-center pt-2">
                <button type="button" onClick={() => { setMode("login"); setMessage({text:"", isError:false}); }} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0a6ed1] hover:underline focus:outline-none">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t.backToLogin}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* CHẾ ĐỘ 3: FORM ĐẶT LẠI MẬT KHẨU */}
        {mode === "reset" && (
          <motion.div key="reset" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-2xl font-semibold text-[#222629] mb-1">{t.resetTitle}</h2>
            <p className="text-xs text-[#6a6d70] mb-6">{t.resetSubtitle}</p>
            
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <SapInput icon={Lock} type="password" name="password" placeholder={t.newPasswordPlaceholder} required />
              <SapInput icon={Lock} type="password" name="confirmPassword" placeholder={t.confirmPasswordPlaceholder} required />
              <SapButton type="submit" isLoading={isLoading}>{t.resetBtn}</SapButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}