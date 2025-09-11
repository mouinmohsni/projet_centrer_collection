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

        const { id_client,id_livreur, id_produit, id_date, quantite } = data;
        const [result] = await db.execute(
            `INSERT INTO livraison (id_client,id_livreur, id_produit, id_date, quantite)
             VALUES (?,?, ?, ?, ?)`,
            [id_client,id_livreur, id_produit, id_date, quantite]
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
     * 🔍 Récupère une livraison par son ID avec detail.
     * @param {number} id_livraison
     * @returns {Promise<object>}
     */
    async findByIdDetail(id_livraison) {
        const [rows] = await db.execute(
            `SELECT
                 l.id_livraison, l.quantite,
                 client.id_user AS clientId, client.nom AS clientNom,
                 livreur.id_user AS livreurId, livreur.nom AS livreurNom,
                 p.id_produit AS produitId, p.nom AS produitNom,
                 d.jour AS dateLivraison , d.periode AS perride
             FROM
                 livraison AS l
                     LEFT JOIN user AS client ON l.id_client = client.id_user
                     LEFT JOIN user AS livreur ON l.id_livreur = livreur.id_user
                     LEFT JOIN produit AS p ON l.id_produit = p.id_produit
                     LEFT JOIN dim_date AS d ON l.id_date = d.id_date
             WHERE  id_livraison = ?`,
            [id_livraison]
        );
        return rows[0];
    }

    //
    // /**
    //  * Récupère les livraisons d'un a un client, avec un filtre optionnel par période de dates.
    //  * @param {number} id_client - L'ID du client.
    //  * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
    //  * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
    //  * @returns {Promise<object[]>} Un tableau des récoltes correspondantes.
    //  */
    // async getByClient(id_client, dateDebut, dateFin) {
    //     // 1. On commence avec la requête de base et les paramètres de base.
    //     let sql = `
    //         SELECT l.*,d.*
    //         FROM livraison AS l
    //         JOIN dim_date AS d ON l.id_date = d.id_date
    //         WHERE l.id_client = ?
    //     `;
    //     const params = [id_client];
    //
    //     // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
    //     if (dateDebut) {
    //         sql += ` AND d.jour >= ?`; // On filtre sur la date complète
    //         params.push(dateDebut);
    //     }
    //
    //     if (dateFin) {
    //         sql += ` AND d.jour <= ?`;
    //         params.push(dateFin);
    //     }
    //
    //     // 3. On ajoute le tri à la fin.
    //     sql += ` ORDER BY d.jour DESC`;
    //
    //     // 4. On exécute la requête construite dynamiquement.
    //     const [rows] = await db.execute(sql, params);
    //
    //     return rows.map(this.mapRowToModel);
    // }
    //
    //
    // /**
    //  * Récupère les livraisons d'un conducteur, avec un filtre optionnel par période de dates.
    //  * @param {number} id_livreur - L'ID du conducteur.
    //  * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
    //  * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
    //  * @returns {Promise<object[]>} Un tableau des récoltes correspondantes.
    //  */
    // async getBylivreur(id_livreur, dateDebut, dateFin) {
    //     // 1. On commence avec la requête de base et les paramètres de base.
    //     let sql = `
    //         SELECT l.*,d.*
    //         FROM livraison AS l
    //         JOIN dim_date AS d ON l.id_date = d.id_date
    //         WHERE l.id_livreur = ?
    //     `;
    //     const params = [id_livreur];
    //
    //     // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
    //     if (dateDebut) {
    //         sql += ` AND d.jour >= ?`; // On filtre sur la date complète
    //         params.push(dateDebut);
    //     }
    //
    //     if (dateFin) {
    //         sql += ` AND d.jour <= ?`;
    //         params.push(dateFin);
    //     }
    //
    //     // 3. On ajoute le tri à la fin.
    //     sql += ` ORDER BY d.jour DESC`;
    //
    //     // 4. On exécute la requête construite dynamiquement.
    //     const [rows] = await db.execute(sql, params);
    //
    //     return rows;
    // }

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


    //************************************

    /**
     * Méthode privée générique pour trouver des livraisons détaillées selon des critères.
     * @private
     * @param {object} criteria - L'objet de critères de recherche (ex: { "l.id_client": 123 }).
     * @param {string} [dateDebut] - La date de début.
     * @param {string} [dateFin] - La date de fin.
     * @returns {Promise<object[]>}
     */
    async _findDetailed(criteria, dateDebut, dateFin) {
        // 1. Construire la clause WHERE de base à partir des critères
        const criteriaKeys = Object.keys(criteria);
        if (criteriaKeys.length === 0) {
            throw new Error("La recherche de livraisons détaillées nécessite au moins un critère.");
        }
        const whereClause = criteriaKeys.map(key => `${key} = ?`).join(' AND ');
        const params = Object.values(criteria);

        // 2. Construire la requête SQL complète avec toutes les jointures
        let sql = `
            SELECT 
                l.id_livraison, l.quantite,
                client.id_user AS clientId, client.nom AS clientNom,
                livreur.id_user AS livreurId, livreur.nom AS livreurNom,
                p.id_produit AS produitId, p.nom AS produitNom,
                d.jour AS dateLivraison
            FROM 
                livraison AS l
            LEFT JOIN user AS client ON l.id_client = client.id_user
            LEFT JOIN user AS livreur ON l.id_livreur = livreur.id_user
            LEFT JOIN produit AS p ON l.id_produit = p.id_produit
            LEFT JOIN dim_date AS d ON l.id_date = d.id_date
            WHERE ${whereClause}
        `;

        // 3. Ajouter les filtres de date
        if (dateDebut) {
            sql += ` AND d.jour_complet >= ?`;
            params.push(dateDebut);
        }
        if (dateFin) {
            sql += ` AND d.jour_complet <= ?`;
            params.push(dateFin);
        }

        // 4. Ajouter le tri
        sql += ` ORDER BY d.jour_complet DESC`;

        // 5. Exécuter et retourner
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    /**
     * Récupère les livraisons détaillées pour un client, avec filtre de date.
     * @param {number} id_client - L'ID du client.
     * @param {string} [dateDebut]
     * @param {string} [dateFin]
     * @returns {Promise<object[]>}
     */
    async getByClientDetailed(id_client, dateDebut, dateFin) {
        // Appelle la méthode générique avec le bon critère
        return this._findDetailed({ 'l.id_client': id_client }, dateDebut, dateFin);
    }

    /**
     * Récupère les livraisons détaillées pour un livreur, avec filtre de date.
     * @param {number} id_livreur - L'ID du livreur.
     * @param {string} [dateDebut]
     * @param {string} [dateFin]
     * @returns {Promise<object[]>}
     */
    async getByLivreurDetailed(id_livreur, dateDebut, dateFin) {
        // Appelle la méthode générique avec le bon critère
        return this._findDetailed({ 'l.id_livreur': id_livreur }, dateDebut, dateFin);
    }
}

// On exporte une instance unique (Singleton)
module.exports = new LivraisonRepository();
