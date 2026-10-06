import { prisma } from "@/lib/prisma";
import { CreateTraineeForm } from "@/components/admin/create-trainee-form";

export default async function NewTraineePage() {
  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          הוספת חניך חדש
        </h1>
        <p className="text-sm text-muted-foreground">
          המערכת תייצר שם משתמש וסיסמה זמנית למסירה לחניך.
        </p>
      </div>

      <CreateTraineeForm groups={groups} />
    </div>
  );
}
