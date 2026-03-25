export default function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[#1a1a2e]border border-white/10 rounded-xl px-4 py-3 shadow-2xl font-mono text-xs">
            {label &&(
                <div className="text-white/50 mb-2 text-[11px]">{label}</div>
            )}
            {payload.map((p, i) => (
                <div key={i} className=" flex items-center gap-2 mt-1 " style={{color: p.color || '#fff'}}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: p.color }}></div>
                    {p.name && <span className="text-white/50">{p.name}:</span>}
                    <span className="font-semibold">${Number(p.value).toLocaleString('en-IN')}</span>
                </div>
            ))}
        </div>
    )
}