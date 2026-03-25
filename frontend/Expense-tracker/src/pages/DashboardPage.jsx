import { useTheme } from '../hooks/useTheme'
import { useExpenses } from '../hooks/useExpenses'
import StatCard from '../components/ui/StatCard'
import TransactionItem from '../components/ui/TransactionItem'
import ChartTooltip from '../components/ui/ChartTooltip'
import Spinner from '../components/ui/Spinner'
import { MONTH_NAMES, CAT_COLORS } from '../utils/constants'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

export default function DashboardPage({ setPage, openEdit, onDelete }) {
  const { dark } = useTheme()
  const { expenses, summary, breakdown, loading, totalIncome, totalExpense, balance } = useExpenses()

  const tickStyle = { fill: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11, fontFamily: 'DM Mono' }
  const gridColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

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

  const cardBase = `rounded-2xl border transition-colors ${dark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-card-light'}`

  if (loading) return <Spinner text="Loading dashboard..." />

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Net Balance"    value={Math.abs(balance)} type="balance" icon="💎"
          sub={balance >= 0 ? '▲ Positive balance' : '▼ Negative balance'} delay="animate-stagger-1" />
        <StatCard label="Total Income"   value={totalIncome}  type="income"  icon="📈"
          sub={`${expenses.filter(e => e.type === 'income').length} transactions`} delay="animate-stagger-2" />
        <StatCard label="Total Expenses" value={totalExpense} type="expense" icon="📉"
          sub={`${expenses.filter(e => e.type === 'expense').length} transactions`} delay="animate-stagger-3" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-4">
        {/* Bar Chart */}
        <div className={`${cardBase} p-5 animate-slideUp animate-stagger-2`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Monthly Overview</div>
              <div className={`text-[11px] font-mono mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>income vs expenses</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-income" /><span className={dark ? 'text-white/40' : 'text-gray-400'}>Income</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-expense" /><span className={dark ? 'text-white/40' : 'text-gray-400'}>Expense</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
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

        {/* Pie Chart */}
        <div className={`${cardBase} p-5 animate-slideUp animate-stagger-3`}>
          <div className="mb-4">
            <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Spending by Category</div>
            <div className={`text-[11px] font-mono mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>expense breakdown</div>
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
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className={`font-mono ${dark ? 'text-white/40' : 'text-gray-500'}`}>{d.name}</span>
                    </div>
                    <span className={`font-mono font-semibold ${dark ? 'text-white/70' : 'text-gray-700'}`}>
                      ₹{d.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={`text-center py-10 text-xs font-mono ${dark ? 'text-white/25' : 'text-gray-400'}`}>
              <div className="text-3xl mb-2 opacity-40">◎</div>No expense data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${cardBase} p-5 animate-slideUp animate-stagger-4`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</div>
            <div className={`text-[11px] font-mono mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>
              {expenses.length} total records
            </div>
          </div>
          <button
            onClick={() => setPage('transactions')}
            className="text-xs font-semibold text-brand hover:text-brand-light transition-colors"
          >
            View all →
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className={`text-center py-10 text-xs font-mono ${dark ? 'text-white/25' : 'text-gray-400'}`}>
            <div className="text-4xl mb-2 opacity-30">◎</div>
            No transactions yet — click "+ Add Transaction"
          </div>
        ) : (
          expenses.slice(0, 7).map(tx => (
            <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}
