// routes/user.routes.js

const express = require('express');
const userController = require('../controllers/user.controller');
// Importez vos middlewares d'authentification et de permission
 const { protect, restrictTo } = require('../ middleware/authMiddleware');

const router = express.Router();

// --- Routes d'Authentification et de Création (Publiques ou semi-publiques) ---
router.post('/login', userController.login);

router.use(protect);

router.post('/', userController.createUser);

// --- Routes Générales sur les Utilisateurs (souvent réservées aux admins) ---
router.route('/')
    .get(userController.getAllusers); // protect, restrictTo('admin'),

router.route('/:userId')
    .get(restrictTo(1),userController.getUserById) // protect
    .put(restrictTo(1),userController.updateUser) // protect
    .delete(restrictTo(1),userController.deleteUser); // protect, restrictTo('admin')


// --- Routes Spécifiques pour les Données Associées à un Utilisateur ---
// Ces routes sont très utiles pour les tableaux de bord personnels (conducteur, client, etc.)

// Routes pour un conducteur
router.get('/:userId/voitures',restrictTo(1), userController.getvoitureByUser); // protect
router.get('/:userId/recoltes-conducteur',restrictTo(1), userController.getRecoltesByConducteur); // protect
router.get('/:userId/livraisons-conducteur',restrictTo(1), userController.getLivraisonByConducteur); // protect
router.get('/:userId/carburants',restrictTo(1), userController.getUsersOfCarburant); // protect

// Routes pour un client/producteur
router.get('/:userId/recoltes-producteur',restrictTo(1), userController.getRecoltesByProducteur); // protect
router.get('/:userId/livraisons-client',restrictTo(1), userController.getLivraisonByClient); // protect

// Routes pour un employé
router.get('/:userId/fiche-paie',restrictTo(1), userController.getFichePaieByUserId); // protect

// Routes pour les circuits d'un utilisateur (conducteur ou autre)
router.get('/:userId/circuits',restrictTo(1), userController.findCircuitsByUser); // protect


module.exports = router;
