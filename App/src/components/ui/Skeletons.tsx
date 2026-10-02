export function SkeletonCard() {
  return (
    <div className="finops-card animate-pulse p-5">
      <div className="space-y-3">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-7 w-32 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="finops-card animate-pulse p-5">
      <div className="mb-4 h-4 w-40 rounded bg-muted" />
      <div className="h-64 rounded bg-muted" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="finops-card animate-pulse p-5">
      <div className="mb-4 h-4 w-40 rounded bg-muted" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}
