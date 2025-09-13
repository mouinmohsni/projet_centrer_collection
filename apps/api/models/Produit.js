
class Produit {
    /**
     * @param {object} data
     * @param {number} data.id_produit
     * @param {string} data.nom
     * @param {string} data.unite
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_produit, nom, unite }) {
        this.id_produit = id_produit;
        this.nom = nom;
        this.unite = unite;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = Produit;
