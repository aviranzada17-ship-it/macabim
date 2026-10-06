"use client";

import { useActionState } from "react";
import { addReflectionAction, type ReflectionState } from "@/app/app/reflections/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ReflectionState = {};

export function ReflectionForm() {
  const [state, formAction, pending] = useActionState(
    addReflectionAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="keepPoint">מה הכי טוב שעשיתי באימון הזה? (לשמר)</Label>
        <Textarea
          id="keepPoint"
          name="keepPoint"
          rows={3}
          required
          placeholder="לדוגמה: שמרתי על קצב יציב לאורך כל הריצה"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="improvePoint">מה הכי חשוב לי לשפר באימון הבא?</Label>
        <Textarea
          id="improvePoint"
          name="improvePoint"
          rows={3}
          required
          placeholder="לדוגמה: להתחיל חימום לפני התרגיל המרכזי"
        />
      </div>

      {state.error ? (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "שומר..." : "שמירה"}
      </Button>
    </form>
  );
}
