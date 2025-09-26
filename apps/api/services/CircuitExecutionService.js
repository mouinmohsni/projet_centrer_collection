const CircuitExecutionRepository = require('../repositories/CircuitExecutionRepository')
const CircuitRepository = require('../repositories/CircuitRepository');
const VoitureRepository = require('../repositories/VoitureRepository');
const UserRepository = require('../repositories/UserRepository')
const DimDateRepository = require('../repositories/DimDateRepository')



const AppError = require('../util/AppError')


class CircuitExecutionService {



    /**
     * Planifie une nouvelle exécution de circuit en effectuant des validations de disponibilité et de cohérence.
     * @param {object} data - Les données de la nouvelle exécution.
     * @param {number} performingUserId - L'ID de l'utilisateur (admin) qui effectue la planification.
     * @returns {Promise<CircuitExecution>} L'objet de l'exécution de circuit nouvellement créée.
     */
    async createCircuitExecution(data, performingUserId) {

        // --- 1. VALIDATION D'ENTRÉE ET RÉSOLUTION DE L'ID_DATE ---

        const { id_circuit, id_conducteur, id_voiture, date_debut_planifiee, date_fin_planifiee } = data;

        if (!id_circuit || !id_conducteur || !id_voiture || !date_debut_planifiee || !date_fin_planifiee) {
            throw new AppError("Les informations de circuit, conducteur, véhicule et les dates de début/fin sont requises.",400);
        }

        const debut_N = new Date(date_debut_planifiee);
        const fin_N = new Date(date_fin_planifiee);

        if (debut_N >= fin_N) {
            throw new AppError("La date de début doit être antérieure à la date de fin.",409);
        }

        // Logique pour trouver le bon id_date (matin/soir)
        const dateCalendaire = debut_N.toISOString().split('T')[0]; // ex: '2025-09-18'
        const heureDebut = debut_N.toTimeString().split(' ')[0]; // ex: '09:00:00'
        const periode = (heureDebut < '12:00:00') ? 'matin' : 'soir';
        const id_date_correct = await DimDateRepository.findIdByDateAndPeriod(dateCalendaire, periode);

        if (!id_date_correct) {
            throw new AppError(`Période introuvable pour la date ${dateCalendaire} (${periode}).`,404);
        }


        // --- 2. VÉRIFICATION D'EXISTENCE ET DE RÔLE ---

        const conducteur = await UserRepository.findUserRoleById(id_conducteur);
        if (!conducteur) throw new AppError("Le conducteur spécifié n'existe pas.",404);
        if (conducteur.role !== "Conducteur") throw new AppError(`L'utilisateur ${conducteur.nom} n'est pas un conducteur.`,409);

        const voiture = await VoitureRepository.findById(id_voiture);
        if (!voiture) throw new AppError("Le véhicule spécifié n'existe pas.",404);

        const circuit = await CircuitRepository.findById(id_circuit);
        if (!circuit) throw new AppError("Le circuit spécifié n'existe pas.",404);


        // --- 3. VALIDATION DE DISPONIBILITÉ (CONDUCTEUR ET VÉHICULE) ---

        // Le conducteur est-il disponible ?
        const tourneesConducteur = await CircuitExecutionRepository.findByStatusAndDateRange({ champ: "id_conducteur" , id_conducteur, date_debut: dateCalendaire, date_fin: dateCalendaire });

        for (const tournee of tourneesConducteur) {
            const debut_E = new Date(tournee.heure_debut_planifiee);
            const fin_E = new Date(tournee.heure_fin_planifiee);
            const id_conducteur_E = tournee.id_conducteur


            if (id_conducteur === id_conducteur_E){
                if (debut_N < fin_E && fin_N > debut_E) {
                    throw new AppError(`Conflit: Le conducteur est déjà assigné à une tournée de ${debut_E.toLocaleTimeString()} à ${fin_E.toLocaleTimeString()}.`,409);
                }

            }


        }

        // Le véhicule est-il disponible ?
        const tourneesVoiture = await CircuitExecutionRepository.findByStatusAndDateRange({champ : "id_Voiture", id_voiture, date_debut: dateCalendaire, date_fin: dateCalendaire });
        for (const tournee of tourneesVoiture) {
            const debut_E = new Date(tournee.heure_debut_planifiee);
            const fin_E = new Date(tournee.heure_fin_planifiee);
            const id_voiture_E = tournee.id_Voiture;

            if(id_voiture === id_voiture_E ){
                if (debut_N < fin_E && fin_N > debut_E) {
                    throw new AppError(`Conflit: Le véhicule est déjà utilisé dans une tournée de ${debut_E.toLocaleTimeString()} à ${fin_E.toLocaleTimeString()}.`,409);
                }

            }

        }

        //(Optionnel) Vérification de l'assignation habituelle
        if (voiture.id_conducteur && voiture.id_conducteur !== id_conducteur) {
            // Ici, on pourrait retourner un avertissement au lieu de lancer une erreur
            console.warn(`Avertissement: Le véhicule ${voiture.immatriculation} est habituellement assigné à un autre conducteur.`);
        }


        // --- 4. CRÉATION DE L'ENTITÉ ---

        const dataToCreate = {
            id_circuit,
            id_voiture,
            id_conducteur,
            id_date: id_date_correct.id_date,
            statut: 'planifiee',
            km_parcouru: 0,
            date_debut_planifiee,
            date_fin_planifiee,
            created_by: performingUserId,
            updated_by: performingUserId
        };

        const newExecutionId = await CircuitExecutionRepository.create(dataToCreate);

        // Retourner l'objet complet nouvellement créé pour confirmation
        return CircuitExecutionRepository.findById(newExecutionId);
    }

