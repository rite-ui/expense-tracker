import { useTheme } from '../hooks/useTheme'
// ❌ useExpenses import yahan se hata diya gaya hai taaki naya state na bane
import StatCard from '../components/ui/StatCard'
import TransactionItem from '../components/ui/TransactionItem'
import ChartTooltip from '../components/ui/ChartTooltip'
import Spinner from '../components/ui/Spinner'
import { MONTH_NAMES, CAT_COLORS } from '../utils/constants'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ✅ Ab saara data Parent (App.jsx) se as a Prop aa raha hai
export default function DashboardPage({ 
    setPage, 
    openEdit, 
    onDelete, 
    expenses = [], 
    summary = [], 
    breakdown = [], 
    loading = false, 
    totalIncome = 0, 
    totalExpense = 0, 
    balance = 0 
}) {
    const { dark } = useTheme()
    const isDark = dark === 'dark' || dark === true

    // Chart Styling
    const tickStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11, fontFamily: 'DM Mono' }
    const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

    // Memoized calculations (Data change hote hi ye auto-run honge)
    const barData = (() => {
        const map = {}
        summary.forEach(s => {
            const key = `${MONTH_NAMES[s._id.month - 1]} '${String(s._id.year).slice(2)}`
            if (!map[key]) map[key] = { name: key, income: 0, expense: 0 }
            map[key][s._id.type] = s.total
        })
        return Object.values(map).slice(-6).reverse()
    })()

    const pieData = breakdown.slice(0, 6).map(b => ({
        name: b._id, value: b.total, color: CAT_COLORS[b._id] || '#94a3b8'
    }))

    const cardBase = `rounded-2xl border transition-all duration-300 ${isDark
            ? 'bg-[#1a1a2e] border-white/10 shadow-none'
            : 'bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }`

    if (loading) return <Spinner text="Loading dashboard..." />

    return (
        <div className="flex flex-col gap-5 animate-fadeIn">

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Net Balance" value={Math.abs(balance)} type="balance" icon="💎"
                    sub={balance >= 0 ? '▲ Positive balance' : '▼ Negative balance'} delay="animate-stagger-1" />
                <StatCard label="Total Income" value={totalIncome} type="income" icon="📈"
                    sub={`${expenses.filter(e => e.type === 'income').length} transactions`} delay="animate-stagger-2" />
                <StatCard label="Total Expenses" value={totalExpense} type="expense" icon="📉"
                    sub={`${expenses.filter(e => e.type === 'expense').length} transactions`} delay="animate-stagger-3" />
            </div>

            <div className="grid grid-cols-[1.6fr_1fr] gap-4">
                {/* Bar Chart */}
                <div className={`${cardBase} p-5 animate-slideUp`}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Monthly Overview</div>
                            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>income vs expenses</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={barData} barGap={4} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="income" fill="#22c987" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="expense" fill="#ff6b6b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className={`${cardBase} p-5 animate-slideUp`}>
                    <div className="mb-4">
                        <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Spending by Category</div>
                    </div>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={3}>
                                        {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-1.5 mt-3">
                                {pieData.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                                            <span className={`font-mono ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{d.name}</span>
                                        </div>
                                        <span className={`font-mono font-semibold ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                                            ₹{d.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-xs font-mono opacity-40">No data</div>
                    )}
                </div>
            </div>

            {/* Recent Transactions - Ab ye onDelete call hote hi instantly update hoga */}
            <div className={`${cardBase} p-5 animate-slideUp`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</h3>
                    <button onClick={() => setPage('transactions')} className="text-xs text-brand">View all →</button>
                </div>

                {expenses.length === 0 ? (
                    <div className="text-center py-10 opacity-30 text-xs">No transactions</div>
                ) : (
                    expenses.slice(0, 7).map(tx => (
                        <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
                    ))
                )}
            </div>
        </div>
    )
}