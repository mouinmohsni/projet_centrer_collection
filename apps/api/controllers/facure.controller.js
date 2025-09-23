const catchAsync = require('../util/catchAsync')
const FactureService =require('../services/FacureService')
const Facture = require('../models/Facture')


class FacureController{

    /**
     * @desc    Créer une nouvelle Facure
     * @route   POST /api/Facture
     * @access  Private (à définir plus tard)
     */
    createFacure = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newFacure = await FactureService.createFacture(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                Facure: newFacure

            }
        });
    });

    /**
     * @desc    Récupérer tous les Facture
     * @route   GET /api/Facture
     * @access  Public
     */
    getAllFacture = catchAsync(async (req, res, next) => {
        const Facture = await FactureService.getAllFactures();
        res.status(200).json({
            status: 'success',
            results: Facture.length,
            data: {
                Facture: Facture
            }
        });
    });

    /**
     * @desc    Récupérer  les Factures par filtre
     * @route   GET /api/Facture
     * @access  Public
     */
    getFactureByFilter = catchAsync(async (req, res, next) => {
        const Facture = await FactureService.getFactureByFilter(req.body);
        res.status(200).json({
            status: 'success',
            results: Facture.length,
            data: {
                Facture: Facture
            }
        });
    });




    /**
     * @desc    Récupérer une Facure par son ID
     * @route   GET /api/Facture/:FactureId
     * @access  Private
     */
    getFacureById = catchAsync(async (req, res, next) => {
        const Facure = await FactureService.getFactureById(req.params.FactureId);
        res.status(200).json({
            status: 'success',
            data: {
                Facure: Facure
            }
        });
    });

    /**
     * @desc    modifier d'une Facure
     * @route   PUT /api/Facture/:FactureId
     * @access  Private
     */
    updateFacure = catchAsync(async (req,res,next)=> {
        const FactureId = req.params.FactureId;
        const performingUserId = req.user.id_user;
        const result = await FactureService.updateFacture(FactureId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer d'une Facure
     * @route   DELETE  /api/Facture/:FactureId
     * @access  Private
     */
    deleteFacure = catchAsync(async (req,res,next)=> {
        const FactureId = req.params.FactureId;
        const result = await FactureService.deleteFacture(FactureId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new FacureController();
