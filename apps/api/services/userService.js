const userRepository = require('../repositories/UserRepository');
const NotFoundError = require('../util/NotFoundError');
const recolteRepository = require('../repositories/RecolteRepository')
const livraisonRepository = require('../repositories/LivraisonRepository')
const FichePaieRepository = require("../repositories/FichePaieRepository");

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


    /**
     * Récupère l'historique des récoltes collectées par un conducteur,
     * avec un filtre optionnel par période.
     * @param {number} id_conducteur - L'ID du conducteur.
     * @param {object} [filtres={}] - Un objet contenant les filtres optionnels.
     * @param {string} [filtres.dateDebut] - La date de début (format 'YYYY-MM-DD').
     * @param {string} [filtres.dateFin] - La date de fin (format 'YYYY-MM-DD').
     * @returns {Promise<Recolte[]>}
     */
    async getRecoltesByConducteur(id_conducteur, filtres = {}) {
        // 1. Logique métier du service : valider l'existence du conducteur.
        const user = await userRepository.findById(id_conducteur);
        if (!user) {
            throw new NotFoundError(`Le conducteur avec l'ID ${id_conducteur} n'a pas été trouvé.`);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "conducteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;

        // 3. Appeler la méthode unique du repository en lui passant les paramètres.
        // Si dateDebut ou dateFin sont undefined, le repository saura quoi faire.
        const recoltes = await recolteRepository.getByConducteur(id_conducteur, dateDebut, dateFin);

        return recoltes;
    }


    /**
     * Récupère l'historique des récoltes collectées par un producteur,
     * avec un filtre optionnel par période.
     * @param {number} id_producteur - L'ID du conducteur.
     * @param {object} [filtres={}] - Un objet contenant les filtres optionnels.
     * @param {string} [filtres.dateDebut] - La date de début (format 'YYYY-MM-DD').
     * @param {string} [filtres.dateFin] - La date de fin (format 'YYYY-MM-DD').
     * @returns {Promise<Recolte[]>}
     */
    async getRecoltesByProducteur(id_producteur, filtres = {}) {
        // 1. Logique métier du service : valider l'existence du producteur.
        const user = await userRepository.findById(id_producteur);
        if (!user) {
            throw new NotFoundError(`Le conducteur avec l'ID ${id_producteur} n'a pas été trouvé.`);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "producteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;

        // 3. Appeler la méthode unique du repository en lui passant les paramètres.
        // Si dateDebut ou dateFin sont undefined, le repository saura quoi faire.
        const recoltes = await recolteRepository.getByProducteur(id_producteur, dateDebut, dateFin);

        return recoltes;
    }

//***************************************

    /**
     * Récupère l'historique des livraisons fourni par un conducteur,
     * avec un filtre optionnel par période.
     * @param {number} id_livreur - L'ID du conducteur.
     * @param {object} [filtres={}] - Un objet contenant les filtres optionnels.
     * @param {string} [filtres.dateDebut] - La date de début (format 'YYYY-MM-DD').
     * @param {string} [filtres.dateFin] - La date de fin (format 'YYYY-MM-DD').
     * @returns {Promise<object[]>}
     */
    async getLivraisonByConducteur(id_livreur, filtres = {}) {
        // 1. Logique métier du service : valider l'existence du conducteur.
        const user = await userRepository.findById(id_livreur);
        if (!user) {
            throw new NotFoundError(`Le conducteur avec l'ID ${id_livreur} n'a pas été trouvé.`);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "conducteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;

        // 3. Appeler la méthode unique du repository en lui passant les paramètres.
        // Si dateDebut ou dateFin sont undefined, le repository saura quoi faire.
        const livraison = await livraisonRepository.getByLivreurDetailed(id_livreur, dateDebut, dateFin);

        return livraison;
    }


    /**
     * Récupère l'historique des livraisons fourni au client,
     * avec un filtre optionnel par période.
     * @param {number} id_client - L'ID du conducteur.
     * @param {object} [filtres={}] - Un objet contenant les filtres optionnels.
     * @param {string} [filtres.dateDebut] - La date de début (format 'YYYY-MM-DD').
     * @param {string} [filtres.dateFin] - La date de fin (format 'YYYY-MM-DD').
     * @returns {Promise<object[]>}
     */
    async getLivraisonsByClient(id_client, filtres = {}) {
        // 1. Logique métier du service : valider l'existence du producteur.
        const user = await userRepository.findById(id_client);
        if (!user) {
            throw new NotFoundError(`Le conducteur avec l'ID ${id_client} n'a pas été trouvé.`);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "producteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;

        // 3. Appeler la méthode unique du repository en lui passant les paramètres.
        // Si dateDebut ou dateFin sont undefined, le repository saura quoi faire.
        const livraison = await livraisonRepository.getByClientDetailed(id_client, dateDebut, dateFin);

        return livraison;
    }

    async getFichePaieByUserId(userId) {
        const fiche = await FichePaieRepository.getByUser(userId);
        if (!fiche) {
            throw new NotFoundError(`Le Fiche de Paie avec l'ID ${userId} n'a pas été trouvé.`);
        }
        return fiche;
    }
}

module.exports = new UserService();
