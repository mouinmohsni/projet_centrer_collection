const RoleRepository = require('../repositories/RoleRepository')
const AppError = require('../util/AppError')




class RoleService{


    /**
     * creation d'un Role
     * @param {object} dataFromController
     * @param {number} performingUserId
     * @returns {Promise<Role>} Le nouveau role.
     */
    async create(dataFromController,performingUserId){


        const allowedData = {
            libelle: dataFromController.libelle,
            created_by: performingUserId,
            updated_by: performingUserId
        };


        const idRole = await RoleRepository.create(allowedData)
        return RoleRepository.findById(idRole)

    }

    // /**
    //  * trouver un role par id
    //  * @param {String} libelle
    //  * @returns {Promise<Role>} le role demander
    //  */
    //
    // async getByLibelle (libelle){
    //     const role = await RoleRepository.findByLibelle(libelle);
    //     if (!role) {
    //         throw new AppError(`Le role avec l'ID ${libelle} n'a pas été trouvé.`,404);
    //     }
    //     return role;
    // }

    /**
     * trouver un role par id
     * @param {number} idRole
     * @returns {Promise<Role>} le role demander
     */
    async getoneById(idRole) {
        const role = await RoleRepository.findById(idRole);
        if (!role) {
            throw new AppError(`Le role avec l'ID ${idRole} n'a pas été trouvé.`,404);
        }
        return role;
    }

    /**
     * récupérer tout les roles
     * @returns {Promise<Role[]>} tableau de tout les role
     */
    async getAll() {
        return RoleRepository.getAll();
    }



    /**
     * modifier les informations d'un role
     * @param {number} idRole
     * @param {number} performingUserId
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */
    async update (idRole, data,performingUserId){
        const role = await RoleRepository.findById(idRole);

        if (!role) {
            throw new AppError(`Le role avec l'ID ${idRole} n'existe pas.`,404);
        }
        const dataForRepo={...data, updated_by:performingUserId}
        await RoleRepository.update(idRole, dataForRepo);

        return { message: 'le role est modifier avec succès.' };

    }

    /**
     *  supprimer un role
     * @param {number}idRole
     * @returns {Promise<{message: string}>}
     */
    async delete (idRole){

        const role = await RoleRepository.findById(idRole)
        if(!role){
            throw new AppError(`Le circuit avec l'ID ${idRole} n'existe pas.`,404);
        }

        await RoleRepository.delete(idRole)
        return { message: 'la suppression du role est effectuer  avec succès.' };

    }

}
module.exports = new RoleService();