# מערכת "המכבים" – ניהול ומעקב חניכים

מערכת web למעקב אחר התקדמות חניכים בתוכנית הכנה לצבא "המכבים": אזור אישי לחניך עם מדדים, יעדים ונקודות שימור/שיפור, ואזור ניהול למאמנים/מנהל עם מבט רחב על כל החניכים.

המערכת נבנתה לפי המפרט ב-[PROJECT_PROMPT.md](./PROJECT_PROMPT.md).

## מה יש כאן

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **shadcn/ui** (Radix) לקומפוננטות ממשק
- **Prisma** + **PostgreSQL** לבסיס הנתונים
- אימות מותאם אישית (שם משתמש + סיסמה, לא אימייל) עם סשן חתום (JWT ב-cookie מאובטח)
- עיצוב RTL מלא, מותאם לנייד

## הרצה מקומית (לפיתוח)

דרישות: [Node.js](https://nodejs.org) גרסה 20 ומעלה.

```bash
npm install
```

### בסיס נתונים מקומי

לפיתוח, אין צורך בהתקנת PostgreSQL בעצמכם – Prisma מספקת שרת פיתוח מקומי מובנה:

```bash
npx prisma dev -d --name mechabim
```

הפקודה תדפיס כתובת חיבור (DATABASE_URL) – יש להעתיק אותה לקובץ `.env` (ראו `.env.example`).

לאחר מכן:

```bash
npx prisma migrate dev --name init   # יצירת הטבלאות
npm run db:seed                       # יצירת משתמש מנהל ראשוני + מדדי ברירת מחדל
npm run dev                           # הרצת השרת
```

פרטי ההתחברות הראשוניים (יוצגו גם בפלט של `db:seed`):

- שם משתמש: `admin`
- סיסמה: `admin123`

בכניסה הראשונה המערכת תבקש להחליף סיסמה.

## פריסה לאינטרנט (פרודקשן) – ללא עלות

המערכת מתוכננת לרוץ על שירותי Tier חינמי:

1. **בסיס נתונים – [Supabase](https://supabase.com):**
   פתחו פרויקט חדש (חינמי) → בדף הפרויקט לחצו על הכפתור הירוק **Connect** (למעלה) → טאב **ORMs** (או "Direct connection"). תקבלו שתי כתובות:
   - `DATABASE_URL` – כתובת ה-pooler (פורט 6543, עם `pgbouncer=true`) – לשימוש שוטף של האתר
   - `DIRECT_URL` – כתובת ישירה (פורט 5432) – נדרשת רק להרצת מיגרציות

   בשתי הכתובות יש להחליף את `[YOUR-PASSWORD]` בסיסמת בסיס הנתונים שבחרתם ביצירת הפרויקט.

2. **אחסון האתר – [Vercel](https://vercel.com):**
   חברו את ריפוזיטורי הקוד (GitHub) לפרויקט Vercel חדש. בהגדרות הפרויקט (Environment Variables) הוסיפו:
   - `DATABASE_URL` – כתובת ה-pooler מ-Supabase
   - `DIRECT_URL` – כתובת ה-Direct connection מ-Supabase
   - `AUTH_SECRET` – מחרוזת אקראית וסודית (אפשר להפיק עם `openssl rand -base64 32`)

3. לפני ההרצה הראשונה בפרודקשן יש להריץ את המיגרציות ואת ה-seed מול בסיס הנתונים של Supabase (פעם אחת, ממחשב מקומי):
   ```bash
   DATABASE_URL="<pooler URL>" DIRECT_URL="<direct URL>" npx prisma migrate deploy
   DATABASE_URL="<pooler URL>" DIRECT_URL="<direct URL>" SEED_ADMIN_PASSWORD="<סיסמה-חזקה-משלכם>" npm run db:seed
   ```

4. Vercel יבנה ויפרוס את האתר אוטומטית בכל push לענף הראשי.

> חשוב: לפני הפריסה לפרודקשן יש להחליף את `AUTH_SECRET` לערך סודי משלכם, ולא להשתמש בסיסמת המנהל שבדוגמה.

## מבנה הנתונים (עיקרי)

- `User` – משתמשי המערכת (מנהל / מאמן / חניך), שם משתמש+סיסמה מוצפנת
- `TraineeProfile` – פרופיל הקליטה וההרשמה של כל חניך
- `Group` – קבוצות אימון
- `MetricDefinition` – הגדרות המדדים (ניתן להוסיף מדדים חדשים דרך "ניהול מדדים")
- `MetricEntry` – רישומי תוצאות לאורך זמן
- `Goal` – יעדים אישיים לכל מדד
- `ReflectionEntry` – נקודות שימור/שיפור
- `CoachNote` – הערות פרטיות של מאמנים על חניך
- `AIProgram` – placeholder לפיצ'ר תוכנית אימון אישית מבוססת AI (עתידי)

## סקריפטים שימושיים

```bash
npm run dev          # שרת פיתוח
npm run build        # בנייה לפרודקשן
npm run lint         # בדיקת קוד
npm run db:migrate   # יצירת/הרצת מיגרציות בפיתוח
npm run db:seed      # זריעת נתוני בסיס (מנהל + מדדים)
npm run db:studio    # ממשק גרפי לצפייה בבסיס הנתונים (Prisma Studio)
```

## מיתוג

קבצי הלוגו וחומרי המיתוג נמצאים ב-[public/branding](./public/branding). צבעי המותג מוגדרים במקום מרוכז אחד – `src/app/globals.css` (משתני CSS תחת `:root` ו-`.dark`) – כדי שיהיה קל לעדכן אותם בעתיד.
