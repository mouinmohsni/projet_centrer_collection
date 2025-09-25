class AppError extends Error {
    /**
     * Crée une erreur opérationnelle personnalisée.
     * @param {string} message - Le message d'erreur à afficher.
     * @param {number} statusCode - Le code de statut HTTP (400, 401, 403, 404, etc.).
     */
    constructor(message, statusCode) {
        super(message); // Appelle le constructeur de la classe parente 'Error'

        this.statusCode = statusCode;
        // On déduit le statut ('fail' pour 4xx, 'error' pour 5xx)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // On marque cette erreur comme étant "opérationnelle"
        this.isOperational = true;

        // Capture la pile d'appels (stack trace) pour le débogage, en excluant le constructeur de l'erreur lui-même.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
