import { fixPoemWithWatson } from '@/lib/watson';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req) {
    const startTime = Date.now();

    try {
        const requestData = await req.json();
        const { poem } = requestData;

        logger.info('Received poem fix request', {
            poemLength: poem?.length || 0,
            endpoint: '/api/poems/fix',
            userAgent: req.headers.get('user-agent'),
            contentType: req.headers.get('content-type')
        });

        // Input validation
        if (!poem?.trim()) {
            logger.error('Empty poem received', { requestData });
            return NextResponse.json(
                { error: 'النص مطلوب' },
                { status: 400 }
            );
        }

        if (poem.length > 5000) {
            logger.error('Poem too long', { poemLength: poem.length });
            return NextResponse.json(
                { error: 'النص طويل جداً' },
                { status: 400 }
            );
        }

        logger.debug('Validated input, calling Watson API', {
            poemLength: poem.length,
            firstLine: poem.split('\n')[0]
        });

        const { fixedPoem } = await fixPoemWithWatson(poem);

        const responseTime = Date.now() - startTime;

        logger.info('Successfully fixed poem', {
            responseTime,
            originalLength: poem.length,
            fixedLength: fixedPoem?.length || 0
        });

        if (!fixedPoem) {
            logger.error('Empty response received from Watson', { requestData });
            return NextResponse.json(
                { error: 'فشل في تصحيح القصيدة' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            fixedPoem,
            metadata: {
                processingTime: responseTime,
                timestamp: new Date().toISOString(),
                originalLength: poem.length,
                fixedLength: fixedPoem.length
            }
        });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        logger.error('Error in poem fix endpoint', error, {
            responseTime,
            endpoint: '/api/poems/fix',
            errorCode: error.code,
            errorStatus: error.status
        });

        return NextResponse.json(
            {
                error: 'فشل في تصحيح القصيدة',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: error.status || 500 }
        );
    }
}