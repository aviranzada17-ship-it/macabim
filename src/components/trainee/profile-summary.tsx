import type { Group, TraineeProfile } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileWithGroup = TraineeProfile & {
  group: Group | null;
  user: { fullName: string; phone: string | null };
};

const FIELDS: { key: keyof TraineeProfile; label: string }[] = [
  { key: "lastName", label: "שם משפחה" },
  { key: "parentName", label: "שם ההורה" },
  { key: "parentPhone", label: "טלפון ההורה" },
  { key: "school", label: "בית ספר" },
  { key: "grade", label: "כיתה" },
  { key: "bio", label: "קצת עליי" },
  { key: "enlistmentGoal", label: "לאן רוצה להתגייס" },
  { key: "yearImportance", label: "מה חשוב מהשנה הנוכחית" },
  { key: "strengths", label: "יתרונות בולטים" },
  { key: "weakness", label: "נקודה לשיפור" },
  { key: "importantToKnow", label: "חשוב שנדע" },
  { key: "howFound", label: "איך הגיע לתוכנית" },
  { key: "investmentLevel", label: "רמת ההשקעה" },
];

export function ProfileSummary({
  profile,
  title = "פרופיל הקליטה",
}: {
  profile: ProfileWithGroup;
  title?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {profile.user.phone ? (
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">
                טלפון החניך
              </dt>
              <dd className="text-sm text-foreground" dir="ltr">
                {profile.user.phone}
              </dd>
            </div>
          ) : null}
          {FIELDS.map(({ key, label }) => {
            const value = profile[key];
            if (!value) return null;
            return (
              <div key={key}>
                <dt className="text-xs font-semibold text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-sm text-foreground">{String(value)}</dd>
              </div>
            );
          })}
          {profile.group ? (
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">
                קבוצה
              </dt>
              <dd className="text-sm text-foreground">{profile.group.name}</dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  );
}
