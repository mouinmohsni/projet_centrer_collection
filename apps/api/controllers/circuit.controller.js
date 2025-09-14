const circuitService = require('../services/CircuitService')
const catchAsync = require('../util/catchAsync')


class CircuitController{


    /**
     * @desc    Créer un nouveau circuit
     * @route   POST /api/circuits
     * @access  Private (à définir plus tard)
     */
    createCircuit = catchAsync(async (req, res, next) => {
        const { nom, description } = req.body;
        const performingUserId = req.user.id_user;

        const newCercuit = { nom, description };

        const nouveauCircuit = await circuitService.createCircuit(newCercuit,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                circuit: nouveauCircuit

            }
        });
    });

    /**
     * @desc    Récupérer tous les circuits
     * @route   GET /api/circuits
     * @access  Public
     */
    getAllCircuits = catchAsync(async (req, res, next) => {
        const circuits = await circuitService.getAllCircuits();
        res.status(200).json({
            status: 'success',
            results: circuits.length,
            data: {
                circuits: circuits
            }
        });
    });

    /**
     * @desc    Récupérer un circuit par son ID
     * @route   GET /api/circuits/:id
     * @access  Private
     */
    getCircuitById = catchAsync(async (req, res, next) => {
        // req.params.id contient l'ID passé dans l'URL
        const circuit = await circuitService.getCircuitById(req.params.circuitId);
        res.status(200).json({
            status: 'success',
            data: {
                circuit: circuit
            }
        });
    });

    /**
     * @desc    Ajouter un utilisateur à un circuit
     * @route   POST /api/circuits/:circuitId/users
     * @access  Private
     */
    addUserToCircuit = catchAsync(async (req, res, next) => {
        const { circuitId } = req.params;
        const { userId } = req.body; // On s'attend à recevoir l'ID de l'utilisateur dans le body
        const performingUserId = req.user.id_user;
        if (!userId) {
            // C'est une validation simple, on pourrait utiliser une librairie comme Joi ou Zod
            return res.status(400).json({ status: 'fail', message: 'Veuillez fournir un userId.' });
        }

        const result = await circuitService.addUserToCircuit(circuitId, userId,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });
    });



    /**
     *@desc    supprimer un utilisateur à un circuit
     *@route   DELETE  /api/circuits/:circuitId/users/:userId
     *@access  Private
     */

    removeUserFromCircuit = catchAsync(async (req,res,next)=>{
        const { circuitId ,userId } = req.params;

        if (!userId) {
            // C'est une validation simple, on pourrait utiliser une librairie comme Joi ou Zod
            return res.status(400).json({ status: 'fail', message: 'Veuillez fournir un userId.' });
        }

        const result = await circuitService.deleteUserToCircuit(circuitId, userId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     *@desc    recuperer tout les utilisateurs d'un circuit
     *@route   Get /api/circuits/:circuitId/users
     *@access  Private
     */
    getUsersOfCircuit = catchAsync(async (req, res, nex)=>{
        const { circuitId } = req.params;
        const users = await circuitService.getUsersOfCircuit(circuitId);
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users: users
            }
        });

    });

    /**
     * @desc    modifier un utilisateur d'un circuit
     * @route   PUT /api/circuits/:circuitId/user/:userId
     * @access  Private
     */
    updateUserInCircuit = catchAsync(async (req,res,next)=> {
        const {circuitId ,userId} = req.params;
        const {newUserId } = req.body;
        const performingUserId = req.user.id_user;
        if (!newUserId) {
            return res.status(400).json({ status: 'fail', message: 'Veuillez fournir un newUserId dans le corps de la requête.' });
        }


        const result = await circuitService.updateUserInCircuit(circuitId, userId,newUserId,performingUserId );
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    modifier un d'un circuit
     * @route   PUT /api/circuits/:circuitId
     * @access  Private
     */
    updateCircuit = catchAsync(async (req,res,next)=> {
        const {circuitId} = req.params;

        const { nom, description } = req.body;
        const updateData = { nom, description };
        const performingUserId = req.user.id_user;

        const result = await circuitService.updateCircuit(circuitId,updateData,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un circuit
     * @route   DELETE  /api/circuits/:circuitId
     * @access  Private
     */
    deleteCircuit = catchAsync(async (req,res,next)=> {
        const {circuitId} = req.params;
        const result = await circuitService.deleteCircuit(circuitId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });




    }
module.exports = new CircuitController()