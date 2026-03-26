import { useTheme } from '../hooks/useTheme'
import { useExpenses } from '../hooks/useExpenses'
import ChartTooltip from '../components/ui/ChartTooltip'
import Spinner from '../components/ui/Spinner'
import { MONTH_NAMES, CAT_COLORS, CAT_ICONS } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'

export default function AnalyticsPage() {
  const { dark } = useTheme()
  const isDark = dark === 'dark' // String to Boolean Fix

  const { expenses, summary, breakdown, loading, totalIncome, totalExpense } = useExpenses()

  // Chart Styles based on theme
  const tickStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11, fontFamily: 'DM Mono' }
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

  const barData = (() => {
    const map = {}
    summary.forEach(s => {
      const key = `${MONTH_NAMES[s._id.month - 1]} '${String(s._id.year).slice(2)}`
      if (!map[key]) map[key] = { name: key, income: 0, expense: 0 }
      map[key][s._id.type] = s.total
    })
    return Object.values(map).slice(-6).reverse()
  })()

  const lineData  = barData.map(d => ({ ...d, savings: (d.income || 0) - (d.expense || 0) }))
  const pieData   = breakdown.slice(0, 8).map(b => ({ name: b._id, value: b.total, color: CAT_COLORS[b._id] || '#94a3b8' }))
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0

  const cardBase = `rounded-2xl border transition-all duration-300 ${
    isDark ? 'bg-[#1a1a2e] border-white/10 shadow-none' : 'bg-white border-gray-100 shadow-sm'
  }`

  const kpis = [
    { label: 'Savings Rate',      value: `${savingsRate}%`,      sub: 'of income saved',           color: 'text-[#22c987]'  },
    { label: 'Avg / Transaction', value: expenses.length ? formatCurrency(Math.round((totalIncome + totalExpense) / expenses.length)) : '₹0', sub: `${expenses.length} records`, color: 'text-[#6c63ff]' },
    { label: 'Top Category',      value: breakdown[0]?._id || '—', sub: breakdown[0] ? formatCurrency(breakdown[0].total) : 'no data', color: 'text-orange-500' },
    { label: 'Active Months',     value: new Set(summary.map(s => `${s._id.month}-${s._id.year}`)).size, sub: 'months tracked', color: 'text-sky-500' },
  ]

  if (loading) return <Spinner text="Loading analytics..." />

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className={`${cardBase} p-5 animate-slideUp`}>
            <div className={`text-[10px] font-bold tracking-[1.2px] uppercase font-mono mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              {k.label}
            </div>
            <div className={`text-2xl font-extrabold tracking-tight ${k.color}`}>{k.value}</div>
            <div className={`text-[11px] font-mono mt-1.5 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar + Area Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardBase} p-5`}>
          <div className="mb-4">
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Income vs Expenses</div>
            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>monthly comparison</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="income"  name="Income"  fill="#22c987" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ff6b6b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardBase} p-5`}>
          <div className="mb-4">
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Savings Trend</div>
            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>monthly net savings</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#6c63ff" strokeWidth={2.5} fill="url(#savingsGrad)" dot={{ fill: '#6c63ff', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + Category Breakdown */}
      <div className="grid grid-cols-[1fr_1.4fr] gap-4">
        <div className={`${cardBase} p-5`}>
          <div className="mb-4">
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Category Distribution</div>
            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>all expenses</div>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={95} dataKey="value" paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={`text-center py-10 text-xs font-mono ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
              <div className="text-3xl mb-2 opacity-30">◎</div>No data yet
            </div>
          )}
        </div>

        <div className={`${cardBase} p-5`}>
          <div className="mb-5">
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Category Breakdown</div>
            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>ranked by spending</div>
          </div>
          <div className="flex flex-col gap-4">
            {breakdown.length === 0 && (
              <div className={`text-center py-6 text-xs font-mono ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
                <div className="text-3xl mb-2 opacity-30">◎</div>No expense data
              </div>
            )}
            {breakdown.map((b, i) => {
              const pct = totalExpense > 0 ? ((b.total / totalExpense) * 100).toFixed(1) : 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{CAT_ICONS[b._id] || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{b._id}</span>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{pct}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: CAT_COLORS[b._id] || '#94a3b8' }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold font-mono ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {formatCurrency(b.total)}
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