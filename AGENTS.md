<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# פרויקט "המכבים"

ראו [PROJECT_PROMPT.md](./PROJECT_PROMPT.md) למפרט המלא, ו-[README.md](./README.md) להרצה ופריסה.

- Prisma מוצמד לגרסה 6.19.3 (לא 7) בכוונה — יציבה יותר, תיעוד זמין, `generator` סטנדרטי (`prisma-client-js`) וטעינת `.env` אוטומטית.
- בפיתוח מקומי רץ בסיס נתונים מקומי דרך `npx prisma dev -d --name mechabim` (ללא Docker). ראו README.
- אימות הוא מותאם אישית (שם משתמש+סיסמה, `src/lib/auth.ts` + `src/middleware.ts`) — לא NextAuth/Auth.js וגם לא Supabase Auth, כי אלה מבוססי אימייל ולא מתאימים לחניכים קטינים.
- רכיבי UI: shadcn/ui עם preset `radix-nova` ותמיכת RTL מובנית (`rtl:` variants). שדות `<select>` בתוך טפסים עם Server Actions משתמשים ב-`NativeSelect` (`src/components/ui/native-select.tsx`) ולא ברכיב ה-Select המבוסס-Radix, כדי ש-FormData יעבוד בלי JS נוסף.
- צבעי המותג מרוכזים ב-`src/app/globals.css` (`:root`/`.dark`). קבצי מיתוג גולמיים ב-`public/branding`.

