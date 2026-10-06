import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { MetricEntryForm } from "@/components/trainee/metric-entry-form";

export default async function NewMetricEntryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const metrics = await prisma.metricDefinition.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">הזנת מדד</h1>
        <p className="text-sm text-muted-foreground">
          רשמת תוצאה חדשה באימון? תעדכן כאן ותראה את ההתקדמות שלך מתעדכנת מיד.
        </p>
      </div>

      <MetricEntryForm metrics={metrics} />
    </div>
  );
}
