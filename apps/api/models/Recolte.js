
class Recolte {
    /**
     * @param {object} data
     * @param {number} data.id_recolte
     * @param {number} data.id_producteur
     * @param {number} data.id_conducteur
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     */
    constructor({ id_recolte, id_producteur,id_conducteur, id_produit, id_date, quantite }) {
        this.id_recolte = id_recolte;
        this.id_producteur = id_producteur;
        this.id_conducteur = id_conducteur;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
    }
}

module.exports = Recolte;
