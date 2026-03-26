import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import { useExpenses } from './hooks/useExpenses'
import Sidebar from './components/layout/Sidebar'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ExpenseModal from './components/ui/ExpenseModal'
import { exportCSV } from './services/expenseService'

const PAGE_META = {
  dashboard:    { title: 'Overview',     sub: 'Your financial summary at a glance'    },
  transactions: { title: 'Transactions', sub: 'All your income & expense records'     },
  analytics:    { title: 'Analytics',    sub: 'Deep insights into your spending'      },
}

function AppShell() {
  const { auth } = useAuth()
  const { dark } = useTheme()
  const [page,    setPage]    = useState('dashboard')
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)

  // 1. Saara data yahan hook se nikaalein (Takki single source of truth rahe)
  const { 
    expenses, 
    summary, 
    breakdown, 
    loading, 
    totalIncome, 
    totalExpense, 
    balance,
    addExpense, 
    editExpense, 
    removeExpense 
  } = useExpenses()

  if (!auth) return <AuthPage />

  const openEdit   = (tx) => { setEditing(tx);   setModal(true)  }
  const closeModal = ()   => { setModal(false);  setEditing(null) }

  const handleSave = async (form) => {
    if (editing) await editExpense(editing._id, form)
    else         await addExpense(form)
    closeModal()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    await removeExpense(id)
  }

  const { title, sub } = PAGE_META[page]

  return (
    <div className={`flex min-h-screen transition-colors ${dark ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <Sidebar page={page} setPage={setPage} />

      <main className="ml-55 flex-1 px-8 py-7 min-h-screen">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-7 gap-4 flex-wrap animate-slideIn">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            <p className={`text-xs font-mono mt-1 ${dark ? 'text-white/35' : 'text-gray-400'}`}>{sub}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportCSV}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all
                ${dark
                  ? 'border-dark-border bg-dark-card text-white/50 hover:text-income hover:border-income/30 hover:bg-income/5'
                  : 'border-light-border bg-white text-gray-500 hover:text-income hover:border-income/30 shadow-sm'
                }`}
            >
              <span>⬇</span> Export CSV
            </button>

            <button
              onClick={() => { setEditing(null); setModal(true) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-light hover:shadow-glow-brand hover:-translate-y-px active:scale-[0.98] transition-all"
            >
              <span className="text-base">+</span> Add Transaction
            </button>
          </div>
        </div>

        {/* 2. Pages ko saara data as PROPS bhej rahe hain */}
        {page === 'dashboard' && (
          <DashboardPage 
            setPage={setPage} 
            openEdit={openEdit} 
            onDelete={handleDelete}
            expenses={expenses}
            summary={summary}
            breakdown={breakdown}
            loading={loading}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        )}
        
        {page === 'transactions' && (
          <TransactionsPage 
            openEdit={openEdit} 
            onDelete={handleDelete} 
            expenses={expenses}
            loading={loading}
          />
        )}

        {page === 'analytics' && <AnalyticsPage />}
      </main>

      {modal && (
        <ExpenseModal editing={editing} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  )
}