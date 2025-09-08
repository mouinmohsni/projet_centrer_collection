const userRepository = require('../repositories/UserRepository')
const CircuitRepository = require('../repositories/CircuitRepository')
const CircuitUserRepository  = require('../repositories/CircuitUserRepository')
const Circuit = require('../models/Circuit');

const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')





class CircuitService {


    /**
     * creation d'un circuit
     * @param {object} data
     * @returns {Promise<Circuit>} Le nouveau circuit.
     */
    async createCircuit(data){

        const id_circuit = await CircuitRepository.create(data)
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
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'a pas été trouvé.`);
        }
        return circuit;
    }

    /**
     * recuperer tout les circuits
     * @returns {Promise<Circuit[]>} tableau de tout les circuits
     */
    async getAllCircuits() {
        return CircuitRepository.getAll();
    }

    /**
     * ajouter un utilisateur a un circuit
     * @param {number} id_circuit
     * @param {number} userId
     * @returns {Promise<{message: string}>}
     */
    async addUserToCircuit(id_circuit, userId) {
        // 1. Vérifier que le circuit existe
        const circuit = await CircuitRepository.findById(id_circuit);
        if (!circuit) {
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }

        // 2. Vérifier que l'utilisateur existe
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(`L'utilisateur avec l'ID ${userId} n'existe pas.`);
        }

        // 3. Vérifier si l'association existe déjà pour éviter les doublons
        const associationExists = await CircuitUserRepository.exists(id_circuit, userId);
        if (associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId} est déjà associé au circuit ${id_circuit}.`);
        }
        // 4. Si tout est bon, on crée l'association
        await CircuitUserRepository.create(id_circuit, userId);

        return { message: 'Utilisateur ajouté au circuit avec succès.' };
    }

    /**
     * ajouter un utilisateur a un circuit
     * @param {number} id_circuit
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */


    async updateCircuit (id_circuit, data){
        const circuit = await CircuitRepository.findById(id_circuit);

        if (!circuit) {
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }
        await CircuitRepository.update(id_circuit, data);

        return { message: 'le circuit est modifier avec succès.' };
        
    }

    /**
     * supprimer un utilisateur d'un circuit
     * @param {number} id_circuit
     * @param {number} userId
     * @returns {Promise<{message: string}>}
     */
    
    

    async deleteUserToCircuit(id_circuit,userId){
        const user = await userRepository.findById(userId)
        if(!user){
            throw new NotFoundError(`L'utilisateur avec l'ID ${userId} n'existe pas.`);
        }

        const circuit = await CircuitRepository.findById(id_circuit)
        if(!circuit){
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }

        const associationExists = await CircuitUserRepository.exists(id_circuit, userId);
        if (!associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId}  n'est pas  associé au circuit ${id_circuit}.`);
        }

        await CircuitUserRepository.delete(id_circuit,userId)

        return { message: 'Utilisateur est supprimer  du circuit avec succès.' };

    }

    /**
     * recuperer tout les utilisateur d'un circuit
     * @param {number} id_circuit
     * @returns {Promise<User[]>}
     */
    async getUsersOfCircuit(id_circuit) {
        // Vérifier que le circuit existe
        const circuit = await CircuitRepository.findById(id_circuit);
        if (!circuit) {
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }

        // Récupérer les utilisateurs
        return CircuitUserRepository.findUsersByCircuit(id_circuit);
    }

    /**
     * modifier un utilisateur d'un circuit
     * @param {number} id_circuit
     * @param {number} userId
     * @param {number} new_id
     * @returns {Promise<{message: string}>}
     */
    async updateUserInCircuit (id_circuit,userId, new_id){

        const user = await userRepository.findById(new_id)
        if(!user){
            throw new NotFoundError(`L'utilisateur avec l'ID ${new_id} n'existe pas.`);
        }
        const circuit = await CircuitRepository.findById(id_circuit)
        if(!circuit){
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }
        const associationExists = await CircuitUserRepository.exists(id_circuit, userId);
        if (!associationExists) {
            throw new BusinessLogicError(`L'utilisateur ${userId}  n'est pas  associé au circuit ${id_circuit}.`);
        }

        await CircuitUserRepository.replaceUserInCircuit(id_circuit,userId,new_id)
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
            throw new NotFoundError(`Le circuit avec l'ID ${id_circuit} n'existe pas.`);
        }

        await CircuitUserRepository.deleteAllAssociationsByCircuit(id_circuit); // (Méthode à créer dans le repo)

        await CircuitRepository.delete(id_circuit)
        return { message: 'la suppression du circuit est effectuer  avec succès.' };

    }
}
module.exports = new CircuitService();


