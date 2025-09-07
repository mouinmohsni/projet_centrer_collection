
class FactureLigne {
    /**
     * @param {object} data
     * @param {number} data.id_ligne
     * @param {number} data.id_facture
     * @param {number} data.id_produit
     * @param {number} data.quantite
     * @param {number} data.prix_unitaire
     * @param {number} [data.montant] - Le montant total, peut être calculé.
     */
    constructor({ id_ligne, id_facture, id_produit, quantite, prix_unitaire, montant }) {
        this.id_ligne = id_ligne;
        this.id_facture = id_facture;
        this.id_produit = id_produit;
        this.quantite = quantite;
        this.prix_unitaire = prix_unitaire;

        // Le montant est soit fourni (depuis la BDD), soit calculé.
        this.montant = montant !== undefined ? montant : this.calculateMontant();
    }

    /**
     * Calcule le montant total de la ligne.
     * C'est une logique métier qui appartient au modèle.
     * @returns {number}
     */
    calculateMontant() {
        return (this.quantite || 0) * (this.prix_unitaire || 0);
    }
}

module.exports = FactureLigne;
