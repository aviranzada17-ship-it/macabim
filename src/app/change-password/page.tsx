"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ChangePasswordState = {};

export default function ChangePasswordPage() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialState,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
        <h1 className="mb-1 text-center text-lg font-bold text-card-foreground">
          החלפת סיסמה
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          זו הכניסה הראשונה שלך — יש לבחור סיסמה אישית וחדשה כדי להמשיך.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">סיסמה חדשה</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">אימות סיסמה</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          {state.error ? (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          ) : null}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "שומר..." : "שמירה והמשך"}
          </Button>
        </form>
      </div>
    </div>
  );
}
