const catchAsync = require('../util/catchAsync')
const VoitureService =require('../services/VoitureService')
const circuitService = require("../services/CircuitService");


class VoitureController{

    /**
     * @desc    Créer une nouvelle voiture
     * @route   POST /api/voitures
     * @access  Private (à définir plus tard)
     */
    createVoiture = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const nouveauVoiture = await VoitureService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                circuit: nouveauVoiture

            }
        });
    });

    /**
     * @desc    Récupérer tous les voitures
     * @route   GET /api/voitures
     * @access  Public
     */
    getAllVoiture = catchAsync(async (req, res, next) => {
        const voitures = await VoitureService.getAllVoitures();
        res.status(200).json({
            status: 'success',
            results: voitures.length,
            data: {
                voiture: voitures
            }
        });
    });

    /**
     * @desc    Récupérer une voiture par son ID
     * @route   GET /api/voitures/:id
     * @access  Private
     */
    getVoituresById = catchAsync(async (req, res, next) => {
        // req.params.id contient l'ID passé dans l'URL
        const voiture = await VoitureService.getVoitureById(req.params.voitureId);
        res.status(200).json({
            status: 'success',
            data: {
                voiture: voiture
            }
        });
    });

    /**
     * @desc    modifier un d'une voiture
     * @route   PUT /api/voitures/:voitureId
     * @access  Private
     */
    updateVoiture = catchAsync(async (req,res,next)=> {
        const {voitureId} = req.params;
        const performingUserId = req.user.id_user;

        const { immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat} = req.body;
        const updateData = { immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat };


        const result = await VoitureService.updateVoiture(voitureId,updateData,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer une voiture
     * @route   DELETE  /api/voitures/:voitureId
     * @access  Private
     */
    deleteVoiture = catchAsync(async (req,res,next)=> {
        const {voitureId} = req.params;
        const result = await VoitureService.deleteVoiture(voitureId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    associer un utilisateur a une Voiture
     * @route   put /api/voitures/:voitureId/users
     * @access  Private
     */
    addUserToVoiture = catchAsync(async (req, res, next) => {
        const { voitureId } = req.params;
        const { userId } = req.body; // On s'attend à recevoir l'ID de l'utilisateur dans le body
        const performingUserId = req.user.id_user;
        if (!userId) {
            // C'est une validation simple, on pourrait utiliser une librairie comme Joi ou Zod
            return res.status(400).json({ status: 'fail', message: 'Veuillez fournir un userId.' });
        }

        const result = await VoitureService.assignDriverToVehicle(voitureId,userId,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });
    });

    unassignDriver = catchAsync(async (req, res, next) => {
        const { voitureId } = req.params;
        const performingUserId = req.user.id_user;

        const updatedVoiture = await VoitureService.unassignDriverFromVehicle(voitureId,performingUserId);

        res.status(200).json({
            status: 'success',
            message: `Conducteur retiré de la voiture ${voitureId}.`,
            data: {
                voiture: updatedVoiture
            }
        });
    });

    /**
     * @desc    associer un utilisateur a une Voiture
     * @route   get /api/voitures/:voitureId/users
     * @access  Private
     */
    findWithDriver = catchAsync(async (req, res, next) => {
        const { voitureId } = req.params;
        const result = await VoitureService.findWithDriver(voitureId);

        res.status(200).json({
            status: 'success',
            voiture: result.voiture,
            user : result.conducteur
        });
    });

    /**
     * @desc    recupere la consomation de carburant total d'une voiture
     * @route   get /api/voitures/:voitureId/carburants
     * @access  Private
     */
    getTotalCoutByVoiture = catchAsync(async (req,res,next)=>{
        const { voitureId } = req.params;
        const { dateDebut, dateFin } = req.query;

        const result = await VoitureService.getTotalCoutByVoiture(voitureId,dateDebut, dateFin)
        res.status(200).json({
            status: 'success',
            total: result

        });

    });



    
}

module.exports = new VoitureController();
