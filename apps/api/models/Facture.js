
class Facture {
    /**
     * @param {object} data
     * @param {number} data.id_facture
     * @param {string} data.nomFacture
     * @param {number} data.id_client
     * @param {number} data.id_date
     * @param {number} data.montant_total
     * @param {string} data.type
     * @param {string} data.statut
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_facture,nomFacture, id_client, id_date, montant_total, type, statut ,created_by,
        created_at, 
        updated_by, 
        updated_at }) {
        this.id_facture = id_facture;
        this.nomFacture = nomFacture
        this.id_client = id_client;
        this.id_date = id_date;
        this.montant_total = montant_total;
        this.type = type;
        this.statut = statut;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = Facture;
