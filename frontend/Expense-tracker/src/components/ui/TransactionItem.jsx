import {useTheme} from "../../hooks/useTheme";
import {CAT_ICONS} from "../../utils/constants";

 export  default function TransactionItem({tx, onEdit, onDelete}) {
    const { dark } = useTheme();

    const formatted = `${Number(tx.amount).toLocaleString('en-IN')}`;
    const date = new Date(tx.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <div className={`group flex items-center gap-3 px-3 py-3.5 rounded-xl 
            transition-all cursor-default
            ${dark ? 'hover:bg-white/4' : 'hover:bg-black/3'}`}
        >

            {/*Icon*/}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                 text-base shrink-0 
                 ${tx.type === 'income' ? 'bg-income/10'
                    : 'bg-expense/10'
                }`}>
                {CAT_ICONS[tx.category] || '📦'}
            </div>

            {/*Info*/}
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-gray-800'}`}>
                    {tx.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono
                        ${dark ? 'bg-white/[0.07] text-white/50' : 'bg-black/5 text-gray-500'}`}
                    >
                        {tx.category}
                    </span>
                    <span className={`text-[11px] font-mono truncate max-w-30
                        ${dark ? ' text-white/30' : ' text-gray-400'}`}
                    >
                        .{date}
                    </span>
                    {tx.description && (
                        <span className={`text-[11px] font-mono truncate max-w-30
                            ${dark ? ' text-white/25' : ' text-gray-400'}`}
                        >
                           . {tx.description}
                        </span>
                    )}
                </div>
            </div>

            {/*Amount*/}
            <div className={`text-sm font-bold font-mono shrink-0
                 ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{formatted}
            </div>
            {/*Actions*/}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(tx)}
                    className={` w-7 h-7 rounded-lg text-xs flex items-center
                        justify-content border transition-all
                         ${dark ?
                             'border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/20' 
                             : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-400 hover:border-gray-300'}`}
                >
                    ✏️
                </button>
                <button
                    onClick={() => onDelete(tx)}
                    className={` w-7 h-7 rounded-lg text-xs flex items-center
                        justify-content border transition-all
                         ${dark ?
                             'border-white/10 bg-white/5 text-white/40 hover:text-expense hover:border-expense/30 hover:bg-expense/10' 
                             : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-expense hover:border-expense/30 hover:bg-expense/10'}`}
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}