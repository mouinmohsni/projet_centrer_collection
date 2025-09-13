// file: src/models/carburant.model.js
class Carburant {

    /**
     * @param {object} data
     * @param {number} data.id_carburant
     * @param {number} data.id_Voiture
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} data.cout
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_carburant, id_Voiture, id_date, quantite, cout ,created_by, 
        created_at, 
        updated_by, 
        updated_at }) {
        this.id_carburant = id_carburant;
        this.id_Voiture = id_Voiture;
        this.id_date = id_date;
        this.quantite = quantite;
        this.cout = cout;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}
module.exports = Carburant;
