export const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    },
    error: (message, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
            error: error.message || error,
            stack: error.stack,
            ...(error.response?.data && { responseData: error.response.data })
        });
    }
};