    /**
     * trouver un CircuitExecution par id
     * @param {number} id_CircuitExecution
     * @returns {Promise<object>} le CircuitExecution demander
     */
    async getCircuitExecutionById(id_CircuitExecution) {
        const CircuitExecution = await CircuitExecutionRepository.getDetailById(id_CircuitExecution);
        if (!CircuitExecution) {
            throw new AppError(`Le CircuitExecution avec l'ID ${id_CircuitExecution} n'a pas été trouvé.`,404);
        }
        return CircuitExecution;
    }

    /**
     * récupérer tous les CircuitExecutions
     * @returns {Promise<CircuitExecution[]>} tableau de tous les CircuitExecutions
     */
    async getAllCircuitExecutions() {
        return CircuitExecutionRepository.getAll();
    }


    /**
     * modifier les informations d'un CircuitExecution
     * @param {number} executionId
     * @param {number} performingUserId
     * @param {object} dataToUpdate
     * @returns {Promise<{message: string}>}
     */
    async updateCircuitExecution(executionId, dataToUpdate, performingUserId) {

        // --- Étape 1 : Vérifier l'existence et le statut de la tournée ---

        const executionActuelle = await CircuitExecutionRepository.findById(executionId);
        if (!executionActuelle) {
            throw new AppError(`L'exécution de circuit avec l'ID ${executionId} n'existe pas.`,404);
        }

        // Règle métier : Un planificateur ne peut modifier qu'une tournée qui est au statut 'planifiee'.
        if (executionActuelle.statut !== 'planifiee') {
            throw new AppError(`Impossible de modifier une tournée qui n'est plus au statut 'planifiée'. Statut actuel : '${executionActuelle.statut}'.`,409);
        }

        // Règle de sécurité : Interdire le changement de statut via cette méthode.
        if (dataToUpdate.statut) {
            throw new AppError("Le changement de statut doit se faire via la méthode dédiée (démarrer/terminer la tournée).",404);
        }

        // --- Étape 2 : Préparer les données finales et valider les changements ---

        // On fusionne les données actuelles avec les modifications demandées pour avoir l'état final.
        const dataFinal = { ...executionActuelle, ...dataToUpdate };

        let id_date_final = executionActuelle.id_date;

        // A. Le conducteur a-t-il changé ? Si oui, on valide le nouveau.
        if (dataToUpdate.id_conducteur && dataToUpdate.id_conducteur !== executionActuelle.id_conducteur) {
            const nouveauConducteur = await UserRepository.findUserRoleById(dataToUpdate.id_conducteur);
            if (!nouveauConducteur) throw new AppError(`Le nouveau conducteur avec l'ID ${dataToUpdate.id_conducteur} n'existe pas.`,404);
            if (nouveauConducteur.role !== "Conducteur") throw new AppError(`L'utilisateur ${nouveauConducteur.nom} n'est pas un conducteur.`,409);
        }

        // B. Le véhicule a-t-il changé ? Si oui, on valide le nouveau.
        if (dataToUpdate.id_voiture && dataToUpdate.id_voiture !== executionActuelle.id_Voiture) {
            const nouvelleVoiture = await VoitureRepository.findById(dataToUpdate.id_voiture);
            if (!nouvelleVoiture) throw new AppError(`Le nouveau véhicule avec l'ID ${dataToUpdate.id_voiture} n'existe pas.`,404);
        }

        // C. Les horaires ont-ils changé ? Si oui, on valide les nouvelles dates et on recalcule l'id_date.
        if (dataToUpdate.date_debut_planifiee || dataToUpdate.date_fin_planifiee) {
            const debut_N = new Date(dataFinal.date_debut_planifiee);
            const fin_N = new Date(dataFinal.date_fin_planifiee);

            if (isNaN(debut_N.getTime()) || isNaN(fin_N.getTime()) || debut_N >= fin_N) {
                throw new AppError("Les dates de début/fin sont invalides ou la date de début n'est pas antérieure à la date de fin.",409);
            }

            const dateCalendaire = debut_N.toISOString().split('T')[0];
            const heureDebut = debut_N.toTimeString().split(' ')[0];
            const periode = (heureDebut < '12:00:00') ? 'matin' : 'soir';
            const id_date_calcule = await DimDateRepository.findIdByDateAndPeriod(dateCalendaire, periode);

            if (!id_date_calcule) throw new AppError(`Période introuvable pour la date ${dateCalendaire} (${periode}).`,404);
            id_date_final = id_date_calcule.id_date;
        }

        // --- Étape 3 : Validation de disponibilité (la plus importante) ---
        // On utilise les données finales (dataFinal) pour cette validation.

        const debut_final = new Date(dataFinal.date_debut_planifiee);
        const fin_final = new Date(dataFinal.date_fin_planifiee);

        // Disponibilité du conducteur
        const tourneesConducteur = await CircuitExecutionRepository.find({
            id_conducteur: dataFinal.id_conducteur,
            id_date: id_date_final,
            excludeId: executionId // On exclut la tournée actuelle de la vérification !
        });
        for (const tournee of tourneesConducteur) {
            const debut_E = new Date(tournee.heure_debut_planifiee);
            const fin_E = new Date(tournee.heure_fin_planifiee);
            if (debut_final < fin_E && fin_final > debut_E) {
                throw new AppError(`Conflit: Le conducteur est déjà assigné à une tournée de ${debut_E.toLocaleTimeString()} à ${fin_E.toLocaleTimeString()}.`,409);
            }
        }

        // Disponibilité du véhicule
        const tourneesVoiture = await CircuitExecutionRepository.find({
            id_voiture: dataFinal.id_voiture,
            id_date: id_date_final,
            excludeId: executionId // On exclut la tournée actuelle de la vérification !
        });
        for (const tournee of tourneesVoiture) {
            const debut_E = new Date(tournee.heure_debut_planifiee);
            const fin_E = new Date(tournee.heure_fin_planifiee);
            if (debut_final < fin_E && fin_final > debut_E) {
                throw new AppError(`Conflit: Le véhicule est déjà utilisé dans une tournée de ${debut_E.toLocaleTimeString()} à ${fin_E.toLocaleTimeString()}.`,409);
            }
        }

        // --- Étape 4 : Appliquer la mise à jour ---

        // On ne passe que les champs modifiés au repository, plus l'ID de l'updater et le nouvel id_date si calculé.
        const dataForRepo = { ...dataToUpdate, updated_by: performingUserId, id_date: id_date_final };

        const success = await CircuitExecutionRepository.update(executionId, dataForRepo);

        if (!success) {
            throw new AppError("La mise à jour de l'exécution de circuit a échoué (aucune modification détectée ou erreur interne).",404);
        }
        // --- Étape 5 : Renvoyer l'objet mis à jour ---

        return { message: 'le CircuitExecution est modifier avec succès.' };
        
    }

