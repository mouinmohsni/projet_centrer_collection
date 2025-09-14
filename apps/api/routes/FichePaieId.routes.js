
const express = require('express');
const FichePaieController = require('../controllers/FichePaie.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();

// --- Routes pour les associations entre fichePaie et Utilisateurs ---


// GET /api/fichePaie -> Récupérer tous les fichePaie
// POST /api/fichePaie -> Créer un nouveau fichePaie
router.route('/')
    // .get(FichePaieController.getAllfichePaie)
    .post(FichePaieController.createFichePaie);

// GET /api/fichePaie/:id -> Récupérer un circuit par son ID
// PATCH /api/fichePaie/:id -> Mettre à jour un circuit
// DELETE /api/fichePaie/:id -> Supprimer un circuit
router.route('/:fichePaieId')
    .get(FichePaieController.getFichePaieById)
    .put(FichePaieController.updateFichePaie)
    .delete(FichePaieController.deleteFichePaie);

module.exports = router;
