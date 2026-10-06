"use client";

import { useActionState, useState, useTransition } from "react";
import type { MetricDefinition } from "@prisma/client";
import {
  createMetricAction,
  updateMetricAction,
  toggleMetricActiveAction,
  type MetricDefinitionState,
} from "@/app/admin/metrics/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UNIT_LABELS } from "@/lib/metrics";
import { Pencil, Plus } from "lucide-react";

const initialState: MetricDefinitionState = {};

const UNIT_OPTIONS: { value: string; label: string }[] = [
  { value: "REPS", label: "חזרות" },
  { value: "TIME_SECONDS", label: "זמן (שניות)" },
  { value: "DISTANCE_METERS", label: "מרחק (מטרים)" },
  { value: "FREE_NUMBER", label: "ערך מספרי חופשי" },
];

function MetricForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: MetricDefinitionState, formData: FormData) => Promise<MetricDefinitionState>;
  defaultValues?: Partial<MetricDefinition>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">שם המדד</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unit">יחידת מידה</Label>
        <NativeSelect
          id="unit"
          name="unit"
          required
          defaultValue={defaultValues?.unit ?? ""}
        >
          <option value="" disabled>
            בחר יחידה
          </option>
          {UNIT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="higherIsBetter">כיוון שיפור</Label>
        <NativeSelect
          id="higherIsBetter"
          name="higherIsBetter"
          defaultValue={
            defaultValues?.higherIsBetter === undefined
              ? "true"
              : String(defaultValues.higherIsBetter)
          }
        >
          <option value="true">ערך גבוה יותר = שיפור (לדוגמה מתח)</option>
          <option value="false">ערך נמוך יותר = שיפור (לדוגמה זמן ריצה)</option>
        </NativeSelect>
      </div>

      {state.error ? (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "שומר..." : submitLabel}
      </Button>
    </form>
  );
}

function EditMetricDialog({ metric }: { metric: MetricDefinition }) {
  const action = updateMetricAction.bind(null, metric.id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="עריכת מדד">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>עריכת מדד: {metric.name}</DialogTitle>
        </DialogHeader>
        <MetricForm action={action} defaultValues={metric} submitLabel="שמירת שינויים" />
      </DialogContent>
    </Dialog>
  );
}

function MetricActiveToggle({ metric }: { metric: MetricDefinition }) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(metric.active);

  return (
    <Button
      variant={active ? "outline" : "secondary"}
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleMetricActiveAction(metric.id, !active);
          setActive(!active);
        })
      }
    >
      {active ? "השבתת מדד" : "הפעלת מדד"}
    </Button>
  );
}

export function MetricsManager({ metrics }: { metrics: MetricDefinition[] }) {
  return (
    <div className="flex flex-col gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="self-start">
            <Plus className="size-4" />
            הוספת מדד חדש
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוספת מדד חדש</DialogTitle>
          </DialogHeader>
          <MetricForm action={createMetricAction} submitLabel="יצירת מדד" />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-foreground">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {UNIT_LABELS[metric.unit]} ·{" "}
                    {metric.higherIsBetter ? "גבוה יותר = שיפור" : "נמוך יותר = שיפור"}
                  </p>
                </div>
                {!metric.active ? (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    לא פעיל
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <EditMetricDialog metric={metric} />
                <MetricActiveToggle metric={metric} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
