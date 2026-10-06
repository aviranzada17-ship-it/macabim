import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalForm } from "@/components/trainee/goal-form";

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.traineeProfile.findUnique({
    where: { userId: session.userId },
    include: { goals: { where: { status: "ACTIVE" } } },
  });
  if (!profile) redirect("/login");

  const metrics = await prisma.metricDefinition.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          היעדים האישיים שלי
        </h1>
        <p className="text-sm text-muted-foreground">
          הצב יעד לכל מדד כדי לראות את ההתקדמות שלך מולו בעמוד הבית.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {metrics.map((metric) => (
          <GoalForm
            key={metric.id}
            metric={metric}
            currentGoal={
              profile.goals.find((g) => g.metricId === metric.id) ?? null
            }
          />
        ))}
      </div>
    </div>
  );
}
