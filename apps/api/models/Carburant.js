// file: src/models/carburant.model.js
class Carburant {

    /**
     * @param {object} data
     * @param {number} data.id_carburant
     * @param {number} data.id_vehicule
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} data.cout
     */
    constructor({ id_carburant, id_vehicule, id_date, quantite, cout }) {
        this.id_carburant = id_carburant;
        this.id_vehicule = id_vehicule;
        this.id_date = id_date;
        this.quantite = quantite;
        this.cout = cout;
    }
}
module.exports = Carburant;
