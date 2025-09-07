
class Livraison {
    /**
     * @param {object} data
     * @param {number} data.id_livraison
     * @param {number} data.id_user
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     */
    constructor({ id_livraison, id_user, id_produit, id_date, quantite }) {
        this.id_livraison = id_livraison;
        this.id_user = id_user;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
    }
}

module.exports = Livraison;
