
class CircuitExecution {
    /**
     * @param {object} data
     * @param {number} data.id_execution
     * @param {number} data.id_circuit
     * @param {number} data.id_date
     * @param {number} data.id_Voiture
     * @param {number} data.km_parcouru
     */
    constructor({ id_execution, id_circuit, id_date, id_Voiture, km_parcouru }) {
        this.id_execution = id_execution;
        this.id_circuit = id_circuit;
        this.id_date = id_date;
        this.id_Voiture = id_Voiture;
        this.km_parcouru = km_parcouru;
    }
}

module.exports = CircuitExecution;
