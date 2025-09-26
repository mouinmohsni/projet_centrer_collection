const catchAsync = require('../util/catchAsync')
const FichePaieService =require('../services/FichePaieService')


class FichePaieController{

    /**
     * @desc    Créer une nouvelle FichePaie
     * @route   POST /api/FichePaies
     * @access  private
     */
    createFichePaie = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newFichePaie = await FichePaieService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                FichePaie: newFichePaie

            }
        });
    });

    // /**
    //  * @desc    Récupérer tous les FichePaies
    //  * @route   GET /api/FichePaies
    //  * @access  Public
    //  */
    // getAllFichePaies = catchAsync(async (req, res, next) => {
    //     const FichePaies = await FichePaieService.getAll();
    //     res.status(200).json({
    //         status: 'success',
    //         results: FichePaies.length,
    //         data: {
    //             FichePaies: FichePaies
    //         }
    //     });
    // });

    /**
     * @desc    Récupérer une FichePaie par son ID
     * @route   GET /api/FichePaies/:FichePaieId
     * @access  Private
     */
    getFichePaieById = catchAsync(async (req, res, next) => {

        const FichePaie = await FichePaieService.getoneById(req.params.fichePaieId);
        res.status(200).json({
            status: 'success',
            data: {
                FichePaie: FichePaie
            }
        });
    });

    /**
     * @desc    modifier d'une FichePaie
     * @route   PUT /api/FichePaies/:FichePaieId
     * @access  Private
     */
    updateFichePaie = catchAsync(async (req,res,next)=> {
        const FichePaieId = req.params.fichePaieId;
        console.log("controler fichePaieId ",  FichePaieId)
        const performingUserId = req.user.id_user;
        const result = await FichePaieService.update(FichePaieId,req.body , performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer d'une FichePaie
     * @route   DELETE  /api/FichePaies/:FichePaieId
     * @access  Private
     */
    deleteFichePaie = catchAsync(async (req,res,next)=> {
        const FichePaieId = req.params.fichePaieId;
        const result = await FichePaieService.delete(FichePaieId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new FichePaieController();
