const produitRepository = require('../repositories/ProduitRepository')
const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')
const Produit = require('../models/Produit')



class ProduitService{


    /**
     * creation d'un Produit
     * @param {object} dataFromController
     * @returns {Promise<Produit>} Le nouveau Produit.
     */
    async create(dataFromController){


        const allowedData = {
            nom    : dataFromController.nom,
            unite : dataFromController.unite,
        };

        const idProduit = await produitRepository.create(allowedData)
        return produitRepository.findById(idProduit)

    }

    /**
     * trouver un Produit par id
     * @param {number} idProduit
     * @returns {Promise<Produit>} le Produit demander
     */

    async getoneById(idProduit) {
        const Produit = await produitRepository.findById(idProduit);
        if (!Produit) {
            throw new NotFoundError(`Le Produit avec l'ID ${idProduit} n'a pas été trouvé.`);
        }
        return Produit;
    }

    /**
     * recuperer tout les Produits
     * @returns {Promise<Produit[]>} tableau de tout les Produit
     */
    async getAll() {
        return produitRepository.getAll();
    }



    /**
     * modifier les informations d'un Produit
     * @param {number} idProduit
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */
    async update (idProduit, data){
        const Produit = await produitRepository.findById(idProduit);

        if (!Produit) {
            throw new NotFoundError(`Le Produit avec l'ID ${idProduit} n'existe pas.`);
        }
        await produitRepository.update(idProduit, data);

        return { message: 'le Produit est modifier avec succès.' };

    }

    /**
     *  supprimer un Produit
     * @param {number}idProduit
     * @returns {Promise<{message: string}>}
     */
    async delete (idProduit){

        const Produit = await produitRepository.findById(idProduit)
        if(!Produit){
            throw new NotFoundError(`Le circuit avec l'ID ${idProduit} n'existe pas.`);
        }

        await produitRepository.delete(idProduit)
        return { message: 'la suppression du Produit est effectuer  avec succès.' };

    }

}
module.exports = new ProduitService();