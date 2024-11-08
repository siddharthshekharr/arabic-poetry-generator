import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Camera, Book, X, ArrowLeft, Pen, Wrench } from 'lucide-react';
import { generatePoem, fixPoem } from '@/lib/api';
import { toast } from "sonner";

const topics = ['حب', 'حكمة', 'شجاعة', 'طبيعة', 'وطن', 'غربة'];

const PoetryGenerationInterface = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showTopics, setShowTopics] = useState(false);
    const [verses, setVerses] = useState(5);
    const [style, setStyle] = useState('طويل');
    const [generatedPoem, setGeneratedPoem] = useState('');
    const [originalPoem, setOriginalPoem] = useState('');
    const [fixedPoem, setFixedPoem] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTaskSelection = (task) => {
        setSelectedTask(task);
        setCurrentStep(1);
        setShowTopics(false);
    };

    const handleImageUpload = async (event) => {
        if (!selectedTopic && event.target.files[0]) {
            const file = event.target.files[0];

            if (file.size > 5 * 1024 * 1024) {
                toast.error('حجم الصورة يجب أن يكون أقل من 5 ميغابايت');
                return;
            }

            try {
                // Convert to base64
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });

                setUploadedImage(base64);
                setShowTopics(false);
            } catch (error) {
                toast.error('حدث خطأ أثناء تحميل الصورة');
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleTopicSelect = (topic) => {
        if (!uploadedImage) {
            setSelectedTopic(topic);
            setShowTopics(false);
        }
    };

    const handleTopicButtonClick = () => {
        if (!uploadedImage) {
            setShowTopics(!showTopics);
        }
    };

    const handleGeneratePoem = async () => {
        try {
            setIsLoading(true);

            let imageBase64;
            if (uploadedImage) {
                const response = await fetch(uploadedImage);
                const blob = await response.blob();
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            }

            const { poem } = await generatePoem({
                topic: selectedTopic,
                style,
                verses,
                customPrompt,
                imageUrl: imageBase64
            });

            setGeneratedPoem(poem);
            setCurrentStep(3);
            toast.success('تم إنشاء القصيدة بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء إنشاء القصيدة. يرجى المحاولة مرة أخرى.');
            console.error('Error generating poem:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFixPoem = async () => {
        try {
            if (!originalPoem.trim()) {
                toast.error('يرجى إدخال نص القصيدة أولاً');
                return;
            }

            setIsLoading(true);
            const { fixedPoem: newFixedPoem } = await fixPoem(originalPoem);
            setFixedPoem(newFixedPoem);
            toast.success('تم تصحيح القصيدة بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء تصحيح القصيدة. يرجى المحاولة مرة أخرى.');
            console.error('Error fixing poem:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPoem = async () => {
        const textToCopy = generatedPoem || fixedPoem;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success('تم نسخ القصيدة بنجاح');
        } catch (error) {
            toast.error('فشل نسخ النص. يرجى المحاولة مرة أخرى.');
            console.error('Error copying text:', error);
        }
    };

    const handleNext = () => {
        if (selectedTask === 'fix') {
            return;
        }

        if ((selectedTopic || uploadedImage) && currentStep === 1) {
            setCurrentStep(2);
        } else if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setShowTopics(false);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setSelectedTask(null);
        setUploadedImage(null);
        setSelectedTopic(null);
        setShowTopics(false);
        setGeneratedPoem('');
        setOriginalPoem('');
        setFixedPoem('');
        setCustomPrompt('');
    };

    const renderTaskSelection = () => (
        <div className="grid grid-cols-2 gap-8 w-full max-w-xl mx-auto">
            <button
                onClick={() => handleTaskSelection('generate')}
                className="aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors"
            >
                <Pen className="w-12 h-12 text-white opacity-80" />
                <span className="text-white text-lg">حدد المطلوب</span>
            </button>
            <button
                onClick={() => handleTaskSelection('fix')}
                className="aspect-square rounded-lg bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center justify-center gap-4 transition-colors"
            >
                <Wrench className="w-12 h-12 text-white opacity-80" />
                <span className="text-white text-lg">اصلح الشعر</span>
            </button>
        </div>
    );

    const renderFixPoem = () => (
        <div className="w-full mx-auto grid grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-white text-right mb-4 text-lg">التعديل</h2>
                <div className="w-full min-h-[300px] text-white text-right relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                    ) : (
                        fixedPoem || 'سيظهر الشعر المعدل هنا...'
                    )}
                </div>
                {fixedPoem && (
                    <button
                        onClick={handleCopyPoem}
                        className="mt-4 px-4 py-2 bg-purple-500/50 hover:bg-purple-500/70 rounded-lg text-white transition-colors"
                    >
                        نسخ
                    </button>
                )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 relative">
                <h2 className="text-white text-right mb-4 text-lg">اكتب / الصق الشعر هنا</h2>
                <textarea
                    value={originalPoem}
                    onChange={(e) => setOriginalPoem(e.target.value)}
                    className="w-full h-[calc(100%-100px)] bg-transparent text-white text-right resize-none focus:outline-none placeholder-white/50"
                    placeholder="ضع قصيدتك هنا..."
                    dir="rtl"
                    disabled={isLoading}
                />
                <button
                    onClick={handleFixPoem}
                    disabled={isLoading || !originalPoem.trim()}
                    className={`absolute bottom-6 left-6 px-6 py-2 rounded-lg 
                        ${isLoading || !originalPoem.trim() ? 'bg-purple-500/30 cursor-not-allowed' : 'bg-purple-500/50 hover:bg-purple-500/70'} 
                        text-white transition-colors`}
                >
                    {isLoading ? 'جاري المعالجة...' : 'إنشاء'}
                </button>
            </div>
        </div>
    );

    const renderInputSelection = () => (
        <div className="relative w-full max-w-xl mx-auto h-[400px] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-24 items-center relative">
                <div className={`aspect-square w-48 rounded-lg bg-white/10 p-6 flex flex-col items-center justify-center gap-4 
                    ${selectedTopic ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'} transition-colors relative`}
                    onClick={() => !selectedTopic && document.getElementById('imageInput').click()}
                >
                    {uploadedImage ? (
                        <>
                            <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover rounded-lg absolute inset-0" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedImage(null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Camera className="w-12 h-12 text-white opacity-80" />
                            <span className="text-white text-lg">أرفق صورة</span>
                        </>
                    )}
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={selectedTopic}
                    />
                </div>

                <div className="relative">
                    {showTopics && (
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <div className="relative w-[300px] h-[150px]">
                                {topics.map((topic, index) => {
                                    const angle = Math.PI + Math.PI * (index / (topics.length - 1));
                                    const radius = 130;
                                    const x = radius * Math.cos(angle);
                                    const y = radius * Math.sin(angle);

                                    return (
                                        <button
                                            key={topic}
                                            onClick={() => handleTopicSelect(topic)}
                                            className="absolute h-14 w-14 rounded-full bg-purple-900 hover:bg-purple-800 
                                                flex items-center justify-center text-white text-sm transition-colors 
                                                duration-200 shadow-lg backdrop-blur-sm"
                                            style={{
                                                left: `${150 + x}px`,
                                                top: `${y}px`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        >
                                            {topic}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div
                        onClick={handleTopicButtonClick}
                        className={`aspect-square w-48 rounded-lg bg-white/10 p-6 flex flex-col items-center justify-center gap-4 
                        ${uploadedImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'} transition-colors relative`}
                    >
                        {selectedTopic ? (
                            <>
                                <span className="text-white text-xl">{selectedTopic}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTopic(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Book className="w-12 h-12 text-white opacity-80" />
                                <span className="text-white text-lg">اختر موضوع</span>
                            </>
                        )}
                    </div>
                </div>

                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl opacity-80">
                    أو
                </span>
            </div>
        </div>
    );

    const renderPoemSettings = () => (
        <div className="space-y-6 w-full max-w-xl mx-auto">
            <div className="space-y-2">
                <label className="block text-white text-right">البحر</label>
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
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
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20"
                    placeholder="اكتب شيء معين مثلاً...."
                    dir="rtl"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-white text-right">عدد</label>
                <select
                    value={verses}
                    onChange={(e) => setVerses(e.target.value)}
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

    const renderGeneratedPoem = () => (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-lg p-6 min-h-[300px] text-white text-right relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                ) : (
                    generatedPoem || 'القصيدة ستظهر هنا...'
                )}
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleCopyPoem}
                    disabled={!generatedPoem || isLoading}
                    className="px-6 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    نسخ
                </button>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return renderTaskSelection();
            case 1:
                return selectedTask === 'fix' ? renderFixPoem() : renderInputSelection();
            case 2:
                return renderPoemSettings();
            case 3:
                return renderGeneratedPoem();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 p-6 flex items-center justify-center">
            <Card className="w-full max-w-4xl bg-black/30 backdrop-blur-sm border-white/10 p-8 relative">
                <h1 className="text-3xl font-bold text-white text-center mb-12">مولد القصائد العربية</h1>

                {renderCurrentStep()}

                {selectedTask !== 'fix' && (
                    <div className="flex justify-between mt-8">
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                disabled={isLoading}
                                className="flex items-center gap-2 text-white hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                                السابق
                            </button>
                        )}

                        {currentStep < 3 && (
                            <button
                                onClick={currentStep === 2 ? handleGeneratePoem : handleNext}
                                disabled={
                                    isLoading ||
                                    (currentStep === 1 && !selectedTopic && !uploadedImage)
                                }
                                className={`flex items-center gap-2 ${isLoading || (currentStep === 1 && !selectedTopic && !uploadedImage)
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-white hover:text-purple-300'
                                    } mr-auto`}
                            >
                                {currentStep === 2 && isLoading ? 'جاري المعالجة...' : 'التالي'}
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {currentStep > 0 && (
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="absolute top-4 left-4 text-white hover:text-purple-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        العودة للرئيسية
                    </button>
                )}
            </Card>
        </div>
    );
};

export default PoetryGenerationInterface;