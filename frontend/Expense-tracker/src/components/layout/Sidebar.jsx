import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { NAV_ITEMS } from '../../utils/constants'
import { getInitial } from '../../utils/formatters'

// ✅ isOpen aur setIsOpen props receive karein
export default function Sidebar({ page, setPage, isOpen, setIsOpen }) {
  const { dark, toggleTheme } = useTheme()
  const { auth, logout } = useAuth()
  const isDark = dark === 'dark'

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 md:w-55 flex flex-col z-50 border-r transition-all duration-300 ease-in-out
      ${/* ✅ Logic: Mobile par hide/show aur Desktop par hamesha dikhega */
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0
      ${isDark
        ? 'bg-[#1a1a2e] border-white/5'
        : 'bg-white border-gray-100 shadow-sm'
      }`}>

      {/* Logo & Close Button */}
      <div className="px-6 py-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
            ${isDark ? 'bg-brand shadow-[0_0_15px_rgba(108,99,255,0.4)]' : 'bg-brand'}`}>
            <span className="text-white font-extrabold text-sm">E</span>
          </div>
          <div>
            <div className={`text-base font-extrabold tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Expensio
            </div>
          </div>
        </div>

        {/* ✅ Mobile Close Button (Sirf mobile par dikhega) */}
        <button 
          onClick={() => setIsOpen(false)}
          className={`md:hidden p-2 rounded-lg ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
        <div className={`text-[9px] font-bold tracking-[1.5px] uppercase font-mono px-3 mb-2
          ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
          Menu
        </div>

        {NAV_ITEMS.map((n) => {
          const isActive = page === n.id
          return (
            <button
              key={n.id}
              onClick={() => {
                setPage(n.id)
                // ✅ Page change hote hi mobile par sidebar band ho jaye
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border w-full text-left
                ${isActive
                  ? isDark
                    ? 'bg-brand/10 text-white border-brand/20'
                    : 'bg-brand/10 text-brand border-brand/20'
                  : isDark
                    ? 'text-white/50 border-transparent hover:bg-white/5 hover:text-white'
                    : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all
                ${isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/30'
                  : isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                {n.icon}
              </span>
              <span className="truncate">{n.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />}
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all mb-3
            ${isDark
              ? 'border-white/5 bg-white/5 text-white/50 hover:text-white'
              : 'border-gray-100 bg-gray-50 text-gray-500 hover:text-gray-800'
            }`}
        >
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span className="truncate">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User Badge */}
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl border
          ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitial(auth?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {auth?.name || 'User'}
            </div>
            <div className={`text-[9px] font-mono ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              member
            </div>
          </div>
          <button
            onClick={logout}
            className={`p-1.5 transition-colors ${isDark ? 'text-white/20 hover:text-red-400' : 'text-gray-300 hover:text-red-500'}`}
          >⏻</button>
        </div>
      </div>
    </aside>
  )
}