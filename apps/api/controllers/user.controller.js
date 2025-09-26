const catchAsync = require('../util/catchAsync')
const UserService =require('../services/userService')


class UserController{

    /**
     * @desc    Créer une nouvelle user
     * @route   POST /api/users
     * @access  Private
     */
    createUser = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user; // Suppose que le middleware d'auth est actif
        const newUser = await UserService.create(req.body, performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser // Correction
            }
        });
    });


    /**
     * @desc    Récupérer tous les users
     * @route   GET /api/users
     * @access  Public
     */
    getAllusers = catchAsync(async (req, res, next) => {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users: users
            }
        });
    });

    /**
     * @desc    Récupérer tous les users
     * @route   Post /api/users/login
     * @access  Public
     */
    login = catchAsync(async (req, res, next) => {
        const loginData = await UserService.login(req.body);
        res.status(200).json({
            status: 'success',
            data: loginData
        });
    });



    /**
     * @desc    Récupérer une role par son ID
     * @route   GET /api/users/:userId
     * @access  Private
     */
    getUserById = catchAsync(async (req, res, next) => {
        const user = await UserService.getUserById(req.params.userId);
        res.status(200).json({
            status: 'success',
            data: {
                user: user // Correction
            }
        });
    });


    /**
     * @desc    modifier un d'un user
     * @route   PUT /api/users/:userId
     * @access  Private
     */
    updateUser = catchAsync(async (req,res,next)=> {
        const userId= req.params.userId;
        const performingUserId = req.user.id_user;
        const data = req.body ;

        const result = await UserService.updateUser(userId,data,performingUserId);
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
        const userId = req.params.userId;
        const result = await UserService.deleteUser(userId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    recupere la recolte d'un conducteur
     * @route   GET  /api/users/:userId/recoltes-conducteur
     * @access  Private
     */
    getRecoltesByConducteur = catchAsync(async (req, res, next) => {
        const userId  = req.params.userId;
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
     * @route   GET  /api/users/:userId /recoltes-producteur
     * @access  Private
     */
    getRecoltesByProducteur = catchAsync(async (req, res, next) => {
        const userId = req.params.userId;
        const { dateDebut, dateFin } = req.query;
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
     * @route   GET  /api/users/:userId /voiture
     * @access  Private
     */

    getvoitureByUser = catchAsync(async (req, res, next) => {
        const userId = req.params.userId;
        const voiture = await UserService.getVehiclesForUser(userId);
        res.status(200).json({
            status: 'success',
            results: voiture.length,
            data: {
                voiture
            }
        });
    });

    /**
     * @desc    recupere la livraison d'un conducteur
     * @route   GET  /api/users/:userId/livraison-conducteur
     * @access  Private
     */
    getLivraisonByConducteur = catchAsync(async (req, res, next) => {
        const userId = req.params.userId;

        // Les filtres de date viennent des query parameters (ex: ?dateDebut=2025-09-01&dateFin=2025-09-07)
        const { dateDebut, dateFin } = req.query;

        // On passe l'ID et un objet de filtres au service.
        const livraison = await UserService.getLivraisonByConducteur(userId, { dateDebut, dateFin });

        res.status(200).json({
            status: 'success',
            results: livraison.length,
            data: {
                livraison
            }
        });
    });

    /**
     * @desc    recupere les livraisons par clien
     * @route   GET  /api/users/:userId/livraison-producteur
     * @access  Private
     */
    getLivraisonByClient = catchAsync(async (req, res, next) => {
        const userId= req.params.userId;
        const { dateDebut, dateFin } = req.query;

        // On passe l'ID et un objet de filtres au service.
        const livraisons = await UserService.getLivraisonsByClient(userId, { dateDebut, dateFin });

        res.status(200).json({
            status: 'success',
            results: livraisons.length,
            data: {
                livraisons
            }
        });
    });

    /**
     * @desc    recupere les fiche de paye par user
     * @route   GET  /api/users/:userId/fiche-paie
     * @access  Private
     */
    getFichePaieByUserId =catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    const FichePaie = await UserService.getFichePaieByUserId(userId);
    res.status(200).json({
                             status: 'success',
                             results: FichePaie.length,
                             data: {
                                 FichePaie
                             }
                         });
    });


    /**
     * @desc    recupere les Circuits par user
     * @route   GET  /api/users/:userId/circuits
     * @access  Private
     */
    findCircuitsByUser = catchAsync(async (req, res, next) => {
        const userId = req.params.userId;
        const Circuits = await UserService.findCircuitsByUser(userId);
        res.status(200).json({
            status: 'success',
            results: Circuits.length,
            data: {
                Circuits
            }
        });
    });


    /**
     * @desc    recupere les Carburant par user
     * @route   GET  /api/users/:userId/carburants
     * @access  Private
     */
    getUsersOfCarburant = catchAsync(async (req, res, next) => {
        const userId = req.params.userId;
        const { dateDebut, dateFin } = req.query; // N'oubliez pas les filtres si nécessaire
        const carburants = await UserService.getUsersOfCarburant(userId, { dateDebut, dateFin }); // Correction
        res.status(200).json({
            status: 'success',
            results: carburants.length,
            data: {
                carburants: carburants // Correction
            }
        });
    });





}

module.exports = new UserController();
