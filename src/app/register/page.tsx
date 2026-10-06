"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerAction, type RegisterState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

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
          <p className="text-sm text-primary-foreground/70">הרשמה לתוכנית</p>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-primary-foreground/10 bg-card p-6 shadow-xl">
        <h2 className="mb-6 text-center text-lg font-bold text-card-foreground">
          יצירת חשבון חדש
        </h2>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">שם מלא</Label>
            <Input id="fullName" name="fullName" autoComplete="name" required autoFocus />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">שם משתמש (באנגלית)</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              dir="ltr"
              className="text-left"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
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
            {pending ? "נרשם..." : "הרשמה והמשך לשאלון"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-sm text-primary-foreground/70">
        כבר יש לכם חשבון?{" "}
        <Link href="/login" className="font-semibold text-accent underline">
          להתחברות
        </Link>
      </p>
    </div>
  );
}
