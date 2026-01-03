const db = require('../models/db');
const Facture = require("../models/Facture");
const BaseRepository = require("../delete/BaseRepository");
class FactureRepository  extends BaseRepository{

    constructor() {
        super("facture", "id_facture")

        this.updatableFields = ["id_client", "id_date", "montant_total", "type", "statut", "updated_by"];
    }


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
     * @param connection
     * @returns {Promise<number>} L'ID de la nouvelle Facture.
     */
    async create(data,connection = db) {

        const { id_client,nomFacture, id_date, montant_total, type, statut, created_by, updated_by } = data;
        const [result] = await connection.query(
            `INSERT INTO facture (id_client, nomFacture, id_date, montant_total, type, statut, created_by, updated_by)
             VALUES (?, ?,?, ?, ?, ?, ?, ?)`,
            [id_client,nomFacture, id_date, montant_total, type, statut, created_by, updated_by]
        );
        return result.insertId;
    }


    /**
     * Récupère une Facture par son ID.
     * @param {number} id_facture
     * @returns {Promise<Facture|null>}
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
    async findById(id_facture) {
        const row= super.findById_raw(id_facture)
        return this.mapRowToModel(row);
    }

    // /**
    //  * Met à jour une Facture.
    //  * @param {number} id_facture - L'ID de la fiche à mettre à jour.
    //  * @param {object} data - Les nouvelles données.
    //  * @returns {Promise<boolean>} True si la mise à jour a réussi.
    //  */
    // async update(id_facture, data) {
    //     const updatableFields = [ "id_client", "id_date", "montant_total", "type", "statut", "updated_by"];
    //
    //     // 2. Filtrer l'objet 'data' pour ne garder que les champs autorisés.
    //     const dataToUpdate = {};
    //     Object.keys(data).forEach(key => {
    //         if (updatableFields.includes(key)) {
    //             dataToUpdate[key] = data[key];
    //         }
    //     });
    //
    //     // 3. Construire la requête dynamiquement à partir des données filtrées.
    //     const fields = Object.keys(dataToUpdate);
    //     const values = Object.values(dataToUpdate);
    //
    //
    //     if (fields.length === 0) {
    //         // Le client n'a envoyé aucun champ modifiable.
    //         return false;
    //     }
    //
    //     const setClause = fields.map(field => `${field} = ?`).join(', ');
    //     values.push(id_facture); // Ajouter l'ID pour la clause WHERE
    //
    //
    //
    //     const [result] = await db.execute(
    //         `UPDATE facture SET ${setClause} WHERE id_facture = ?`,
    //         values
    //     );
    //     return result.affectedRows > 0;
    // }

    /** Surcharge de la méthode update pour utiliser la liste de champs prédéfinie.
     * @param {number} id - L'ID de l'exécution.
     * @param {object} data - Les données à mettre à jour.
     * @param  {string[]} [allowedFields=null]
     * @returns {Promise<boolean>}
     */
    async update(id, data,allowedFields = null) {
        // On appelle la méthode 'update' de la classe parente (BaseRepository)
        // en lui passant la liste des champs autorisés.
        return super.updateConnexion(id, data, this.updatableFields);
    }



    // /**
    //  * Récupère toutes les factures d'un client.
    //  * @param {number} id_client
    //  * @returns {Promise<Facture[]>}
    //  */
    // async getByUser(id_client) {
    //     const [rows] = await db.execute(
    //         `SELECT * FROM facture WHERE id_client = ? ORDER BY id_date DESC`,
    //         [id_client]
    //     );
    //     return rows.map(row => this.mapRowToModel(row));
    // }

    async getAll(){
        const [rows] = super.getAll_raw()
        return rows.map(this.mapRowToModel)
    }


    // /**
    //  * 💰 Récupère le montant total pour un statut de facture donné.
    //  * @param {string} statut
    //  * @returns {Promise<number>}
    //  */
    // async getTotalByStatut(statut) {
    //     const [rows] = await db.query(
    //         `SELECT SUM(montant_total) AS total FROM facture WHERE statut = ?`,
    //         [statut]
    //     );
    //     return rows[0]?.total || 0;
    // }

    /**
     * Récupère toutes les factures d'un client.
     * @param {Object} filters
     * @returns {Promise<Facture[]>}
     */

    async getByFilter(filters = {}){

        const { type, statut,nomFacture, id_client, id_date, date_debut, date_fin } = filters;

        let query = `SELECT f.* FROM ${this.tableName} AS f`;
        const conditions = [];
        const params = [];


        // Si un filtre de date par intervalle est présent, on doit joindre dim_date.
        if (date_debut || date_fin) {
            // IMPORTANT : Assurez-vous que les noms 'dim_date' et 'jour' sont corrects.
            query += ` JOIN dim_date AS dd ON f.id_date = dd.id_date`;

            if (date_debut) {
                conditions.push('dd.jour >= ?');
                params.push(date_debut);
            }
            if (date_fin) {
                conditions.push('dd.jour <= ?');
                params.push(date_fin);
            }
        }

        if (type) {
            conditions.push('type = ?');
            params.push(type);
        }
        if(nomFacture){
            conditions.push('type LIKE ?');
            params.push(nomFacture);
        }

        if (statut)  {
            if (Array.isArray(statut)) {
                const status = statut.map(() => '?').join(',');
                conditions.push(`statut IN (${status})`);
                params.push(...statut);
            } else {
                conditions.push('statut = ?');
                params.push(statut);
            }
        }

        if (id_client){
            conditions.push('id_client = ?');
            params.push(id_client);
        }

        if (id_date){
            conditions.push('id_date = ?');
            params.push(id_date);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await db.query(query, params);
        return rows.map(row => this.mapRowToModel(row));


    }
}

module.exports = new FactureRepository() ;