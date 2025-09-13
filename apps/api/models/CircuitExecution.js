
class CircuitExecution {
    /**
     * @param {object} data
     * @param {number} data.id_execution
     * @param {number} data.id_circuit
     * @param {number} data.id_date
     * @param {number} data.id_Voiture
     * @param {number} data.km_parcouru
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_execution, id_circuit, id_date, id_Voiture, km_parcouru ,created_by, 
        created_at, 
        updated_by, 
        updated_at }) {
        this.id_execution = id_execution;
        this.id_circuit = id_circuit;
        this.id_date = id_date;
        this.id_Voiture = id_Voiture;
        this.km_parcouru = km_parcouru;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = CircuitExecution;
