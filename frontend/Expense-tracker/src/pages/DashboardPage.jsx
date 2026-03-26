import { useTheme } from '../hooks/useTheme'
import StatCard from '../components/ui/StatCard'
import TransactionItem from '../components/ui/TransactionItem'
import ChartTooltip from '../components/ui/ChartTooltip'
import Spinner from '../components/ui/Spinner'
import { MONTH_NAMES, CAT_COLORS } from '../utils/constants'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

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

  // Chart Styling Constants
  const tickStyle = { 
    fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', 
    fontSize: 10, 
    fontFamily: 'DM Mono' 
  }
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

  // Data Processing: Bar Chart (Last 6 Months)
  const barData = (() => {
    const map = {}
    summary.forEach(s => {
      const key = `${MONTH_NAMES[s._id.month - 1]} '${String(s._id.year).slice(2)}`
      if (!map[key]) map[key] = { name: key, income: 0, expense: 0 }
      map[key][s._id.type] = s.total
    })
    return Object.values(map).slice(-6).reverse()
  })()

  // Data Processing: Pie Chart (Top 6 Categories)
  const pieData = breakdown.slice(0, 6).map(b => ({
    name: b._id, 
    value: b.total, 
    color: CAT_COLORS[b._id] || '#94a3b8'
  }))

  const cardBase = `rounded-2xl border transition-all duration-300 ${
    isDark
      ? 'bg-[#1a1a2e] border-white/10 shadow-none'
      : 'bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
  }`

  if (loading) return <Spinner text="Syncing your dashboard..." />

  return (
    <div className="flex flex-col gap-5 animate-fadeIn w-full overflow-x-hidden pb-8">

      {/* ✅ 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Net Balance" value={Math.abs(balance)} type="balance" icon="💎"
          sub={balance >= 0 ? '▲ Positive' : '▼ Negative'} delay="animate-stagger-1" 
        />
        <StatCard 
          label="Total Income" value={totalIncome} type="income" icon="📈"
          sub={`${expenses.filter(e => e.type === 'income').length} sources`} delay="animate-stagger-2" 
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard 
            label="Total Expenses" value={totalExpense} type="expense" icon="📉"
            sub={`${expenses.filter(e => e.type === 'expense').length} items`} delay="animate-stagger-3" 
          />
        </div>
      </div>

      {/* ✅ 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        
        {/* Monthly Bar Chart */}
        <div className={`${cardBase} p-4 md:p-5 animate-slideUp`}>
          <div className="mb-5">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Monthly Overview</h3>
            <p className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Income vs Expenses</p>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                <Tooltip 
                  content={<ChartTooltip />} 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} 
                />
                <Bar dataKey="income" fill="#22c987" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category (Pie Chart) */}
        <div className={`${cardBase} p-4 md:p-5 animate-slideUp`}>
          <h3 className={`mb-4 text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Spending by Category
          </h3>
          
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-stretch gap-6">
              <div className="h-40 w-full sm:w-1/2 lg:w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} cx="50%" cy="50%" 
                      innerRadius={45} outerRadius={65} 
                      dataKey="value" paddingAngle={4}
                    >
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col gap-2.5 w-full sm:w-1/2 lg:w-full">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className={`font-mono truncate ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                        {d.name}
                      </span>
                    </div>
                    <span className={`font-mono font-bold shrink-0 ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                      ₹{d.value >= 1000 ? (d.value/1000).toFixed(1)+'k' : d.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 text-xs font-mono opacity-30 ${isDark ? 'text-white' : 'text-gray-400'}`}>
              <div className="text-3xl mb-2">∅</div>
              No categorization data
            </div>
          )}
        </div>
      </div>

      {/* ✅ 3. Recent Transactions List */}
      <div className={`${cardBase} p-4 md:p-5 animate-slideUp overflow-hidden`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h3>
          <button 
            onClick={() => setPage('transactions')} 
            className="text-[11px] font-bold text-brand hover:underline transition-all"
          >
            View All History →
          </button>
        </div>

        <div className="flex flex-col">
          {expenses.length === 0 ? (
            <div className={`text-center py-10 opacity-30 text-xs font-mono ${isDark ? 'text-white' : 'text-gray-400'}`}>
              No transactions found
            </div>
          ) : (
            expenses.slice(0, 6).map(tx => (
              <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}