import { ReflectionForm } from "@/components/trainee/reflection-form";

export default function NewReflectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">
          נקודת שימור ושיפור
        </h1>
        <p className="text-sm text-muted-foreground">
          כמה רגעים אחרי האימון כדי לעצור ולחשוב — זה מה שבאמת מקדם אותך.
        </p>
      </div>

      <ReflectionForm />
    </div>
  );
}
