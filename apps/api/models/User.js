const db = require('./db');
const bcrypt = require('bcrypt');
class User{
    constructor(id_user,nom,email,mot_de_passe,adresse,id_role,longitude = null, latitude = null){
        this.id_user = id_user;
        this.nom = nom ;
        this.email = email ;
        this.mot_de_passe = mot_de_passe ;
        this.adresse = adresse ;
        this.id_role = id_role ;
        this.longitude = longitude;
        this.latitude = latitude;
    }
    // ➕ Créer un utilisateur avec mot de passe crypté
    static async create({ nom, email, mot_de_passe, adresse, id_role, longitude = null, latitude = null }) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // 10 rounds de salage
        try {
            const [result] = await db.execute(
                `INSERT INTO user (nom, email, mot_de_passe, adresse, id_role, longitude, latitude)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nom, email, hashedPassword, adresse, id_role, longitude, latitude]
            );
            return new User(result.insertId, nom, email, hashedPassword, adresse, id_role, longitude, latitude);
        }catch (e) {
            console.error('Erreur DB dans user.create :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un utilisateur par ID
    static async findById(id_user) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM user WHERE id_user = ?`,
                [id_user]
            );
            if (!rows.length) return null;
            const row = rows[0];
            return new User(row.id_user, row.nom, row.email, row.mot_de_passe, row.adresse, row.id_role, row.longitude, row.latitude);
        }catch (e) {
            console.error('Erreur DB dans user.findById :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour un utilisateur (mot de passe facultatif)
    async update({ nom, email, mot_de_passe = null, adresse, id_role, longitude, latitude }) {
        let hashedPassword = this.mot_de_passe;
        if (mot_de_passe) {
                hashedPassword = await bcrypt.hash(mot_de_passe, 10);
                this.mot_de_passe = hashedPassword;
        }
        this.nom = nom;
        this.email = email;
        this.adresse = adresse;
        this.id_role = id_role;
        this.longitude = longitude;
        this.latitude = latitude;
        try {
            await db.execute(
                `UPDATE user SET nom = ?, email = ?, mot_de_passe = ?, adresse = ?, id_role = ?, longitude = ?, latitude = ? WHERE id_user = ?`,
                [this.nom, this.email, hashedPassword, this.adresse, this.id_role, this.longitude, this.latitude, this.id_user]
            );
        }catch (e) {
            console.error('Erreur DB dans user.update :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un utilisateur
    async delete() {
        try {
            await db.execute(
                `DELETE FROM user WHERE id_user = ?`,
                [this.id_user]
            );
        }catch (e) {
            console.error('Erreur DB dans user.delete :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer tous les utilisateurs
    static async getAll() {
        try {
            const [rows] = await db.execute(`SELECT * FROM user ORDER BY nom`);
            return rows.map(row => new User(row.id_user, row.nom, row.email, row.mot_de_passe, row.adresse, row.id_role, row.longitude, row.latitude));
        }catch (e) {
            console.error('Erreur DB dans user.getAll :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔑 Vérifier le mot de passe
    async verifyPassword(password) {
        return await bcrypt.compare(password, this.mot_de_passe);
    }
}
module.exports =  User ;