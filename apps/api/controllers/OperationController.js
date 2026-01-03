const OperationService = require('../services/OperationService');
const catchAsync = require('../utils/catchAsync'); // Assurez-vous que le chemin est correct

/**
 * Contrôleur pour la gestion des opérations (recolte et livraison).
 * Remplace LivraisonController et RecolteController.
 */
class OperationController {

    /**
     * @desc Crée une nouvelle opération.
     * @route POST /api/operations
     * @access Private (conducteur/livreur)
     */
    createOperation = catchAsync(async (req, res, next) => {
        // Le performingUserId est supposé être attaché à req.user par le middleware 'protect'
        const performingUserId = req.user.id_user;

        const newOperation = await OperationService.createOperation(req.body, performingUserId);

        res.status(201).json({
            status: 'success',
            data: {
                operation: newOperation
            }
        });
    });

    /**
     * @desc Récupère une opération par son ID.
     * @route GET /api/operations/:id
     * @access Private
     */
    getOperationById = catchAsync(async (req, res, next) => {
        const operationId = req.params.id;

        const operationDetail = await OperationService.getOperationDetail(operationId);

        res.status(200).json({
            status: 'success',
            data: {
                operation: operationDetail
            }
        });
    });

    /**
     * @desc Met à jour une opération.
     * @route PUT /api/operations/:id
     * @access Private (planificateur/conducteur)
     */
    updateOperation = catchAsync(async (req, res, next) => {
        const operationId = req.params.id;
        const performingUserId = req.user.id_user;

        const updatedOperation = await OperationService.updateOperation(operationId, req.body, performingUserId);

        res.status(200).json({
            status: 'success',
            data: {
                operation: updatedOperation
            }
        });
    });

    /**
     * @desc Supprime une opération.
     * @route DELETE /api/operations/:id
     * @access Private (Admin/Planificateur)
     */
    deleteOperation = catchAsync(async (req, res, next) => {
        const operationId = req.params.id;

        await OperationService.deleteOperation(operationId);

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

    /**
     * @desc Récupère les opérations selon des filtres complexes.
     * @route POST /api/operations/search
     * @access Private
     */
    searchOperations = catchAsync(async (req, res, next) => {
        const filters = req.body;

        const operations = await OperationService.getOperations(filters);

        res.status(200).json({
            status: 'success',
            results: operations.length,
            data: {
                operations
            }
        });
    });

    /**
     * @desc Récupère les opérations détaillées pour un utilisateur concerné.
     * @route GET /api/operations/concerne/:id
     * @access Private
     */
    getOperationsByConcerne = catchAsync(async (req, res, next) => {
        const id_utilisateur_concerne = req.params.id;
        const { dateDebut, dateFin } = req.query;
        const performingUserId = req.user.id_user;

        const operations = await OperationService.getByUtilisateurConcerneDetailed(
            id_utilisateur_concerne,
            dateDebut,
            dateFin,
            performingUserId
        );

        res.status(200).json({
            status: 'success',
            results: operations.length,
            data: {
                operations
            }
        });
    });
}

module.exports = new OperationController();
