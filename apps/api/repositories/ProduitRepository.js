const db = require('../models/db');
// file: src/repositories/produit.repository.js

const Produit = require('../models/Produit');

class ProduitRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Produit.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Produit | null}
     */
    mapRowToModel(row) {
        return row ? new Produit(row) : null;
    }

    /**
     * ➕ Crée un nouveau produit.
     * @param {object} data - Les données du produit { nom, unite }.
     * @returns {Promise<number>} L'ID du nouveau produit.
     */
    async create(data) {
        const { nom, unite , created_by , updated_by } = data;
        const [result] = await db.execute(
            `INSERT INTO produit (nom, unite ,created_by , updated_by) VALUES (?, ?,?,?)`,
            [nom, unite,created_by,updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère un produit par son ID.
     * @param {number} id_produit
     * @returns {Promise<Produit|null>}
     */
    async findById(id_produit) {
        const [rows] = await db.execute(
            `SELECT * FROM produit WHERE id_produit = ?`,
            [id_produit]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔹 Récupère tous les produits.
     * @returns {Promise<Produit[]>}
     */
    async getAll() {
        const [rows] = await db.execute(`SELECT * FROM produit ORDER BY nom`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 🔄 Met à jour un produit.
     * @param {number} id
     * @param {object} data - Les données à mettre à jour { nom, unite }.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    // async update(id_produit, data) {
    //     const { nom, unite } = data;
    //     const [result] = await db.execute(
    //         `UPDATE produit SET nom = ?, unite = ? WHERE id_produit = ?`,
    //         [nom, unite, id_produit]
    //     );
    //     return result.affectedRows > 0;
    // }

    async update(id, data) {
        const updatableFields = ['nom', 'unite', 'updated_by'];

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
            `UPDATE produit SET ${setClause} WHERE id_produit = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime un produit.
     * @param {number} id_produit
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_produit) {
        const [result] = await db.execute(
            `DELETE FROM produit WHERE id_produit = ?`,
            [id_produit]
        );
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new ProduitRepository();
