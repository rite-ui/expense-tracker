import { useTheme } from "../../hooks/useTheme";

export default function ChartTooltip({ active, payload, label }) {
    const { dark } = useTheme();
    // ✅ Robust logic for both string 'dark' or boolean true
    const isDark = dark === 'dark' || dark === true; 

    if (!active || !payload?.length) return null;

    return (
        <div className={`border rounded-xl px-4 py-3 shadow-2xl font-mono text-xs transition-all duration-300 backdrop-blur-md
            ${isDark 
                ? 'bg-[#1a1a2e]/90 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                : 'bg-white/95 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
            }`}
        >
            {/* Tooltip Label (Date/Month/Category) */}
            {label && (
                <div className={`mb-2 text-[10px] uppercase tracking-wider font-black ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {label}
                </div>
            )}

            {/* Tooltip Data Points */}
            <div className="flex flex-col gap-1.5">
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {/* Color Dot */}
                            <div 
                                className="w-2 h-2 rounded-full shrink-0 shadow-sm" 
                                style={{ backgroundColor: p.color || p.payload.fill }}
                            ></div>
                            
                            {/* Name (Income/Expense/Category) */}
                            <span className={`capitalize ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                                {p.name}:
                            </span>
                        </div>
                        
                        {/* Value formatted for Indian Rupee */}
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ₹{Number(p.value).toLocaleString('en-IN')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}