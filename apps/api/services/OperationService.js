const OperationRepository = require('../repositories/OperationRepository');
const CircuitExecutionRepository = require('../repositories/CircuitExecutionRepository'); // Pour la validation de la tournée
const AppError = require('../util/AppError')

/**
 * Service pour la gestion des opérations (recolte et livraison).
 * Remplace LivraisonService et RecolteService.
 */
class OperationService {

    /**
     * Crée une nouvelle opération (recolte ou livraison).
     * @param {object} data - Les données de l'opération.
     * @param {number} performingUserId - L'ID de l'utilisateur effectuant l'action.
     * @returns {Promise<Operation>}
     */
    async createOperation(data, performingUserId) {
        // 1. Validation des données de base
        if (!data.type || (data.type !== 'recolte' && data.type !== 'livraison')) {
            throw new AppError("Le type d'opération doit être 'recolte' ou 'livraison'.", 400);
        }
        if (!data.id_utilisateur_concerne || !data.id_utilisateur_effectuant || !data.id_produit || !data.id_date || !data.quantite) {
            throw new AppError("Des champs obligatoires sont manquants pour la création de l'opération.", 400);
        }

        // 2. Validation de la tournée (si fournie)
        if (data.id_circuit_execution) {
            const execution = await CircuitExecutionRepository.findById(data.id_circuit_execution);
            if (!execution) {
                throw new AppError(`L'exécution de circuit avec l'ID ${data.id_circuit_execution} n'existe pas.`, 404);
            }
            // Logique métier : On ne peut ajouter une opération qu'à une tournée planifiée ou en cours
            if (execution.statut === 'terminee' || execution.statut === 'annulee') {
                throw new AppError("Impossible d'ajouter une opération à une tournée terminée ou annulée.", 409);
            }
        }

        // 3. Préparation des données
        const allowedData = {
            ...data,
            created_by: performingUserId,
            updated_by: performingUserId
        };

        // 4. Création dans le Repository
        const idOperation = await OperationRepository.create(allowedData);

        // 5. Retour de l'objet créé
        return OperationRepository.findById(idOperation);
    }

    /**
     * Met à jour une opération existante.
     * @param {number} id_operation - L'ID de l'opération à mettre à jour.
     * @param {object} data - Les données à mettre à jour.
     * @param {number} performingUserId - L'ID de l'utilisateur effectuant l'action.
     * @returns {Promise<Operation>}
     */
    async updateOperation(id_operation, data, performingUserId) {
        const operationActuelle = await OperationRepository.findById(id_operation);
        if (!operationActuelle) {
            throw new AppError(`L'opération avec l'ID ${id_operation} n'existe pas.`, 404);
        }

        // Logique métier : On ne peut modifier une opération que si sa tournée n'est pas terminée
        if (operationActuelle.id_circuit_execution) {
            const execution = await CircuitExecutionRepository.findById(operationActuelle.id_circuit_execution);
            if (execution && (execution.statut === 'terminee' || execution.statut === 'annulee')) {
                throw new AppError("Impossible de modifier une opération liée à une tournée terminée ou annulée.", 409);
            }
        }

        // Préparation des données
        const dataToUpdate = {
            ...data,
            updated_by: performingUserId
        };

        // Mise à jour dans le Repository
        const success = await OperationRepository.update(id_operation, dataToUpdate);

        if (!success) {
            throw new AppError("La mise à jour de l'opération a échoué (aucune modification détectée ou erreur interne).", 500);
        }

        // Retour de l'objet mis à jour
        return OperationRepository.findById(id_operation);
    }

    /**
     * Récupère une opération détaillée par son ID.
     * @param {number} id_operation
     * @returns {Promise<object>}
     */
    async getOperationDetail(id_operation) {
        const detail = await OperationRepository.findByIdDetail(id_operation);
        if (!detail) {
            throw new AppError(`L'opération avec l'ID ${id_operation} n'existe pas.`, 404);
        }
        return detail;
    }

    /**
     * Récupère la liste des opérations selon des filtres.
     * @param {object} filters
     * @returns {Promise<Operation[]>}
     */
    async getOperations(filters) {
        // On pourrait ajouter ici une logique de permission (ex: un conducteur ne voit que ses opérations)
        return OperationRepository.find(filters);
    }

    // Ajoutez ici les méthodes getByUtilisateurConcerneDetailed, etc.

    /**
     * Récupère les opérations détaillées pour un utilisateur concerné (client/producteur).
     * @param {number} id_utilisateur_concerne - L'ID de l'utilisateur.
     * @param {string} [dateDebut] - Date de début (YYYY-MM-DD).
     * @param {string} [dateFin] - Date de fin (YYYY-MM-DD).
     * @param {number} performingUserId - L'ID de l'utilisateur connecté (pour les permissions).
     * @returns {Promise<object[]>}
     */
    async getByUtilisateurConcerneDetailed(id_utilisateur_concerne, dateDebut, dateFin, performingUserId) {
        // Logique de Permission (Exemple) :
        // Un utilisateur ne peut voir que ses propres opérations, sauf si c'est un Admin.
        // if (id_utilisateur_concerne !== performingUserId && !userService.isAdmin(performingUserId)) {
        //     throw new AppError("Accès refusé. Vous ne pouvez pas consulter les opérations d'un autre utilisateur.", 403);
        // }

        // Appel au Repository
        const operations = await OperationRepository.getByUtilisateurConcerneDetailed(
            id_utilisateur_concerne,
            dateDebut,
            dateFin
        );

        if (operations.length === 0) {
            throw new AppError("Aucune opération trouvée pour cet utilisateur dans la période spécifiée.", 404);
        }

        return operations;
    }

}

module.exports = new OperationService();
