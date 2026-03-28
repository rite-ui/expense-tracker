import { useTheme } from '../hooks/useTheme'
import { useExpenses } from '../hooks/useExpenses'
import ChartTooltip from '../components/ui/Charttooltip'
import Spinner from '../components/ui/Spinner'
// ✅ INCOME_CATEGORIES ko add kiya gaya hai
import { MONTH_NAMES, CAT_COLORS, CAT_ICONS, INCOME_CATEGORIES } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'

export default function AnalyticsPage() {
  const { dark } = useTheme()
  const isDark = dark === 'dark'

  const { expenses, summary, breakdown, loading } = useExpenses()

  // ✅ 1. Re-calculating Totals to ensure Salary is always Income
  const calculatedIncome = expenses
    .filter(e => e.type === 'income' || INCOME_CATEGORIES.includes(e.category))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const calculatedExpense = expenses
    .filter(e => e.type === 'expense' && !INCOME_CATEGORIES.includes(e.category))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const tickStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 10, fontFamily: 'DM Mono' }
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

  // ✅ 2. Bar Chart Data Fix (Salary -> Income Bar)
  const barData = (() => {
    const map = {}
    summary.forEach(s => {
      const key = `${MONTH_NAMES[s._id.month - 1]} '${String(s._id.year).slice(2)}`
      if (!map[key]) map[key] = { name: key, income: 0, expense: 0 }
      
      if (INCOME_CATEGORIES.includes(s._id.category) || s._id.type === 'income') {
        map[key].income += s.total
      } else {
        map[key].expense += s.total
      }
    })
    return Object.values(map).slice(-6).reverse()
  })()

  const lineData = barData.map(d => ({ ...d, savings: (d.income || 0) - (d.expense || 0) }))

  // ✅ 3. Filtered Breakdown (Excluding Income Categories for Charts/List)
  const filteredBreakdown = breakdown.filter(b => !INCOME_CATEGORIES.includes(b._id))

  const pieData = filteredBreakdown.slice(0, 8).map(b => ({ 
    name: b._id, 
    value: b.total, 
    color: CAT_COLORS[b._id] || '#94a3b8' 
  }))

  const savingsRate = calculatedIncome > 0 
    ? (((calculatedIncome - calculatedExpense) / calculatedIncome) * 100).toFixed(1) 
    : 0

  const cardBase = `rounded-2xl border transition-all duration-300 ${
    isDark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-gray-100 shadow-sm'
  }`

  const kpis = [
    { label: 'Savings Rate', value: `${savingsRate}%`, sub: 'of income', color: 'text-[#22c987]' },
    { label: 'Avg / Tx', value: expenses.length ? formatCurrency(Math.round((calculatedIncome + calculatedExpense) / expenses.length)) : '₹0', sub: `${expenses.length} records`, color: 'text-[#6c63ff]' },
    { label: 'Top Category', value: filteredBreakdown[0]?._id || '—', sub: filteredBreakdown[0] ? formatCurrency(filteredBreakdown[0].total) : 'no data', color: 'text-orange-500' },
    { label: 'Months', value: new Set(summary.map(s => `${s._id.month}-${s._id.year}`)).size, sub: 'tracked', color: 'text-sky-500' },
  ]

  if (loading) return <Spinner text="Loading analytics..." />

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 px-1 md:px-0">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((k, i) => (
          <div key={i} className={`${cardBase} p-4 md:p-5 animate-slideUp`}>
            <div className={`text-[9px] md:text-[10px] font-bold tracking-widest uppercase font-mono mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              {k.label}
            </div>
            <div className={`text-xl md:text-2xl font-extrabold tracking-tight truncate ${k.color}`}>{k.value}</div>
            <div className={`text-[10px] md:text-[11px] font-mono mt-1 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className={`${cardBase} p-4 md:p-5`}>
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Income vs Expenses</h3>
          </div>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="income" fill="#22c987" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardBase} p-4 md:p-5`}>
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Savings Trend</h3>
          </div>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="savings" stroke="#6c63ff" strokeWidth={2.5} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 md:gap-6">
        <div className={`${cardBase} p-4 md:p-5`}>
          <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Distribution</h3>
          <div className="h-57.5 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" dataKey="value" paddingAngle={4}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-xs font-mono">
                <div className="text-3xl mb-1">◎</div>No data yet
              </div>
            )}
          </div>
        </div>

        <div className={`${cardBase} p-4 md:p-5`}>
          <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white' : 'text-gray-800'}`}>Category Breakdown</h3>
          <div className="flex flex-col gap-4">
            {filteredBreakdown.length === 0 && <div className="text-center py-6 opacity-30 text-xs">No expense data found</div>}
            {filteredBreakdown.map((b, i) => {
              const pct = calculatedExpense > 0 ? ((b.total / calculatedExpense) * 100).toFixed(1) : 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{CAT_ICONS[b._id] || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold truncate pr-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{b._id}</span>
                      <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{formatCurrency(b.total)}</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: CAT_COLORS[b._id] || '#94a3b8' }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}