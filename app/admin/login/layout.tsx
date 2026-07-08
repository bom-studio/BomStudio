import type { ReactNode } from "react";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-section">{children}</div>;
}
