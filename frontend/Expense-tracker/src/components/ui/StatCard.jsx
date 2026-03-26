import { useTheme } from "../../hooks/useTheme";

const CONFIGS = {
    balance: {
        bar: 'from-[#6c63ff] to-[#47b8ff]',
        icon: 'bg-[#6c63ff]/20',
        value: 'text-[#8b85ff]',
    },
    income: {
        bar: 'from-[#22c987] to-emerald-400',
        icon: 'bg-[#22c987]/20',
        value: 'text-[#22c987]',
    },
    expense: {
        bar: 'from-[#ff6b6b] to-[#ffc947]',
        icon: 'bg-[#ff6b6b]/20',
        value: 'text-[#ff6b6b]',
    },
}

export default function StatCard({ label, value, type, icon, sub, delay }) {
    const { dark } = useTheme();
    const isDark = dark === 'dark';
    
    const c = CONFIGS[type];
    const formatted = `₹${Number(value).toLocaleString('en-IN')}`;

    return (
        <div className={`relative overflow-hidden rounded-2xl transition-all duration-300
            /* ✅ Mobile: p-4, Desktop: p-6 */
            p-4 md:p-6 border hover:-translate-y-1 animate-slideUp ${delay}
            ${isDark
                ? 'bg-[#1a1a2e] border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                : 'bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
            }
        `}>
            {/* Top Gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${c.bar}`} />
            
            {/* Background glow blob */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full 
                bg-linear-to-br ${c.bar} opacity-[0.08] blur-2xl pointer-events-none`} 
            />

            {/* Content Container */}
            <div className="relative z-10">
                {/* Icon + label */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    {/* ✅ Icon: Mobile pe thoda chota */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${c.icon} flex items-center justify-center text-base md:text-lg shrink-0`}>
                        {icon}
                    </div>
                    {/* ✅ Label: Mobile pe wrap na ho isliye tracking kam ki hai */}
                    <span className={`text-[9px] md:text-[10px] font-bold tracking-wider md:tracking-widest uppercase font-mono text-right ml-2
                        ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {label}
                    </span>
                </div>

                {/* Value */}
                {/* ✅ Text: Mobile pe 22px, Desktop pe 28px taaki overflow na ho */}
                <div className={`text-[22px] md:text-[28px] font-extrabold tracking-tight leading-none truncate ${c.value}`}>
                    {formatted}
                </div>

                {/* Subtext */}
                {sub && (
                    <div className={`text-[10px] md:text-[11px] mt-2 font-mono truncate ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                        {sub}
                    </div>
                )}
            </div>
        </div>
    );
}