import { logger } from './logger';

const BASE_URL = 'https://ai.deem.sa';
const DEPLOYMENT_ID = '2cbbcdce-86af-46ad-a51b-0fc8134a864f';
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5WZTRrVnZkc25JUUdrOWs0YzFRMlhrNjBmekhKSW1GUW5NWUJjN3A4ZkkifQ.eyJ1aWQiOiIxMDAwMzMxMDg2IiwidXNlcm5hbWUiOiI0MWI0NDUwZC00OGVlLTQ5MmYtYTczNi01YjkxMjQ5ZTVmZGQiLCJyb2xlIjoiVXNlciIsInBlcm1pc3Npb25zIjpbInNpZ25faW5fb25seSJdLCJncm91cHMiOlsxMDAzNiwxMDAwMF0sInN1YiI6IjQxYjQ0NTBkLTQ4ZWUtNDkyZi1hNzM2LTViOTEyNDllNWZkZCIsImlzcyI6IktOT1hTU08iLCJhdWQiOiJEU1giLCJhcGlfcmVxdWVzdCI6dHJ1ZSwiaWF0IjoxNzMxMDgwMjgyLCJleHAiOjUzMzEwNzY2ODJ9.2ghUL52tD7dKa_CkwmPEYBhAT4hIRm-7gnvWE_-AYsVzWKZyG9Uvo5fzM15nkSRINoXYGyimUI1Ahyz_G9Zi0bMqtSt3otgQyvXh42E5-mHvdNytoVt6_0TNknhmuvCdQCHwNPmMq1SfoH5kpNz42I4kno677tNl-BA2BYlZeyTf3tAFejHfIvedednnvTCj5H9SszIFh6a68ujmvXK41p3nE6FgwYJUBmOcP62xSls9bmMi_8HPeqpekLGTiTUzAr357JRojFhj6gFeoQAAS5Jb7JkNakLTEyUIEc1GhWuZc_5iFA8dUe9QPePVehqiPKEYXQYNcjlAB1gHdrrjMg';

export async function generatePoemWithWatson({ topic, style, verses, customPrompt }) {
    const startTime = Date.now();
    const input = `اكتب قصيدة عربية فصحى ${topic ? `عن ${topic}` : ''} بعدد ${verses} أبيات على البحر ${style}. ${customPrompt || ''}`;
    const url = `${BASE_URL}/ml/v1/deployments/${DEPLOYMENT_ID}/text/generation?version=2021-05-01`;

    logger.info('Starting poem generation with Watson', {
        topic,
        style,
        verses,
        customPrompt,
        deploymentId: DEPLOYMENT_ID
    });

    const requestBody = {
        input,
        parameters: {
            decoding_method: "greedy",
            max_new_tokens: verses * 50,
            min_new_tokens: verses * 20,
            stop_sequences: [],
            repetition_penalty: 1.2
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
    };

    logger.request('POST', url, headers, requestBody);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        });

        const responseTime = Date.now() - startTime;
        const data = await response.json();

        logger.response(response.status, data, responseTime);

        if (!response.ok) {
            throw new Error(
                `Watson API error: ${response.status} ${response.statusText}\n` +
                `Response: ${JSON.stringify(data)}`
            );
        }

        const generatedText = data.generated_text || data.predictions?.[0]?.generated_text;

        logger.info('Successfully generated poem', {
            responseTime,
            poemLength: generatedText?.length || 0,
            status: response.status
        });

        return { poem: generatedText };
    } catch (error) {
        logger.error('Failed to generate poem with Watson', error, {
            requestBody,
            responseTime: Date.now() - startTime,
            url
        });
        throw error;
    }
}

export async function fixPoemWithWatson(poem) {
    const startTime = Date.now();
    const url = `${BASE_URL}/ml/v1/deployments/${DEPLOYMENT_ID}/text/generation?version=2021-05-01`;

    logger.info('Starting poem correction with Watson', {
        poemLength: poem?.length,
        deploymentId: DEPLOYMENT_ID
    });

    const requestBody = {
        input: `قم بتصحيح وتحسين هذه القصيدة:\n${poem}`,
        parameters: {
            decoding_method: "greedy",
            max_new_tokens: 500,
            min_new_tokens: 50,
            stop_sequences: [],
            repetition_penalty: 1.2
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
    };

    logger.request('POST', url, headers, requestBody);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        });

        const responseTime = Date.now() - startTime;
        const data = await response.json();

        logger.response(response.status, data, responseTime);

        if (!response.ok) {
            throw new Error(
                `Watson API error: ${response.status} ${response.statusText}\n` +
                `Response: ${JSON.stringify(data)}`
            );
        }

        const fixedText = data.generated_text || data.predictions?.[0]?.generated_text;

        logger.info('Successfully fixed poem', {
            responseTime,
            originalLength: poem?.length || 0,
            fixedLength: fixedText?.length || 0,
            status: response.status
        });

        return { fixedPoem: fixedText };
    } catch (error) {
        logger.error('Failed to fix poem with Watson', error, {
            requestBody,
            responseTime: Date.now() - startTime,
            url
        });
        throw error;
    }
}