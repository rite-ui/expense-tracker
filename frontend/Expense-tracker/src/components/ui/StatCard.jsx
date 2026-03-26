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
    
    // 1. Boolean check fix: dark ek string hai ('dark'/'light')
    const isDark = dark === 'dark';
    
    const c = CONFIGS[type];
    const formatted = `₹${Number(value).toLocaleString('en-IN')}`;

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
            hover:-translate-y-1 animate-slideUp ${delay}
            ${isDark
                ? 'bg-[#1a1a2e] border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                : 'bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
            }
        `}>
            {/* Top Gradient bar - Fixed Height & Color */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${c.bar}`} />
            
            {/* Background glow blob - Fixed Nesting */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full 
                bg-linear-to-br ${c.bar} opacity-[0.08] blur-2xl pointer-events-none`} 
            />

            {/* Content Container - relative z-10 */}
            <div className="relative z-10">
                {/* Icon + label */}
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
                        {icon}
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase font-mono 
                        ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {label}
                    </span>
                </div>

                {/* Value */}
                <div className={`text-[28px] font-extrabold tracking-tight leading-none ${c.value}`}>
                    {formatted}
                </div>

                {/* Subtext */}
                {sub && (
                    <div className={`text-[11px] mt-2 font-mono ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                        {sub}
                    </div>
                )}
            </div>
        </div>
    );
}