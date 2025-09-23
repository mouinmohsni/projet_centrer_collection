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
        const { nom, description,created_by, updated_by } = data;
        const [result] = await db.query(
            `INSERT INTO circuit (nom, description ,created_by, updated_by) VALUES (?, ?,?,?)`,
            [nom, description,created_by, updated_by]
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
     * @param {number} id
     * @param {object} data - Les données à mettre à jour { nom, description }.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    // async update(id_circuit, data) {
    //     const { nom, description } = data;
    //     const [result] = await db.query(
    //         `UPDATE circuit SET nom = ?, description = ? WHERE id_circuit = ?`,
    //         [nom, description, id_circuit]
    //     );
    //     return result.affectedRows > 0;
    // }
    async update(id, data) {
        const updatableFields = ['nom', 'description', 'updated_by'];

        // 2. Filtrer l'objet 'data' pour ne garder que les champs autorisés.
        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (updatableFields.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        // 3. Construire la requête dynamiquement à partir des données filtrées.
        const fields = Object.keys(dataToUpdate);
        const values = Object.values(dataToUpdate);


        if (fields.length === 0) {
            // Le client n'a envoyé aucun champ modifiable.
            return false;
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        values.push(id); // Ajouter l'ID pour la clause WHERE



        const [result] = await db.execute(
            `UPDATE circuit SET ${setClause} WHERE id_circuit = ?`,
            values
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
