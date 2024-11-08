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