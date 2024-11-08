// src/lib/openai.js
import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Generate poetry function
export async function generatePoem({ topic, style, verses, customPrompt }) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert Arabic poet capable of generating high-quality Arabic poetry in various styles and meters."
                },
                {
                    role: "user",
                    content: `Generate an Arabic poem with the following specifications:
            Topic: ${topic || 'general'}
            Style: ${style}
            Number of verses: ${verses}
            Additional requirements: ${customPrompt || 'none'}
            Please ensure proper Arabic grammar and meter.`
                }
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating poem:', error);
        throw new Error('Failed to generate poem');
    }
}
