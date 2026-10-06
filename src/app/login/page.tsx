"use client";

import { useActionState } from "react";
import Image from "next/image";
import { loginAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/branding/logo-olive.png"
          alt="לוגו המכבים"
          width={96}
          height={96}
          className="rounded-full bg-primary-foreground/5 p-2"
          priority
        />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-primary-foreground">
            המכבים
          </h1>
          <p className="text-sm text-primary-foreground/70">
            תוכנית הכנה לצבא ולחיים
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-primary-foreground/10 bg-card p-6 shadow-xl">
        <h2 className="mb-6 text-center text-lg font-bold text-card-foreground">
          התחברות למערכת
        </h2>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">שם משתמש</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.error ? (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          ) : null}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "מתחבר..." : "התחברות"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-xs text-primary-foreground/50">
        לא זכור לך שם המשתמש או הסיסמה? פנה למאמן או למנהל התוכנית.
      </p>
    </div>
  );
}