    // Dans CircuitExecutionService.js

    /**
     * Met à jour le statut d'une exécution de circuit.
     * Gère les transitions d'état autorisées (ex : planifiée → en_cours → terminée).
     * @param {number} executionId - L'ID de l'exécution à mettre à jour.
     * @param {object} data - Le nouveau statut souhaité ('en_cours', 'terminée', 'annulée').
     * @param {number} performingUserId - L'ID de l'utilisateur (chauffeur) qui effectue l'action.
     */
    async updateExecutionStatus(executionId, data, performingUserId) {
        const executionActuelle = await CircuitExecutionRepository.findById(executionId);
        if (!executionActuelle) {
            throw new AppError(`L'exécution de circuit avec l'ID ${executionId} n'existe pas.`,404);
        }

        const statutActuel = executionActuelle.statut;
        const nouveauStatut = data.statut
        const dataToUpdate = { statut: nouveauStatut, updated_by: performingUserId };

        // Logique de la machine à états
        switch (nouveauStatut) {
            case 'en_cours':
                if (statutActuel !== 'planifiee') {
                    throw new AppError(`Impossible de démarrer une tournée qui n'est pas au statut 'planifiée'. Statut actuel : ${statutActuel}.`,409);
                }
                // On enregistre l'heure de début réelle
                dataToUpdate.date_debut_reelle = new Date();
                break;

            case 'terminee':
                if (statutActuel !== 'en_cours') {
                    throw new AppError(`Impossible de terminer une tournée qui n'est pas 'en cours'. Statut actuel : ${statutActuel}.`,409);
                }
                // On enregistre l'heure de fin réelle et les kilomètres
                dataToUpdate.date_fin_reelle = new Date();
                if (data.km_parcouru === undefined) {
                    throw new AppError("Le kilométrage final est requis pour terminer la tournée.",400);
                }
                dataToUpdate.km_parcouru = data.km_parcouru;
                break;

            case 'annulee':
                if (statutActuel === 'terminee') {
                    throw new AppError("Impossible d'annuler une tournée déjà terminée.",409);
                }
                // On peut annuler une tournée planifiée ou en cours.
                break;

            default:
                throw new AppError(`Le statut '${nouveauStatut}' est invalide.`,404);
        }

        // Si toutes les règles sont respectées, on met à jour.
        const success= await CircuitExecutionRepository.update(executionId, dataToUpdate);
        if (!success) {
            // Cela peut arriver si l'ID n'existe plus (race condition) ou si aucune donnée n'a réellement changé.
            throw new AppError("La mise à jour de l'exécution de circuit a échoué.",404);
        }

        return { message: 'le CircuitExecution est modifier avec succès.' };

    }


