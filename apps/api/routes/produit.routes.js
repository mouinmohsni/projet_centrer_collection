
const express = require('express');
const roleController = require('../controllers/produit.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/produits -> Récupérer touts les produits
// POST /api/produits -> Créer un nouveau role
router.route('/')
    .get(roleController.getAllProduits)
    .post(roleController.createProduit);

// GET /api/produits/:id -> Récupérer une voiture par son ID
// PATCH /api/produits/:id -> Mettre à jour une voiture
// DELETE /api/produits/:id -> Supprimer une voiture
router.route('/:produitId')
    .get(roleController.getProduitById)
    .put(roleController.updateProduit)
    .delete(roleController.deleteProduit);

module.exports = router;
