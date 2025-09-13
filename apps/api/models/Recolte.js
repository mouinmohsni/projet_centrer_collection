
class Recolte {
    /**
     * @param {object} data
     * @param {number} data.id_recolte
     * @param {number} data.id_producteur
     * @param {number} data.id_conducteur
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_recolte, id_producteur,id_conducteur, id_produit, id_date, quantite,created_by, 
        created_at, 
        updated_by, 
        updated_at  }) {
        this.id_recolte = id_recolte;
        this.id_producteur = id_producteur;
        this.id_conducteur = id_conducteur;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = Recolte;
