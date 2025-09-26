const catchAsync = require('../util/catchAsync')
const RecolteService =require('../services/RecolteService')


class RecolteController{

    /**
     * @desc    Créer une nouvelle recolte
     * @route   POST /api/recoltes
     * @access  Private
     */
    createRecolte = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newRecolte = await RecolteService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                Recolte: newRecolte

            }
        });
    });

    // /**
    //  * @desc    Récupérer tous les Recoltes
    //  * @route   GET /api/Recoltes
    //  * @access  Public
    //  */
    // getAllRecoltes = catchAsync(async (req, res, next) => {
    //     const Recoltes = await RecolteService.getAll();
    //     res.status(200).json({
    //         status: 'success',
    //         results: Recoltes.length,
    //         data: {
    //             Recoltes: Recoltes
    //         }
    //     });
    // });

    /**
     * @desc    Récupérer une Recolte par son ID
     * @route   GET /api/Recoltes/:id
     * @access  Private
     */
    getRecolteById = catchAsync(async (req, res, next) => {
        const Recolte = await RecolteService.getoneById(req.params.recolteId);
        res.status(200).json({
            status: 'success',
            data: {
                Recolte: Recolte
            }
        });
    });

    /**
     * @desc    modifier un d'un Recolte
     * @route   PUT /api/Recoltes/:recolteId
     * @access  Private
     */
    updateRecolte = catchAsync(async (req,res,next)=> {
        const recolteId = req.params.recolteId
        const performingUserId = req.user.id_user;

        const result = await RecolteService.update(recolteId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un Recolte
     * @route   DELETE  /api/Recoltes/:recolteId
     * @access  Private
     */
    deleteRecolte = catchAsync(async (req,res,next)=> {
        const recolteId = req.params.recolteId;
        const result = await RecolteService.delete(recolteId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new RecolteController();
