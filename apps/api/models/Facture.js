
class Facture {
    /**
     * @param {object} data
     * @param {number} data.id_facture
     * @param {number} data.id_client
     * @param {number} data.id_date
     * @param {number} data.montant_total
     * @param {string} data.type
     * @param {string} data.statut
     */
    constructor({ id_facture, id_client, id_date, montant_total, type, statut }) {
        this.id_facture = id_facture;
        this.id_client = id_client;
        this.id_date = id_date;
        this.montant_total = montant_total;
        this.type = type;
        this.statut = statut;
    }
}

module.exports = Facture;
