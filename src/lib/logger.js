const formatData = (data) => {
    try {
        return JSON.stringify(data, null, 2);
    } catch (error) {
        return '[Unable to stringify data]';
    }
};

const getTimestamp = () => new Date().toISOString();

export const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${getTimestamp()}\nMessage: ${message}\nData: ${formatData(data)}\n${'-'.repeat(80)}`);
    },

    error: (message, error = {}, additionalData = {}) => {
        console.error(
            `[ERROR] ${getTimestamp()}\n` +
            `Message: ${message}\n` +
            `Error: ${error.message || error}\n` +
            `Stack: ${error.stack || 'No stack trace'}\n` +
            `Additional Data: ${formatData(additionalData)}\n` +
            `Response Data: ${error.response?.data ? formatData(error.response.data) : 'No response data'}\n` +
            `${'-'.repeat(80)}`
        );
    },

    debug: (message, data = {}) => {
        console.debug(`[DEBUG] ${getTimestamp()}\nMessage: ${message}\nData: ${formatData(data)}\n${'-'.repeat(80)}`);
    },

    request: (method, url, headers = {}, body = {}) => {
        const sanitizedHeaders = { ...headers };
        if (sanitizedHeaders.Authorization) {
            sanitizedHeaders.Authorization = 'Bearer [REDACTED]';
        }

        console.log(
            `[REQUEST] ${getTimestamp()}\n` +
            `Method: ${method}\n` +
            `URL: ${url}\n` +
            `Headers: ${formatData(sanitizedHeaders)}\n` +
            `Body: ${formatData(body)}\n` +
            `${'-'.repeat(80)}`
        );
    },

    response: (status, data, timing) => {
        console.log(
            `[RESPONSE] ${getTimestamp()}\n` +
            `Status: ${status}\n` +
            `Timing: ${timing}ms\n` +
            `Data: ${formatData(data)}\n` +
            `${'-'.repeat(80)}`
        );
    }
};