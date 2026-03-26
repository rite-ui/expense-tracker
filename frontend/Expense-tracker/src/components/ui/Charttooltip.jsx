import { useTheme } from "../../hooks/useTheme";

export default function ChartTooltip({ active, payload, label }) {
    const { dark } = useTheme();
    const isDark = dark === 'dark'; // Theme logic add ki gayi

    if (!active || !payload?.length) return null;

    return (
        <div className={`border rounded-xl px-4 py-3 shadow-2xl font-mono text-xs transition-all duration-300
            ${isDark 
                ? 'bg-[#1a1a2e] border-white/10' 
                : 'bg-white border-gray-100 shadow-lg'
            }`}
        >
            {/* Tooltip Label (Date/Month) */}
            {label && (
                <div className={`mb-2 text-[11px] font-bold ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
                    {label}
                </div>
            )}

            {/* Tooltip Data Points */}
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mt-1.5">
                    {/* Color Dot */}
                    <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: p.color }}
                    ></div>
                    
                    {/* Name (Income/Expense) */}
                    {p.name && (
                        <span className={isDark ? 'text-white/60' : 'text-gray-500'}>
                            {p.name}:
                        </span>
                    )}
                    
                    {/* Value */}
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        ₹{Number(p.value).toLocaleString('en-IN')}
                    </span>
                </div>
            ))}
        </div>
    );
}