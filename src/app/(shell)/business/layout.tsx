import { DashboardShell } from "@/components/business/dashboard-shell";

export const metadata = { title: "MajiFlow Business" };

interface LayoutProps {
  children: React.ReactNode;
}

export default function BusinessLayout({ children }: LayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}