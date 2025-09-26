const db = require('../models/db');

class BaseRepository {
    /**
     * @param {string} tableName - Le nom de la table pour ce repository.
     * @param {string} primaryKey - Le nom de la colonne de la clé primaire.
     */
    constructor(tableName, primaryKey = 'id') {
        if (!tableName) {
            throw new Error('Le nom de la table est requis pour le BaseRepository.');
        }
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }



    /**
     * Met à jour dynamiquement une ligne par son ID.
     * @param {number} id - La valeur de la clé primaire de la ligne à mettre à jour.
     * @param {object} data - Les nouvelles données.
     * @param {string[]} updatableFields - La liste des champs qui ont le droit d'être modifiés.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id, data, updatableFields) {
        if (!updatableFields || updatableFields.length === 0) {
            throw new Error("La liste des champs modifiables ('updatableFields') est requise pour la mise à jour.");
        }

        // 1. Filtrer l'objet 'data' pour ne garder que les champs autorisés.
        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (updatableFields.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        const fields = Object.keys(dataToUpdate);
        const values = Object.values(dataToUpdate);

        // Si aucune donnée valide n'a été fournie, on ne fait rien.
        if (fields.length === 0) {
            console.warn("Aucun champ valide à mettre à jour.");
            return false;
        }

        // 2. Construire la clause SET dynamiquement.
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        // 3. Ajouter l'ID à la fin du tableau de valeurs pour la clause WHERE.
        values.push(id);

        // 4. Exécuter la requête.
        const [result] = await db.execute(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    /**
     * Récupère une ligne par son ID.
     * @param {number} id - La valeur de la clé primaire.
     * @returns {Promise<object|null>}
     */
    async findById_raw(id) {
        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
            [id]
        );
        return rows[0] || null;
    }

    /**
     * Supprime une ligne par son ID.
     * @param {number} id - La valeur de la clé primaire.
     * @returns {Promise<boolean>}
     */
    async deleteById(id) {
        const [result] = await db.query(
            `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Récupère toutes les lignes d'une table.
     * @returns {Promise<object[]>}
     */
    async getAll_raw() {
        const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    /**
     * Met à jour dynamiquement une ligne par son ID.
     * @param {number} id - La valeur de la clé primaire de la ligne à mettre à jour.
     * @param {object} data - Les nouvelles données.
     * @param {string[]} updatableField - La liste des champs qui ont le droit d'être modifiés.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async updateConnexion(id, data, updatableField) {
        const Connexion=db;
        if (!updatableField || updatableField.length === 0) {
            throw new Error("La liste des champs modifiables ('updatableFields') est requise pour la mise à jour.");
        }

        // 1. Filtrer l'objet 'data' pour ne garder que les champs autorisés.
        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (updatableField.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        const fields = Object.keys(dataToUpdate);
        const values = Object.values(dataToUpdate);

        // Si aucune donnée valide n'a été fournie, on ne fait rien.
        if (fields.length === 0) {
            console.warn("Aucun champ valide à mettre à jour.");
            return false;
        }

        // 2. Construire la clause SET dynamiquement.
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        // 3. Ajouter l'ID à la fin du tableau de valeurs pour la clause WHERE.
        values.push(id);

        // 4. Exécuter la requête.
        const [result] = await Connexion.execute(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`,
            values
        );

        return result.affectedRows > 0;
    }
}

module.exports = BaseRepository;
