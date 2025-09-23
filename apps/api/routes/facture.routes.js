
const express = require('express');
const FactureController = require('../controllers/facure.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/factures -> Récupérer touts les factures
// POST /api/factures -> Créer un nouveau facture
router.route('/')
    .get(FactureController.getAllFacture)
    .post(FactureController.createFacure);

// GET /api/factures/:id -> Récupérer une voiture par son ID
// PATCH /api/factures/:id -> Mettre à jour une voiture
// DELETE /api/factures/:id -> Supprimer une voiture
router.route('/:livraisonId')
    .get(FactureController.getFacureById)
    .put(FactureController.updateFacure)
    .delete(FactureController.deleteFacure);
router.route('/filters')
    .post(FactureController.getFactureByFilter)

module.exports = router;
