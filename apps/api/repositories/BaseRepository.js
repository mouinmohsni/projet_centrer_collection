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


    // Dans BaseRepository.js

    // /**
    //  * Crée une nouvelle ligne dans la table avec les données fournies.
    //  * @param {object} data - Un objet où les clés sont les noms des colonnes et les valeurs sont les données à insérer.
    //  * @returns {Promise<number>} - L'ID de la ligne nouvellement créée.
    //  */
    // async create(data) {
    //     // 1. Obtenir la liste des colonnes à partir des clés de l'objet 'data'.
    //     // C'est la partie la plus simple.
    //     const columns = Object.keys(data);
    //
    //     // 2. Obtenir la liste des valeurs correspondantes.
    //     // L'ordre est garanti d'être le même que celui des clés.
    //     const values = Object.values(data);
    //
    //     // Si l'objet 'data' est vide, il n'y a rien à insérer.
    //     if (columns.length === 0) {
    //         throw new Error("Impossible de créer une ligne avec des données vides.");
    //     }
    //
    //     // 3. Construire la liste des "placeholders" (?) pour la requête préparée.
    //     // Pour chaque colonne, nous ajoutons un '?' à la liste.
    //     // Ex: ['col1', 'col2'] => '?, ?'
    //     const placeholders = columns.map(() => '?').join(', ');
    //
    //     // 4. Construire la liste des colonnes pour la requête SQL.
    //     // Ex: ['col1', 'col2'] => 'col1, col2'
    //     const columnNames = columns.join(', ');
    //
    //     // 5. Assembler la requête SQL finale.
    //     const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders})`;
    //
    //     // 6. Exécuter la requête avec le tableau de valeurs.
    //     // db.execute s'assurera que chaque '?' est remplacé de manière sécurisée par une valeur du tableau.
    //     const [result] = await db.execute(query, values);
    //
    //     // 7. Renvoyer l'ID de l'enregistrement qui vient d'être créé.
    //     return result.insertId;
    // }




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
}

module.exports = BaseRepository;
