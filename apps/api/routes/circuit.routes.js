const express = require('express');
const circuitController = require('../controllers/circuit.controller');
const circuitUserRouter = require('./circuitUser.routes'); // Importer le routeur d'association

const router = express.Router();

// Imbrication : toutes les routes de circuitUserRouter seront préfixées par /:id/users
router.use('/:circuitId/users', circuitUserRouter);

// Routes pour les circuits eux-mêmes
router.route('/')
    .get(circuitController.getAllCircuits)
    .post(circuitController.createCircuit);

router.route('/:circuitId')
    .get(circuitController.getCircuitById)
    .put(circuitController.updateCircuit)
    .delete(circuitController.deleteCircuit);

// Route pour lister les utilisateurs d'un circuit
router.get('/:circuitId/users', circuitController.getUsersOfCircuit);

module.exports = router;
