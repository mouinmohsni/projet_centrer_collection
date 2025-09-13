
class FactureLigne {
    /**
     * @param {object} data
     * @param {number} data.id_ligne
     * @param {number} data.id_facture
     * @param {number} data.id_produit
     * @param {number} data.quantite
     * @param {number} data.prix_unitaire
     * @param {number} [data.montant]
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_ligne, id_facture, id_produit, quantite, prix_unitaire, montant,created_by, 
        created_at, 
        updated_by, 
        updated_at  }) {
        this.id_ligne = id_ligne;
        this.id_facture = id_facture;
        this.id_produit = id_produit;
        this.quantite = quantite;
        this.prix_unitaire = prix_unitaire;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;

    }


}

module.exports = FactureLigne;
