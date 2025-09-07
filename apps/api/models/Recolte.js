
class Recolte {
    /**
     * @param {object} data
     * @param {number} data.id_recolte
     * @param {number} data.id_user
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     */
    constructor({ id_recolte, id_user, id_produit, id_date, quantite }) {
        this.id_recolte = id_recolte;
        this.id_user = id_user;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
    }
}

module.exports = Recolte;
