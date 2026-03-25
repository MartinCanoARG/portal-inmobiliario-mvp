import { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`section-shell ${className}`.trim()}>{children}</div>;
}
