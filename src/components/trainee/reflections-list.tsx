import type { ReflectionEntry } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";

export function ReflectionsList({
  reflections,
}: {
  reflections: ReflectionEntry[];
}) {
  if (reflections.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          עדיין לא נרשמו נקודות שימור/שיפור. אחרי האימון הבא, זה הזמן להתחיל!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reflections.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex flex-col gap-2 py-4">
            <p className="text-xs text-muted-foreground">
              {new Date(r.sessionDate).toLocaleDateString("he-IL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-secondary">לשמר</p>
                <p className="text-sm text-foreground">{r.keepPoint}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-accent">לשפר</p>
                <p className="text-sm text-foreground">{r.improvePoint}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
