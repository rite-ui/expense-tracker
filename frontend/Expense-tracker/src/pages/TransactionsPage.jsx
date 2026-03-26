import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
// ❌ useExpenses removed to prevent duplicate state
import TransactionItem from '../components/ui/TransactionItem'
import Spinner from '../components/ui/Spinner'
import { CATEGORIES } from '../utils/constants'

const FILTERS = [
  { key: 'all',     label: 'All'       },
  { key: 'income',  label: '↑ Income'  },
  { key: 'expense', label: '↓ Expense' },
]

// ✅ Now receiving expenses and loading as props from App.jsx
export default function TransactionsPage({ openEdit, onDelete, expenses = [], loading = false }) {
  const { dark } = useTheme()
  const isDark = dark === 'dark' || dark === true
  
  const [type,      setType]     = useState('all')
  const [category, setCategory] = useState('all')
  const [search,   setSearch]   = useState('')

  // This will now automatically re-filter whenever 'expenses' prop changes
  const filtered = expenses.filter(tx => {
    const matchType     = type     === 'all' || tx.type     === type
    const matchCategory = category === 'all' || tx.category === category
    const matchSearch   = tx.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCategory && matchSearch
  })

  const cardBase = `rounded-2xl border transition-all duration-300 ${
    isDark 
      ? 'bg-[#1a1a2e] border-white/10 shadow-none' 
      : 'bg-white border-gray-100 shadow-sm'
  }`

  const inputBase = isDark
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6c63ff] transition-all'
    : 'bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6c63ff] transition-all'

  if (loading) return <Spinner text="Loading transactions..." />

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">

      {/* Filter Bar */}
      <div className={`${cardBase} px-5 py-4 flex items-center gap-3 flex-wrap`}>
        <input
          className={`${inputBase} flex-1 min-w-45`}
          placeholder="🔍   Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setType(f.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
                ${type === f.key
                  ? 'bg-brand/10 text-brand border-brand/20'
                  : isDark
                    ? 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
            >{f.label}</button>
          ))}
        </div>

        <select
          className={`${inputBase} cursor-pointer min-w-35`}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c} className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>{c}</option>
          ))}
        </select>
      </div>

      {/* Transactions List Card */}
      <div className={`${cardBase} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            All Transactions
          </div>
          <div className={`text-xs font-mono px-2.5 py-1 rounded-lg border
            ${isDark 
                ? 'border-white/10 bg-white/5 text-white/40' 
                : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            {filtered.length} results
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={`text-center py-12 text-xs font-mono ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
            <div className="text-4xl mb-2 opacity-30">◎</div>
            No transactions match your filters
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(tx => (
              <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}