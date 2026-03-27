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

// ✅ Enhanced Premium Footer
const Footer = ({ isDark }) => (
  <footer className="mt-auto py-10">
    <div className="flex flex-col items-center gap-3">
      {/* Decorative Divider */}
      <div className={`h-px w-24 rounded-full bg-linear-to-r from-transparent via-brand/50 to-transparent mb-2 opacity-50`}></div>
      
      <div className={`group flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-500 hover:scale-105 ${
        isDark 
          ? 'bg-white/2 border-white/5 hover:border-white/10 shadow-xl shadow-black/20' 
          : 'bg-gray-50 border-gray-100 hover:border-gray-200 shadow-sm'
      }`}>
        <span className={`text-[10px] font-mono tracking-[4px] uppercase ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
          Made with 
        </span>
        <span className="text-sm animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">❤️</span>
        <span className={`text-[10px] font-mono tracking-[4px] uppercase ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
          by 
        </span>
        <span className="relative font-black text-[11px] tracking-widest uppercase bg-linear-to-r from-brand to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-brand transition-all duration-500">
          Ritesh
        </span>
      </div>

      <p className={`text-[9px] font-mono opacity-20 uppercase tracking-[2px] ${isDark ? 'text-white' : 'text-black'}`}>
        © 2026 Expensio Labs
      </p>
    </div>
  </footer>
)

function AppShell() {
  const { auth } = useAuth()
  const { dark } = useTheme()
  const isDark = dark === 'dark' || dark === true

  const [page, setPage] = useState('dashboard')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { 
    expenses, summary, breakdown, loading, 
    totalIncome, totalExpense, balance,
    addExpense, editExpense, removeExpense 
  } = useExpenses()

  if (!auth) return <AuthPage />

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
    <div className={`flex min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0f0f1a]' : 'bg-[#f8fafc]'}`}>
      
      {/* 1. Sidebar */}
      <Sidebar 
        page={page} 
        setPage={(p) => { setPage(p); setSidebarOpen(false); }} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* 2. Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden transition-all duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 px-4 py-6 md:px-10 md:py-8 md:ml-60 w-full max-w-400 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-5 animate-slideIn">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`p-3 rounded-2xl border md:hidden transition-all active:scale-90 ${
                isDark ? 'border-white/5 bg-white/5 text-white' : 'border-gray-100 bg-white text-gray-700 shadow-sm'
              }`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {meta.title}
              </h1>
              <p className={`text-[10px] font-mono tracking-wider mt-1 uppercase ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {meta.sub}
              </p>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={exportCSV}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-bold border transition-all ${
                isDark
                  ? 'border-white/5 bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  : 'border-gray-100 bg-white text-gray-500 shadow-sm hover:bg-gray-50'
              }`}
            >
              Export Data
            </button>

            <button
              onClick={() => { setEditing(null); setModal(true) }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-[11px] font-bold text-white bg-brand shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              + Add Record
            </button>
          </div>
        </div>

        {/* 4. Page Routing Logic */}
        <div className="animate-fadeIn flex-1">
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

        {/* ✅ 5. Premium Footer */}
        <Footer isDark={isDark} />
      </main>

      {/* 6. Global Modal */}
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  )
}