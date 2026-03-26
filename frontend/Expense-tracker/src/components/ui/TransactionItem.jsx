import { useTheme } from "../../hooks/useTheme";
import { CAT_ICONS } from "../../utils/constants";

export default function TransactionItem({ tx, onEdit, onDelete }) {
    const { dark } = useTheme();
    const isDark = dark === 'dark';

    const formatted = `${Number(tx.amount).toLocaleString('en-IN')}`;
    const date = new Date(tx.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className={`group flex items-center gap-3 px-3 py-3 md:py-3.5 rounded-xl 
            transition-all cursor-default border border-transparent
            ${isDark ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-gray-50 hover:border-gray-100'}`}
        >
            {/* 1. Icon: Mobile par thoda compact */}
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center
                 text-sm md:text-base shrink-0 
                 ${tx.type === 'income' 
                    ? 'bg-income/10 text-income'
                    : 'bg-expense/10 text-expense'
                }`}>
                {CAT_ICONS[tx.category] || '📦'}
            </div>

            {/* 2. Info Section */}
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {tx.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono shrink-0
                        ${isDark ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-500'}`}
                    >
                        {tx.category}
                    </span>
                    <span className={`text-[10px] font-mono truncate opacity-50 shrink-0 ${isDark ? 'text-white' : 'text-gray-500'}`}>
                        • {date}
                    </span>
                    {/* Description: Mobile par chhupa sakte hain space bachane ke liye, ya truncate karein */}
                    {tx.description && (
                        <span className={`hidden sm:inline text-[10px] font-mono truncate opacity-30 ${isDark ? 'text-white' : 'text-gray-500'}`}>
                           • {tx.description}
                        </span>
                    )}
                </div>
            </div>

            {/* 3. Amount & Actions Container */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Amount */}
                <div className={`text-sm font-bold font-mono text-right
                     ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatted}
                </div>

                {/* 4. Actions: Mobile par opacity-100 (visible), Desktop par hover par */}
                <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(tx); }}
                        className={`w-7 h-7 rounded-lg text-[10px] flex items-center justify-center border transition-all
                             ${isDark ?
                                 'border-white/10 bg-white/5 text-white/40 hover:text-white' 
                                 : 'border-gray-200 bg-white text-gray-400 hover:text-brand'}`}
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(tx._id); }}
                        className={`w-7 h-7 rounded-lg text-[10px] flex items-center justify-center border transition-all
                             ${isDark ?
                                 'border-white/10 bg-white/5 text-white/40 hover:text-expense'
                                 : 'border-gray-200 bg-white text-gray-400 hover:text-expense'}`}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    )
}