const catchAsync = require('../util/catchAsync')
const LivraisonService =require('./LivraisonService')


class LivraisonController{

    /**
     * @desc    Créer une nouvelle Livraison
     * @route   POST /api/livraisons
     * @access  Private
     */
    createLivraison = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newLivraison = await LivraisonService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                Livraison: newLivraison

            }
        });
    });

    // /**
    //  * @desc    Récupérer tous les Livraisons
    //  * @route   GET /api/Livraisons
    //  * @access  Public
    //  */
    // getAllLivraisons = catchAsync(async (req, res, next) => {
    //     const Livraisons = await LivraisonService.getAll();
    //     res.status(200).json({
    //         status: 'success',
    //         results: Livraisons.length,
    //         data: {
    //             Livraisons: Livraisons
    //         }
    //     });
    // });

    /**
     * @desc    Récupérer une Livraison par son ID
     * @route   GET /api/livraisons/:livraisonId
     * @access  Private
     */
    getLivraisonById = catchAsync(async (req, res, next) => {
        const livraison = await LivraisonService.getoneById(req.params.livraisonId);
        res.status(200).json({
            status: 'success',
            data: {
                livraison: livraison
            }
        });
    });

    /**
     * @desc    modifier d'une Livraison
     * @route   PUT /api/livraisons/:livraisonId
     * @access  Private
     */
    updateLivraison = catchAsync(async (req,res,next)=> {
        const livraisonId = req.params.livraisonId;
        const performingUserId = req.user.id_user;
        const result = await LivraisonService.update(livraisonId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer d'une Livraison
     * @route   DELETE  /api/livraisons/:livraisonId
     * @access  Private
     */
    deleteLivraison = catchAsync(async (req,res,next)=> {
        const livraisonId = req.params.livraisonId;
        const result = await LivraisonService.delete(livraisonId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new LivraisonController();
