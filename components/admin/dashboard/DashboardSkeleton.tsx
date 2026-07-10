function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/60 ${className ?? ""}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-64" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
        <SkeletonBlock className="h-9 w-48" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-52" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SkeletonBlock className="h-[380px] xl:col-span-2" />
        <SkeletonBlock className="h-[380px]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72 lg:col-span-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </div>

      <SkeletonBlock className="h-40" />
      <SkeletonBlock className="h-[380px]" />
    </div>
  );
}
