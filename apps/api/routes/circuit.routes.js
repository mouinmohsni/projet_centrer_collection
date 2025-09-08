
const express = require('express');
const circuitController = require('../controllers/circuit.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();

// --- Routes pour les associations entre Circuits et Utilisateurs ---

// GET /api/circuits/:circuitId/users -> Récupérer tous les utilisateurs d'un circuit
// POST /api/circuits/:circuitId/users -> Ajouter un utilisateur à un circuit
router.route('/:circuitId/users')
    .get(circuitController.getUsersOfCircuit)
    .post(circuitController.addUserToCircuit);

// DELETE /api/circuits/:circuitId/users/:userId -> Supprimer un utilisateur d'un circuit
// PATCH /api/circuits/:circuitId/users/:userId -> Remplacer un utilisateur sur un circuit
router.route('/:circuitId/users/:userId')
    .delete(circuitController.removeUserFromCircuit)
    .patch(circuitController.updateUserInCircuit); // Utiliser PATCH est sémantiquement bon pour une mise à jour partielle/remplacement

// --- Routes pour les Circuits eux-mêmes ---

// GET /api/circuits -> Récupérer tous les circuits
// POST /api/circuits -> Créer un nouveau circuit
router.route('/')
    .get(circuitController.getAllCircuits)
    .post(circuitController.createCircuit);

// GET /api/circuits/:id -> Récupérer un circuit par son ID
// PATCH /api/circuits/:id -> Mettre à jour un circuit
// DELETE /api/circuits/:id -> Supprimer un circuit
router.route('/:id')
    .get(circuitController.getCircuitById)
    .patch(circuitController.updateCircuit)
    .delete(circuitController.deleteCircuit);

module.exports = router;
