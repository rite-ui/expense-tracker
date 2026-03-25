import {useTheme} from "../../hooks/useTheme";

const CONFIGS = {
    balance: {
        bar:'from-[#6c63ff] to-[#47b8ff]',
        icon:'bg-[#6c63ff]/20',
        value:'text-[#8b85ff]',
    },
    income: {
        bar:'from-[#22c987] to-emerald-400',
        icon:'bg-[#22c987]/20',
        value:'text-[#22c987]',
    },
    expense: {
        bar:'from-[#ff6b6b] to-[#ffc947]',
        icon:'bg-[#ff6b6b]/20',
        value:'text-[#ff6b6b]',
    },
}

export default function StatCard({label, value, type,icon,sub}) {
    const { dark} = useTheme();
    const c = CONFIGS[type];
    const formatted = ` ${Number(value).toLocaleString('en-IN')}`;
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all
            hover:-tranalate-y-0.5 hover:shadow-lg animate-slideUp
            ${dark
                ? 'bg-dark-card border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                : 'bg-white border-light-border shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            }
        `}>
            {/*Top Gradient bar*/}
            <div className={`absolute top-0 left-0 right-0 h-[0.75r] bg-linear-to-r ${c.bar} to bg-transparent`}/>
            
            {/*Background glow blob*/}
            <div className={`absolute top-6  right-6 w-28 h-28 rounded-full 
                bg-linear-to-br ${c.bar} opacity-[0.06] blur-2xl`}>


                {/* Icon + label*/}
                <div className="flex items-center justify-between mb-4">
                    <div className= {`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
                        {icon}
                    </div>
                    <span className={`text-[10px] font-bold tracking-[1.5px] uppercase font-mono ${dark ? 'text-white/2' : 'text-grey-400'}`}>
                        {label}
                    </span>
                </div>
                {/*Value*/}
                <div className={`text-[28px] font-extrabold tracking-tight leading-none ${c.value}`}>
                    {formatted}
                </div>
                {/*Subtext*/}
                {sub && (
                    <div className={`text-[11px]mt-2 font-mono ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                        {sub}
                    </div>
                )};
            </div>
        </div>
    );

};