const express = require('express');
const circuitExecutionController = require('../controllers/circuitExecution.controller');


const router = express.Router();


// GET /api/carburants -> Récupérer touts les carburants
// POST /api/carburants -> Créer un nouveau carburant
router.route('/')
    .get(circuitExecutionController.getAllCircuitExecutions)
    .post(circuitExecutionController.createCircuitExecution);

// GET /api/carburants/:id -> Récupérer une voiture par son ID
// PATCH /api/carburants/:id -> Mettre à jour une voiture
// DELETE /api/carburants/:id -> Supprimer une voiture
router.route('/:CircuitExecutionId')
    .get(circuitExecutionController.getCircuitExecutionById)
    .put(circuitExecutionController.updateCircuitExecution)
    .delete(circuitExecutionController.deleteCircuitExecution);

router.route('/:CircuitExecutionId/statuts')
    .put(circuitExecutionController.updateExecutionStatus)
router.route('/filters')
    .post(circuitExecutionController.updateExecutionStatus)


module.exports = router;
