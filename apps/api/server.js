
require('dotenv').config();
const express = require('express')
const bodyParser =require('body-parser')
const cors = require('cors')
const NotFoundError = require('./util/NotFoundError')
const BusinessLogicError = require('./util/BusinessLogicError')

const app = express()
app.use(cors())
app.use(bodyParser.json())

 const port = process.env.PORT || 3000

// Ce middleware s'exécute si aucune des routes ci-dessus n'a correspondu.
app.all(/.*/, (req, res, next) => {
    // On crée une erreur et on la passe au gestionnaire d'erreurs global
    next(new NotFoundError(`Impossible de trouver ${req.originalUrl} sur ce serveur.`));
});


app.get('/api/test', (req, res) => {
    res.send('Hello! Server is running on port 3000')
})


// MIDDLEWARE DE GESTION D'ERREURS GLOBAL
// C'est le dernier middleware. Express sait qu'il gère les erreurs car il a 4 arguments.
// MIDDLEWARE DE GESTION D'ERREURS GLOBAL
app.use((err, req, res, next) => { // Le paramètre 'next' est requis par Express, même si inutilisé.
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Une erreur interne du serveur est survenue.';

    console.error('💥 ERREUR ATTRAPÉE :', err);

    res.status(statusCode).json({
        status: 'error',
        message: message, // Utilisation explicite pour éviter les problèmes de linter
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


app.listen(port ,()=>{
    console.log(`server running on port ${port}`)
})