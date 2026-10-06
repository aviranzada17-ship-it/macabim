import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeProgress } from "@/lib/metrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Target } from "lucide-react";
import { MetricCard } from "@/components/trainee/metric-card";
import { ProfileSummary } from "@/components/trainee/profile-summary";
import { ReflectionsList } from "@/components/trainee/reflections-list";

export default async function TraineeDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.traineeProfile.findUnique({
    where: { userId: session.userId },
    include: {
      group: true,
      metricEntries: { orderBy: { recordedAt: "asc" } },
      goals: { where: { status: "ACTIVE" } },
      reflections: { orderBy: { sessionDate: "desc" }, take: 8 },
    },
  });

  if (!profile) redirect("/login");
  if (!profile.onboardingCompleted) redirect("/onboarding");

  const metrics = await prisma.metricDefinition.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const metricCards = metrics.map((metric) => {
    const entries = profile.metricEntries.filter(
      (e) => e.metricId === metric.id,
    );
    const goal = profile.goals.find((g) => g.metricId === metric.id) ?? null;
    const progress = computeProgress(
      entries,
      goal?.targetValue ?? null,
      metric.higherIsBetter,
    );
    return { metric, entries, goal, progress };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          היי {session.fullName.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          הנה תמונת המצב שלך – איפה אתה עומד מול היעדים שהצבת.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          asChild
          size="lg"
          className="h-auto min-w-0 flex-col gap-1 py-4 whitespace-normal"
        >
          <Link href="/app/metrics/new">
            <Plus className="size-5" />
            <span>הזנת מדד</span>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="h-auto min-w-0 flex-col gap-1 py-4 whitespace-normal"
        >
          <Link href="/app/reflections/new">
            <Target className="size-5" />
            <span>נקודת שימור/שיפור</span>
          </Link>
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">
            המדדים שלי
          </h2>
          <Link
            href="/app/goals"
            className="text-xs font-semibold text-primary hover:underline"
          >
            ניהול יעדים
          </Link>
        </div>
        {metricCards.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              עדיין לא הוגדרו מדדים במערכת.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
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
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">
            נקודות שימור ושיפור אחרונות
          </h2>
          <Link
            href="/app/reflections/new"
            className="text-xs font-semibold text-primary hover:underline"
          >
            הוספת נקודה +
          </Link>
        </div>
        <ReflectionsList reflections={profile.reflections} />
      </section>

      <section>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="size-4 text-accent" />
              תוכנית אישית מבוססת AI
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            בקרוב: תוכנית אימון אישית שתיבנה במיוחד עבורך על בסיס המדדים
            וההתקדמות שלך. אנחנו עובדים על זה 💪
          </CardContent>
        </Card>
      </section>

      <section>
        <ProfileSummary profile={profile} title="פרופיל הקליטה שלי" />
      </section>
    </div>
  );
}
