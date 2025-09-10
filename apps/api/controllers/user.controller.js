const catchAsync = require('../util/catchAsync')
const UserService =require('../services/userService')
const User = require('../models/User')


class UserController{

    /**
     * @desc    Créer une nouvelle user
     * @route   POST /api/users
     * @access  Private (à définir plus tard)
     */
    createRole = catchAsync(async (req, res, next) => {
        const newRole = await UserService.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                role: newRole

            }
        });
    });

    /**
     * @desc    Récupérer tous les users
     * @route   GET /api/users
     * @access  Public
     */
    getAllusers = catchAsync(async (req, res, next) => {
        const users = await UserService.getAll();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users: users
            }
        });
    });

    /**
     * @desc    Récupérer une role par son ID
     * @route   GET /api/users/:userId
     * @access  Private
     */
    getUserById = catchAsync(async (req, res, next) => {
        const role = await UserService.getoneById(req.params.userId);
        res.status(200).json({
            status: 'success',
            data: {
                role: role
            }
        });
    });

    /**
     * @desc    modifier un d'un user
     * @route   PUT /api/users/:userId
     * @access  Private
     */
    updateUser = catchAsync(async (req,res,next)=> {
        const {userId} = req.params;

        const result = await UserService.update(userId,req.body);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un user
     * @route   DELETE  /api/users/:userId
     * @access  Private
     */
    deleteUser = catchAsync(async (req,res,next)=> {
        const {roleId} = req.params;
        const result = await UserService.delete(userId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    recupere la recolte d'un conducteur
     * @route   DELETE  /api/users/:userId/recoltes-conducteur
     * @access  Private
     */
    getRecoltesByConducteur = catchAsync(async (req, res, next) => {
        const { userId } = req.params;

        // Les filtres de date viennent des query parameters (ex: ?dateDebut=2025-09-01&dateFin=2025-09-07)
        const { dateDebut, dateFin } = req.query;

        // On passe l'ID et un objet de filtres au service.
        const recoltes = await UserService.getRecoltesByConducteur(userId, { dateDebut, dateFin });

        res.status(200).json({
            status: 'success',
            results: recoltes.length,
            data: {
                recoltes
            }
        });
    });

    /**
     * @desc    recupere la recolte d'un producteur
     * @route   GET  /api/users/:roleId/recoltes-producteur
     * @access  Private
     */
    getRecoltesByProducteur = catchAsync(async (req, res, next) => {
        const { userId } = req.params;

        // Les filtres de date viennent des query parameters (ex: ?dateDebut=2025-09-01&dateFin=2025-09-07)
        const { dateDebut, dateFin } = req.query;

        // On passe l'ID et un objet de filtres au service.
        const recoltes = await UserService.getRecoltesByProducteur(userId, { dateDebut, dateFin });

        res.status(200).json({
            status: 'success',
            results: recoltes.length,
            data: {
                recoltes
            }
        });
    });

    /**
     * @desc    recupere la voiture d'un conducteur
     * @route   GET  /api/users/:roleId/voiture
     * @access  Private
     */

    getvoitureByUser = catchAsync(async (req, res, next) => {
        const { userId } = req.params;
        const voiture = await UserService.getVehiclesForUser(userId);

        res.status(200).json({
            status: 'success',
            results: voiture.length,
            data: {
                voiture
            }
        });
    });




}

module.exports = new UserController();
