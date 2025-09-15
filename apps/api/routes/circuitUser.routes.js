const express = require('express');
const circuitUserController = require('../controllers/CircuitUser.controller');
// const protect = require('../middlewares/auth.middleware'); // Middleware de protection

// Le { mergeParams: true } est CRUCIAL.
// Il permet à ce routeur d'accéder aux paramètres du routeur parent (comme :circuitId).
const router = express.Router({ mergeParams: true });

// Notez comment les URL sont relatives.
// '/' correspond en réalité à '/api/circuits/:circuitId/users'
router.route('/')
    .post( circuitUserController.addUserToCircuit);

// '/:userId' correspond à '/api/circuits/:circuitId/users/:userId'
router.route('/:userId')
    .delete( circuitUserController.removeUserFromCircuit)
    .put(circuitUserController.updateUserInCircuit);

module.exports = router;
