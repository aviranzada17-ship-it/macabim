const TEMP_PASSWORD_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";

export function generateTempPassword(length = 8): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += TEMP_PASSWORD_CHARS[Math.floor(Math.random() * TEMP_PASSWORD_CHARS.length)];
  }
  return result;
}

function normalize(part: string): string {
  return part
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** הצעת שם משתמש מאנגלית בלבד; אם אין תווים לועזיים, נופל חזרה לקידומת חניך + מספר אקראי */
export function suggestUsername(firstName: string, lastName: string): string {
  const first = normalize(firstName);
  const last = normalize(lastName);
  const base = [first, last].filter(Boolean).join(".");
  if (base) return base;
  return `trainee${Math.floor(1000 + Math.random() * 9000)}`;
}
