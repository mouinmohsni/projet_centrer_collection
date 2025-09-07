const db = require('../models/db');

// file: src/repositories/livraison.repository.js

const Livraison = require('../models/Livraison');

class LivraisonRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Livraison.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Livraison | null}
     */
    mapRowToModel(row) {
        return row ? new Livraison(row) : null;
    }

    /**
     * ➕ Crée une nouvelle livraison.
     * @param {object} data - Les données de la livraison.
     * @returns {Promise<number>} L'ID de la nouvelle livraison.
     */
    async create(data) {
        const { id_user, id_produit, id_date, quantite } = data;
        const [result] = await db.execute(
            `INSERT INTO livraison (id_user, id_produit, id_date, quantite)
             VALUES (?, ?, ?, ?)`,
            [id_user, id_produit, id_date, quantite]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une livraison par son ID.
     * @param {number} id_livraison
     * @returns {Promise<Livraison|null>}
     */
    async findById(id_livraison) {
        const [rows] = await db.execute(
            `SELECT * FROM livraison WHERE id_livraison = ?`,
            [id_livraison]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔹 Récupère toutes les livraisons d'un utilisateur spécifique.
     * @param {number} id_user
     * @returns {Promise<Livraison[]>}
     */
    async getByUser(id_user) {
        const [rows] = await db.execute(
            `SELECT * FROM livraison WHERE id_user = ? ORDER BY id_date DESC`,
            [id_user]
        );
        return rows.map(this.mapRowToModel);
    }

    /**
     * 🔄 Met à jour une livraison.
     * @param {number} id_livraison
     * @param {object} data - Les données à mettre à jour (ex: { quantite: 50 }).
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_livraison, data) {
        const { quantite } = data;
        const [result] = await db.execute(
            `UPDATE livraison SET quantite = ? WHERE id_livraison = ?`,
            [quantite, id_livraison]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime une livraison.
     * @param {number} id_livraison
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_livraison) {
        const [result] = await db.execute(
            `DELETE FROM livraison WHERE id_livraison = ?`,
            [id_livraison]
        );
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new LivraisonRepository();
