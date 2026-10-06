"use client";

import { useActionState } from "react";
import type { MetricDefinition } from "@prisma/client";
import {
  addMetricEntryAction,
  type MetricEntryState,
} from "@/app/app/metrics/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { UNIT_LABELS } from "@/lib/metrics";

const initialState: MetricEntryState = {};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function MetricEntryForm({
  metrics,
  traineeId,
}: {
  metrics: MetricDefinition[];
  traineeId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    addMetricEntryAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {traineeId ? (
        <input type="hidden" name="traineeId" value={traineeId} />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="metricId">מדד</Label>
        <NativeSelect id="metricId" name="metricId" required defaultValue="">
          <option value="" disabled>
            בחר מדד
          </option>
          {metrics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({UNIT_LABELS[m.unit]})
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="value">ערך</Label>
        <Input
          id="value"
          name="value"
          type="number"
          step="any"
          inputMode="decimal"
          required
          placeholder="לדוגמה: 14 (חזרות) או 540 (שניות)"
        />
        <p className="text-xs text-muted-foreground">
          עבור מדדי זמן יש להזין שניות (לדוגמה 9:30 דק׳ = 570)
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="recordedAt">תאריך</Label>
        <Input
          id="recordedAt"
          name="recordedAt"
          type="date"
          defaultValue={todayStr()}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">הערה (לא חובה)</Label>
        <Textarea id="note" name="note" rows={2} />
      </div>

      {state.error ? (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "שומר..." : "שמירת תוצאה"}
      </Button>
    </form>
  );
}
