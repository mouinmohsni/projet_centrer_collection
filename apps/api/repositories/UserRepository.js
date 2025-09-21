const db = require('../models/db');
const User = require('../models/User');
const Voiture = require('../models/Voiture')



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
        const { nom, email, mot_de_passe, adresse, id_role, longitude, latitude,created_by,updated_by } = userData;
        const [result] = await db.query(
            `INSERT INTO user (nom, email, mot_de_passe, adresse, id_role, longitude, latitude,created_by,updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`,
            [nom, email, mot_de_passe, adresse, id_role, longitude, latitude,created_by,updated_by]
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
     * @param {number} id
     * @param {object} data - Les champs à mettre à jour.
     * @returns {Promise<boolean>}
     */
    // async update(id_user, userData) {
    //     // On ne met à jour que les champs fournis.
    //     // C'est une approche plus flexible pour les mises à jour partielles.
    //     const [currentUser] = await db.query(`SELECT * FROM user WHERE id_user = ?`, [id_user]);
    //     if (!currentUser.length) return false;
    //
    //     const updatedData = { ...currentUser[0], ...userData };
    //
    //     const { nom, email, adresse, id_role, longitude, latitude } = updatedData;
    //     const [result] = await db.query(
    //         `UPDATE user SET nom = ?, email = ?, adresse = ?, id_role = ?, longitude = ?, latitude = ?
    //          WHERE id_user = ?`,
    //         [nom, email, adresse, id_role, longitude, latitude, id_user]
    //     );
    //     return result.affectedRows > 0;
    // }

    async update(id, data) {
        const updatableFields = ['nom', 'email','mot_de_passe','telephone' ,'adresse', 'id_role', 'longitude', 'latitude','updated_by'];

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
            `UPDATE user SET ${setClause} WHERE id_user = ?`,
            values
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
    /**
     * Récupère tous les véhicules conduits par un utilisateur spécifique.
     * @param {number} id_user - L'ID de l'utilisateur (conducteur).
     * @returns {Promise<Voiture[]>} Un tableau des véhicules conduits par l'utilisateur.
     */
    async findVehiclesByUserId(id_user) {
        const [rows] = await db.query(
            `SELECT * FROM voiture WHERE id_conducteur = ?`,
            [id_user]
        );

        // On mappe chaque ligne de résultat en une instance de la classe Voiture
        return rows.map(row => new Voiture(row));
    }

    async findUserRoleById ( userId){
        const [rows] = await db.query(
            `SELECT u.*, r.libelle AS role FROM user AS u
            JOIN collection_db.role r on u.id_role = r.id_role
         WHERE id_user = ?`,
            [userId]
        )
        return rows[0];
    }
}

// On exporte une instance unique (Singleton)
module.exports = new UserRepository();
