
class Livraison {
    /**
     * @param {object} data
     * @param {number} data.id_livraison
     * @param {number} data.id_client
     * @param {number} data.id_livreur
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_livraison, id_client,id_livreur, id_produit, id_date, quantite,created_by, 
        created_at, 
        updated_by, 
        updated_at  }) {
        this.id_livraison = id_livraison;
        this.id_client = id_client;
        this.id_livreur = id_livreur;
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

module.exports = Livraison;
