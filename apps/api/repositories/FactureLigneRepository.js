const db = require('../models/db');

const FactureLigne = require('../models/FactureLigne');
const BaseRepository = require("../delete/BaseRepository");

class FactureLigneRepository  extends BaseRepository{

    constructor() {
        super("facture_ligne", "id_ligne")

        this.updatableFields = ["id_facture", "id_produit", "quantite", "prix_unitaire", "montant", "updated_by"];
    }


    /**
     * Transforme une ligne de la base de données en une instance de FactureLigne.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {FactureLigne | null}
     */
    mapRowToModel(row) {
        return row ? new FactureLigne(row) : null;
    }

    /**
     * ➕ Crée une nouvelle FactureLigne.
     * Le montant_total sera souvent mis à jour par le service après ajout des lignes.
     * @param {object} data - Les données de la FactureLigne.
     * @param connection
     * @returns {Promise<number>} L'ID de la nouvelle FactureLigne.
     */
    async create(data , connection = db) {
        const { id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by} = data;
        const [result] = await connection.query(
            `INSERT INTO facture_ligne (id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by) 
             VALUES (?, ?, ?, ?, ?,?)`,
            [id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une FactureLigne par son ID.
     * @param {number} id_ligne
     * @returns {Promise<FactureLigne|null>}
     */
    async findById(id_ligne) {
        const [rows] = await db.query(
            `SELECT * FROM facture_ligne WHERE id_ligne = ?`,
            [id_ligne]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔍 Récupère une FactureLigne par son ID.
     * @param {number} factureId
     * @returns {Promise<Object|null>}
     */
    async findByFactureId(factureId){
        const [rows] = await db.query(
            `SELECT f.* , p.nom as produit FROM facture_ligne AS F
         JOIN collection_db.produit p on F.id_produit = p.id_produit
            WHERE id_facture = ?`,
            [factureId]
        );
        return rows
    }

    /**
     * 📋 Récupère toutes les FactureLignes.
     * @returns {Promise<FactureLigne[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM facture`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📋 Récupère toutes les FactureLignes d'un client spécifique.
     * @param {number} id_client
     * @returns {Promise<FactureLigne[]>}
     */
    async getByClient(id_client) {
        const [rows] = await db.query(
            `SELECT * FROM facture WHERE id_client = ?`,
            [id_client]
        );
        return rows.map(this.mapRowToModel);
    }



        /** Surcharge de la méthode update pour utiliser la liste de champs prédéfinie.
    * @param {number} id - L'ID de l'exécution.
    * @param {object} data - Les données à mettre à jour.
    * @param  {string[]} [allowedFields=null]
    * @returns {Promise<boolean>}
    */
    async update(id, data,allowedFields = null) {
        // On appelle la méthode 'update' de la classe parente (BaseRepository)
        // en lui passant la liste des champs autorisés.
        return super.update(id, data, this.updatableFields);
    }


    /**
     * ❌ Supprime une facture.
     * @param {number} id_ligne
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_ligne) {
        const [result] = await db.query(`DELETE FROM facture_ligne WHERE id_ligne = ?`, [id_ligne]);
        return result.affectedRows > 0;
    }

    async findLigneWithFactureStatus(ligneId) {
        const [rows] = await db.query(
            `SELECT fl.*, f.statut AS statut_facture
             FROM facture_ligne AS fl
             JOIN facture AS f ON fl.id_facture = f.id_facture
             WHERE fl.id_ligne = ?`,
            [ligneId]
        );
        return rows[0] || null;
    }

    async deleteByFactureId(factureId, connection = db) {
        const [result] = await connection.query(
            `DELETE FROM ${this.tableName} WHERE id_facture = ?`,
            [factureId]
        );
        return result.affectedRows;
    }



}

// On exporte une instance unique (Singleton)
module.exports = new FactureLigneRepository();
