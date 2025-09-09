
const express = require('express');
const roleController = require('../controllers/role.controller');
// Plus tard, nous ajouterons le middleware de protection ici
// const protect = require('../middleware/auth.middleware');

const router = express.Router();


// GET /api/roles -> Récupérer touts les roles
// POST /api/roles -> Créer un nouveau role
router.route('/')
    .get(roleController.getAllRoles)
    .post(roleController.createRole);

// GET /api/roles/:id -> Récupérer une voiture par son ID
// PATCH /api/roles/:id -> Mettre à jour une voiture
// DELETE /api/roles/:id -> Supprimer une voiture
router.route('/:roleId')
    .get(roleController.getRoleById)
    .put(roleController.updateRole)
    .delete(roleController.deleteRole);

module.exports = router;
