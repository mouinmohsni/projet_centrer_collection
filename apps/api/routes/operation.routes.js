const express = require('express');
const OperationController = require('../controllers/OperationController');
// const authMiddleware = require('../middlewares/authMiddleware'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Toutes les routes nécessitent d'être protégé (authentifié)
// router.use(authMiddleware.protect);

// Routes pour la recherche et la création
router.route('/')
    .post(OperationController.createOperation) // Créer une opération
    .get(OperationController.searchOperations); // Utiliser GET pour la recherche simple ou POST pour la recherche complexe

// Route pour la recherche complexe (filtres dans le body)
router.route('/search')
    .post(OperationController.searchOperations);

// Route pour la recherche par utilisateur concerné
router.route('/concerne/:id')
    .get(OperationController.getOperationsByConcerne);

// Routes pour les opérations individuelles
router.route('/:id')
    .get(OperationController.getOperationById)
    .put(OperationController.updateOperation)
    .delete(OperationController.deleteOperation);

module.exports = router;
