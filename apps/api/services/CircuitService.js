const userRepository = require('../repositories/UserRepository')
const CircuitRepository = require('../repositories/CircuitRepository')
const CircuitUserRepository  = require('../repositories/CircuitUserRepository')

const AppError = require('../util/AppError')
const BusinessLogicError = require('../util/BusinessLogicError')


class CircuitService {


    /**
     * creation d'un circuit
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<Circuit>} Le nouveau circuit.
     */
    async createCircuit(data,performingUserId){
        const allowedData ={
            nom : data.nom,
            description : data.description,
            created_by : performingUserId,
            updated_by : performingUserId
        }

        const id_circuit = await CircuitRepository.create(allowedData)
        return CircuitRepository.findById(id_circuit)

    }

    /**
     * trouver un circuit par id
     * @param {number} id_circuit
     * @returns {Promise<Circuit>} le circuit demander
     */

    async getCircuitById(id_circuit) {
        const circuit = await CircuitRepository.findById(id_circuit);
        if (!circuit) {
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'a pas été trouvé.`,404);
        }
        return circuit;
    }

    /**
     * récupérer tous les circuits
     * @returns {Promise<Circuit[]>} tableau de tous les circuits
     */
    async getAllCircuits() {
        return CircuitRepository.getAll();
    }

    /**
     * ajouter un utilisateur a un circuit
     * @param {number} circuitId
     * @param {number} userId
     * @param {number} performingUserId
     * @returns {Promise<{message: string}>}
     */
    async addUserToCircuit(circuitId,userId,performingUserId) {
        const allowedData ={
            id_circuit : circuitId,
            id_user    : userId ,
            created_by : performingUserId,
            updated_by : performingUserId
        }

        // 1. Vérifier que le circuit existe
        const circuit = await CircuitRepository.findById(circuitId);
        if (!circuit) {
            throw new AppError(`Le circuit avec l'ID ${allowedData.id_circuit} n'existe pas.`,404);
        }

        // 2. Vérifier que l'utilisateur existe
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError(`L'utilisateur avec l'ID ${userId} n'existe pas.`,404);
        }

        // 3. Vérifier si l'association existe déjà pour éviter les doublons
        const associationExists = await CircuitUserRepository.findByCircuitAndUser(circuitId, userId);
        if (associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId} est déjà associé au circuit ${circuitId}.`);
        }


        // 4. Si tout est bon, on crée l'association
        await CircuitUserRepository.create(allowedData);

        return { message: 'Utilisateur ajouté au circuit avec succès.' };
    }

    /**
     * modifier les informations d'un circuit
     * @param {number} id_circuit
     * @param {number} performingUserId
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */


    async updateCircuit (id_circuit, data,performingUserId){
        const circuit = await CircuitRepository.findById(id_circuit);

        if (!circuit) {
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`,404);
        }
        const allowedData ={...data, updated_by :performingUserId
        }
        await CircuitRepository.update(id_circuit, allowedData);

        return { message: 'le circuit est modifier avec succès.' };
        
    }

    /**
     * supprimer un utilisateur d'un circuit
     * @param {number} id_circuit
     * @param {number} userId
     * @returns {Promise<{message: string}>}
     */
    
    

    async removeUserFromCircuit(id_circuit, userId){
        const user = await userRepository.findById(userId)
        if(!user){
            throw new AppError(`L'utilisateur avec l'ID ${userId} n'existe pas.`,404);
        }

        const circuit = await CircuitRepository.findById(id_circuit)
        if(!circuit){
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`,404);
        }

        const associationExists = await CircuitUserRepository.findByCircuitAndUser(id_circuit, userId);
        if (!associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId}  n'est pas  associé au circuit ${id_circuit}.`);
        }

        await CircuitUserRepository.delete(associationExists.id_circuit_user)

        return { message: 'Utilisateur est supprimer  du circuit avec succès.' };

    }

    /**
     * récupérer tous les utilisateurs d'un circuit
     * @param {number} id_circuit
     * @returns {Promise<User[]>}
     */
    async getUsersOfCircuit(id_circuit) {
        // Vérifier que le circuit existe
        const circuit = await CircuitRepository.findById(id_circuit);
        if (!circuit) {
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`,404);
        }

        // Récupérer les utilisateurs
        return CircuitUserRepository.findUsersByCircuit(id_circuit);
    }

    /**
     * modifier un utilisateur d'un circuit
     * @param {number} id_circuit
     * @param {number} userId
     * @param {number} new_id
     * @param {number} performingUserId
     * @returns {Promise<{message: string}>}
     */
    async updateUserInCircuit (id_circuit,userId, new_id,performingUserId){

        const user = await userRepository.findById(new_id)
        if(!user){
            throw new AppError(`L'utilisateur avec l'ID ${new_id} n'existe pas.`,404);
        }
        const circuit = await CircuitRepository.findById(id_circuit)
        if(!circuit){
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`,404);
        }
        const associationExists = await CircuitUserRepository.findByCircuitAndUser(id_circuit, userId);
        if (!associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId}  n'est pas  associé au circuit ${id_circuit}.`);
        }

        const allowedData ={
            id_circuit : id_circuit,
            id_user  : new_id ,
            updated_by :performingUserId
        }

        await CircuitUserRepository.update(associationExists.id_circuit_user,allowedData)
        return { message: 'la modification est effectuer  avec succès.' };

    }

    /**
     *  supprimer un circuit
     * @param {number}id_circuit
     * @returns {Promise<{message: string}>}
     */
    async deleteCircuit (id_circuit){

        const circuit = await CircuitRepository.findById(id_circuit)
        if(!circuit){
            throw new AppError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`,404);
        }

        await CircuitUserRepository.deleteAllAssociationsByCircuit(id_circuit); // (Méthode à créer dans le repo)

        await CircuitRepository.delete(id_circuit)
        return { message: 'la suppression du circuit est effectuer  avec succès.' };

    }
}
module.exports = new CircuitService();


