// src/components/poems/PoemSettings.js
export const PoemSettings = ({ verses, onVersesChange, style, onStyleChange }) => (
    <div className="space-y-6 w-full max-w-xl mx-auto">
        <div className="space-y-2">
            <label className="block text-white text-right">البحر</label>
            <select
                value={style}
                onChange={onStyleChange}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20"
                dir="rtl"
            >
                <option value="طويل">طويل</option>
                <option value="بسيط">بسيط</option>
                <option value="كامل">كامل</option>
                <option value="وافر">وافر</option>
            </select>
        </div>

        <div className="space-y-2">
            <label className="block text-white text-right">خصص</label>
            <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20"
                placeholder="اكتب شيء معين مثلاً...."
                dir="rtl"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-white text-right">عدد</label>
            <select
                value={verses}
                onChange={onVersesChange}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20"
                dir="rtl"
            >
                <option value="3">3 أبيات</option>
                <option value="5">5 أبيات</option>
                <option value="7">7 أبيات</option>
                <option value="10">10 أبيات</option>
            </select>
        </div>
    </div>
);