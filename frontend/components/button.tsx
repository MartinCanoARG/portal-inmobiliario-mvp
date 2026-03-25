import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary: "bg-ink text-white hover:bg-slate-800",
  secondary: "bg-gold text-white hover:bg-[#9c733d]",
  ghost: "border border-slate-300 bg-white/80 text-ink hover:bg-white"
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  onClick
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
