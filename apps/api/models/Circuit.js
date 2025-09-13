
class Circuit {
    /**
     * @param {object} data
     * @param {number} data.id_circuit
     * @param {string} data.nom
     * @param {string} data.description
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_circuit, nom, description ,created_by, 
        created_at, 
        updated_by, 
        updated_at }) {
        this.id_circuit = id_circuit;
        this.nom = nom;
        this.description = description;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = Circuit;
