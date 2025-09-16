const CarburantService = require('../services/CarburantService')
const catchAsync = require('../util/catchAsync')


class CarburantController{


    /**
     * @desc    Créer un nouveau Carburant
     * @route   POST /api/Carburants
     * @access   Public
     */
    createCarburant = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;

        const nouveauCarburant = await CarburantService.createCarburant(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                Carburant: nouveauCarburant

            }
        });
    });

    /**
     * @desc    Récupérer tous les Carburants
     * @route   GET /api/Carburants
     * @access  Public
     */
    getAllCarburants = catchAsync(async (req, res, next) => {
        const Carburants = await CarburantService.getAllCarburants();
        res.status(200).json({
            status: 'success',
            results: Carburants.length,
            data: {
                Carburants: Carburants
            }
        });
    });

    /**
     * @desc    Récupérer un Carburant par son ID
     * @route   GET /api/Carburants/:id
     * @access  Private
     */
    getCarburantById = catchAsync(async (req, res, next) => {
        // req.params.id contient l'ID passé dans l'URL
        const Carburant = await CarburantService.getCarburantById(req.params.carburantId);
        res.status(200).json({
            status: 'success',
            data: {
                Carburant: Carburant
            }
        });
    });



    /**
     * @desc    modifier un d'un Carburant
     * @route   PUT /api/Carburants/:CarburantId
     * @access  Private
     */
    updateCarburant = catchAsync(async (req,res,next)=> {
        const CarburantId = req.params.carburantId;
        const performingUserId = req.user.id_user;
        const result = await CarburantService.updateCarburant(CarburantId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un Carburant
     * @route   DELETE  /api/Carburants/:carburantId
     * @access  Private
     */
    deleteCarburant = catchAsync(async (req,res,next)=> {
        const CarburantId= req.params.carburantId;
        const result = await CarburantService.deleteCarburant(CarburantId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });




    }
module.exports = new CarburantController()