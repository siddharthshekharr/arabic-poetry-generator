import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Camera, Book, X, ArrowLeft, Pen, Wrench } from 'lucide-react';

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

    const handleTaskSelection = (task) => {
        setSelectedTask(task);
        setCurrentStep(1);
        setShowTopics(false);
    };

    const handleImageUpload = (event) => {
        if (!selectedTopic && event.target.files[0]) {
            setUploadedImage(URL.createObjectURL(event.target.files[0]));
            setShowTopics(false);
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

    const handleNext = () => {
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
                                    // Modified angle calculation to rotate by 180 degrees (adding Math.PI)
                                    const angle = Math.PI + Math.PI * (index / (topics.length - 1));
                                    const radius = 130;
                                    const x = radius * Math.cos(angle);
                                    const y = radius * Math.sin(angle);

                                    return (
                                        <button
                                            key={topic}
                                            onClick={() => handleTopicSelect(topic)}
                                            className="absolute h-14 w-14 rounded-full bg-purple-900 
                            hover:bg-purple-800 flex items-center justify-center
                            text-white text-sm transition-colors duration-200
                            shadow-lg backdrop-blur-sm"
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
            <div className="bg-white/10 rounded-lg p-6 min-h-[300px] text-white text-right">
                {generatedPoem || 'القصيدة ستظهر هنا...'}
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

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return renderTaskSelection();
            case 1:
                return renderInputSelection();
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

                <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-white hover:text-purple-300"
                        >
                            <ChevronRight className="w-5 h-5" />
                            السابق
                        </button>
                    )}

                    {currentStep < 3 && (
                        <button
                            onClick={handleNext}
                            disabled={currentStep === 1 && !selectedTopic && !uploadedImage}
                            className={`flex items-center gap-2 ${currentStep === 1 && !selectedTopic && !uploadedImage
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-white hover:text-purple-300'
                                } mr-auto`}
                        >
                            التالي
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {currentStep > 0 && (
                    <button
                        onClick={handleReset}
                        className="absolute top-4 left-4 text-white hover:text-purple-300 flex items-center gap-2"
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