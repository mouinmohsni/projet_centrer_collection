const CarburantRepository = require('../repositories/CarburantRepository')

const AppError = require('../util/AppError')


class CarburantService {


    /**
     * creation d'un Carburant
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<Carburant>} Le nouveau Carburant.
     */
    async createCarburant(data,performingUserId){
        const allowedData ={
            id_Voiture : data.id_Voiture,
            id_date : data.id_date,
            quantite : data.quantite,
            cout : data.cout,
            created_by : performingUserId,
            updated_by : performingUserId
        }

        const id_Carburant = await CarburantRepository.create(allowedData)
        return CarburantRepository.findById(id_Carburant)

    }

    /**
     * trouver un Carburant par id
     * @param {number} id_Carburant
     * @returns {Promise<object>} le Carburant demander
     */

    async getCarburantById(id_Carburant) {
        const Carburant = await CarburantRepository.getDetailById(id_Carburant);
        if (!Carburant) {
            throw new AppError(`Le Carburant avec l'ID ${id_Carburant} n'a pas été trouvé.`,404);
        }
        return Carburant;
    }

    /**
     * récupérer tout les Carburants
     * @returns {Promise<Carburant[]>} tableau de touts les Carburants
     */
    async getAllCarburants() {
        return CarburantRepository.getAll();
    }



    /**
     * modifier les informations d'un Carburant
     * @param {number} id_Carburant
     * @param {number} performingUserId
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */


    async updateCarburant (id_Carburant, data,performingUserId){
        const Carburant = await CarburantRepository.findById(id_Carburant);

        if (!Carburant) {
            throw new AppError(`Le Carburant avec l'ID ${id_Carburant} n'existe pas.`,404);
        }
        const allowedData ={...data, updated_by :performingUserId}

        await CarburantRepository.update(id_Carburant, allowedData);

        return { message: 'le Carburant est modifier avec succès.' };
        
    }



    /**
     *  supprimer un Carburant
     * @param {number}id_Carburant
     * @returns {Promise<{message: string}>}
     */
    async deleteCarburant (id_Carburant){

        const Carburant = await CarburantRepository.findById(id_Carburant)
        if(!Carburant){
            throw new AppError(`Le Carburant avec l'ID ${id_Carburant} n'existe pas.`,404);
        }

        await CarburantRepository.delete(id_Carburant)
        return { message: 'la suppression du Carburant est effectuer  avec succès.' };

    }
}
module.exports = new CarburantService();


