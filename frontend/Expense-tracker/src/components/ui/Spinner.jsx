export default function Spinner({text = 'Loading...'}) {
    return (
        <div className="flex items-center justify-center gap-3 py-20 text-sm font-mono text-gray-400">
            <div className="w-5 h-5 rounded-full border-2border-[#6c63ff]/ 30border-t-[#6c63ff] animate-spin">
                {text}
            </div>
        </div>
    )
}