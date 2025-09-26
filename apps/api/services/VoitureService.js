const VoitureRepository = require('../repositories/VoitureRepository')
const AppError = require('../util/AppError')
const userRepository = require('../repositories/UserRepository')
const CarburantRepository = require("../repositories/CarburantRepository");



class VoitureService{


    /**
     * creation d'un circuit
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<Voiture>} Le nouveau circuit.
     */
    async create(dataFromController,performingUserId){
        const allowedData = {
            immatriculation: dataFromController.immatriculation,
            capacite: dataFromController.capacite,
            refrigerateur: dataFromController.refrigerateur,
            // On peut définir des valeurs par défaut si elles ne sont pas fournies
            km_total: dataFromController.km_total || 0,
            km_prochain_vidange: dataFromController.km_prochain_vidange || null,
            etat: dataFromController.etat || 'en_service',
            id_conducteur: dataFromController.id_conducteur || null,
            created_by: performingUserId,
            updated_by: performingUserId

        };

        const idVoiture = await VoitureRepository.create(allowedData)
        return VoitureRepository.findById(idVoiture)

    }

    /**
     * trouver une Voiture par id
     * @param {number} idVoiture
     * @returns {Promise<Voiture>} le circuit demander
     */
    async getVoitureById(idVoiture) {
        const Voiture = await VoitureRepository.findById(idVoiture);
        if (!Voiture) {
            throw new AppError(`Le Voiture avec l'ID ${idVoiture} n'a pas été trouvé.`,404);
        }
        return Voiture;
    }

    /**
     * récupérer toutes les Voitures
     * @returns {Promise<Voiture[]>} tableau de toutes les Voitures
     */
    async getAllVoitures() {
        return VoitureRepository.getAll();
    }

    /**
     * modifier les informations d'une Voiture
     * @param {number} idVoiture
     * @param {number} performingUserId
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */
    async updateVoiture (idVoiture, data ,performingUserId){
        const Voiture = await VoitureRepository.findById(idVoiture);

        if (!Voiture) {
            throw new AppError(`Le Voiture avec l'ID ${idVoiture} n'existe pas.`,404);
        }
        const dataForRepo={...data, updated_by:performingUserId}
        await VoitureRepository.update(idVoiture, dataForRepo);

        return { message: 'le Voiture est modifier avec succès.' };

    }

    /**
     *  supprimer un Voiture
     * @param {number}idVoiture
     * @returns {Promise<{message: string}>}
     */
    async deleteVoiture (idVoiture){

        const Voiture = await VoitureRepository.findById(idVoiture)
        if(!Voiture){
            throw new AppError(`Le circuit avec l'ID ${idVoiture} n'existe pas.`,404);
        }

        await VoitureRepository.delete(idVoiture)
        return { message: 'la suppression du Voiture est effectuer  avec succès.' };

    }

    /**
     * Récupère un véhicule et les informations de son conducteur associé.
     * @param {number} idVoiture - L'ID du véhicule.
     * @returns {Promise<{Voiture: Voiture, conducteur: User|null}|null>} Un objet contenant le véhicule et son conducteur, ou null si le véhicule n'est pas trouvé.
     */
    async findWithDriver (idVoiture){

        const result  = await VoitureRepository.findWithDriver(idVoiture);

        if(!result ){
            throw new AppError(`La voiture avec l'ID ${idVoiture} n'existe pas.`,404);
        }
        return  result
    }

    /**
     * Assigne un conducteur à un véhicule.
     * @param {number} id_Voiture - L'ID du véhicule.
     * @param {number} performingUserId
     * @param {number} id_conducteur - L'ID du conducteur à assigner.
     * @returns {Promise<Voiture>} Le véhicule mis à jour.
     */
    async assignDriverToVehicle(id_Voiture, id_conducteur,performingUserId) {

        const Voiture = await VoitureRepository.findById(id_Voiture);
        if (!Voiture) {
            throw new AppError(`Le véhicule avec l'ID ${id_Voiture} n'a pas été trouvé.`,404);
        }

        const conducteur = await userRepository.findById(id_conducteur);
        if (!conducteur) {
            throw new AppError(`Le conducteur avec l'ID ${id_conducteur} n'a pas été trouvé.`,404);
        }

        await VoitureRepository.assignUnassignDriverToVehicle(id_Voiture, { id_conducteur: id_conducteur , performingUserId:performingUserId });
        return VoitureRepository.findById(id_Voiture);
    }

    /**
     * Désassigne le conducteur actuel d'un véhicule (met id_conducteur à NULL).
     * @param {number} id_voiture - L'ID de la voiture.
     * @param {number} performingUserId
     * @returns {Promise<Voiture>} La voiture mise à jour.
     */

    async unassignDriverFromVehicle(id_voiture,performingUserId) {
        // 1. Vérifier que la voiture existe
        const voiture = await VoitureRepository.findById(id_voiture);
        if (!voiture) {
            throw new AppError(`La voiture avec l'ID ${id_voiture} n'a pas été trouvée.`,404);
        }

        // 2. Appeler le repository pour mettre le champ à NULL
        await VoitureRepository.assignUnassignDriverToVehicle(id_voiture, { id_conducteur: null ,performingUserId:performingUserId });

        // 3. Retourner la voiture mise à jour
        return VoitureRepository.findById(id_voiture);
    }

    /**
     * Calcule le coût total du carburant pour une voiture, avec un filtre optionnel par période.
     * @param {number} id_voiture - L'ID de la voiture.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<object>} Le coût total du carburant.
     */
    async getTotalCoutByVoiture(id_voiture, dateDebut, dateFin) {

        const voiture = await VoitureRepository.findById(id_voiture)
        if (!voiture) {
            throw new AppError(`La voiture avec l'ID ${id_voiture} n'a pas été trouvée.`,404);
        }
       return  CarburantRepository.getTotalCoutByVoiture(id_voiture,dateDebut,dateFin);

    }

}
module.exports = new VoitureService();