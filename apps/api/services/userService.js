const userRepository = require('../repositories/UserRepository');
const NotFoundError = require('../util/NotFoundError');

class UserService {

    // ... autres méthodes du service (getUserById, etc.) ...

    /**
     * Récupère la liste de tous les véhicules assignés à un utilisateur.
     * @param {number} id_user - L'ID de l'utilisateur.
     * @returns {Promise<Voiture[]>}
     */
    async getVehiclesForUser(id_user) {
        // Logique métier du service : d'abord, vérifier que l'utilisateur existe !
        const user = await userRepository.findById(id_user);
        if (!user) {
            throw new NotFoundError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`);
        }

        // Si l'utilisateur existe, on appelle la méthode du repository pour trouver ses véhicules.
        const voitures = await userRepository.findVehiclesByUserId(id_user);

        return voitures;
    }
}

module.exports = new UserService();
