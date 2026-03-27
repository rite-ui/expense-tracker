import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
// ✅ Sahi imports (purana CATEGORIES hata diya)
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CAT_ICONS } from "../../utils/constants";

const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
};

const DEFAULT = {
    title: "",
    amount: "",
    type: "expense",
    category: "Food", // Default expense category
    description: "",
    date: new Date().toISOString().split('T')[0],
}

export default function ExpenseModal({ onClose, editing, onSave }) {
    const { dark } = useTheme();
    const isDark = dark === 'dark' || dark === true;

    const [form, setForm] = useState(editing ? {
        ...editing,
        date: formatDateForInput(editing.date),
    } : DEFAULT);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    // ✅ Naya Logic: Jab Type change ho (Income/Expense), toh category bhi default par set ho jaye
    const handleTypeChange = (newType) => {
        const defaultCat = newType === 'income' ? 'Salary' : 'Food';
        setForm(prev => ({ ...prev, type: newType, category: defaultCat }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return setError("Title is required");
        if (!form.amount || form.amount <= 0) return setError("Amount should be a positive number");
        setLoading(true);
        setError("");
        try {
            await onSave(editing ? { ...form, _id: editing._id } : form);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-all border
    ${isDark
        ? 'bg-[#13131f] border-white/[0.07] text-white focus:border-[#6c63ff]'
        : 'bg-[#f9f9fc] border-[#e2e2ee] text-gray-800 focus:border-[#6c63ff]'
    }`;

    const labelsCls = `text-[10px] font-bold tracking-[1.2px] uppercase font-mono ${isDark ? "text-white/35" : "text-gray-400"}`;

    return (
        <div className="fixed inset-0 z-1000 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn"
             onClick={e => e.target === e.currentTarget && onClose()}>

            <div className={`w-full md:w-125 max-h-[92vh] md:max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-2xl border transition-all duration-300
                 ${isDark
                    ? "bg-[#1a1a2e] border-white/10 shadow-2xl"
                    : "bg-white border-gray-100 shadow-2xl"}`}>

                <div className="flex items-start justify-between p-6 pb-4 border-b border-black/5 dark:border-white/5">
                    <div>
                        <h2 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {editing ? 'Edit Transaction' : 'New Transaction'}
                        </h2>
                        <p className={`text-[11px] mt-0.5 font-mono ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                            {editing ? 'Update your record' : 'Add income or expense'}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs border transition-all active:scale-95
                            ${isDark ? 'border-white/10 bg-white/5 text-white/40' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-mono animate-shake">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-3">
                        {['income', 'expense'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleTypeChange(t)}
                                className={`py-3.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2
                                ${form.type === t
                                    ? t === 'income'
                                        ? 'bg-green-500/10 text-green-500 border-green-500/30 ring-1 ring-green-500/20'
                                        : 'bg-red-500/10 text-red-500 border-red-500/30 ring-1 ring-red-500/20'
                                    : isDark
                                        ? 'bg-white/5 text-white/40 border-white/[0.07]'
                                        : 'bg-gray-50 text-gray-400 border-gray-200'
                                }`}>
                                <span>{t === 'income' ? '⬆️' : '⬇️'}</span>
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelsCls}>Title</label>
                            <input
                                className={inputCls}
                                placeholder="e.g. Salary or Coffee"
                                value={form.title}
                                onChange={e => set('title', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelsCls}>Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40 font-bold">₹</span>
                                    <input
                                        className={`${inputCls} pl-8`}
                                        type="number"
                                        placeholder="0.00"
                                        value={form.amount}
                                        onChange={e => set('amount', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelsCls}>Date</label>
                                <input
                                    className={inputCls}
                                    type="date"
                                    value={form.date}
                                    onChange={e => set('date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelsCls}>Category</label>
                            <div className="relative">
                                <select
                                    className={`${inputCls} appearance-none`}
                                    value={form.category}
                                    onChange={e => set('category', e.target.value)}>
                                    
                                    {/* ✅ Type ke base par filter: Ab Income mein Food nahi dikhega */}
                                    {(form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                                        <option key={c} value={c} className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                   {CAT_ICONS[form.category] || '📦'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelsCls}>Description (optional)</label>
                            <textarea
                                className={`${inputCls} resize-none h-24`}
                                placeholder="Add a note..."
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-black/5 dark:border-white/5 flex gap-3">
                    <button onClick={onClose}
                        className={`flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all active:scale-95
                            ${isDark ? 'border-white/10 bg-white/5 text-white/50' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="flex-2 py-3.5 rounded-xl text-sm font-bold text-white bg-brand hover:shadow-lg hover:shadow-brand/20 disabled:opacity-50 transition-all active:scale-95">
                        {loading ? 'Saving...' : editing ? 'Update' : 'Save Transaction'}
                    </button>
                </div>
            </div>
        </div>
    );
}