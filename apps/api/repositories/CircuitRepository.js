const db = require('../models/db');
const Circuit = require('../models/Circuit');




class CircuitRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Circuit.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Circuit | null}
     */
    mapRowToModel(row) {
        return row ? new Circuit(row) : null;
    }

    /**
     * ➕ Crée un nouveau circuit.
     * @param {object} data - Les données du circuit { nom, description }.
     * @returns {Promise<number>} L'ID du nouveau circuit.
     */
    async create(data) {
        const { nom, description } = data;
        const [result] = await db.query(
            `INSERT INTO circuit (nom, description) VALUES (?, ?)`,
            [nom, description]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère un circuit par son ID.
     * @param {number} id_circuit
     * @returns {Promise<Circuit|null>}
     */
    async findById(id_circuit) {
        const [rows] = await db.query(
            `SELECT * FROM circuit WHERE id_circuit = ?`,
            [id_circuit]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Récupère tous les circuits.
     * @returns {Promise<Circuit[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM circuit`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * ✏️ Met à jour un circuit.
     * @param {number} id_circuit
     * @param {object} data - Les données à mettre à jour { nom, description }.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_circuit, data) {
        const { nom, description } = data;
        const [result] = await db.query(
            `UPDATE circuit SET nom = ?, description = ? WHERE id_circuit = ?`,
            [nom, description, id_circuit]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime un circuit.
     * @param {number} id_circuit
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_circuit) {
        const [result] = await db.query(
            `DELETE FROM circuit WHERE id_circuit = ?`,
            [id_circuit]
        );
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new CircuitRepository();
