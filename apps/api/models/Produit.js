
class Produit {
    /**
     * @param {object} data
     * @param {number} data.id_produit
     * @param {string} data.nom
     * @param {string} data.unite
     */
    constructor({ id_produit, nom, unite }) {
        this.id_produit = id_produit;
        this.nom = nom;
        this.unite = unite;
    }
}

module.exports = Produit;
