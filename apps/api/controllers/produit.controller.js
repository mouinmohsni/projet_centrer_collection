const catchAsync = require('../util/catchAsync')
const ProduitService =require('../services/ProduitService')
const Produit = require('../models/Produit')


class ProduitController{

    /**
     * @desc    Créer une nouvelle Produit
     * @route   POST /api/produits
     * @access  Private (à définir plus tard)
     */
    createProduit = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newProduit = await ProduitService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                produit: newProduit

            }
        });
    });

    /**
     * @desc    Récupérer tous les Produits
     * @route   GET /api/produits
     * @access  Public
     */
    getAllProduits = catchAsync(async (req, res, next) => {
        const produits = await ProduitService.getAll();
        res.status(200).json({
            status: 'success',
            results: produits.length,
            data: {
                produits: produits
            }
        });
    });

    /**
     * @desc    Récupérer un Produit par son ID
     * @route   GET /api/produits/:produitId
     * @access  Private
     */
    getProduitById = catchAsync(async (req, res, next) => {
        const produit = await ProduitService.getoneById(req.params.produitId);
        res.status(200).json({
            status: 'success',
            data: {
                produit: produit
            }
        });
    });

    /**
     * @desc    modifier un d'un Produit
     * @route   PUT /api/produits/:produitId
     * @access  Private
     */
    updateProduit = catchAsync(async (req,res,next)=> {
        const produitId = req.params.produitId;
        const performingUserId = req.user.id_user;
        const result = await ProduitService.update(produitId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un Produit
     * @route   DELETE  /api/produits/:produitId
     * @access  Private
     */
    deleteProduit = catchAsync(async (req,res,next)=> {
        const produitId = req.params.produitId;
        const result = await ProduitService.delete(produitId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new ProduitController();
