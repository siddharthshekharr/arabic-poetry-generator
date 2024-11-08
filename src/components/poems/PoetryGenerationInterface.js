// src/components/poems/PoetryGenerationInterface.js
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { TaskSelection } from './TaskSelection';
import { InputSelection } from './InputSelection';
import { PoemSettings } from './PoemSettings';
import { GeneratedPoem } from './GeneratedPoem';

const PoetryGenerationInterface = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [verses, setVerses] = useState(5);
    const [style, setStyle] = useState('طويل');
    const [generatedPoem, setGeneratedPoem] = useState('');

    const handleTaskSelection = (task) => {
        setSelectedTask(task);
        setCurrentStep(1);
    };

    const handleImageUpload = (event) => {
        if (!selectedTopic && event.target.files[0]) {
            setUploadedImage(URL.createObjectURL(event.target.files[0]));
            setCurrentStep(2);
        }
    };

    const handleTopicSelect = () => {
        if (!uploadedImage) {
            setSelectedTopic(true);
            setCurrentStep(2);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setSelectedTask(null);
        setUploadedImage(null);
        setSelectedTopic(null);
        setGeneratedPoem('');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <TaskSelection onSelect={handleTaskSelection} />;
            case 1:
                return (
                    <InputSelection
                        onImageUpload={handleImageUpload}
                        onTopicSelect={handleTopicSelect}
                        uploadedImage={uploadedImage}
                        selectedTopic={selectedTopic}
                    />
                );
            case 2:
                return (
                    <PoemSettings
                        verses={verses}
                        onVersesChange={(e) => setVerses(e.target.value)}
                        style={style}
                        onStyleChange={(e) => setStyle(e.target.value)}
                    />
                );
            case 3:
                return <GeneratedPoem poem={generatedPoem} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 p-6 flex items-center justify-center">
            <Card className="w-full max-w-4xl bg-black/30 backdrop-blur-sm border-white/10 p-8 relative">
                <h1 className="text-3xl font-bold text-white text-center mb-12">مولد القصائد العربية</h1>

                {renderStepContent()}

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
                            className="flex items-center gap-2 text-white hover:text-purple-300 mr-auto"
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