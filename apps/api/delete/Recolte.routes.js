
const express = require('express');
const RecolteController = require('./Recolte.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/recoltes -> Récupérer touts les Recoltes
// POST /api/recoltes -> Créer un nouveau Recolte
router.route('/')
    // .get(RecolteController.getAllRecoltes)
    .post(RecolteController.createRecolte);

// GET /api/recoltes/:id -> Récupérer une voiture par son ID
// PATCH /api/recoltes/:id -> Mettre à jour une voiture
// DELETE /api/recoltes/:id -> Supprimer une voiture
router.route('/:recolteId')
    .get(RecolteController.getRecolteById)
    .put(RecolteController.updateRecolte)
    .delete(RecolteController.deleteRecolte);

module.exports = router;
