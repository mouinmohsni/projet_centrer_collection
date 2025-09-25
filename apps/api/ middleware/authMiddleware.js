const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // Un utilitaire Node.js pour "transformer" les callbacks en promises
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError'); // Vous devriez avoir une classe d'erreur personnalisée
const UserRepository = require('../repositories/UserRepository');

// Récupérez votre clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Récupérer le token et vérifier s'il existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.', 401));
    }

    // 2. Vérifier la validité du token
    // jwt.verify utilise des callbacks, on le transforme en promise avec promisify
    const decodedPayload = await promisify(jwt.verify)(token, JWT_SECRET);

    // 3. Vérifier si l'utilisateur existe toujours
    const currentUser = await UserRepository.findById(decodedPayload.id);
    if (!currentUser) {
        return next(new AppError('L\'utilisateur associé à ce token n\'existe plus.', 401));
    }

    // 4. Vérifier si l'utilisateur n'a pas changé son mot de passe après la création du token
    // (Ceci est une étape de sécurité avancée mais très importante)
    // Vous devez ajouter un champ 'passwordChangedAt' à votre modèle User.
    // if (currentUser.passwordChangedAfter(decodedPayload.iat)) {
    //     return next(new AppError('Le mot de passe a été récemment changé. Veuillez vous reconnecter.', 401));
    // }

    // 5. Si tout est bon, attacher l'utilisateur à la requête
    // Le prochain middleware ou contrôleur aura accès à req.user
    req.user = currentUser;
    next(); // On passe à la suite
});

// ... (code du middleware protect)

/**
 * Middleware pour restreindre l'accès à certains rôles.
 * @param {...number} roles 
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {


        if (!roles.includes(req.user.role)) { // 'role' doit être le libellé : 'admin', 'conducteur'
            return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action.', 403)); // 403 = Forbidden
        }

        next();
    };
};
