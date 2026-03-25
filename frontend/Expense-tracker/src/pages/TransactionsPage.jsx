import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useExpenses } from '../hooks/useExpenses'
import TransactionItem from '../components/ui/TransactionItem'
import Spinner from '../components/ui/Spinner'
import { CATEGORIES } from '../utils/constants'

const FILTERS = [
  { key: 'all',     label: 'All'       },
  { key: 'income',  label: '↑ Income'  },
  { key: 'expense', label: '↓ Expense' },
]

export default function TransactionsPage({ openEdit, onDelete }) {
  const { dark } = useTheme()
  const { expenses, loading } = useExpenses()
  const [type,     setType]     = useState('all')
  const [category, setCategory] = useState('all')
  const [search,   setSearch]   = useState('')

  const filtered = expenses.filter(tx => {
    const matchType     = type     === 'all' || tx.type     === type
    const matchCategory = category === 'all' || tx.category === category
    const matchSearch   = tx.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCategory && matchSearch
  })

  const cardBase  = `rounded-2xl border transition-colors ${dark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-card-light'}`
  const inputBase = dark
    ? 'bg-dark-surface border border-dark-border text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all'
    : 'bg-light-card border border-light-border text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all'

  if (loading) return <Spinner text="Loading transactions..." />

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">

      {/* Filter Bar */}
      <div className={`${cardBase} px-5 py-4 flex items-center gap-3 flex-wrap`}>
        {/* Search */}
        <input
          className={`${inputBase} flex-1 min-w-45`}
          placeholder="🔍  Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Type Filter */}
        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setType(f.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
                ${type === f.key
                  ? 'bg-brand/10 text-brand border-brand/20'
                  : dark
                    ? 'border-dark-border bg-white/5 text-white/40 hover:text-white hover:border-white/20'
                    : 'border-light-border bg-gray-50 text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
            >{f.label}</button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          className={`${inputBase} cursor-pointer`}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all" className={dark ? 'bg-dark-card' : 'bg-white'}>All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c} className={dark ? 'bg-dark-card' : 'bg-white'}>{c}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className={`${cardBase} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
            All Transactions
          </div>
          <div className={`text-xs font-mono px-2.5 py-1 rounded-lg border
            ${dark ? 'border-dark-border bg-white/5 text-white/40' : 'border-light-border bg-gray-50 text-gray-400'}`}>
            {filtered.length} results
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={`text-center py-12 text-xs font-mono ${dark ? 'text-white/25' : 'text-gray-400'}`}>
            <div className="text-4xl mb-2 opacity-30">◎</div>
            No transactions match your filters
          </div>
        ) : (
          filtered.map(tx => (
            <TransactionItem key={tx._id} tx={tx} onEdit={openEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}
