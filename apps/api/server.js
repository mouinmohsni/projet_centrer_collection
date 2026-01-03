// =================================================================
// BLOC 1 : IMPORTS ET CONFIGURATION
// =================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { protect } = require('./ middleware/authMiddleware');


// Import des routes
const circuitRoutes = require('./routes/circuit.routes')
const voitureRoutes = require('./routes/voiture.routes');
const roleRoutes = require('./routes/role.routes');
const operationRoute = require('./routes/operation.routes');
const produitRoute =require('./routes/produit.routes');
const livraisonRoute = require('./delete/livraison.routes');
const fichePaieId = require('./routes/fichePaieId.routes');
const carburant = require('./routes/carburant.routes');
const circuitExecution = require('./routes/circuitExecution.routes');
const facture =  require('./routes/facture.routes');
const user = require('./routes/user.routes');



// Import des gestionnaires d'erreur
const AppError = require('./util/AppError');



// =================================================================
// BLOC 2 : CRÉATION ET CONFIGURATION DE L'APP EXPRESS
// =================================================================
const app = express();

// --- Middlewares Globaux ---
// Doit être placé AVANT les routes pour que les requêtes soient préparées.

// 1. Activer CORS pour toutes les requêtes
app.use(cors());

// 2. Parser le corps des requêtes JSON. C'est la ligne qui remplit req.body.
app.use(express.json(), express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('🔧 Middleware de simulation : Ajout de req.user factice.');
    req.user = {
        id_user: 1, // Simule l'utilisateur avec l'ID 1
        nom: 'Admin Test',
        id_role: 1 // Simule le rôle d'administrateur
    };
    next(); // Passe à la suite (vos routes et contrôleurs)
});


// =================================================================
// BLOC 3 : ROUTES
// =================================================================

// Route de test simple
app.get('/api/test', (req, res) => {
    res.send('Hello! Server is running!');
});
app.use('api/users',user);

app.use(protect);
// Montage des routes pour les circuits
app.use('/api/circuits', circuitRoutes);
app.use('/api/voitures',voitureRoutes);
app.use('/api/operation',operationRoute);
app.use('/api/produits',produitRoute);
app.use('/api/fichePaies',fichePaieId);
app.use('/api/carburants',carburant);
app.use('/api/circuitExecutions',circuitExecution);
app.use('api/factures',facture);





// =================================================================
// BLOC 4 : GESTION DES ERREURS
// =================================================================

// 1. Gestion des routes non trouvées (404)
// Doit être APRÈS toutes les routes valides.
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Impossible de trouver ${req.originalUrl} sur ce serveur.`));
});

// 2. Gestionnaire d'erreurs global
// Doit être le TOUT DERNIER middleware.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Une erreur interne du serveur est survenue.';

    console.error('💥 ERREUR ATTRAPÉE :', err);

    res.status(statusCode).json({
        status: 'error',
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// =================================================================
// BLOC 5 : DÉMARRAGE DU SERVEUR
// =================================================================
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
