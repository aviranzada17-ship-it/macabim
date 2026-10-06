import type { MetricUnit } from "@prisma/client";

export const UNIT_LABELS: Record<MetricUnit, string> = {
  REPS: "חזרות",
  TIME_SECONDS: "זמן",
  DISTANCE_METERS: "מטרים",
  FREE_NUMBER: "ערך",
};

export function formatMetricValue(unit: MetricUnit, value: number): string {
  switch (unit) {
    case "TIME_SECONDS": {
      const minutes = Math.floor(value / 60);
      const seconds = Math.round(value % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")} דק'`;
    }
    case "DISTANCE_METERS":
      return `${value.toLocaleString("he-IL")} מ'`;
    case "REPS":
      return `${value.toLocaleString("he-IL")} חזרות`;
    default:
      return `${value.toLocaleString("he-IL")}`;
  }
}

export type ProgressInfo = {
  currentValue: number | null;
  targetValue: number | null;
  gap: number | null;
  percentToGoal: number | null;
  trend: "up" | "down" | "flat" | null;
};

/**
 * מחשב את מצב ההתקדמות מול היעד, בהתחשב בכיוון המדד
 * (האם ערך גבוה יותר נחשב שיפור, כמו במתח, או נמוך יותר, כמו בזמן ריצה).
 */
export function computeProgress(
  entries: { value: number; recordedAt: Date }[],
  targetValue: number | null,
  higherIsBetter: boolean,
): ProgressInfo {
  if (entries.length === 0) {
    return {
      currentValue: null,
      targetValue,
      gap: null,
      percentToGoal: null,
      trend: null,
    };
  }

  const sorted = [...entries].sort(
    (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime(),
  );
  const currentValue = sorted[sorted.length - 1].value;
  const previousValue =
    sorted.length > 1 ? sorted[sorted.length - 2].value : null;

  let trend: ProgressInfo["trend"] = "flat";
  if (previousValue !== null) {
    if (currentValue === previousValue) trend = "flat";
    else if (higherIsBetter)
      trend = currentValue > previousValue ? "up" : "down";
    else trend = currentValue < previousValue ? "up" : "down";
  }

  if (targetValue === null) {
    return {
      currentValue,
      targetValue: null,
      gap: null,
      percentToGoal: null,
      trend,
    };
  }

  const gap = higherIsBetter
    ? targetValue - currentValue
    : currentValue - targetValue;

  // חישוב אחוז התקדמות מתוך המרחק מנקודת ההתחלה (הערך הראשון שנרשם) ליעד
  const startValue = sorted[0].value;
  const totalDistance = Math.abs(targetValue - startValue);
  const traveled = Math.abs(currentValue - startValue);
  const percentToGoal =
    totalDistance === 0 ? 100 : Math.min(100, Math.round((traveled / totalDistance) * 100));

  return { currentValue, targetValue, gap, percentToGoal, trend };
}
