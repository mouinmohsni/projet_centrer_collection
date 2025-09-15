const FichePaieRepository = require('../repositories/FichePaieRepository')
const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')



class FichePaieService{


    /**
     * creation d'un FichePaie
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<FichePaie>} Le nouveau Fiche.
     */
    async create(dataFromController,performingUserId){


        const allowedData = {
            ...dataFromController,
            created_by: performingUserId,
            updated_by: performingUserId
        };

        const ficheId = await FichePaieRepository.create(allowedData)
        return FichePaieRepository.findDetailById(ficheId)

    }

    /**
     * trouver une FichePaie par id
     * @param {number} ficheId
     * @returns {Promise<FichePaie>} le Fiche demander
     */

    async getoneById(ficheId) {
        console.log('service : ficheId = ',ficheId)

        const fiche = await FichePaieRepository.findDetailById(ficheId);
        if (!fiche) {
            throw new NotFoundError(`Le Fiche de Paie avec l'ID ${ficheId} n'a pas été trouvé.`);
        }
        return fiche;
    }



    // /**
    //  * recuperer tout les Fiche de Paie
    //  * @returns {Promise<Produit[]>} tableau de tout les Produit
    //  */
    // async getAll() {
    //     return FichePaieRepository.getAll();
    // }



    /**
     * modifier les informations d'une fiche
     * @param {number} ficheId
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<{message: string}>}
     */
    async update (ficheId, data,performingUserId){
        const fichePaie = await FichePaieRepository.findById(ficheId);

        if (!fichePaie) {
            throw new NotFoundError(`La Fiche de Paie avec l'ID ${ficheId} n'existe pas.`);
        }

        const dataForRepo={...data, updated_by:performingUserId}

        await FichePaieRepository.update(ficheId, dataForRepo);

        return { message: 'la Fiche Paie est modifier avec succès.' };

    }

    /**
     *  supprimer un fichePaie
     * @param {number}ficheId
     * @returns {Promise<{message: string}>}
     */
    async delete (ficheId){

        const fichePaie = await FichePaieRepository.findDetailById(ficheId)
        if(!fichePaie){
            throw new NotFoundError(`La Fiche de Paie avec l'ID ${ficheId} n'existe pas.`);
        }

        await FichePaieRepository.delete(ficheId)
        return { message: 'la suppression du Fiche de Paie est effectuer  avec succès.' };

    }

}
module.exports = new FichePaieService();