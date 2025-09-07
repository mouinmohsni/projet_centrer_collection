
class CircuitUser {
    /**
     * @param {object} data
     * @param {number} data.id_circuit
     * @param {number} data.id_user
     */
    constructor({ id_circuit, id_user }) {
        this.id_circuit = id_circuit;
        this.id_user = id_user;
    }
}

module.exports = CircuitUser;
