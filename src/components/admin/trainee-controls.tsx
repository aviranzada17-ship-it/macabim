"use client";

import { useState, useTransition } from "react";
import type { Group } from "@prisma/client";
import {
  resetTraineePasswordAction,
  setTraineeActiveAction,
  assignGroupAction,
  deleteTraineeAction,
} from "@/app/admin/trainees/actions";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { KeyRound, Ban, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ResetPasswordButton({ traineeUserId }: { traineeUserId: string }) {
  const [pending, startTransition] = useTransition();
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const result = await resetTraineePasswordAction(traineeUserId);
      if (result.tempPassword) {
        setTempPassword(result.tempPassword);
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  }

  if (tempPassword) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-sm">
        <KeyRound className="size-4 text-muted-foreground" />
        סיסמה זמנית חדשה: <strong>{tempPassword}</strong>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={pending}>
      <KeyRound className="size-4" />
      {pending ? "מאפס..." : "איפוס סיסמה"}
    </Button>
  );
}

export function ToggleActiveButton({
  traineeUserId,
  active,
}: {
  traineeUserId: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(active);

  function handleClick() {
    startTransition(async () => {
      await setTraineeActiveAction(traineeUserId, !isActive);
      setIsActive(!isActive);
      toast.success(!isActive ? "החניך הופעל מחדש" : "החניך הושבת");
    });
  }

  return (
    <Button
      variant={isActive ? "outline" : "secondary"}
      size="sm"
      onClick={handleClick}
      disabled={pending}
    >
      {isActive ? <Ban className="size-4" /> : <CheckCircle className="size-4" />}
      {pending ? "מעדכן..." : isActive ? "השבתת חניך" : "הפעלת חניך"}
    </Button>
  );
}

export function DeleteTraineeButton({
  traineeUserId,
  traineeName,
}: {
  traineeUserId: string;
  traineeName: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (
      !window.confirm(
        `למחוק את ${traineeName} לצמיתות? כל הנתונים שלו (מדדים, יעדים, נקודות ושאלון) יימחקו ולא ניתן לשחזר.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteTraineeAction(traineeUserId);
    });
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleClick} disabled={pending}>
      <Trash2 className="size-4" />
      {pending ? "מוחק..." : "מחיקת חניך"}
    </Button>
  );
}

export function AssignGroupSelect({
  traineeProfileId,
  groups,
  currentGroupId,
}: {
  traineeProfileId: string;
  groups: Group[];
  currentGroupId: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <NativeSelect
      defaultValue={currentGroupId ?? ""}
      disabled={pending}
      className="max-w-48"
      onChange={(e) => {
        const value = e.target.value || null;
        startTransition(async () => {
          await assignGroupAction(traineeProfileId, value);
          toast.success("הקבוצה עודכנה");
        });
      }}
    >
      <option value="">ללא שיוך לקבוצה</option>
      {groups.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </NativeSelect>
  );
}
