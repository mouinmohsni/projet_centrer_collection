class Role{
    /**
     * @param {object} data
     * @param {number} data.id_role
     * @param {string} data.libelle
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({id_role,libelle,created_by, created_at, updated_by, updated_at }) {
        this.id_role = id_role;
        this.libelle = libelle;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }

}
module.exports =  Role ;