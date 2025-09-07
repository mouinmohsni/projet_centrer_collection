class Role{
    /**
     * @param {object} data
     * @param {number} data.id_role
     * @param {string} data.libelle
     */
    constructor({id_role,libelle}) {
        this.id_role = id_role;
        this.libelle = libelle;
    }

}
module.exports =  Role ;