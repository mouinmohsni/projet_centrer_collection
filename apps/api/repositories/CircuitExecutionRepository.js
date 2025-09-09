const db = require('../models/db');
const CircuitExecution = require('../models/CircuitExecution');


class CircuitExecutionRepository {

    /**
     * Transforme une ligne de la base de données en une instance de CircuitExecution.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {CircuitExecution | null}
     */
    mapRowToModel(row) {
        return row ? new CircuitExecution(row) : null;
    }

    /**
     * ➕ Crée une nouvelle exécution de circuit.
     * @param {object} data - Les données de l'exécution.
     * @returns {Promise<number>} L'ID de la nouvelle exécution.
     */
    async create(data) {
        const { id_circuit, id_date, id_Voiture, km_parcouru } = data;
        const [result] = await db.query(
            `INSERT INTO circuit_execution (id_circuit, id_date, id_Voiture, km_parcouru)
             VALUES (?, ?, ?, ?)`,
            [id_circuit, id_date, id_Voiture, km_parcouru]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une exécution par son ID.
     * @param {number} id_execution
     * @returns {Promise<CircuitExecution|null>}
     */
    async findById(id_execution) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_execution WHERE id_execution = ?`,
            [id_execution]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Liste toutes les exécutions.
     * @returns {Promise<CircuitExecution[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM circuit_execution`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📅 Liste toutes les exécutions d'un circuit donné.
     * @param {number} id_circuit
     * @returns {Promise<CircuitExecution[]>}
     */
    async findByCircuit(id_circuit) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_execution WHERE id_circuit = ?`,
            [id_circuit]
        );
        return rows.map(this.mapRowToModel);
    }

    /**
     * ✏️ Met à jour une exécution.
     * @param {number} id_execution
     * @param {object} data
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_execution, data) {
        const { id_circuit, id_date, id_Voiture, km_parcouru } = data;
        const [result] = await db.query(
            `UPDATE circuit_execution
             SET id_circuit = ?, id_date = ?, id_Voiture = ?, km_parcouru = ?
             WHERE id_execution = ?`,
            [id_circuit, id_date, id_Voiture, km_parcouru, id_execution]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime une exécution.
     * @param {number} id_execution
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_execution) {
        const [result] = await db.query(
            `DELETE FROM circuit_execution WHERE id_execution = ?`,
            [id_execution]
        );
        return result.affectedRows > 0;
    }

    /**
     * 🚛 Récupère les infos détaillées (avec jointures).
     * @param {number} id_execution
     * @returns {Promise<object|null>} Un objet enrichi, pas un modèle pur.
     */
    async getDetails(id_execution) {
        const [rows] = await db.query(
            `SELECT ce.*, v.immatriculation, c.nom AS nom_circuit
             FROM circuit_execution ce
             JOIN voiture v ON ce.id_Voiture = v.id_Voiture
             JOIN circuit c ON ce.id_circuit = c.id_circuit
             WHERE ce.id_execution = ?`,
            [id_execution]
        );
        return rows[0] || null;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new CircuitExecutionRepository();
