const RecolteRepository = require('../repositories/RecolteRepository')
const AppError = require('../util/AppError')




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
     * @returns {Promise<Object>} le Recolte demander
     */

    async getoneById(idRecolte) {
        const Recolte = await RecolteRepository.findByIdDetail(idRecolte);
        if (!Recolte) {
            throw new AppError(`Le Recolte avec l'ID ${idRecolte} n'a pas été trouvé.`,404);
        }
        return Recolte;
    }

    // /**
    //  * récupérer tout les Recoltes
    //  * @returns {Promise<Recolte[]>} tableau de tout les Recolte
    //  */
    // async getAll() {
    //     return RecolteRepository.getAll();
    // }



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
            throw new AppError(`Le Recolte avec l'ID ${idRecolte} n'existe pas.`,404);
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
            throw new AppError(`Le circuit avec l'ID ${idRecolte} n'existe pas.`,404);
        }

        await RecolteRepository.delete(idRecolte)
        return { message: 'la suppression du Recolte est effectuer  avec succès.' };

    }

}
module.exports = new RecolteService();