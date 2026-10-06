"use client";

import { useActionState, useTransition } from "react";
import {
  createGroupAction,
  renameGroupAction,
  deleteGroupAction,
  type GroupFormState,
} from "@/app/admin/groups/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const initialState: GroupFormState = {};

type GroupRow = { id: string; name: string; traineeCount: number };

function RenameGroupForm({ group }: { group: GroupRow }) {
  const action = renameGroupAction.bind(null, group.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Input name="name" defaultValue={group.name} className="max-w-48" />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "שומר..." : "עדכון שם"}
      </Button>
      {state.error ? (
        <span className="text-xs text-destructive">{state.error}</span>
      ) : null}
    </form>
  );
}

function DeleteGroupButton({ group }: { group: GroupRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending || group.traineeCount > 0}
      title={
        group.traineeCount > 0
          ? "לא ניתן למחוק קבוצה עם חניכים משויכים"
          : "מחיקת קבוצה"
      }
      onClick={() =>
        startTransition(async () => {
          const result = await deleteGroupAction(group.id);
          if (result?.error) toast.error(result.error);
        })
      }
    >
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}

export function GroupsManager({ groups }: { groups: GroupRow[] }) {
  const [createState, createFormAction, createPending] = useActionState(
    createGroupAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="py-4">
          <form action={createFormAction} className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="name">שם קבוצה חדשה</Label>
              <Input id="name" name="name" required placeholder='לדוגמה: קבוצה ב' />
            </div>
            <Button type="submit" disabled={createPending}>
              <Plus className="size-4" />
              יצירה
            </Button>
          </form>
          {createState.error ? (
            <p className="mt-2 text-sm font-medium text-destructive">
              {createState.error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <RenameGroupForm group={group} />
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {group.traineeCount} חניכים
                </span>
                <DeleteGroupButton group={group} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
