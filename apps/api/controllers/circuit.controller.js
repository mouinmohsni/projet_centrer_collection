const circuitService = require('../services/CircuitService')
const catchAsync = require('../util/catchAsync')


class CircuitController{


    /**
     * @desc    Créer un nouveau circuit
     * @route   POST /api/circuits
     * @access   Public
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
     *@desc    recuperer tout les utilisateurs d'un circuit
     *@route   Get /api/circuits/:circuitId/users
     *@access  Private
     */
    getUsersOfCircuit = catchAsync(async (req, res, nex)=>{
        const circuitId = req.params.circuitId;
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
     * @desc    modifier un d'un circuit
     * @route   PUT /api/circuits/:circuitId
     * @access  Private
     */
    updateCircuit = catchAsync(async (req,res,next)=> {
        const circuitId = req.params.circuitId;
        const performingUserId = req.user.id_user;
        const result = await circuitService.updateCircuit(circuitId,req.body,performingUserId);
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
        const circuitId= req.params.circuitId;
        const result = await circuitService.deleteCircuit(circuitId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });




    }
module.exports = new CircuitController()