const db = require('../models/db');
const Facture = require("../models/Facture");
class FactureRepository {


    /**
     * Mappe une ligne de la base de données à une instance du modèle facture.
     * @private
     * @param {object|undefined} row - La ligne de la base de données.
     * @returns {Facture|null}
     */
    mapRowToModel(row) {
        return row ? new Facture(row) : null;
    }

    /**
     * Crée une nouvelle Facture.
     * @param {object} data - Les données de la Facture.

     * @returns {Promise<number>} L'ID de la nouvelle Facture.
     */
    async create(data) {
        // On attend les deux champs du service
        // const { id_client, id_date, montant_total = 0, type, statut = 'brouillon' } = data;

        const { id_client, id_date, montant_total, type, statut, created_by, updated_by } = data;
        const [result] = await db.execute(
            `INSERT INTO facture (id_client, id_date, montant_total, type, statut, created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_client, id_date, montant_total, type, statut, created_by, updated_by]
        );
        return result.insertId;
    }


    /**
     * Récupère une Facture par son ID.
     * @param {number} id_facture
     * @returns {Promise<FichePaie|null>}
     */

    async findByIdDetail(id_facture) {
        const [rows] = await db.execute(
            `SELECT  f.id_facture, f.id_client, u.nom, f.id_date, d.jour, f.montant_total, f.type, f.statut, f.created_by,f.created_at,f.updated_by,f.updated_at
                FROM facture AS f
                LEFT JOIN user u on f.id_client = u.id_user
                LEFT JOIN dim_date d on f.id_date = d.id_date
                WHERE id_facture = ?`,
            [id_facture]
        );
        return this.mapRowToModel(rows[0]);
    }
    /**
     * Récupère une Facture par son ID.
     * @param {number} id_facture
     * @returns {Promise<Facture|null>}
     */
    async findByI(id_facture) {
        const [rows] = await db.execute(
            `SELECT * FROM facture 
                WHERE id_facture = ?`,
            [id_facture]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * Met à jour une Facture.
     * @param {number} id_facture - L'ID de la fiche à mettre à jour.
     * @param {object} data - Les nouvelles données.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_facture, data) {
        const updatableFields = [ "id_client", "id_date", "montant_total", "type", "statut", "updated_by"];

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
        values.push(id_facture); // Ajouter l'ID pour la clause WHERE



        const [result] = await db.execute(
            `UPDATE facture SET ${setClause} WHERE id_facture = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    /**
     * Supprime une Facture.
     * @param {number} id_facture
     * @returns {Promise<boolean>}
     */
    async delete(id_facture) {
        const [result] = await db.execute(
            `DELETE FROM facture WHERE id_facture = ?`,
            [id_facture]
        );
        return result.affectedRows > 0;
    }

    /**
     * Récupère toutes les facture d'un client.
     * @param {number} id_client
     * @returns {Promise<FichePaie[]>}
     */
    async getByUser(id_client) {
        const [rows] = await db.execute(
            `SELECT * FROM facture WHERE id_client = ? ORDER BY id_date DESC`,
            [id_client]
        );
        return rows.map(row => this.mapRowToModel(row));
    }


    /**
     * 💰 Récupère le montant total pour un statut de facture donné.
     * @param {string} statut
     * @returns {Promise<number>}
     */
    async getTotalByStatut(statut) {
        const [rows] = await db.query(
            `SELECT SUM(montant_total) AS total FROM facture WHERE statut = ?`,
            [statut]
        );
        return rows[0]?.total || 0;
    }
}

module.exports = FactureRepository ;