
class Circuit {
    /**
     * @param {object} data
     * @param {number} data.id_circuit
     * @param {string} data.nom
     * @param {string} data.description
     */
    constructor({ id_circuit, nom, description }) {
        this.id_circuit = id_circuit;
        this.nom = nom;
        this.description = description;
    }
}

module.exports = Circuit;
