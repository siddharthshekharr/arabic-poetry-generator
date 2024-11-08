// src/components/poems/GeneratedPoem.js
export const GeneratedPoem = ({ poem }) => (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
        <div className="bg-white/10 rounded-lg p-6 min-h-[300px] text-white text-right">
            {poem || 'القصيدة ستظهر هنا...'}
        </div>
        <div className="flex justify-center gap-4">
            <button className="px-6 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                تعديل
            </button>
            <button className="px-6 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                نسخ
            </button>
        </div>
    </div>
);