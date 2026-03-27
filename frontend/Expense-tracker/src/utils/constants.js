// ✅ 1. Income Categories (Expanded)
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Rental",
  "Gift",
  "Other"
];

// ✅ 2. Expense Categories
export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

// Sabhi categories ka combined array
export const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export const CAT_ICONS = {
    // Income Icons
    Salary: "💰",
    Freelance: "💻",
    Investments: "📈",
    Rental: "🏠",
    Gift: "🎁",
    // Expense Icons
    Food: "🍔",
    Transport: "🚗",
    Shopping: "🛍️",
    Bills: "🧾",
    Health: "🏥",
    Entertainment: "🎬",
    Other: "❓"
}

export const CAT_COLORS = {
    // Income Colors
    Salary: "#6c63ff",      // Purple
    Freelance: "#22c987",   // Green
    Investments: "#47b8ff", // Light Blue
    Rental: "#ffc947",      // Yellow-Gold
    Gift: "#ff6bdb",        // Pink
    // Expense Colors
    Food: "#ffc947",
    Transport: "#47b8ff",
    Shopping: "#ff6bdb",
    Bills: "#ff6b6b",
    Health: "#22c987",
    Entertainment: "#8b85ff",
    Other: "#94a3b8"
}

export const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "transactions", label: "Transactions", icon: "📝" },
    { id: "analytics", label: "Analytics", icon: "📊" }
]

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]