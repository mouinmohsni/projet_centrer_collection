const catchAsync = require('../util/catchAsync')
const CircuitUserService =require('../services/CircuitUserService')
const CircuitUser = require('../models/CircuitUser')
const circuitService = require('../services/CircuitService')


class CircuitUserController{

    /**
     * @desc    Créer une nouvelle CircuitUser
     * @route   POST /api/circuits/User
     * @access  private
     */
    addUserToCircuit = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const circuitId = req.params.circuitId
        const userId = req.body.userId
        const newCircuitUser = await circuitService.addUserToCircuit(circuitId,userId,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                CircuitUser: newCircuitUser

            }
        });
    });

    /**
     * @desc    Récupérer une CircuitUser par son ID
     * @route   GET /api/CircuitUsers/:CircuitUserId
     * @access  Private
     */
    getCircuitUserById = catchAsync(async (req, res, next) => {

        const CircuitUser = await CircuitUserService.getoneById(req.params.CircuitUserId);
        res.status(200).json({
            status: 'success',
            data: {
                CircuitUser: CircuitUser
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

        if (!circuitId) {
            // C'est une validation simple, on pourrait utiliser une librairie comme Joi ou Zod
            return res.status(400).json({ status: 'fail', message: 'Veuillez fournir un circuitId.' });
        }

        const result = await circuitService.removeUserFromCircuit(circuitId, userId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new CircuitUserController();
