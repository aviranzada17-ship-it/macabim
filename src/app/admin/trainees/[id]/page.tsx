import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeProgress } from "@/lib/metrics";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/trainee/metric-card";
import { MetricEntryForm } from "@/components/trainee/metric-entry-form";
import { GoalForm } from "@/components/trainee/goal-form";
import { ReflectionsList } from "@/components/trainee/reflections-list";
import { ProfileSummary } from "@/components/trainee/profile-summary";
import { CoachNotes } from "@/components/admin/coach-notes";
import {
  ResetPasswordButton,
  ToggleActiveButton,
  AssignGroupSelect,
  DeleteTraineeButton,
} from "@/components/admin/trainee-controls";

export default async function TraineeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.traineeProfile.findUnique({
    where: { id },
    include: {
      user: true,
      group: true,
      metricEntries: { orderBy: { recordedAt: "asc" } },
      goals: { where: { status: "ACTIVE" } },
      reflections: { orderBy: { sessionDate: "desc" } },
      coachNotes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { fullName: true } } },
      },
    },
  });

  if (!profile) notFound();

  const [metrics, groups] = await Promise.all([
    prisma.metricDefinition.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.group.findMany({ orderBy: { name: "asc" } }),
  ]);

  const metricCards = metrics.map((metric) => {
    const entries = profile.metricEntries.filter((e) => e.metricId === metric.id);
    const goal = profile.goals.find((g) => g.metricId === metric.id) ?? null;
    const progress = computeProgress(entries, goal?.targetValue ?? null, metric.higherIsBetter);
    return { metric, entries, goal, progress };
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">
              {profile.user.fullName}
            </h1>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {profile.user.username}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AssignGroupSelect
              traineeProfileId={profile.id}
              groups={groups}
              currentGroupId={profile.groupId}
            />
            <ResetPasswordButton traineeUserId={profile.user.id} />
            <ToggleActiveButton
              traineeUserId={profile.user.id}
              active={profile.user.active}
            />
            <DeleteTraineeButton
              traineeUserId={profile.user.id}
              traineeName={profile.user.fullName}
            />
          </div>
        </CardContent>
      </Card>

      {!profile.onboardingCompleted ? (
        <Card className="border-accent">
          <CardContent className="py-4 text-sm text-foreground">
            החניך עדיין לא השלים את תהליך הקליטה (שאלון ההרשמה).
          </CardContent>
        </Card>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-muted-foreground">מדדים</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {metricCards.map(({ metric, entries, goal, progress }) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              entries={entries}
              goal={goal}
              progress={progress}
            />
          ))}
        </div>

        <details className="rounded-xl border border-border bg-card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            + הזנת תוצאה בשם החניך
          </summary>
          <div className="mt-4">
            <MetricEntryForm metrics={metrics} traineeId={profile.id} />
          </div>
        </details>

        <details className="rounded-xl border border-border bg-card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            הגדרת / עדכון יעדים אישיים
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            {metrics.map((metric) => (
              <GoalForm
                key={metric.id}
                metric={metric}
                currentGoal={profile.goals.find((g) => g.metricId === metric.id) ?? null}
                traineeId={profile.id}
              />
            ))}
          </div>
        </details>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground">
          נקודות שימור ושיפור
        </h2>
        <ReflectionsList reflections={profile.reflections} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground">
          הערות מאמן (פרטי)
        </h2>
        <CoachNotes traineeId={profile.id} notes={profile.coachNotes} />
      </section>

      <section>
        <ProfileSummary profile={profile} />
      </section>
    </div>
  );
}
