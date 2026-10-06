"use client";

import { useActionState } from "react";
import type { Goal, MetricDefinition } from "@prisma/client";
import { setGoalAction, type GoalState } from "@/app/app/goals/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMetricValue } from "@/lib/metrics";

const initialState: GoalState = {};

export function GoalForm({
  metric,
  currentGoal,
  traineeId,
}: {
  metric: MetricDefinition;
  currentGoal: Goal | null;
  traineeId?: string;
}) {
  const [state, formAction, pending] = useActionState(setGoalAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{metric.name}</span>
          {currentGoal ? (
            <span className="text-xs font-normal text-muted-foreground">
              יעד נוכחי: {formatMetricValue(metric.unit, currentGoal.targetValue)}
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          {traineeId ? (
            <input type="hidden" name="traineeId" value={traineeId} />
          ) : null}
          <input type="hidden" name="metricId" value={metric.id} />

          <div className="flex min-w-32 flex-1 flex-col gap-1.5">
            <Label htmlFor={`targetValue-${metric.id}`}>ערך יעד</Label>
            <Input
              id={`targetValue-${metric.id}`}
              name="targetValue"
              type="number"
              step="any"
              inputMode="decimal"
              defaultValue={currentGoal?.targetValue ?? undefined}
              required
            />
          </div>

          <div className="flex min-w-32 flex-1 flex-col gap-1.5">
            <Label htmlFor={`targetDate-${metric.id}`}>תאריך יעד (לא חובה)</Label>
            <Input
              id={`targetDate-${metric.id}`}
              name="targetDate"
              type="date"
              defaultValue={
                currentGoal?.targetDate
                  ? new Date(currentGoal.targetDate).toISOString().slice(0, 10)
                  : undefined
              }
            />
          </div>

          <Button type="submit" disabled={pending} variant="secondary">
            {pending ? "שומר..." : currentGoal ? "עדכון יעד" : "הגדרת יעד"}
          </Button>
        </form>
        {state.error ? (
          <p className="mt-2 text-sm font-medium text-destructive">
            {state.error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
