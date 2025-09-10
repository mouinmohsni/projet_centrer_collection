// =================================================================
// BLOC 1 : IMPORTS ET CONFIGURATION
// =================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import des routes
const circuitRoutes = require('./routes/circuit.routes')
const voitureRoutes = require('./routes/voiture.routes');
const roleRoutes = require('./routes/role.routes');
const recolteRoute = require('./routes/Recolte.routes');
const produitRoute =require('./routes/produit.routes');

// Import des gestionnaires d'erreur
const NotFoundError = require('./util/NotFoundError');


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


// =================================================================
// BLOC 3 : ROUTES
// =================================================================

// Route de test simple
app.get('/api/test', (req, res) => {
    res.send('Hello! Server is running!');
});

// Montage des routes pour les circuits
app.use('/api/circuits', circuitRoutes);
app.use('/api/voitures',voitureRoutes);
app.use('/api/roles',roleRoutes);
app.use('/api/recoltes',recolteRoute);
app.use('/api/produits',produitRoute);


// =================================================================
// BLOC 4 : GESTION DES ERREURS
// =================================================================

// 1. Gestion des routes non trouvées (404)
// Doit être APRÈS toutes les routes valides.
app.all(/.*/, (req, res, next) => {
    next(new NotFoundError(`Impossible de trouver ${req.originalUrl} sur ce serveur.`));
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
