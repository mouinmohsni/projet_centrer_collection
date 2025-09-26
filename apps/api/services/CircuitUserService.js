const CircuitUserRepository = require('../repositories/CircuitUserRepository')
const AppError = require('../util/AppError')



class CircuitUserService{


    /**
     * trouver une CircuitUser par id
     * @param {number} cuID
     * @returns {Promise<object>}
     */

    async getoneById(cuID) {

        const circuitUser = await CircuitUserRepository.findDetailsById(cuID);
        if (!circuitUser) {
            throw new AppError(`l'association circuitUser avec l'id ${cuID} n'a pas été trouvé.`,404);
        }
        return circuitUser;
    }

    /**
     *  supprimer un CircuitUser
     * @param {number}cuID
     * @returns {Promise<{message: string}>}
     */
    async delete (cuID){

        const CircuitUser = await CircuitUserRepository.findById(cuID)
        if(!CircuitUser){
            throw new AppError(`La Fiche de Paie avec l'ID ${cuID}  n'existe pas.`,404);
        }

        await CircuitUserRepository.delete(cuID)
        return { message: 'la suppression du Fiche de Paie est effectuer  avec succès.' };

    }


}
module.exports = new CircuitUserService();