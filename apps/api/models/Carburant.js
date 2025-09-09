// file: src/models/carburant.model.js
class Carburant {

    /**
     * @param {object} data
     * @param {number} data.id_carburant
     * @param {number} data.id_Voiture
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} data.cout
     */
    constructor({ id_carburant, id_Voiture, id_date, quantite, cout }) {
        this.id_carburant = id_carburant;
        this.id_Voiture = id_Voiture;
        this.id_date = id_date;
        this.quantite = quantite;
        this.cout = cout;
    }
}
module.exports = Carburant;
