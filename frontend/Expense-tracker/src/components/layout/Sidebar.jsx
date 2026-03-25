import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { NAV_ITEMS } from '../../utils/constants'
import { getInitial } from '../../utils/formatters'

export default function Sidebar({ page, setPage }) {
  const { dark, toggle } = useTheme()
  const { auth, logout } = useAuth()

  return (
    <aside className={`fixed top-0 left-0 h-full w-55 flex flex-col z-50 border-r transition-colors
      ${dark
        ? 'bg-dark-surface border-dark-border'
        : 'bg-white border-light-border shadow-sm'
      }`}>

      {/* Logo */}
      <div className="px-6 py-6 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-glow-brand">
            <span className="text-white font-extrabold text-sm">E</span>
          </div>
          <div>
            <div className={`text-base font-extrabold tracking-tight leading-none ${dark ? 'text-white' : 'text-gray-900'}`}>
              Expensio
            </div>
            <div className={`text-[10px] font-mono mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>
              smart tracker
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        <div className={`text-[9px] font-bold tracking-[1.5px] uppercase font-mono px-3 mb-2
          ${dark ? 'text-white/25' : 'text-gray-400'}`}>
          Menu
        </div>

        {NAV_ITEMS.map((n, i) => {
          const isActive = page === n.id
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border w-full text-left
                animate-slideIn animate-stagger-${i + 1}
                ${isActive
                  ? dark
                    ? 'bg-brand/10 text-brand-light border-brand/20'
                    : 'bg-brand/10 text-brand border-brand/20'
                  : dark
                    ? 'text-white/50 border-transparent hover:bg-white/5 hover:text-white'
                    : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all
                ${isActive
                  ? 'bg-brand text-white shadow-glow-brand'
                  : dark ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                {n.icon}
              </span>
              {n.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className={`p-4 border-t ${dark ? 'border-dark-border' : 'border-light-border'}`}>
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all mb-3
            ${dark
              ? 'border-dark-border bg-white/5 text-white/50 hover:text-white hover:border-white/20'
              : 'border-light-border bg-gray-50 text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
        >
          <span className="text-base">{dark ? '☀️' : '🌙'}</span>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User Badge */}
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border
          ${dark ? 'border-dark-border bg-white/5' : 'border-light-border bg-gray-50'}`}>
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitial(auth?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold truncate ${dark ? 'text-white' : 'text-gray-800'}`}>
              {auth?.name || 'User'}
            </div>
            <div className={`text-[10px] font-mono ${dark ? 'text-white/30' : 'text-gray-400'}`}>
              member
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className={`text-sm transition-colors ${dark ? 'text-white/25 hover:text-expense' : 'text-gray-300 hover:text-expense'}`}
          >⏻</button>
        </div>
      </div>
    </aside>
  )
}
