const db = require('../models/db');

const Facture = require('../models/Facture');

class FactureRepository {

    /**
     * Transforme une ligne de la base de données en une instance de Facture.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Facture | null}
     */
    mapRowToModel(row) {
        return row ? new Facture(row) : null;
    }

    /**
     * ➕ Crée une nouvelle facture.
     * Le montant_total sera souvent mis à jour par le service après ajout des lignes.
     * @param {object} data - Les données de la facture.
     * @returns {Promise<number>} L'ID de la nouvelle facture.
     */
    async create(data) {
        const { id_client, id_date, montant_total = 0, type, statut = 'brouillon' } = data;
        const [result] = await db.query(
            `INSERT INTO facture (id_client, id_date, montant_total, type, statut) 
             VALUES (?, ?, ?, ?, ?)`,
            [id_client, id_date, montant_total, type, statut]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une facture par son ID.
     * @param {number} id_facture
     * @returns {Promise<Facture|null>}
     */
    async findById(id_facture) {
        const [rows] = await db.query(
            `SELECT * FROM facture WHERE id_facture = ?`,
            [id_facture]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Récupère toutes les factures.
     * @returns {Promise<Facture[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM facture`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📋 Récupère toutes les factures d'un client spécifique.
     * @param {number} id_client
     * @returns {Promise<Facture[]>}
     */
    async getByClient(id_client) {
        const [rows] = await db.query(
            `SELECT * FROM facture WHERE id_client = ?`,
            [id_client]
        );
        return rows.map(this.mapRowToModel);
    }

    /**
     * ✏️ Met à jour une facture.
     * @param {number} id_facture
     * @param {object} data - Les données à mettre à jour.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_facture, data) {
        const { id_client, id_date, montant_total, type, statut } = data;
        const [result] = await db.query(
            `UPDATE facture 
             SET id_client = ?, id_date = ?, montant_total = ?, type = ?, statut = ?
             WHERE id_facture = ?`,
            [id_client, id_date, montant_total, type, statut, id_facture]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprime une facture.
     * @param {number} id_facture
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_facture) {
        const [result] = await db.query(`DELETE FROM facture WHERE id_facture = ?`, [id_facture]);
        return result.affectedRows > 0;
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

// On exporte une instance unique (Singleton)
module.exports = new FactureRepository();
