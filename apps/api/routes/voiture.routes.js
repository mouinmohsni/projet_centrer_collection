
const express = require('express');
const voitureController = require('../controllers/voiture.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/voitures/:voitureId/users -> Récupérer l'utilisateur d'une voiture
// POST /api/circuits/:voitureId/users -> Ajouter un utilisateur à une voiture
router.route('/:voitureId/users')
    .get(voitureController.findWithDriver)
    .put(voitureController.addUserToVoiture)
    .delete(voitureController.unassignDriver);

// GET /api/circuits -> Récupérer tous les voitures
// POST /api/circuits -> Créer une nouvelle voiture
router.route('/')
    .get(voitureController.getAllVoiture)
    .post(voitureController.createVoiture);

// GET /api/circuits/:id -> Récupérer une voiture par son ID
// PATCH /api/circuits/:id -> Mettre à jour une voiture
// DELETE /api/circuits/:id -> Supprimer une voiture
router.route('/:voitureId')
    .get(voitureController.getVoituresById)
    .put(voitureController.updateVoiture)
    .delete(voitureController.deleteVoiture);

module.exports = router;
