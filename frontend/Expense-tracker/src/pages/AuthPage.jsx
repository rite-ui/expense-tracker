import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { dark, toggleTheme } = useTheme()
  const { login, register } = useAuth()
  const [mode,    setMode]    = useState('login')
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const isDark = dark === 'dark' || dark === true

  const handle = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({email:form.email,password: form.password})
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return }
        await register({name:form.name, email:form.email,password: form.password})
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
    setLoading(false)
  }

  const inputCls = isDark
    ? 'w-full bg-dark-card border border-dark-border text-white placeholder:text-white/25 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all'
    : 'w-full bg-light-card border border-light-border text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all'

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors
      ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-brand/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 rounded-full bg-info/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-75 h-75 rounded-full bg-income/5 blur-[80px]" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all
          ${isDark
            ? 'border-dark-border bg-dark-card hover:border-white/20'
            : 'border-light-border bg-white hover:border-gray-300 shadow-sm'
          }`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <div className={`relative z-10 w-110 max-w-[95vw] rounded-2xl border p-8 animate-scaleIn
        ${isDark
          ? 'bg-dark-surface border-dark-border2 shadow-card-dark'
          : 'bg-white border-light-border2 shadow-card-light'
        }`}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow-brand">
            <span className="text-white font-extrabold text-lg">E</span>
          </div>
          <div>
            <div className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Expensio
            </div>
            <div className={`text-[11px] font-mono ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              smart expense tracker
            </div>
          </div>
        </div>

        <p className={`text-sm mt-5 mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          {mode === 'login'
            ? 'Welcome back! Sign in to your account.'
            : 'Create your account and start tracking.'}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-expense/10 border border-expense/25 text-expense text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className={`text-[10px] font-bold tracking-[1.2px] uppercase font-mono ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                Full Name
              </label>
              <input
                className={inputCls}
                placeholder="John Doe"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-[1.2px] uppercase font-mono ${dark ? 'text-white/35' : 'text-gray-400'}`}>
              Email
            </label>
            <input
              className={inputCls}
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-[1.2px] uppercase font-mono ${dark ? 'text-white/35' : 'text-gray-400'}`}>
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
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-light hover:shadow-glow-brand active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        {/* Switch mode */}
        <p className={`text-center mt-5 text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          {mode === 'login'
            ? <>No account?{' '}
                <button onClick={() => { setMode('register'); setError('') }} className="text-brand font-semibold hover:underline">
                  Register
                </button>
              </>
            : <>Have an account?{' '}
                <button onClick={() => { setMode('login'); setError('') }} className="text-brand font-semibold hover:underline">
                  Sign in
                </button>
              </>
          }
        </p>
      </div>
    </div>
  )
}
