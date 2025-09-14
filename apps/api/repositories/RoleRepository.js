const db = require('../models/db');

// file: src/repositories/role.repository.js
const Role = require('../models/Role');

class RoleRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Role.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Role | null}
     */
    mapRowToModel(row) {
        return row ? new Role(row) : null;
    }

    /**
     * ➕ Crée un nouveau rôle.
     * @param {object} data - Le libellé du nouveau rôle.
     * @returns {Promise<number>} L'ID du nouveau rôle.
     */
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO role (libelle , created_by,updated_by) VALUES (?,?,?)`,
            [data.libelle ,data.created_by ,data.updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère un rôle par son ID.
     * @param {number} id_role
     * @returns {Promise<Role|null>}
     */
    async findById(id_role) {
        const [rows] = await db.execute(
            `SELECT * FROM role WHERE id_role = ?`,
            [id_role]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔹 Récupère tous les rôles.
     * @returns {Promise<Role[]>}
     */
    async getAll() {
        const [rows] = await db.execute(`SELECT * FROM role ORDER BY libelle`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 🔄 Met à jour un rôle.
     * @param {number} id_role
     * @param {object} data
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_role, data) {
        const [result] = await db.execute(
            `UPDATE role SET libelle = ?,updated_by = ? WHERE id_role = ?`,
            [data.libelle,data.updated_by, id_role]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime un rôle.
     * @param {number} id_role
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_role) {
        const [result] = await db.execute(
            `DELETE FROM role WHERE id_role = ?`,
            [id_role]
        );
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new RoleRepository();
