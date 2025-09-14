const RecolteRepository = require('../repositories/RecolteRepository')
const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')
const Recolte = require('../models/Recolte')



class RecolteService{


    /**
     * creation d'un Recolte
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<Recolte>} Le nouveau Recolte.
     */
    async create(dataFromController,performingUserId){


        const allowedData = {
            id_producteur : dataFromController.id_producteur,
            id_conducteur : dataFromController.id_conducteur,
            id_produit    : dataFromController.id_produit,
            id_date       : dataFromController.id_date,
            quantite      : dataFromController.quantite,
            created_by: performingUserId,
            updated_by: performingUserId
        };

        const idRecolte = await RecolteRepository.create(allowedData)
        return RecolteRepository.findById(idRecolte)

    }

    /**
     * trouver un Recolte par id
     * @param {number} idRecolte
     * @returns {Promise<Recolte>} le Recolte demander
     */

    async getoneById(idRecolte) {
        const Recolte = await RecolteRepository.findByIdDetail(idRecolte);
        if (!Recolte) {
            throw new NotFoundError(`Le Recolte avec l'ID ${idRecolte} n'a pas été trouvé.`);
        }
        return Recolte;
    }

    /**
     * recuperer tout les Recoltes
     * @returns {Promise<Recolte[]>} tableau de tout les Recolte
     */
    async getAll() {
        return RecolteRepository.getAll();
    }



    /**
     * modifier les informations d'un Recolte
     * @param {number} idRecolte
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<{message: string}>}
     */
    async update (idRecolte, data,performingUserId){
        const Recolte = await RecolteRepository.findById(idRecolte);

        if (!Recolte) {
            throw new NotFoundError(`Le Recolte avec l'ID ${idRecolte} n'existe pas.`);
        }
        const dataForRepo={...data, updated_by:performingUserId}

        await RecolteRepository.update(idRecolte, dataForRepo);

        return { message: 'le Recolte est modifier avec succès.' };

    }

    /**
     *  supprimer un Recolte
     * @param {number}idRecolte
     * @returns {Promise<{message: string}>}
     */
    async delete (idRecolte){

        const Recolte = await RecolteRepository.findById(idRecolte)
        if(!Recolte){
            throw new NotFoundError(`Le circuit avec l'ID ${idRecolte} n'existe pas.`);
        }

        await RecolteRepository.delete(idRecolte)
        return { message: 'la suppression du Recolte est effectuer  avec succès.' };

    }

}
module.exports = new RecolteService();