    /**
     *  supprimer un CircuitExecution
     * @param {number}id_CircuitExecution
     * @returns {Promise<{message: string}>}
     */
    async deleteCircuitExecution (id_CircuitExecution){

        const CircuitExecution = await CircuitExecutionRepository.findById(id_CircuitExecution)
        if(!CircuitExecution){
            throw new AppError(`Le CircuitExecution avec l'ID ${id_CircuitExecution} n'existe pas.`,404);
        }

        await CircuitExecutionRepository.deleteById(id_CircuitExecution)
        return { message: 'la suppression du CircuitExecution est effectuer  avec succès.' };

    }


    /**
     * Recherche des exécutions de circuit en fonction de divers critères.
     * @param {object} searchParams
     * @param {number} searchParams.conducteurId
     * @param {number} searchParams.voitureId
     * @param {string} searchParams.statut
     * @param {string} searchParams.jour
     * @returns {Promise<CircuitExecution[]>}
     */
    async findExecutions(searchParams) {
        const filters = {};

        // On construit l'objet de filtres à partir des paramètres de recherche.
        // Exemple : searchParams pourrait être {conducteurId : 12, statut : 'planifiée'}

        if (searchParams.conducteurId) {
            filters.id_conducteur = searchParams.conducteurId;
        }
        if (searchParams.voitureId) {
            filters.id_voiture = searchParams.voitureId;
        }
        if (searchParams.statut) {
            filters.statut = searchParams.statut;
        }
        if (searchParams.jour) {
            // On doit trouver l'id_date correspondant au jour
            const date = await DimDateRepository.findByDay(searchParams.jour);
            if (!date) {
                // Si la date n'existe pas, aucune tournée ne peut exister, on retourne un tableau vide.
                return [];
            }
            filters.id_date = date.id_date;
        }


        return await CircuitExecutionRepository.find(filters);
    }

}
module.exports = new CircuitExecutionService();


