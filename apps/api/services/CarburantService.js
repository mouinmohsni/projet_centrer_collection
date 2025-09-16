const userRepository = require('../repositories/UserRepository')
const CarburantRepository = require('../repositories/CarburantRepository')
const Carburant = require('../models/Carburant');

const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')


class CarburantService {


    /**
     * creation d'un Carburant
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<Carburant>} Le nouveau Carburant.
     */
    async createCarburant(data,performingUserId){
        console.log(data)
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
            throw new NotFoundError(`Le Carburant avec l'ID ${id_Carburant} n'a pas été trouvé.`);
        }
        return Carburant;
    }

    /**
     * recuperer tout les Carburants
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
            throw new NotFoundError(`Le Carburant avec l'ID ${id_Carburant} n'existe pas.`);
        }
        const allowedData ={...data, updated_by :performingUserId
        }
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
            throw new NotFoundError(`Le Carburant avec l'ID ${id_Carburant} n'existe pas.`);
        }

        await CarburantRepository.delete(id_Carburant)
        return { message: 'la suppression du Carburant est effectuer  avec succès.' };

    }
}
module.exports = new CarburantService();


