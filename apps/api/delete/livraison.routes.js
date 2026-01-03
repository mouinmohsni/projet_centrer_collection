
const express = require('express');
const LivraisonController = require('./livraison.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/livraisons -> Récupérer touts les livraisons
// POST /api/livraisons -> Créer un nouveau Recolte
router.route('/')
    // .get(RecolteController.getAlllivraisons)
    .post(LivraisonController.createLivraison);

// GET /api/livraisons/:id -> Récupérer une voiture par son ID
// PATCH /api/livraisons/:id -> Mettre à jour une voiture
// DELETE /api/livraisons/:id -> Supprimer une voiture
router.route('/:livraisonId')
    .get(LivraisonController.getLivraisonById)
    .put(LivraisonController.updateLivraison)
    .delete(LivraisonController.deleteLivraison);

module.exports = router;
