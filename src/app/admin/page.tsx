import { prisma } from "@/lib/prisma";
import { TraineesOverviewTable } from "@/components/admin/trainees-overview-table";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";
import { buildTraineeOverviewRows } from "@/lib/trainee-overview";

export default async function AdminDashboardPage() {
  const trainees = await prisma.traineeProfile.findMany({
    include: {
      user: true,
      group: true,
      metricEntries: { orderBy: { recordedAt: "desc" }, take: 1 },
      reflections: { orderBy: { sessionDate: "desc" }, take: 1 },
    },
    orderBy: { joinedAt: "desc" },
  });

  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });

  // eslint-disable-next-line react-hooks/purity -- רכיב שרת אסינכרוני שמרונדר פעם אחת לבקשה, לא כפוף לחוקי טוהר של רינדור בצד הלקוח
  const rows = buildTraineeOverviewRows(trainees, Date.now());

  const activeCount = rows.filter((r) => r.status === "active").length;
  const staleCount = rows.filter(
    (r) => r.status === "stale" || r.status === "none",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">מבט כללי</h1>
        <p className="text-sm text-muted-foreground">
          תמונת מצב מהירה על כל החניכים בתוכנית.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="size-8 text-primary" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                {rows.length}
              </p>
              <p className="text-xs text-muted-foreground">חניכים פעילים במערכת</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <TrendingUp className="size-8 text-secondary" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                {activeCount}
              </p>
              <p className="text-xs text-muted-foreground">
                עדכנו נתונים בשבוע האחרון
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-8 text-destructive" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                {staleCount}
              </p>
              <p className="text-xs text-muted-foreground">
                דורשים תשומת לב (ללא עדכון מעל שבועיים)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TraineesOverviewTable rows={rows} groups={groups} />
    </div>
  );
}
