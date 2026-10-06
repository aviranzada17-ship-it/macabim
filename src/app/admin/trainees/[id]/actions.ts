"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { coachNoteSchema } from "@/lib/validation";

export type CoachNoteState = {
  error?: string;
};

export async function addCoachNoteAction(
  _prevState: CoachNoteState,
  formData: FormData,
): Promise<CoachNoteState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const traineeId = formData.get("traineeId")?.toString();
  if (!traineeId) return { error: "שגיאה: חניך לא זוהה" };

  const parsed = coachNoteSchema.safeParse({
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.coachNote.create({
    data: {
      traineeId,
      authorId: session.userId,
      content: parsed.data.content,
    },
  });

  revalidatePath(`/admin/trainees/${traineeId}`);
  return {};
}
