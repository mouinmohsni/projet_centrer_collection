/**
 * Prend une fonction de contrôleur asynchrone et la transforme en une fonction
 * que Express peut utiliser, en attrapant toute erreur et en la passant
 * au middleware de gestion d'erreurs via next().
 * @param {Function} fn - La fonction de contrôleur asynchrone.
 * @returns {Function} Une nouvelle fonction qui gère les erreurs.
 */
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;