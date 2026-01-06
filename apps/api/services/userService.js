const userRepository = require('../repositories/UserRepository');
const AppError = require('../util/AppError');

const operationRepository = require('../repositories/OperationRepository')
const livraisonRepository = require('../delete/LivraisonRepository')
const FichePaieRepository = require("../repositories/FichePaieRepository");
const CircuitUserRepository = require('../repositories/CircuitUserRepository');
const CarburantRepository = require("../repositories/CarburantRepository");
const bcrypt = require('bcrypt');
const RoleRepository = require("../repositories/RoleRepository");
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

class UserService {

    /**
     * creation d'un Role
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<Role>} Le nouveau role.
     */
    async create(dataFromController,performingUserId){

        const { nom, mot_de_passe, telephone, id_role } = dataFromController;
        if (!nom || !mot_de_passe || !telephone || !id_role) {
            throw new AppError("Le nom, le mot de passe, le téléphone et le rôle sont requis.",400);
        }
        const existingUserByTel = await userRepository.findByTel(telephone);
        if (existingUserByTel) {
            throw new AppError(`Le numéro de téléphone '${telephone}' est déjà utilisé.`,409);
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe,10);


        const allowedData = {
            nom: dataFromController.nom,
            email: dataFromController.email,
            mot_de_passe: hashedPassword, // On utilise le mot de passe hashé
            telephone: dataFromController.telephone,
            adresse: dataFromController.adresse,
            id_role: dataFromController.id_role,
            longitude: dataFromController.longitude,
            latitude: dataFromController.latitude,
            created_by: performingUserId,
            updated_by: performingUserId
        };


        const idRole = await userRepository.create(allowedData)
        return userRepository.findById(idRole)

    }

    /**
     * Authentifie un utilisateur avec son numéro de téléphone et son mot de passe.
     * @param {object} credentials - Les informations d'identification.
     * @param {number} credentials.telephone - Le numéro de téléphone de l'utilisateur.
     * @param {string} credentials.mot_de_passe - Le mot de passe en clair de l'utilisateur.
     * @returns {Promise<{token: string, user: User}>} Un objet contenant le JWT et les informations de l'utilisateur.
     */
    async login(credentials){
        const { telephone, mot_de_passe } = credentials;

        // --- Étape 1: Validation des entrées ---
        if (!telephone || !mot_de_passe) {
            throw new AppError("Le numéro de téléphone et le mot de passe sont requis.",400);
        }

        // --- Étape 2: Trouver l'utilisateur ---
        // On utilise findByTel qui retourne l'objet brut, y compris le mot de passe hashé.
        const userFromDb = await userRepository.findByTel(telephone);

        if (!userFromDb) {
            // Erreur générique pour ne pas donner d'indices à un attaquant (ne pas dire "utilisateur non trouvé").
            throw new AppError("Numéro de téléphone ou mot de passe incorrect.",409);
        }

        // --- Étape 3: Comparer les mots de passe ---
        // On utilise la version Promise de bcrypt.compare avec await.
        const isPasswordMatch = await bcrypt.compare(mot_de_passe, userFromDb.mot_de_passe);

        if (!isPasswordMatch) {
            // Même erreur générique.
            throw new AppError("Numéro de téléphone ou mot de passe incorrect.",409);
        }

        // --- Étape 4: Générer le JSON Web Token (JWT) ---
        // Le "payload" du token contient les informations que l'on veut embarquer.
        const payload = {
            id: userFromDb.id_user,
            role: userFromDb.id_role // Embarquer le rôle est très utile pour la gestion des permissions.
        };

        // On signe le token avec notre clé secrète. Il expirera dans 30 jour.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        // --- Étape 5: Renvoyer le token et les informations de l'utilisateur ---
        // On utilise mapRowToModel pour renvoyer un objet utilisateur propre (sans le hash).
        const userToReturn = userRepository.mapRowToModel(userFromDb);

        return {
            token: token,
            user: userToReturn
        };
    }

    /**
     * trouver un user par id
     * @param {number} id_user
     * @returns {Promise<object>} le Carburant demander
     */

