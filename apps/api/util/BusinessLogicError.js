class BusinessLogicError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BusinessLogicError';
        this.statusCode = 400; // Bad Request
    }
}
module.exports = BusinessLogicError;
