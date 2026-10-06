"use client";

import { useActionState } from "react";
import { addCoachNoteAction, type CoachNoteState } from "@/app/admin/trainees/[id]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type NoteWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  author: { fullName: string };
};

const initialState: CoachNoteState = {};

export function CoachNotes({
  traineeId,
  notes,
}: {
  traineeId: string;
  notes: NoteWithAuthor[];
}) {
  const [state, formAction, pending] = useActionState(
    addCoachNoteAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="traineeId" value={traineeId} />
        <Textarea
          name="content"
          rows={3}
          placeholder="הערה פרטית על החניך (גלויה למאמנים ולמנהל בלבד)"
          required
        />
        {state.error ? (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        ) : null}
        <Button type="submit" disabled={pending} size="sm" className="self-start">
          {pending ? "שומר..." : "הוספת הערה"}
        </Button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">אין עדיין הערות.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="py-3">
                <p className="text-sm text-foreground">{note.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {note.author.fullName} ·{" "}
                  {new Date(note.createdAt).toLocaleDateString("he-IL")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