    async getUserById(id_user) {
        const User = await userRepository.findById(id_user);
        if (!User) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }
        return User;
    }

    /**
     * modifier un utilisateur
     * @param {number} id_user
     * @param {Object} data
     * @param {number} performingUserId
     * @returns {Promise<{message: string}>}
     */
    async updateUser(id_user,data,performingUserId){

        const modifiableFields = ['nom', 'email', 'telephone', 'adresse', 'mot_de_passe', 'role','longitude','latitude'];

        const hasModifiableField = Object.keys(data).some(key => modifiableFields.includes(key));
        if (!hasModifiableField) {
            throw new AppError("Aucune donnée modifiable n'a été fournie.",400);
        }

        const userExists = await userRepository.findById(id_user);
        if (!userExists) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }

        const dataToUpdate = { updated_by: performingUserId };

        if (data.mot_de_passe) {
            const saltRounds = 10;
            dataToUpdate.mot_de_passe = await bcrypt.hash(data.mot_de_passe, saltRounds);
        }

        if (data.role) {
            const newRole = await RoleRepository.findByLibelle(data.role);
            if (!newRole) {
                throw new AppError(`Le rôle '${data.role}' n'a pas été trouvé.`,404);
            }
            dataToUpdate.id_role = newRole.id_role;
        }

        if (data.nom) dataToUpdate.nom = data.nom;
        if (data.email) dataToUpdate.email = data.email;

        if (data.telephone) {
            const existingUser = await userRepository.findByTel(data.telephone);
            if (existingUser && existingUser.id_user !== id_user) {
                throw new AppError(`Le numéro de téléphone '${data.telephone}' est déjà utilisé par un autre compte.`,400);
            }
            dataToUpdate.telephone = data.telephone;
        }

        if (data.adresse) dataToUpdate.adresse = data.adresse;
        if (data.longitude) dataToUpdate.longitude = data.longitude;
        if (data.latitude) dataToUpdate.latitude = data.latitude;

        await userRepository.update(id_user, dataToUpdate);

        return { message: "les information de l'utilisateur sont modifier  avec succès." };

    }

    /**
     * récupérer tout les users
     * @returns {Promise<User[]>} tableau de touts les users
     */
    async getAllUsers() {
        return userRepository.getAll();
    }

    /**
     * supprimer un user
     * @param {number} id_user
     * @return {Promise<{message: string}>}
     */
    async deleteUser (id_user){
        const User = await userRepository.findById(id_user);
        if (!User) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }

        await  userRepository.delete(id_user)
        return { message: "la suppression de l'utilisateur est effectuer  avec succès." };

    }

    /**
     * Récupère la liste de tous les véhicules assignés à un utilisateur.
     * @param {number} id_user - L'ID de l'utilisateur.
     * @returns {Promise<Voiture[]>}
     */
    async getVehiclesForUser(id_user) {
        // Logique métier du service : d'abord, vérifier que l'utilisateur existe !
        const user = await userRepository.findById(id_user);
        if (!user) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }

        return  userRepository.findVehiclesByUserId(id_user);
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
            throw new AppError(`Le conducteur avec l'ID ${id_conducteur} n'a pas été trouvé.`,404);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "conducteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;

        // 3. Appeler la méthode unique du repository en lui passant les paramètres.
        // Si dateDebut ou dateFin sont undefined, le repository saura quoi faire.
        return operationRepository.getByRoleAndDateRange("conducteur",id_conducteur, dateDebut, dateFin);


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
            throw new AppError(`Le conducteur avec l'ID ${id_producteur} n'a pas été trouvé.`,404);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "producteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;


        return operationRepository.getByProducteur(id_producteur, dateDebut, dateFin);
    }


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
            throw new AppError(`Le conducteur avec l'ID ${id_livreur} n'a pas été trouvé.`,404);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "conducteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;



        return livraisonRepository.getByLivreurDetailed(id_livreur, dateDebut, dateFin);
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
            throw new AppError(`Le conducteur avec l'ID ${id_client} n'a pas été trouvé.`,404);
        }
        // On pourrait aussi vérifier ici que l'utilisateur a bien le rôle "producteur".

        // 2. Extraire les filtres de l'objet.
        const { dateDebut, dateFin } = filtres;



        return livraisonRepository.getByClientDetailed(id_client, dateDebut, dateFin);
    }

    /**
     * Récupère l'le fiche de paie d'un utilisateur,
     * @param {number} id_user - L'ID du client.
     * @returns {Promise<object[]>}
     */
    async getFichePaieByUserId(id_user) {
        const user = await userRepository.findById(id_user);
        if (!user) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }


        return FichePaieRepository.getByUser(id_user);
    }

    /**
     * trouver les circuits au qu'elle appartient un utilisateur
     * @param {number} id_user
     * @returns {Promise<object[]>}
     */
    async findCircuitsByUser(id_user){
        const user = await userRepository.findById(id_user);
        if (!user) {
            throw new AppError(`L'utilisateur avec l'ID ${id_user} n'a pas été trouvé.`,404);
        }

       return await CircuitUserRepository.findCircuitsByUser(id_user) ;
    }

    /**
     * Récupère l'historique des livraisons fourni au client,
     * avec un filtre optionnel par période.
     * @param {number} id_conducteur - L'ID du conducteur.
     * @param {object} [filtres={}] - Un objet contenant les filtres optionnels.
     * @param {string} [filtres.dateDebut] - La date de début (format 'YYYY-MM-DD').
     * @param {string} [filtres.dateFin] - La date de fin (format 'YYYY-MM-DD').
     * @returns {Promise<object[]>}
     */
    async getUsersOfCarburant(id_conducteur ,filtres={}) {
        // Vérifier que le Carburant existe
        const conducteur = await userRepository.findById(id_conducteur);
        if (!conducteur) {
            throw new AppError(`Le conducteur avec l'ID ${id_conducteur} n'existe pas.`,404);
        }
        const { dateDebut, dateFin } = filtres;

        // Récupérer les utilisateurs
        return CarburantRepository.getConsumptionByDriver(id_conducteur,dateDebut,dateFin);
    }
}

module.exports = new UserService();
