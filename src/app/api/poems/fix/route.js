import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
    try {
        const { poem } = await req.json();

        if (!poem?.trim()) {
            logger.error('Empty poem received');
            return NextResponse.json(
                { error: 'Poem text is required' },
                { status: 400 }
            );
        }

        logger.info('Starting poem correction', { poemLength: poem.length });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `أنت خبير في تصحيح وتحسين الشعر العربي. قم بتصحيح الأخطاء العروضية واللغوية وتحسين الصياغة.
                            اشرح التصحيحات التي قمت بها في نهاية النص.`
                },
                {
                    role: "user",
                    content: `قم بتصحيح وتحسين هذه القصيدة:\n${poem}`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        logger.info('Successfully fixed poem');
        return NextResponse.json({
            fixedPoem: response.choices[0].message.content
        });
    } catch (error) {
        logger.error('Error in poem correction', error);
        return NextResponse.json(
            {
                error: 'Failed to fix poem',
                details: error.message
            },
            { status: error.status || 500 }
        );
    }
}