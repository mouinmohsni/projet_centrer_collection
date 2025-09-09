const RoleRepository = require('../repositories/RoleRepository')
const NotFoundError = require('../util/NotFoundError')
const BusinessLogicError = require('../util/BusinessLogicError')
const Role = require('../models/Role')



class RoleService{


    /**
     * creation d'un Role
     * @param {object} dataFromController
     * @returns {Promise<Role>} Le nouveau role.
     */
    async create(dataFromController){


        const allowedData = {
            libelle: dataFromController.libelle,
        };

        console.log("allowedData",allowedData)

        const idRole = await RoleRepository.create(allowedData)
        return RoleRepository.findById(idRole)

    }

    /**
     * trouver un role par id
     * @param {number} idRole
     * @returns {Promise<Role>} le role demander
     */

    async getoneById(idRole) {
        const role = await RoleRepository.findById(idRole);
        if (!role) {
            throw new NotFoundError(`Le role avec l'ID ${idRole} n'a pas été trouvé.`);
        }
        return role;
    }

    /**
     * recuperer tout les roles
     * @returns {Promise<Role[]>} tableau de tout les role
     */
    async getAll() {
        return RoleRepository.getAll();
    }



    /**
     * modifier les informations d'un role
     * @param {number} idRole
     * @param {object} data
     * @returns {Promise<{message: string}>}
     */
    async update (idRole, data){
        const role = await RoleRepository.findById(idRole);

        if (!role) {
            throw new NotFoundError(`Le role avec l'ID ${idRole} n'existe pas.`);
        }
        await RoleRepository.update(idRole, data);

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
            throw new NotFoundError(`Le circuit avec l'ID ${idRole} n'existe pas.`);
        }

        await RoleRepository.delete(idRole)
        return { message: 'la suppression du role est effectuer  avec succès.' };

    }

}
module.exports = new RoleService();