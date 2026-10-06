"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Goal, MetricDefinition, MetricEntry } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatMetricValue, type ProgressInfo } from "@/lib/metrics";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const TREND_META = {
  up: { icon: TrendingUp, label: "משתפר", className: "bg-secondary text-secondary-foreground" },
  down: { icon: TrendingDown, label: "בירידה", className: "bg-destructive text-white" },
  flat: { icon: Minus, label: "יציב", className: "bg-muted text-muted-foreground" },
};

export function MetricCard({
  metric,
  entries,
  goal,
  progress,
}: {
  metric: MetricDefinition;
  entries: MetricEntry[];
  goal: Goal | null;
  progress: ProgressInfo;
}) {
  const chartData = entries.map((e) => ({
    date: new Date(e.recordedAt).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
    }),
    value: e.value,
  }));

  const trend = progress.trend ? TREND_META[progress.trend] : null;
  const TrendIcon = trend?.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{metric.name}</CardTitle>
        {trend ? (
          <Badge className={trend.className} variant="secondary">
            {TrendIcon ? <TrendIcon className="ms-1 size-3" /> : null}
            {trend.label}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">ערך נוכחי</p>
            <p className="text-2xl font-extrabold text-foreground">
              {progress.currentValue !== null
                ? formatMetricValue(metric.unit, progress.currentValue)
                : "אין נתונים עדיין"}
            </p>
          </div>
          {goal ? (
            <div className="text-end">
              <p className="text-xs text-muted-foreground">יעד</p>
              <p className="text-sm font-semibold text-foreground">
                {formatMetricValue(metric.unit, goal.targetValue)}
              </p>
            </div>
          ) : null}
        </div>

        {goal && progress.percentToGoal !== null ? (
          <div className="flex flex-col gap-1.5">
            <Progress value={progress.percentToGoal} />
            <p className="text-xs text-muted-foreground">
              {progress.gap !== null && progress.gap > 0
                ? `נשארו ${formatMetricValue(metric.unit, Math.abs(progress.gap))} עד היעד`
                : "היעד הושג! 🎯"}
            </p>
          </div>
        ) : !goal ? (
          <p className="text-xs text-muted-foreground">
            עדיין לא הוגדר יעד אישי למדד הזה.
          </p>
        ) : null}

        {chartData.length >= 2 ? (
          <div className="h-32 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip
                  contentStyle={{
                    direction: "rtl",
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value) => [
                    formatMetricValue(metric.unit, Number(value)),
                    "ערך",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            דרושים לפחות שני רישומים כדי להציג גרף התקדמות.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
