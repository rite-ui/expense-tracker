import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import { useExpenses } from './hooks/useExpenses'

// Layout & Components
import Sidebar from './components/layout/Sidebar'
import ExpenseModal from './components/ui/ExpenseModal'

// Pages
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'

// Services
import { exportCSV } from './services/expenseService'

const PAGE_META = {
  dashboard:    { title: 'Overview',     sub: 'Your financial summary at a glance'    },
  transactions: { title: 'Transactions', sub: 'All your income & expense records'     },
  analytics:    { title: 'Analytics',    sub: 'Deep insights into your spending'      },
}

function AppShell() {
  const { auth } = useAuth()
  const { dark } = useTheme()
  const isDark = dark === 'dark' || dark === true

  // State Management
  const [page, setPage] = useState('dashboard')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Custom Hook for Data
  const { 
    expenses, summary, breakdown, loading, 
    totalIncome, totalExpense, balance,
    addExpense, editExpense, removeExpense 
  } = useExpenses()

  // Auth Guard
  if (!auth) return <AuthPage />

  // Handlers
  const openEdit   = (tx) => { setEditing(tx); setModal(true) }
  const closeModal = ()   => { setModal(false); setEditing(null) }

  const handleSave = async (form) => {
    try {
      if (editing) await editExpense(editing._id, form)
      else await addExpense(form)
      closeModal()
    } catch (err) {
      console.error("Failed to save transaction:", err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await removeExpense(id)
    }
  }

  const meta = PAGE_META[page] || PAGE_META.dashboard

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0f0f1a]' : 'bg-[#f8fafc]'}`}>
      
      {/* 1. Sidebar (Mobile + Desktop) */}
      <Sidebar 
        page={page} 
        setPage={(p) => { setPage(p); setSidebarOpen(false); }} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* 2. Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 transition-all duration-300 px-4 py-6 md:px-10 md:py-8 md:ml-60 w-full max-w-400 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5 animate-slideIn">
          <div className="flex items-center gap-4">
            {/* Hamburger for Mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`p-2.5 rounded-xl border md:hidden transition-all active:scale-90 ${
                isDark ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-700 shadow-sm'
              }`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {meta.title}
              </h1>
              <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                {meta.sub}
              </p>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={exportCSV}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                  : 'border-gray-200 bg-white text-gray-500 shadow-sm hover:border-gray-300'
              }`}
            >
              Download CSV
            </button>

            <button
              onClick={() => { setEditing(null); setModal(true) }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] transition-all active:scale-95"
            >
              + New Transaction
            </button>
          </div>
        </div>

        {/* 4. Page Routing Logic */}
        <div className="animate-fadeIn min-h-[70vh]">
          {page === 'dashboard' && (
            <DashboardPage 
              expenses={expenses}
              summary={summary}
              breakdown={breakdown}
              loading={loading}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              openEdit={openEdit}
              onDelete={handleDelete}
              setPage={setPage}
            />
          )}
          
          {page === 'transactions' && (
            <TransactionsPage 
              expenses={expenses}
              loading={loading}
              openEdit={openEdit}
              onDelete={handleDelete}
            />
          )}

          {page === 'analytics' && (
            <AnalyticsPage 
              expenses={expenses}
              summary={summary}
              breakdown={breakdown}
              loading={loading}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          )}
        </div>
      </main>

      {/* 5. Global Modal */}
      {modal && (
        <ExpenseModal 
          editing={editing} 
          onClose={closeModal} 
          onSave={handleSave} 
        />
      )}
    </div>
  )
}

// Wrapper to provide Context
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  )
}