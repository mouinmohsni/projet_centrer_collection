
const express = require('express');
const voitureController = require('../controllers/voiture.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/voitures/:voitureId/users -> Récupérer l'utilisateur d'une voiture
// POST /api/voitures/:voitureId/users -> Ajouter un utilisateur à une voiture
router.route('/:voitureId/users')
    .get(voitureController.findWithDriver)
    .put(voitureController.addUserToVoiture)
    .delete(voitureController.unassignDriver);

// GET /api/voitures -> Récupérer tous les voitures
// POST /api/voitures -> Créer une nouvelle voiture
router.route('/')
    .get(voitureController.getAllVoiture)
    .post(voitureController.createVoiture);

// GET /api/voitures/:id -> Récupérer une voiture par son ID
// PATCH /api/voitures/:id -> Mettre à jour une voiture
// DELETE /api/voitures/:id -> Supprimer une voiture
router.route('/:voitureId')
    .get(voitureController.getVoituresById)
    .put(voitureController.updateVoiture)
    .delete(voitureController.deleteVoiture);

module.exports = router;
