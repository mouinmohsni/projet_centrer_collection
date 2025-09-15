
class CircuitUser {
    /**
     * @param {object} data
     * @param {number} data.id_circuit_user
     * @param {number} data.id_circuit
     * @param {number} data.id_user
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_circuit_user,id_circuit, id_user ,created_by,
        created_at, 
        updated_by, 
        updated_at }) {

        this.id_circuit_user = id_circuit_user;
        this.id_circuit = id_circuit;
        this.id_user = id_user;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;

    }
}

module.exports = CircuitUser;
