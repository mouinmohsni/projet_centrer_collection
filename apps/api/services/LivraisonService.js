const LivraisonRepository = require('../repositories/LivraisonRepository')
const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')
const Livraison = require('../models/Livraison')



class LivraisonService{


    /**
     * creation d'un Livraison
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<Livraison>} Le nouveau Livraison.
     */
    async create(dataFromController,performingUserId){


        const allowedData = {
            id_client    : dataFromController.id_client,
            id_livreur    : dataFromController.id_livreur,
            id_produit : dataFromController.id_produit,
            id_date    : dataFromController.id_date,
            quantite   : dataFromController.quantite,
            created_by: performingUserId,
            updated_by: performingUserId
        };

        const idLivraison = await LivraisonRepository.create(allowedData)
        return LivraisonRepository.findById(idLivraison)

    }

    /**
     * trouver une Livraison par id
     * @param {number} idLivraison
     * @returns {Promise<Livraison>} le Livraison demander
     */

    async getoneById(idLivraison) {
        const Livraison = await LivraisonRepository.findByIdDetail(idLivraison);
        if (!Livraison) {
            throw new NotFoundError(`Le Livraison avec l'ID ${idLivraison} n'a pas été trouvé.`);
        }
        return Livraison;
    }

    // /**
    //  * recuperer tout les Livraisons
    //  * @returns {Promise<Livraison[]>} tableau de tout les Livraison
    //  */
    // async getAll() {
    //     return LivraisonRepository.getAll();
    // }



    /**
     * modifier les informations d'une Livraison
     * @param {number} idLivraison
     * @param {number} performingUserId
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */
    async update (idLivraison, data,performingUserId){
        const Livraison = await LivraisonRepository.findById(idLivraison);

        if (!Livraison) {
            throw new NotFoundError(`La Livraison avec l'ID ${idLivraison} n'existe pas.`);
        }
        const dataForRepo={...data, updated_by:performingUserId}

        await LivraisonRepository.update(idLivraison, dataForRepo);

        return { message: 'la Livraison est modifier avec succès.' };

    }

    /**
     *  supprimer un Livraison
     * @param {number}idLivraison
     * @returns {Promise<{message: string}>}
     */
    async delete (idLivraison){

        const Livraison = await LivraisonRepository.findById(idLivraison)
        if(!Livraison){
            throw new NotFoundError(`La livraison avec l'ID ${idLivraison} n'existe pas.`);
        }

        await LivraisonRepository.delete(idLivraison)
        return { message: 'la suppression du Livraison est effectuer  avec succès.' };

    }

}
module.exports = new LivraisonService();