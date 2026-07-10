import type { CustomerKpiSummary } from "@/types/admin-customer";

interface CustomerSummaryCardsProps {
  summary: CustomerKpiSummary;
}

const CARDS = [
  { key: "total" as const, label: "전체 고객" },
  { key: "newCount" as const, label: "신규 고객" },
  { key: "inProgressCount" as const, label: "진행중 고객" },
  { key: "completedCount" as const, label: "완료 고객" },
  { key: "dormantCount" as const, label: "휴면 고객" },
];

export function CustomerSummaryCards({ summary }: CustomerSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card) => (
        <section
          key={card.key}
          className="rounded-xl border border-border bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {summary[card.key]}건
          </p>
        </section>
      ))}
    </div>
  );
}
