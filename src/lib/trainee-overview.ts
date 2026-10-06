export type TraineeOverviewSource = {
  id: string;
  user: { fullName: string; username: string; active: boolean };
  group: { name: string } | null;
  groupId: string | null;
  onboardingCompleted: boolean;
  metricEntries: { recordedAt: Date }[];
  reflections: { sessionDate: Date }[];
};

export type TraineeOverviewRow = {
  id: string;
  fullName: string;
  username: string;
  groupName: string | null;
  groupId: string | null;
  onboardingCompleted: boolean;
  active: boolean;
  daysSince: number | null;
  status: "active" | "warning" | "stale" | "none";
};

export function buildTraineeOverviewRows(
  trainees: TraineeOverviewSource[],
  now: number,
): TraineeOverviewRow[] {
  return trainees.map((t) => {
    const lastMetricDate = t.metricEntries[0]?.recordedAt ?? null;
    const lastReflectionDate = t.reflections[0]?.sessionDate ?? null;
    const lastActivity = [lastMetricDate, lastReflectionDate]
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const daysSince = lastActivity
      ? Math.floor((now - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    let status: TraineeOverviewRow["status"] = "none";
    if (daysSince !== null) {
      if (daysSince <= 7) status = "active";
      else if (daysSince <= 14) status = "warning";
      else status = "stale";
    }

    return {
      id: t.id,
      fullName: t.user.fullName,
      username: t.user.username,
      groupName: t.group?.name ?? null,
      groupId: t.groupId,
      onboardingCompleted: t.onboardingCompleted,
      active: t.user.active,
      daysSince,
      status,
    };
  });
}
