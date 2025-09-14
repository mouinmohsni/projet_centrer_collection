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
        const { id_producteur ,id_conducteur , id_produit, id_date, quantite ,created_by,updated_by } = data;
        const [result] = await db.execute(
            `INSERT INTO recolte (id_producteur,id_conducteur, id_produit, id_date, quantite,created_by,updated_by)
             VALUES (?,?, ?, ?, ?,?,?)`,
            [id_producteur, id_conducteur, id_produit, id_date, quantite, created_by, updated_by]
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
     * 🔍 Récupère une livraison par son ID avec detail.
     * @param {number} id_recolte
     * @returns {Promise<object>}
     */
    async findByIdDetail(id_recolte) {
        const [rows] = await db.execute(
            `SELECT
                 r.id_recolte, r.quantite,
                 producteur.id_user AS clientId, producteur.nom AS producteurNom,
                 conducteur.id_user AS livreurId, conducteur.nom AS livreurNom,
                 p.id_produit AS produitId, p.nom AS produitNom,
                 d.jour AS dateLivraison , d.periode AS perride
             FROM
                 recolte AS r
                     LEFT JOIN user AS producteur ON r.id_producteur = producteur.id_user
                     LEFT JOIN user AS conducteur ON r.id_conducteur = conducteur.id_user
                     LEFT JOIN produit AS p ON r.id_produit = p.id_produit
                     LEFT JOIN dim_date AS d ON r.id_date = d.id_date
             WHERE  id_recolte = ?`,
            [id_recolte]
        );
        return rows[0];
    }


    /**
     * Récupère les récoltes d'un conducteur, avec un filtre optionnel par période de dates.
     * @param {number} id_producteur - L'ID du conducteur.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<object[]>} Un tableau des récoltes correspondantes.
     */
    async getByProducteur(id_producteur, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres de base.
        let sql = `
            SELECT  r.id_recolte,
                    r.id_producteur,
                    r.id_conducteur,
                    r.id_produit,
                    r.quantite,
                    d.id_date,
                    d.jour,
                    d.mois,
                    d.annee,
                    d.jour_semaine
            FROM recolte AS r
            JOIN dim_date AS d ON r.id_date = d.id_date
            WHERE r.id_producteur = ?
        `;
        const params = [id_producteur];

        // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
        if (dateDebut) {
            sql += ` AND d.jour >= ?`; // On filtre sur la date complète
            params.push(dateDebut);
        }

        if (dateFin) {
            sql += ` AND d.jour <= ?`;
            params.push(dateFin);
        }

        // 3. On ajoute le tri à la fin.
        sql += ` ORDER BY d.jour DESC`;

        // 4. On exécute la requête construite dynamiquement.
        const [rows] = await db.execute(sql, params);

        return rows;
    }


    /**
     * Récupère les récoltes d'un conducteur, avec un filtre optionnel par période de dates.
     * @param {number} id_conducteur - L'ID du conducteur.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<object[]>} Un tableau des récoltes correspondantes.
     */
    async getByConducteur(id_conducteur, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres de base.
        let sql = `
            SELECT r.id_recolte,
                   r.id_producteur,
                   r.id_conducteur,
                   r.id_produit,
                   r.quantite,
                   d.id_date,
                   d.jour,
                   d.mois,
                   d.annee,
                   d.jour_semaine
            FROM recolte AS r
            JOIN dim_date AS d ON r.id_date = d.id_date
            WHERE r.id_conducteur = ?
        `;
        const params = [id_conducteur];

        // 2. On ajoute dynamiquement les conditions de date si elles sont fournies.
        if (dateDebut) {
            sql += ` AND d.jour >= ?`; // On filtre sur la date complète
            params.push(dateDebut);
        }

        if (dateFin) {
            sql += ` AND d.jour <= ?`;
            params.push(dateFin);
        }

        // 3. On ajoute le tri à la fin.
        sql += ` ORDER BY d.jour DESC`;

        // 4. On exécute la requête construite dynamiquement.
        const [rows] = await db.execute(sql, params);

        return rows;
    }

    /**
     * 🔄 Met à jour une récolte.
     * @param {number} id
     * @param {object} data - Les données à mettre à jour (ex: { quantite: 150 }).
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    // async update(id_recolte, data) {
    //     // Pour l'instant, on ne met à jour que la quantité, mais on pourrait étendre
    //     const { quantite } = data;
    //     const [result] = await db.execute(
    //         `UPDATE recolte SET quantite = ? WHERE id_recolte = ?`,
    //         [quantite, id_recolte]
    //     );
    //     return result.affectedRows > 0;
    // }

    async update(id, data) {
        const updatableFields = ['id_producteur', 'id_conducteur', 'id_produit', 'id_date', 'quantite', 'updated_by']
        ;

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
            `UPDATE recolte SET ${setClause} WHERE id_recolte = ?`,
            values
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
