// src/components/poems/TaskSelection.js
import React from 'react';
import { Pen, Wrench } from 'lucide-react';

export const TaskSelection = ({ onSelect }) => (
    <div className="grid grid-cols-2 gap-8 w-full max-w-xl mx-auto">
        <button
            onClick={() => onSelect('generate')}
            className="aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors"
        >
            <Pen className="w-12 h-12 text-white opacity-80" />
            <span className="text-white text-lg">حدد المطلوب</span>
        </button>
        <button
            onClick={() => onSelect('fix')}
            className="aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors"
        >
            <Wrench className="w-12 h-12 text-white opacity-80" />
            <span className="text-white text-lg">اصلح الشعر</span>
        </button>
    </div>
);

// src/components/poems/InputSelection.js
import { Camera, Book } from 'lucide-react';

export const InputSelection = ({ onImageUpload, onTopicSelect, uploadedImage, selectedTopic }) => (
    <div className="grid grid-cols-2 gap-8 w-full max-w-xl mx-auto">
        <button
            onClick={() => document.getElementById('imageInput').click()}
            className={`aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors ${selectedTopic ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            disabled={selectedTopic}
        >
            <Camera className="w-12 h-12 text-white opacity-80" />
            <span className="text-white text-lg">أرفق صورة</span>
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
                disabled={selectedTopic}
            />
        </button>

        <button
            onClick={onTopicSelect}
            className={`aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors ${uploadedImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            disabled={uploadedImage}
        >
            <Book className="w-12 h-12 text-white opacity-80" />
            <span className="text-white text-lg">اختر موضوع</span>
        </button>

        <span className="text-white text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            أو
        </span>
    </div>
);

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