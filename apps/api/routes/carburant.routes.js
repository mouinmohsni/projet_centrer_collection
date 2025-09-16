
const express = require('express');
const carburantController = require('../controllers/carburant.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/carburants -> Récupérer touts les carburants
// POST /api/carburants -> Créer un nouveau carburant
router.route('/')
    .get(carburantController.getAllCarburants)
    .post(carburantController.createCarburant);

// GET /api/carburants/:id -> Récupérer une voiture par son ID
// PATCH /api/carburants/:id -> Mettre à jour une voiture
// DELETE /api/carburants/:id -> Supprimer une voiture
router.route('/:carburantId')
    .get(carburantController.getCarburantById)
    .put(carburantController.updateCarburant)
    .delete(carburantController.deleteCarburant);

module.exports = router;
