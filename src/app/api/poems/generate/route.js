import { generatePoemWithWatson } from '@/lib/watson';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req) {
    const startTime = Date.now();

    try {
        const requestData = await req.json();
        const { topic, style, verses, customPrompt } = requestData;

        logger.info('Received poem generation request', {
            requestData,
            endpoint: '/api/poems/generate',
            userAgent: req.headers.get('user-agent'),
            contentType: req.headers.get('content-type')
        });

        // Input validation
        if (!style) {
            logger.error('Missing required field: style', { requestData });
            return NextResponse.json(
                { error: 'البحر مطلوب' },
                { status: 400 }
            );
        }

        if (!verses || isNaN(verses)) {
            logger.error('Invalid verses value', { verses, requestData });
            return NextResponse.json(
                { error: 'عدد الأبيات غير صالح' },
                { status: 400 }
            );
        }

        logger.debug('Validated input, calling Watson API', { topic, style, verses });

        const { poem } = await generatePoemWithWatson({
            topic,
            style,
            verses: parseInt(verses),
            customPrompt
        });

        const responseTime = Date.now() - startTime;

        logger.info('Successfully generated poem', {
            responseTime,
            poemLength: poem?.length || 0,
            topic,
            style,
            verses
        });

        if (!poem) {
            logger.error('Empty poem received from Watson', { requestData });
            return NextResponse.json(
                { error: 'فشل في إنشاء القصيدة' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            poem,
            metadata: {
                generationTime: responseTime,
                timestamp: new Date().toISOString(),
                topic,
                style,
                verses
            }
        });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        logger.error('Error in poem generation endpoint', error, {
            responseTime,
            endpoint: '/api/poems/generate',
            errorCode: error.code,
            errorStatus: error.status
        });

        return NextResponse.json(
            {
                error: 'فشل في إنشاء القصيدة',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: error.status || 500 }
        );
    }
}