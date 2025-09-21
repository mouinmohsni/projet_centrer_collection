const CircuitExecutionService = require('../services/CircuitExecutionService')
const catchAsync = require('../util/catchAsync')


class CircuitExecutionController{

    /**
     * @desc    Créer un nouveau CircuitExecution
     * @route   POST /api/CircuitExecutions
     * @access   Public
     */
    createCircuitExecution = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;

        const nouveauCircuitExecution = await CircuitExecutionService.createCircuitExecution(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                CircuitExecution: nouveauCircuitExecution

            }
        });
    });

    /**
     * @desc    Récupérer tous les CircuitExecutions
     * @route   GET /api/CircuitExecutions
     * @access  Public
     */
    getAllCircuitExecutions = catchAsync(async (req, res, next) => {
        const CircuitExecutions = await CircuitExecutionService.getAllCircuitExecutions();
        res.status(200).json({
            status: 'success',
            results: CircuitExecutions.length,
            data: {
                CircuitExecutions: CircuitExecutions
            }
        });
    });

    /**
     * @desc    Récupérer un CircuitExecution par son ID
     * @route   GET /api/CircuitExecutions/:id
     * @access  Private
     */
    getCircuitExecutionById = catchAsync(async (req, res, next) => {
        // req.params.id contient l'ID passé dans l'URL
        const CircuitExecution = await CircuitExecutionService.getCircuitExecutionById(req.params.CircuitExecutionId);
        res.status(200).json({
            status: 'success',
            data: {
                CircuitExecution: CircuitExecution
            }
        });
    });



    /**
     * @desc    modifier un d'un CircuitExecution
     * @route   PUT /api/CircuitExecutions/:CircuitExecutionId
     * @access  Private
     */
    updateCircuitExecution = catchAsync(async (req,res,next)=> {
        const CircuitExecutionId = req.params.CircuitExecutionId;
        const performingUserId = req.user.id_user;
        const result = await CircuitExecutionService.updateCircuitExecution(CircuitExecutionId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    modifier un d'un CircuitExecution
     * @route   PUT /api/CircuitExecutions/:CircuitExecutionId
     * @access  Private
     */
    updateExecutionStatus = catchAsync(async (req,res,next)=> {
        const CircuitExecutionId = req.params.CircuitExecutionId;
        const performingUserId = req.user.id_user;
        const result = await CircuitExecutionService.updateExecutionStatus(CircuitExecutionId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un CircuitExecution
     * @route   DELETE  /api/CircuitExecutions/:CircuitExecutionId
     * @access  Private
     */
    deleteCircuitExecution = catchAsync(async (req,res,next)=> {
        const CircuitExecutionId= req.params.CircuitExecutionId;
        const result = await CircuitExecutionService.deleteCircuitExecution(CircuitExecutionId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
    * @desc   trouver avec un filtre
    * @route   post  /api/CircuitExecutions
    * @access  Private
    */

    findExecutions = catchAsync(async (req, res, next) => {

    const CircuitExecutions = await CircuitExecutionService.findExecutions(req.body);
    res.status(200).json({
                             status: 'success',
                             results: CircuitExecutions.length,
                             data: {
                                 CircuitExecutions: CircuitExecutions
                             }
                         });
});


    }
module.exports = new CircuitExecutionController()