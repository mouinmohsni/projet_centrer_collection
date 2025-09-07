const db = require('../models/db');
const User = require('../models/User');


class UserRepository {

    /**
     * Transforme une ligne de la base de données en une instance de User.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {User | null}
     */
    mapRowToModel(row) {
        if (!row) return null;
        // Important : on ne veut jamais que le hash du mot de passe se promène dans l'application.
        // On le supprime de l'objet qui sera utilisé par les services et contrôleurs.
        const { mot_de_passe, ...userProps } = row;
        return new User(userProps);
    }

    /**
     * Crée un nouvel utilisateur.
     * Note : Le hashage du mot de passe doit être fait dans le SERVICE avant d'appeler cette méthode.
     * @param {object} userData - Données de l'utilisateur (avec mot de passe déjà hashé).
     * @returns {Promise<number>} L'ID du nouvel utilisateur.
     */
    async create(userData) {
        const { nom, email, mot_de_passe, adresse, id_role, longitude, latitude } = userData;
        const [result] = await db.query(
            `INSERT INTO user (nom, email, mot_de_passe, adresse, id_role, longitude, latitude)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom, email, mot_de_passe, adresse, id_role, longitude, latitude]
        );
        return result.insertId;
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param {number} id_user
     * @returns {Promise<User|null>}
     */
    async findById(id_user) {
        const [rows] = await db.query(`SELECT * FROM user WHERE id_user = ?`, [id_user]);
        return this.mapRowToModel(rows[0]);
    }

    /**
     * Récupère un utilisateur par son telephone.
     * Cette méthode est spéciale car elle est souvent utilisée pour l'authentification,
     * donc elle peut retourner l'objet complet de la BDD (avec le hash du mdp).
     * @param {number} telephone
     * @returns {Promise<object|null>} L'enregistrement brut de la BDD.
     */
    async findByEmail(telephone) {
        const [rows] = await db.query(`SELECT * FROM user WHERE email = ?`, [telephone]);
        return rows[0] || null;
    }

    /**
     * Récupère tous les utilisateurs.
     * @returns {Promise<User[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM user`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * Met à jour un utilisateur.
     * @param {number} id_user
     * @param {object} userData - Les champs à mettre à jour.
     * @returns {Promise<boolean>}
     */
    async update(id_user, userData) {
        // On ne met à jour que les champs fournis.
        // C'est une approche plus flexible pour les mises à jour partielles.
        const [currentUser] = await db.query(`SELECT * FROM user WHERE id_user = ?`, [id_user]);
        if (!currentUser.length) return false;

        const updatedData = { ...currentUser[0], ...userData };

        const { nom, email, adresse, id_role, longitude, latitude } = updatedData;
        const [result] = await db.query(
            `UPDATE user SET nom = ?, email = ?, adresse = ?, id_role = ?, longitude = ?, latitude = ?
             WHERE id_user = ?`,
            [nom, email, adresse, id_role, longitude, latitude, id_user]
        );
        return result.affectedRows > 0;
    }

    /**
     * Supprime un utilisateur.
     * @param {number} id_user
     * @returns {Promise<boolean>}
     */
    async delete(id_user) {
        const [result] = await db.query(`DELETE FROM user WHERE id_user = ?`, [id_user]);
        return result.affectedRows > 0;
    }
}

// On exporte une instance unique (Singleton)
module.exports = new UserRepository();
