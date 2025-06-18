class ApiResponse {
    static success(data, message = 'Success', meta = {}) {
        return {
            success: true,
            message,
            data,
            meta
        };
    }

    static error(message = 'Something went wrong', errors = [], statusCode = 500) {
        return {
            success: false,
            message,
            errors,
            statusCode
        };
    }
}

module.exports = {
    ApiResponse
};
