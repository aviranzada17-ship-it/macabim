import { prisma } from "@/lib/prisma";
import { GroupsManager } from "@/components/admin/groups-manager";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { trainees: true } } },
  });

  const rows = groups.map((g) => ({
    id: g.id,
    name: g.name,
    traineeCount: g._count.trainees,
  }));

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          ניהול קבוצות
        </h1>
        <p className="text-sm text-muted-foreground">
          ארגנו את החניכים לקבוצות אימון.
        </p>
      </div>

      <GroupsManager groups={rows} />
    </div>
  );
}
