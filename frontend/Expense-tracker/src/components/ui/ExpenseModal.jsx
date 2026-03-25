import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import {CATEGORIES, CAT_ICONS} from "../../utils/constants";

const DEFAULT = {
    title: "" ,
    amount: "" ,
    type: "expense" ,
    category: "Food" ,
    description: "" ,
    date: new Date().toISOString().split('T') [0],
}

export default function ExpenseModal({ onClose, editing, onSave }) {
    const { dark } = useTheme();
    const [form, setForm] = useState(editing ?{
        title: editing.title,
        amount: editing.amount,
        type: editing.type,
        category: editing.category,
        description: editing.description,
        date: editing.date,
    } : DEFAULT);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k,v)=> setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async () => {
        if(!form.title.trim())   return setError("Title is required");
        if(!form.amount  || form.amount <= 0)   return setError("Amount should be a positive number");
        setLoading(true);
        setError("");
        try {await onSave(form)}
         catch (err) {
            setError(err.response?.data?.message ||err.message || "An error occurred");
        } finally {   
             setLoading(false);
        }
    };

    const inputCls = `w-fu;; rounded-xl px-4 py-2.5 text-sm outline-none
    transition-all border
    ${dark
        ? 'bg-[#13131f] border-white/[0.07] text-white/25 focus:border-[#6c63ff]'
        : 'bg- [#f9f9fc] boder-[#e2e2ee] text-gray-800 placeholder:text-gray-400 focus:border-[#6c63ff]'
    }`

    const labelsCls = `text-[10px] font-bold tracking-[1.2px] uppercase font-mono ${dark ? "text-white/35" : "text-gray-400"}`;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center
         bg-black/60 backdrop-blur-md animate-fadeIn"
         onClick={e => e.target === e.currentTarget && onClose()}>

            <div className={`w-120 max-w-[95vw] rounded-2xl border p-7 animate-scaleIn
                 ${dark
                  ? "bg-dark-card border-white/13 shadow- [0_8px_40px_rgba(0,0,0,0.5)]" 
                  : "bg-white border-light-border2 shadow-[0_8px_40px_rgba(0,0,0,0.1)]"}`}>
                    
                    {/*Header*/}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className={`text-lg font-extrabold tracking-tight
                                ${dark ? 'text-white': 'text-gray-900'}`}>
                                {editing ? 'Edit Transaction': 'New Transaction'}
                            </h2>
                            <p className={`text-xs mt-0.5 font-mono
                                ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                                {editing ? 'Upadate your record': 'Add income or expense'}
                            </p>
                        </div>
                        <button onClick={onClose}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center
                            text-xs border transition-all
                            ${dark
                                ? 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                                : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            ❎
                        </button>
                    </div>
                    
                    {/*Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl
                        bg-expense/10 border border-expense/25
                        text-expense text-xs font-mono">
                            ⚠️{error}
                        </div>
                    )}
                    {/*Type Toggle */}

                    <div className="grid grid-cols-2 gap-2 mb-5">
                        {['income', 'expense'].map(t =>(
                            <button 
                            key={t}
                            onClick={()=> set('type', t)}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all
                            ${form.type === t
                             ? t=== 'income'
                                ? 'bg-income/10 text-income border-income/30'
                                : 'bg-expense/10 text-expense border-expense/30'
                             : dark 
                                ? 'bg-white/5 text-white/40 border-white/[0.07] hover:border-white/20'
                                : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                            }`}>
                                {t === 'income' ? '⬆️ Income' : '⬇️ Expense'}
                            </button>
                        ))}
                    </div>
                    
                    {/* Form GRid */}
                    <div className="grid grid-cols-2 gap-4">

                    <div className="col-span-2 flex flex-col gap-1.5">
                        <label className={labelsCls}>Title</label>
                        <input
                            className={inputCls}
                            placeholder="e.g. Grocery Shopping"
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelsCls}>Amount($)</label>
                         <input
                            className={inputCls}
                            type="number"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={e => set('amount', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelsCls}>Date</label>
                         <input
                            className={inputCls}
                            type="date"
                            value={form.date}
                            onChange={e => set('date', e.target.value)}
                        />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                        <label className={labelsCls}>Category</label>
                         <select>
                            className={inputCls}
                            value={form.category}
                            onChange={e => set('category', e.target.value)}
                            {CATEGORIES.map(c=>(
                                <option>
                                    key = {c} value = {c}
                                    classname={dark? 'bg-black-card':'bg-white'}
                                    {CAT_ICONS[c]}  {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                        <label className={labelsCls}>Description(optional)</label>
                         <input
                            className={inputCls}
                            placeholder="Add a note..."
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            onKeyDown={e=> e.key === 'Enter' && handleSubmit()}
                        />
                    </div>
                    </div>


                    {/*Actions*/}
                    <div className="flex- gap-3 mt-6">
                        <button
                        onClick={onClose}
                        className={`px-5py-3 rounded-xl text-sm font-semibold
                            border transition-all
                            ${dark
                                ? 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-800'
                            }`} 
                        >
                            Cancel
                        </button>
                        <button onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white
                        bg-brand hover:bg-brand-light hover:shadow-[0_0_20px_rgba(108,99,255,0.35)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all active:scale-[0.98]">
                            {loading
                            ? 'Saving...'
                            : editing ? 'Update Transaction': 'Add Transaction'}
                        </button>
                    </div>
            </div>
        </div>
    )

    
}