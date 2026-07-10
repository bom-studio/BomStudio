import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <DashboardCard hover={false} className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </DashboardCard>
  );
}
