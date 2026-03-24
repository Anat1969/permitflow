export const STATUS_CONFIG = {
  planning:   { label: "בתכנון",  color: "#3B82F6", bg: "#EFF6FF" },
  inprogress: { label: "בתהליך", color: "#F59E0B", bg: "#FFFBEB" },
  review:     { label: "בבדיקה", color: "#F97316", bg: "#FFF7ED" },
  done:       { label: "בוצע",   color: "#10B981", bg: "#F0FDF4" },
};

export const BINUI_CATS = {
  "תכנון": ["בניינים", "תשתיות"],
  "בינוי":  ["עירייה", "יזם"],
  'רישוי':  ['בנייה חדשה', 'תמ"א 38', 'תוספות'],
};

export const GENERIC_CATS = {
  "פיתוח": {
    "מרחב":   ["עיר", "רובע", "מתחם"],
    "אלמנט":  ["מתקנים", "פסלים", "גרפיטי", "שלטים"],
  },
  "מיידעים": {
    "מדריכים": [],
    "מדיניות": [],
    "הנחיות":  [],
  },
  "פעולות": {
    "יוזמות (אדריכליות)": [],
    "משימות (מנהלים)":    [],
  },
  "כלי-AI": {
    "כלי AI": ["אפליקציות", "סוכנים"],
  },
};

export const DOMAIN_CONFIG = {
  binui: {
    id: "binui",
    label: "מבנים",
    icon: "🏛",
    color: "#1a3060",
    route: "/binui",
    description: "פרויקטי בינוי עירוניים",
    entity: "BinuiProject",
    categories: Object.entries(BINUI_CATS).map(([label, subs]) => ({ label, subs })),
  },
  pitua: {
    id: "pitua",
    label: "פיתוח",
    icon: "🌿",
    color: "#1a6f7a",
    route: "/pitua",
    description: "פיתוח ומרחב עירוני",
    entity: "GenericProject",
    domain: "פיתוח",
    categories: Object.entries(GENERIC_CATS["פיתוח"]).map(([label, subs]) => ({ label, subs })),
  },
  meyadim: {
    id: "meyadim",
    label: "מיידעים",
    icon: "📋",
    color: "#1e5e38",
    route: "/meyadim",
    description: "מדריכים, מדיניות והנחיות",
    entity: "GenericProject",
    domain: "מיידעים",
    categories: Object.entries(GENERIC_CATS["מיידעים"]).map(([label, subs]) => ({ label, subs })),
  },
  peulot: {
    id: "peulot",
    label: "פעולות",
    icon: "⚡",
    color: "#1a5490",
    route: "/peulot",
    description: "יוזמות ומשימות",
    entity: "GenericProject",
    domain: "פעולות",
    categories: Object.entries(GENERIC_CATS["פעולות"]).map(([label, subs]) => ({ label, subs })),
  },
  ai: {
    id: "ai",
    label: "כלי AI",
    icon: "💻",
    color: "#2E5F7A",
    route: "/apps",
    description: "אפליקציות וסוכני AI",
    entity: "GenericProject",
    domain: "כלי-AI",
    categories: Object.entries(GENERIC_CATS["כלי-AI"]).map(([label, subs]) => ({ label, subs })),
  },
};

export const DOMAIN_LIST = Object.values(DOMAIN_CONFIG);

export function getToday() {
  return new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });
}

export function addHistoryEntry(history = [], note) {
  const entry = { date: getToday(), note };
  return [...(history || []), entry];
}