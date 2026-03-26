import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import TransactionItem from '../components/ui/TransactionItem'
import Spinner from '../components/ui/Spinner'
import { CATEGORIES } from '../utils/constants'

const FILTERS = [
  { key: 'all',     label: 'All'       },
  { key: 'income',  label: '↑ Income'  },
  { key: 'expense', label: '↓ Expense' },
]

export default function TransactionsPage({ openEdit, onDelete, expenses = [], loading = false }) {
  const { dark } = useTheme()
  const isDark = dark === 'dark' || dark === true
  
  const [type,      setType]     = useState('all')
  const [category, setCategory] = useState('all')
  const [search,   setSearch]   = useState('')

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
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all w-full'
    : 'bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all w-full'

  if (loading) return <Spinner text="Loading transactions..." />

  return (
    <div className="flex flex-col gap-4 animate-fadeIn pb-10">

      {/* ✅ Responsive Filter Bar */}
      <div className={`${cardBase} p-4 md:px-5 md:py-4 flex flex-col lg:flex-row items-center gap-4`}>
        
        {/* Search Input: Mobile pe full width */}
        <div className="relative w-full lg:flex-1">
          <input
            className={inputBase}
            placeholder="🔍   Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Group: Mobile pe 2 rows mein split na ho isliye justify-between */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          
          {/* Type Buttons: Segmented control style */}
          <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all
                  ${type === f.key
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white'
                  }`}
              >{f.label}</button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            className={`${inputBase} cursor-pointer w-auto! min-w-30 md:min-w-37.5`}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="all" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c} className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Transactions List Card */}
      <div className={`${cardBase} overflow-hidden`}>
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            History
          </div>
          <div className={`text-[10px] font-mono px-2 py-1 rounded-md border
            ${isDark 
                ? 'border-white/10 bg-white/5 text-white/40' 
                : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            {filtered.length} matches
          </div>
        </div>

        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <div className={`text-center py-16 text-xs font-mono ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
              <div className="text-4xl mb-3 opacity-20">◎</div>
              No transactions match your filters
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map(tx => (
                <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}