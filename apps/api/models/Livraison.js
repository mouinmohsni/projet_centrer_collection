
class Livraison {
    /**
     * @param {object} data
     * @param {number} data.id_livraison
     * @param {number} data.id_client
     * @param {number} data.id_livreur
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     */
    constructor({ id_livraison, id_client,id_livreur, id_produit, id_date, quantite }) {
        this.id_livraison = id_livraison;
        this.id_client = id_client;
        this.id_livreur = id_livreur;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
    }
}

module.exports = Livraison;
