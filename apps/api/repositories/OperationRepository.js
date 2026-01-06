const db = require('../config/db'); // Assurez-vous que le chemin vers votre connexion BDD est correct
const Operation = require('../models/Operation'); // Assurez-vous que le chemin est correct

const TABLE_NAME = "operation";
const PRIMARY_KEY = "id_operation";

/**
 * Repository pour la gestion des opérations (recolte et livraison).
 */
class OperationRepository {

    constructor() {
        // Définition des champs autorisés à être mis à jour
        this.updatableFields = [
            "id_circuit_execution",
            "type",
            "id_utilisateur_concerne",
            "id_utilisateur_effectuant",
            "id_produit",
            "id_date",
            "quantite",
            "updated_by"
        ];
    }

    /**
     * Transforme une ligne de la base de données en une instance de Operation.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Operation | null}
     */
    mapRowToModel(row) {
        return row ? new Operation(row) : null;
    }

    // --- Méthodes CRUD de Base ---

    /**
     * Récupère une opération par son ID.
     * @param {number} id
     * @returns {Promise<Operation | null>}
     */
    async findById(id) {
        const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [id]);
        return this.mapRowToModel(rows[0]);
    }

    /**
     * Crée une nouvelle opération.
     * @param {object} data - Les données de l'opération.
     * @returns {Promise<number>} - L'ID de la nouvelle opération.
     */
    async create(data) {
        const fields = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).fill('?').join(', ');
        const values = Object.values(data);

        const [result] = await db.query(
            `INSERT INTO ${TABLE_NAME} (${fields}) VALUES (${placeholders})`,
            values
        );
        return result.insertId;
    }

    /**
     * Met à jour une opération.
     * @param {number} id - L'ID de l'opération.
     * @param {object} data - Les données à mettre à jour.
     * @returns {Promise<boolean>} - True si la mise à jour a réussi.
     */
    async update(id, data) {
        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (this.updatableFields.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        const fields = Object.keys(dataToUpdate);
        const values = Object.values(dataToUpdate);

        if (fields.length === 0) {
            return false;
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        values.push(id);

        const [result] = await db.query(
            `UPDATE ${TABLE_NAME} SET ${setClause} WHERE ${PRIMARY_KEY} = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    /**
     * Supprime une opération par son ID.
     * @param {number} id
     * @returns {Promise<boolean>} - True si la suppression a réussi.
     */
    async deleteById(id) {
        const [result] = await db.query(`DELETE FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [id]);
        return result.affectedRows > 0;
    }

    // --- Méthodes de Recherche Spécifiques ---

    /**
     * Méthode de recherche universelle pour les opérations (version simple).
     * @param {object} filters - Un objet contenant les filtres.
     * @returns {Promise<Operation[]>}
     */
    async find(filters = {}) {
        const { id_circuit_execution, type, id_utilisateur_concerne, id_utilisateur_effectuant } = filters;

        let query = `SELECT * FROM ${TABLE_NAME}`;
        const conditions = [];
        const params = [];

        // Construction de la clause WHERE de manière sécurisée
        if (id_circuit_execution) {
            conditions.push('id_circuit_execution = ?');
            params.push(id_circuit_execution);
        }
        if (type) {
            conditions.push('type = ?');
            params.push(type);
        }
        if (id_utilisateur_concerne) {
            conditions.push('id_utilisateur_concerne = ?');
            params.push(id_utilisateur_concerne);
        }
        if (id_utilisateur_effectuant) {
            conditions.push('id_utilisateur_effectuant = ?');
            params.push(id_utilisateur_effectuant);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        return rows.map(this.mapRowToModel);
    }

    // --- Méthodes de Recherche Détaillée (Adaptées de vos anciens Repositories) ---

    /**
     * Méthode interne pour construire la requête de recherche détaillée (JOINs).
     * @returns {string}
     */
    _getDetailedSelectQuery() {
        return `
            SELECT
                o.id_operation, o.type, o.quantite, o.id_circuit_execution,
                concerne.id_user AS concerneId, concerne.nom AS concerneNom,
                effectuant.id_user AS effectuantId, effectuant.nom AS effectuantNom,
                p.id_produit AS produitId, p.nom AS produitNom,
                d.jour AS dateOperation, d.periode AS periode
            FROM
                ${TABLE_NAME} AS o
            LEFT JOIN user AS concerne ON o.id_utilisateur_concerne = concerne.id_user
            LEFT JOIN user AS effectuant ON o.id_utilisateur_effectuant = effectuant.id_user
            LEFT JOIN produit AS p ON o.id_produit = p.id_produit
            LEFT JOIN dim_date AS d ON o.id_date = d.id_date
        `;
    }

    /**
     * 🔍 Récupère une opération par son ID avec détails.
     * @param {number} id_operation
     * @returns {Promise<object>}
     */
    async findByIdDetail(id_operation) {
        const query = this._getDetailedSelectQuery() + ` WHERE o.${PRIMARY_KEY} = ?`;
        const [rows] = await db.query(query, [id_operation]);
        return rows[0];
    }

    /**
     * Méthode interne pour exécuter la recherche détaillée avec critères et dates.
     * @param {object} criteria - Critères de recherche (ex: { 'o.id_utilisateur_concerne': 1 }).
     * @param {string} [dateDebut] - Date de début (YYYY-MM-DD).
     * @param {string} [dateFin] - Date de fin (YYYY-MM-DD).
     * @returns {Promise<object[]>}
     */
    async _findDetailed(criteria, dateDebut, dateFin) {
        const criteriaKeys = Object.keys(criteria);
        if (criteriaKeys.length === 0) {
            throw new Error("La recherche détaillée nécessite au moins un critère.");
        }

        const whereClause = criteriaKeys.map(key => `${key} = ?`).join(' AND ');
        const params = Object.values(criteria);

        let sql = this._getDetailedSelectQuery() + ` WHERE ${whereClause}`;

        // Ajout des filtres de date (en supposant que dim_date a une colonne 'jour')
        if (dateDebut) {
            sql += ` AND d.jour >= ?`;
            params.push(dateDebut);
        }
        if (dateFin) {
            sql += ` AND d.jour <= ?`;
            params.push(dateFin);
        }

        sql += ` ORDER BY d.jour DESC`;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    /**
     * Récupère les opérations détaillées pour un utilisateur concerné (client/producteur).
     * @param {number} id_utilisateur_concerne - L'ID de l'utilisateur.
     * @param {string} [dateDebut]
     * @param {string} [dateFin]
     * @returns {Promise<object[]>}
     */
    async getByUtilisateurConcerneDetailed(id_utilisateur_concerne, dateDebut, dateFin) {
        return this._findDetailed({ 'o.id_utilisateur_concerne': id_utilisateur_concerne }, dateDebut, dateFin);
    }

    /**
     * Récupère les opérations détaillées pour un utilisateur effectuant (livreur/conducteur).
     * @param {number} id_utilisateur_effectuant - L'ID de l'utilisateur.
     * @param {string} [dateDebut]
     * @param {string} [dateFin]
     * @returns {Promise<object[]>}
     */
    async getByUtilisateurEffectuantDetailed(id_utilisateur_effectuant, dateDebut, dateFin) {
        return this._findDetailed({ 'o.id_utilisateur_effectuant': id_utilisateur_effectuant }, dateDebut, dateFin);
    }
    /**
     * Récupère les opérations détaillées pour un rôle spécifique (producteur/conducteur/client/livreur),
     * avec un filtre optionnel par période de dates.
     * @param {string} roleType - Le type de rôle à filtrer ('concerne' ou 'effectuant').
     * @param {number} id_user - L'ID de l'utilisateur.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<object[]>} Un tableau des opérations correspondantes.
     */
    async getByRoleAndDateRange(roleType, id_user, dateDebut, dateFin) {
        let userIdColumn;

        // Déterminer la colonne à utiliser en fonction du rôle
        if (roleType === 'client') {
            userIdColumn = 'o.id_client';
        } else if (roleType === 'client') {
            userIdColumn = 'o.id_utilisateur_effectuant';
        } else {
            throw new Error("Le type de rôle doit être 'concerne' ou 'effectuant'.");
        }

        // 1. On commence avec la requête de base et les paramètres de base.
        let sql = `
            SELECT
                o.id_operation, o.type, o.quantite,
                o.id_utilisateur_concerne, o.id_utilisateur_effectuant,
                p.nom AS produitNom,
                d.jour, d.mois, d.annee, d.jour_semaine
            FROM operation AS o
            JOIN dim_date AS d ON o.id_date = d.id_date
            JOIN produit AS p ON o.id_produit = p.id_produit
            WHERE ${userIdColumn} = ?
        `;
        const params = [id_user];

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
        const [rows] = await db.query(sql, params);

        return rows;
    }
}

module.exports = new OperationRepository();
