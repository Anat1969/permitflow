# PermitFlow — גרסה עצמאית (ללא Base44)

האפליקציה רצה ישירות מול Supabase (מסד נתונים + אחסון קבצים) ומתפרסמת אוטומטית ב-GitHub Pages.

**כתובת האפליקציה:** https://anat1969.github.io/permitflow/

## איך זה עובד
- כל דחיפה (push) לענף `standalone` בונה ומפרסמת את האתר מחדש (GitHub Actions → `.github/workflows/deploy.yml`).
- הנתונים: `src/lib/db.js` · הקבצים: `src/lib/storage.js` (דלי `project-files`) · החיבור: `src/lib/supabase.js`.

## הרצה מקומית
```
npm install
npm run dev
```
אפשר להחליף פרויקט Supabase דרך קובץ `.env.local`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
