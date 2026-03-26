import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { dark, toggleTheme } = useTheme()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isDark = dark === 'dark' || dark === true

  const handle = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return }
        await register({ name: form.name, email: form.email, password: form.password })
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
    setLoading(false)
  }

  const inputCls = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-all border ${
    isDark
      ? 'bg-[#1a1a2e] border-white/10 text-white placeholder:text-white/20 focus:border-[#6c63ff]'
      : 'bg-[#f9f9fc] border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#6c63ff]'
  }`

  return (
    // ✅ Use h-screen + overflow-y-auto for mobile keyboard safety
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden transition-colors px-4 py-8 ${
      isDark ? 'bg-[#0f0f1a]' : 'bg-[#f8fafc]'
    }`}>

      {/* Background decoration - Simplified for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-72 md:w-125 h-72 md:h-125 rounded-full bg-brand/10 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-60 md:w-100 h-60 md:h-100 rounded-full bg-blue-500/10 blur-[80px] md:blur-[100px]" />
      </div>

      {/* Theme toggle - Responsive positioning */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all z-50 ${
          isDark ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-700 shadow-sm'
        }`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* ✅ Optimized Card Container */}
      <div className={`relative z-10 w-full max-w-105 rounded-2xl border p-6 md:p-8 animate-scaleIn transition-all ${
        isDark
          ? 'bg-[#16162a] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
      }`}>

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            <span className="text-white font-extrabold text-lg">E</span>
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Expensio
            </h1>
            <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              Smart Tracker
            </p>
          </div>
        </div>

        <h2 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p className={`text-xs mb-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          {mode === 'login'
            ? 'Sign in to continue tracking your expenses.'
            : 'Join us today and take control of your finances.'}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-medium animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                Full Name
              </label>
              <input
                className={inputCls}
                placeholder="Enter your name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Email Address
            </label>
            <input
              className={inputCls}
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Password
            </label>
            <input
              className={inputCls}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
            />
          </div>

          <button
            onClick={handle}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-brand hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="text-center mt-8">
          <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-500'}`}>
            {mode === 'login' ? "Don't have an account?" : "Already a member?"}{' '}
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} 
              className="text-brand font-bold hover:underline underline-offset-4"
            >
              {mode === 'login' ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}