"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavLink({ href, icon: Icon, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all select-none ${
        isActive
          ? "bg-[#0a6ed1] text-white shadow-sm font-semibold"
          : "text-[#32363a] hover:bg-zinc-100 active:bg-zinc-200"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
      <span>{children}</span>
    </Link>
  );
}