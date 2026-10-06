import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "יש להזין שם משתמש"),
  password: z.string().min(1, "יש להזין סיסמה"),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
    confirmPassword: z.string().min(6, "יש לאמת את הסיסמה"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z.object({
  phone: z.string().trim().min(9, "מספר טלפון לא תקין"),
  parentName: z.string().trim().min(1, "שדה חובה"),
  parentPhone: z.string().trim().min(9, "מספר טלפון לא תקין"),
  school: z.string().trim().min(1, "שדה חובה"),
  grade: z.string().trim().min(1, "שדה חובה"),
  bio: z.string().trim().min(1, "שדה חובה"),
  enlistmentGoal: z.string().trim().min(1, "שדה חובה"),
  yearImportance: z.string().trim().min(1, "שדה חובה"),
  strengths: z.string().trim().min(1, "שדה חובה"),
  weakness: z.string().trim().min(1, "שדה חובה"),
  importantToKnow: z.string().trim().min(1, "שדה חובה"),
  howFound: z.string().trim().min(1, "שדה חובה"),
  investmentLevel: z.string().trim().min(1, "שדה חובה"),
});

export const metricEntrySchema = z.object({
  metricId: z.string().min(1, "יש לבחור מדד"),
  value: z.coerce.number({ message: "יש להזין ערך מספרי" }),
  recordedAt: z.string().min(1, "יש לבחור תאריך"),
  note: z.string().trim().optional(),
});

export const reflectionSchema = z.object({
  keepPoint: z.string().trim().min(1, "יש לרשום לפחות נקודה אחת לשימור"),
  improvePoint: z.string().trim().min(1, "יש לרשום לפחות נקודה אחת לשיפור"),
});

export const goalSchema = z.object({
  metricId: z.string().min(1, "יש לבחור מדד"),
  targetValue: z.coerce.number({ message: "יש להזין ערך יעד מספרי" }),
  targetDate: z.string().optional(),
});

export const metricDefinitionSchema = z.object({
  name: z.string().trim().min(1, "יש להזין שם מדד"),
  unit: z.enum(["REPS", "TIME_SECONDS", "DISTANCE_METERS", "FREE_NUMBER"]),
  higherIsBetter: z.coerce.boolean(),
});

export const createTraineeSchema = z.object({
  firstName: z.string().trim().min(1, "שדה חובה"),
  lastName: z.string().trim().min(1, "שדה חובה"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "שם משתמש חייב להכיל לפחות 3 תווים")
    .regex(/^[a-z0-9_.]+$/, "שם משתמש יכול להכיל רק אותיות אנגליות, מספרים, נקודה וקו תחתון"),
  groupId: z.string().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, "יש להזין שם קבוצה"),
});

export const coachNoteSchema = z.object({
  content: z.string().trim().min(1, "יש להזין תוכן הערה"),
});
