const { ApiResponse } = require('../../utils/ApiResponse');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json(
                ApiResponse.error('Validation failed', errors, 400)
            );
        }
        next();
    };
};

module.exports = validateRequest;
