import { prisma } from "@/lib/prisma";
import { MetricsManager } from "@/components/admin/metrics-manager";

export default async function MetricsPage() {
  const metrics = await prisma.metricDefinition.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          ניהול מדדים
        </h1>
        <p className="text-sm text-muted-foreground">
          הגדירו אילו מדדים פיזיים/מנטליים ניתן לעקוב אחריהם בתוכנית.
        </p>
      </div>

      <MetricsManager metrics={metrics} />
    </div>
  );
}
