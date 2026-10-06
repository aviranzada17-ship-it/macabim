"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Group } from "@prisma/client";
import {
  createTraineeAction,
  type CreateTraineeState,
} from "@/app/admin/trainees/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";
import { suggestUsername } from "@/lib/generate";
import { CheckCircle2 } from "lucide-react";

const initialState: CreateTraineeState = {};

export function CreateTraineeForm({ groups }: { groups: Group[] }) {
  const [state, formAction, pending] = useActionState(
    createTraineeAction,
    initialState,
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [username, setUsername] = useState("");

  const suggested = suggestUsername(firstName, lastName);

  if (state.success) {
    return (
      <Card className="border-secondary">
        <CardContent className="flex flex-col gap-4 py-6">
          <div className="flex items-center gap-2 text-secondary">
            <CheckCircle2 className="size-6" />
            <h2 className="text-lg font-bold">
              החניך {state.success.fullName} נוצר בהצלחה!
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            יש למסור לחניך את פרטי ההתחברות הבאים. בכניסה הראשונה הוא יתבקש
            לבחור סיסמה אישית ולמלא שאלון קליטה קצר.
          </p>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span>שם משתמש:</span>
              <strong>{state.success.username}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>סיסמה זמנית:</span>
              <strong>{state.success.tempPassword}</strong>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/admin/trainees/${state.success.traineeId}`}>
                מעבר לפרופיל החניך
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/trainees/new">הוספת חניך נוסף</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">שם פרטי</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">שם משפחה</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">שם משתמש (באנגלית)</Label>
        <Input
          id="username"
          name="username"
          required
          value={usernameTouched ? username : suggested}
          onChange={(e) => {
            setUsernameTouched(true);
            setUsername(e.target.value);
          }}
          dir="ltr"
          className="text-left"
        />
        <p className="text-xs text-muted-foreground">
          הצעה אוטומטית לפי השם, ניתן לערוך. אותיות אנגליות, מספרים, נקודה
          וקו תחתון בלבד.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="groupId">קבוצה</Label>
        <NativeSelect id="groupId" name="groupId" defaultValue="">
          <option value="">ללא שיוך לקבוצה</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      {state.error ? (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "יוצר..." : "יצירת חניך"}
      </Button>
    </form>
  );
}
