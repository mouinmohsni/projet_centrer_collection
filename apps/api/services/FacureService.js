const AppError = require('../util/AppError')
const DimDateRepository = require("../repositories/DimDateRepository");
FactureLigneRepository = require("../repositories/FactureLigneRepository")
const db = require('../models/db');

const FactureRepository = require('../repositories/FactureRepository')
class FactureService {


    /**
     * creation d'une Facture
     * @param {object} data
     * @param {number} performingUserId
     * @returns {Promise<Facture>} Le nouveau Facture.
     */
    async createFacture(data, performingUserId) {
        // On démarre une connexion transactionnelle
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // --- Étape 1: Préparer les données de la facture principale ---

            // On ne fait PAS confiance au montant total venant du front-end. On le calcule nous-mêmes.
            let montant_total_calcule = 0;
            if (data.lignes && data.lignes.length > 0) {
                montant_total_calcule = data.lignes.reduce((total, ligne) => {
                    return total + (ligne.quantite * ligne.prix_unitaire);
                }, 0);
            }

            const date = new Date(data.date);
            const dateCalendaire = date.toISOString().split('T')[0];
            const heureDebut = date.toTimeString().split(' ')[0];
            const periode = (heureDebut < '12:00:00') ? 'matin' : 'soir';
            const id_date_calcule = await DimDateRepository.findIdByDateAndPeriod(dateCalendaire, periode);
            if (!data.nomFacture) {
                throw new AppError("Le champ 'nomFacture' est requis.", 400);
            }

            const factureData = {
                nomFacture : data.nomFacture,
                id_client: data.id_client,
                id_date: id_date_calcule,
                montant_total: montant_total_calcule, // On utilise le montant calculé et sûr
                type: data.type,
                statut: 'brouillon', // Une nouvelle facture devrait toujours commencer en 'brouillon'
                created_by: performingUserId,
                updated_by: performingUserId
            };

            // --- Étape 2: Créer la facture principale DANS la transaction ---
            // Note: Votre méthode de repository doit accepter un objet de connexion optionnel.
            const id_Facture = await FactureRepository.create(factureData, connection);

            // --- Étape 3: Créer les lignes de facture DANS la transaction ---
            if (data.lignes && data.lignes.length > 0) {
                // On utilise for...of pour avoir l'objet ligne, pas l'index.
                for (const ligne of data.lignes) {
                    const ligneData = {
                        ...ligne,
                        id_facture: id_Facture, // On ajoute l'ID de la facture parente !
                        montant: ligne.quantite * ligne.prix_unitaire, // On calcule le montant de la ligne
                        created_by: performingUserId,
                        updated_by: performingUserId
                    };
                    await FactureLigneRepository.create(ligneData, connection);
                }
            }

            // --- Étape 4: Si tout a réussi, on valide la transaction ---
            await connection.commit();

            // On retourne la facture complète nouvellement créée.
            // (findById n'a pas besoin de la transaction car les données sont déjà enregistrées).
            return FactureRepository.findById(id_Facture);

        } catch (error) {
            // --- Étape 5: Si une erreur s'est produite, on annule TOUT ---
            await connection.rollback();

            // On propage l'erreur pour que l'appelant sache que l'opération a échoué.
            throw error;

        } finally {
            // --- Étape 6: On libère la connexion à la base de données ---
            connection.release();
        }
    }


    /**
     * trouver une Facture par id avec tout ces ligne
     * @param {number} id_Facture
     * @returns {Promise<Object>} le Facture demandé
     */
    async getFactureById(id_Facture) {
        const factureDetails = await FactureRepository.findByIdDetail(id_Facture);
        if (!factureDetails) {
            // Si la facture n'existe pas, on s'arrête tout de suite.
            throw new AppError(`La facture avec l'ID ${id_Facture} n'existe pas.`,404);
        }

        const lignes = await FactureLigneRepository.findByFactureId(id_Facture);


        return {
            ...factureDetails,
            lignes: lignes
        };
    }

    /**
     * récupérer touts les Factures
     * @returns {Promise<Facture[]>} tableau de touts les Factures
     */
    async getAllFactures() {
        return FactureRepository.getAll();
    }


    /**
     * Met à jour une facture et ses lignes en une seule opération transactionnelle.
     * @param {number} id_Facture - L'ID de la facture à modifier.
     * @param {object} data - Les nouvelles données. Peut contenir des champs de la facture et/ou la liste des lignes.
     * @param {string} [data.nomFacture]
     * @param {object[]} [data.lignes] - La liste COMPLÈTE et finale des lignes. Si non fournie, les lignes ne sont pas touchées.
     * @param {number} [data.id_client] - Le nouvel ID client.
     * @param {string} [data.type] - Le nouveau type de facture.
     * @param {string} [data.date] - La nouvelle date de la facture.
     * @param {number} performingUserId - L'ID de l'utilisateur qui effectue la modification.
     */
    async updateFacture(id_Facture, data, performingUserId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // --- Étape 1: Verrouiller et valider la facture ---
            const factureActuelle = await FactureRepository.findById(id_Facture);
            if (!factureActuelle) {
                throw new AppError(`La facture avec l'ID ${id_Facture} n'existe pas.`,404);
            }

            if (factureActuelle.statut !== 'brouillon') {
                throw new AppError(`Impossible de modifier une facture qui n'est plus à l'état 'brouillon'.`,409);
            }

            // --- Étape 2: Préparer les données pour la mise à jour de la facture principale ---
            const factureDataToUpdate = { updated_by: performingUserId };
            let montantTotalFinal = factureActuelle.montant_total; // On part du montant actuel

            // A. L'utilisateur veut-il changer un champ de la facture ?
            if (data.id_client) {
                factureDataToUpdate.id_client = data.id_client;
            }
            if(data.nomFacture){
                factureDataToUpdate.nomFacture = data.nomFacture;
            }
            if (data.type) {
                factureDataToUpdate.type = data.type;
            }
            if (data.date) {
                // On recalcule l'id_date si une nouvelle date est fournie
                const nouvelleDate = new Date(data.date);
                const dateCalendaire = nouvelleDate.toISOString().split('T')[0];
                const heure = nouvelleDate.toTimeString().split(' ')[0];
                const periode = (heure < '12:00:00') ? 'matin' : 'soir';
                const id_date_calcule = await DimDateRepository.findIdByDateAndPeriod(dateCalendaire, periode);
                if (!id_date_calcule) throw new AppError(`Période introuvable pour la date ${data.date}.`,404);
                factureDataToUpdate.id_date = id_date_calcule;
            }

            // --- Étape 3: L'utilisateur veut-il synchroniser les lignes ? ---
            // On ne touche aux lignes que si le tableau 'lignes' est explicitement fourni.
            if (data.lignes) {
                // On supprime les anciennes lignes
                await FactureLigneRepository.deleteByFactureId(id_Facture, connection);

                // On recrée les nouvelles lignes et on recalcule le montant total
                let montant_recalcule = 0;
                for (const ligne of data.lignes) {
                    const montant_ligne = ligne.quantite * ligne.prix_unitaire;
                    montant_recalcule += montant_ligne;

                    const ligneData = {
                        ...ligne,
                        id_facture: id_Facture,
                        montant: montant_ligne,
                        created_by: performingUserId,
                        updated_by: performingUserId
                    };
                    await FactureLigneRepository.create(ligneData, connection);
                }
                // Le montant total final est maintenant celui que nous venons de recalculer.
                montantTotalFinal = montant_recalcule;
            }

            // On ajoute le montant total final à l'objet de mise à jour de la facture.
            factureDataToUpdate.montant_total = montantTotalFinal;

            // --- Étape 4: Mettre à jour la facture principale avec toutes les modifications ---
            await FactureRepository.update(id_Facture, factureDataToUpdate);

            // --- Étape 5: Valider la transaction ---
            await connection.commit();

            // On retourne la facture mise à jour depuis la base de données.
            return { message: 'la facture est modifier avec succès.' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    /**
     * récupérer tout les utilisateur d'un Facture
     * @param {Object} filters
     * @returns {Promise<Facture[]>}
     */
    async getFactureByFilter(filters) {

        return  FactureRepository.getByFilter(filters);
    }



    /**
     *  supprimer un Facture
     * @param {number}id_Facture
     * @returns {Promise<{message: string}>}
     */
    async deleteFacture (id_Facture){
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
        const Facture = await FactureRepository.findById(id_Facture)
        if(!Facture){

            await connection.rollback();
            return { message: 'La facture a déjà été supprimée.' };
        }

        if (Facture.statut === 'payee') {
            throw new AppError("Impossible de supprimer une facture qui a déjà été payée.");
        }


            await FactureLigneRepository.deleteByFactureId(id_Facture, connection);

        await FactureRepository.deleteById(id_Facture)
        return { message: 'la suppression du Facture est effectuer  avec succès.' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
        connection.release();
        }

    }
}
module.exports = new FactureService();


