import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
    try {
        const { topic, style, verses, customPrompt, imageUrl } = await req.json();

        logger.info('Starting poem generation', { topic, style, verses, hasImage: !!imageUrl });

        let systemPrompt = `أنت شاعر عربي محترف. قم بإنشاء قصيدة عربية تتبع قواعد البحور الشعرية العربية والقافية.`;
        let userPrompt = '';

        if (imageUrl) {
            logger.info('Generating poem from image');
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4-vision-preview-1106",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `اكتب قصيدة عربية فصحى تصف هذه الصورة. عدد الأبيات: ${verses}. البحر: ${style}.${customPrompt ? ` ${customPrompt}` : ''}`
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: imageUrl,
                                        detail: "auto"
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                });

                logger.info('Successfully generated poem from image');
                return NextResponse.json({
                    poem: response.choices[0].message.content
                });

            } catch (imageError) {
                logger.error('Failed to generate poem from image', imageError);

                // Fallback to text-based generation if vision API fails
                logger.info('Falling back to text-based generation');
                userPrompt = `اكتب قصيدة عربية فصحى. عدد الأبيات: ${verses}. البحر: ${style}.`;
                if (customPrompt) userPrompt += ` ${customPrompt}`;

                const fallbackResponse = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                });

                logger.info('Successfully generated fallback poem');
                return NextResponse.json({
                    poem: fallbackResponse.choices[0].message.content,
                    fallback: true
                });
            }
        } else {
            logger.info('Generating poem from topic');
            userPrompt = `اكتب قصيدة عربية فصحى عن ${topic}. عدد الأبيات: ${verses}. البحر: ${style}.`;

            if (customPrompt) {
                userPrompt += ` ${customPrompt}`;
            }

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            logger.info('Successfully generated poem from topic');
            return NextResponse.json({
                poem: response.choices[0].message.content
            });
        }
    } catch (error) {
        logger.error('Error in poem generation', error);
        return NextResponse.json(
            {
                error: 'Failed to generate poem',
                details: error.message
            },
            { status: error.status || 500 }
        );
    }
}