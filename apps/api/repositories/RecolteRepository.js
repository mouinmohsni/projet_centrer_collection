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
        const { id_producteur ,id_conducteur , id_produit, id_date, quantite } = data;
        const [result] = await db.execute(
            `INSERT INTO recolte (id_producteur,id_conducteur, id_produit, id_date, quantite)
             VALUES (?,?, ?, ?, ?)`,
            [id_producteur, id_conducteur, id_produit, id_date, quantite]
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
     * Récupère les récoltes d'un conducteur, avec un filtre optionnel par période de dates.
     * @param {number} id_producteur - L'ID du conducteur.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<Recolte[]>} Un tableau des récoltes correspondantes.
     */
    async getByProducteur(id_producteur, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres de base.
        let sql = `
            SELECT r.* 
            FROM recolte AS r
            JOIN dim_date AS d ON r.id_date = d.id_date
            WHERE r.id_producteur = ?
        `;
        const params = [id_producteur];

        // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
        if (dateDebut) {
            sql += ` AND d.jour_complet >= ?`; // On filtre sur la date complète
            params.push(dateDebut);
        }

        if (dateFin) {
            sql += ` AND d.jour_complet <= ?`;
            params.push(dateFin);
        }

        // 3. On ajoute le tri à la fin.
        sql += ` ORDER BY d.jour_complet DESC, r.periode DESC`;

        // 4. On exécute la requête construite dynamiquement.
        const [rows] = await db.execute(sql, params);

        return rows.map(this.mapRowToModel);
    }


    /**
     * Récupère les récoltes d'un conducteur, avec un filtre optionnel par période de dates.
     * @param {number} id_conducteur - L'ID du conducteur.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<Recolte[]>} Un tableau des récoltes correspondantes.
     */
    async getByConducteur(id_conducteur, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres de base.
        let sql = `
            SELECT r.* 
            FROM recolte AS r
            JOIN dim_date AS d ON r.id_date = d.id_date
            WHERE r.id_conducteur = ?
        `;
        const params = [id_conducteur];

        // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
        if (dateDebut) {
            sql += ` AND d.jour_complet >= ?`; // On filtre sur la date complète
            params.push(dateDebut);
        }

        if (dateFin) {
            sql += ` AND d.jour_complet <= ?`;
            params.push(dateFin);
        }

        // 3. On ajoute le tri à la fin.
        sql += ` ORDER BY d.jour_complet DESC, r.periode DESC`;

        // 4. On exécute la requête construite dynamiquement.
        const [rows] = await db.execute(sql, params);

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
