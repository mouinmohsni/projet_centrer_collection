const db = require('../models/db');


const CircuitUser = require('../models/CircuitUser');
const User = require('../models/User'); // Nécessaire pour mapper les résultats
const Circuit = require('../models/Circuit'); // Nécessaire pour mapper les résultats

class CircuitUserRepository {

    /**
     * ➕ Associe un utilisateur à un circuit.
     * @param {Object} data
     * @returns {Promise<boolean>} True si l'insertion a réussi.
     */
    async create(data) {
         const {id_circuit, id_user,created_by, updated_by} =data
        const [result] = await db.query(
            `INSERT INTO circuit_user (id_circuit, id_user,created_by, updated_by) VALUES (?, ?,?,?)`,
            [id_circuit, id_user,created_by, updated_by]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime l'association entre un utilisateur et un circuit.
     * @param {number} id_circuit
     * @param {number} id_user
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_circuit, id_user) {
        const [result] = await db.query(
            `DELETE FROM circuit_user WHERE id_circuit = ? AND id_user = ?`,
            [id_circuit, id_user]
        );
        return result.affectedRows > 0;
    }

    /**
     * 🔍 Vérifie si une association existe.
     * @param {number} id_circuit
     * @param {number} id_user
     * @returns {Promise<boolean>}
     */
    async exists(id_circuit, id_user) {
        const [rows] = await db.query(
            `SELECT 1 FROM circuit_user WHERE id_circuit = ? AND id_user = ? LIMIT 1`,
            [id_circuit, id_user]
        );
        return rows.length > 0;
    }

    /**
     * 📋 Liste tous les utilisateurs (modèles User) associés à un circuit.
     * @param {number} id_circuit
     * @returns {Promise<User[]>}
     */
    async findUsersByCircuit(id_circuit) {
        const [rows] = await db.query(
            `SELECT u.* 
             FROM circuit_user cu
             JOIN user u ON cu.id_user = u.id_user
             WHERE cu.id_circuit = ?`,
            [id_circuit]
        );
        // On retourne des instances du modèle User
        return rows.map(row => new User(row));
    }

    /**
     * 🚛 Liste tous les circuits (modèles Circuit) associés à un utilisateur.
     * @param {number} id_user
     * @returns {Promise<Circuit[]>}
     */
    async findCircuitsByUser(id_user) {
        const [rows] = await db.query(
            `SELECT c.* 
             FROM circuit_user cu
             JOIN circuit c ON cu.id_circuit = c.id_circuit
             WHERE cu.id_user = ?`,
            [id_user]
        );
        // On retourne des instances du modèle Circuit
        return rows.map(row => new Circuit(row));
    }

    /**
     * Remplace une association utilisateur sur un circuit par une nouvelle.
     * @param {Object} data
     * @returns {Promise<boolean>} True si le remplacement a réussi.
     */
    async replaceUserInCircuit(data) {
        const {id_circuit, old_id_user, new_id_user,created_by,updated_by} =data
        await this.delete(id_circuit, old_id_user);
        return this.create({id_circuit, new_id_user,created_by,updated_by});
    }

    /**
     * supprimer tout les association d'un circuit
     * @param {number} id_circuit
     * @returns {Promise<boolean>}
     */
    async deleteAllAssociationsByCircuit(id_circuit) {
        const [result] = await db.query(`DELETE FROM circuit_user WHERE id_circuit = ?`, [id_circuit]);
        return result.affectedRows > 0;
    }

}

// On exporte une instance unique (Singleton)
module.exports = new CircuitUserRepository();
