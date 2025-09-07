const db = require('../models/db');

const Recolte = require('../models/Recolte');

class RecolteRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Recolte.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Recolte | null}
     */
    mapRowToModel(row) {
        return row ? new Recolte(row) : null;
    }

    /**
     * ➕ Crée une nouvelle récolte.
     * @param {object} data - Les données de la récolte.
     * @returns {Promise<number>} L'ID de la nouvelle récolte.
     */
    async create(data) {
        const { id_user, id_produit, id_date, quantite } = data;
        const [result] = await db.execute(
            `INSERT INTO recolte (id_user, id_produit, id_date, quantite)
             VALUES (?, ?, ?, ?)`,
            [id_user, id_produit, id_date, quantite]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une récolte par son ID.
     * @param {number} id_recolte
     * @returns {Promise<Recolte|null>}
     */
    async findById(id_recolte) {
        const [rows] = await db.execute(
            `SELECT * FROM recolte WHERE id_recolte = ?`,
            [id_recolte]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔹 Récupère toutes les récoltes d'un utilisateur spécifique.
     * @param {number} id_user
     * @returns {Promise<Recolte[]>}
     */
    async getByUser(id_user) {
        const [rows] = await db.execute(
            `SELECT * FROM recolte WHERE id_user = ? ORDER BY id_date DESC`,
            [id_user]
        );
        return rows.map(this.mapRowToModel);
    }

    /**
     * 🔄 Met à jour une récolte.
     * @param {number} id_recolte
     * @param {object} data - Les données à mettre à jour (ex: { quantite: 150 }).
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_recolte, data) {
        // Pour l'instant, on ne met à jour que la quantité, mais on pourrait étendre
        const { quantite } = data;
        const [result] = await db.execute(
            `UPDATE recolte SET quantite = ? WHERE id_recolte = ?`,
            [quantite, id_recolte]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime une récolte.
     * @param {number} id_recolte
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_recolte) {
        const [result] = await db.execute(
            `DELETE FROM recolte WHERE id_recolte = ?`,
            [id_recolte]
        );
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new RecolteRepository();
