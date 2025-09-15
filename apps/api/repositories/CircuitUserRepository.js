const db = require('../models/db');


const CircuitUser = require('../models/CircuitUser');
const User = require('../models/User'); // Nécessaire pour mapper les résultats
const Circuit = require('../models/Circuit'); // Nécessaire pour mapper les résultats

class CircuitUserRepository {

    /**
     * Transforme une ligne de la base de données en une instance de CircuitUser.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {CircuitUser | null}
     */
    mapRowToModel(row) {
        return row ? new CircuitUser(row) : null;
    }

    /**
     * ➕ Crée une nouvelle association entre un circuit et un utilisateur.
     * @param {object} data - Doit contenir id_circuit, id_user, created_by, updated_by.
     * @returns {Promise<number>} L'ID de la nouvelle ligne d'association (id_circuit_user).
     */
    async create(data) {
        const { id_circuit, id_user, created_by, updated_by } = data;
        const [result] = await db.query(
            `INSERT INTO circuit_user (id_circuit, id_user, created_by, updated_by) VALUES (?, ?, ?, ?)`,
            [id_circuit, id_user, created_by, updated_by]
        );
        return result.insertId; // Retourne le nouvel id_circuit_user
    }

    /**
     * 🔍 Récupère les détails complets d'une association par son ID unique.
     * @param {number} id_circuit_user - La clé primaire de la ligne d'association.
     * @returns {Promise<object|null>} Un objet plat avec tous les détails, ou null si non trouvé.
     */
    async findDetailsById(id_circuit_user) { // Renommée pour plus de clarté
        const sql = `
        SELECT
            cu.id_circuit_user,
            cu.created_at,
            cu.updated_at,

            -- Informations sur le Circuit
            c.id_circuit,
            c.nom AS nom_circuit, -- Alias pour le nom du circuit

            -- Informations sur l'Utilisateur principal de l'association
            u.id_user,
            u.nom AS nom_user, -- Alias pour le nom de l'utilisateur

            -- Informations sur l'utilisateur qui a créé l'association
            creator.id_user AS creator_id,
            creator.nom AS creator_nom, -- Alias pour le nom du créateur

            -- Informations sur l'utilisateur qui a mis à jour l'association
            updater.id_user AS updater_id,
            updater.nom AS updater_nom -- Alias pour le nom du modificateur

        FROM
            circuit_user AS cu
        
        -- Jointure pour les détails du circuit
        LEFT JOIN circuit AS c ON cu.id_circuit = c.id_circuit
        
        -- Jointure pour les détails de l'utilisateur principal
        LEFT JOIN user AS u ON cu.id_user = u.id_user
        
        -- DEUXIÈME jointure sur la table USER pour le créateur
        LEFT JOIN user AS creator ON cu.created_by = creator.id_user
        
        -- TROISIÈME jointure sur la table USER pour le modificateur
        LEFT JOIN user AS updater ON cu.updated_by = updater.id_user
        
        WHERE
            cu.id_circuit_user = ?
    `;

        const [rows] = await db.query(sql, [id_circuit_user]);

        // Retourne l'objet plat et enrichi, ou null si rien n'est trouvé.
        return rows[0] || null;
    }


    /**
     * 🔍 Récupère une association par son ID unique.
     * @param {number} id_circuit_user - La clé primaire de la ligne d'association.
     * @returns {Promise<object|null>}
     */
    async findById(id_circuit_user) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_user WHERE id_circuit_user = ?`,
            [id_circuit_user]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔄 Met à jour une association. Utile pour changer l'utilisateur ou le circuit.
     * @param {number} id_circuit_user - L'ID de l'association à mettre à jour.
     * @param {object} data - Les champs à mettre à jour (ex: { id_user: 5, updated_by: 1 }).
     * @returns {Promise<boolean>}
     */
    async update(id_circuit_user, data) {
        // Liste blanche des champs modifiables
        const updatableFields = ['id_circuit', 'id_user', 'updated_by'];

        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (updatableFields.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        const fields = Object.keys(dataToUpdate);
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(dataToUpdate), id_circuit_user];


        const [result] = await db.execute(
            `UPDATE circuit_user SET ${setClause} WHERE id_circuit_user = ?`,
            values
        )
        return result.affectedRows > 0;
    }


    /**
     * ❌ Supprime une association par son ID unique.
     * @param {number} id_circuit_user - La clé primaire de la ligne d'association.
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_circuit_user) {
        const [result] = await db.query(
            // AMÉLIORÉ : Utilise la nouvelle clé primaire pour plus de simplicité
            `DELETE FROM circuit_user WHERE id_circuit_user = ?`,
            [id_circuit_user]
        );
        return result.affectedRows > 0;
    }



    /**
     * Trouve une association par la combinaison d'un circuit et d'un utilisateur.
     * @param {number} id_circuit
     * @param {number} id_user
     * @returns {Promise<CircuitUser|null>} L'objet d'association ou null.
     */
    async findByCircuitAndUser(id_circuit, id_user) {
        const [rows] = await db.query(
            // C'est bien de sélectionner toutes les colonnes, c'est plus utile
            `SELECT * FROM circuit_user WHERE id_circuit = ? AND id_user = ?`,
            [id_circuit, id_user]
        );
        // On retourne l'objet complet (ou null), ce qui est très utile pour le service.
        return this.mapRowToModel(rows[0]);
    }


    /**
     * 📋 Liste tous les utilisateurs (modèles User) associés à un circuit.
     * @param {number} id_circuit
     * @returns {Promise<User[]>}
     */
    async findUsersByCircuit(id_circuit) {
        const [rows] = await db.query(
            `SELECT u.* 
             FROM circuit_user cu
             JOIN user u ON cu.id_user = u.id_user
             WHERE cu.id_circuit = ?`,
            [id_circuit]
        );
        // On retourne des instances du modèle User
        return rows.map(row => new User(row));
    }

    /**
     * 🚛 Liste tous les circuits (modèles Circuit) associés à un utilisateur.
     * @param {number} id_user
     * @returns {Promise<Circuit[]>}
     */
    async findCircuitsByUser(id_user) {
        const [rows] = await db.query(
            `SELECT c.* 
             FROM circuit_user cu
             JOIN circuit c ON cu.id_circuit = c.id_circuit
             WHERE cu.id_user = ?`,
            [id_user]
        );
        // On retourne des instances du modèle Circuit
        return rows.map(row => new Circuit(row));
    }

    /**
     * supprimer touts les association d'un circuit utilisateur
     * @param {number} id_circuit
     * @returns {Promise<boolean>}
     */
    async deleteAllAssociationsByCircuit(id_circuit) {
        const [result] = await db.query(`DELETE FROM circuit_user WHERE id_circuit = ?`, [id_circuit]);
        return result.affectedRows > 0;
    }


}

// On exporte une instance unique (Singleton)
module.exports = new CircuitUserRepository();
