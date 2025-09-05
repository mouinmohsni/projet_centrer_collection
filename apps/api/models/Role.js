const db = require('./db');
class Role{
    constructor(id_role,libelle) {
        this.id_role = id_role;
        this.libelle = libelle;
    }

    // ➕ Créer un rôle
    static async create(libelle) {
        try {
        const [result] = await db.execute(
            `INSERT INTO role (libelle) VALUES (?)`,
            [libelle]
        );
        return new Role(result.insertId, libelle);
        }catch (e) {
            console.error('Erreur DB dans Role.create :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un rôle par ID
    static async findById(id_role) {
        try {

            const [rows] = await db.execute(
                `SELECT * FROM role WHERE id_role = ?`,
                [id_role]
            );
            if (!rows.length) return null;
            const row = rows[0];
            return new Role(row.id_role, row.libelle);
        } catch (e) {
        console.error('Erreur DB dans Role :', e);
        throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour un rôle
    async update(libelle) {
        this.libelle = libelle;
        try {
            await db.execute(
                `UPDATE role SET libelle = ? WHERE id_role = ?`,
                [libelle, this.id_role]
            );
        }catch (e) {
            console.error('Erreur DB dans Role :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un rôle
    async delete() {
        try {
            await db.execute(
                `DELETE FROM role WHERE id_role = ?`,
                [this.id_role]
            );
        }catch (e) {
            console.error('Erreur DB dans Role :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer tous les rôles
    static async getAll() {
        try {
            const [rows] = await db.execute(`SELECT * FROM role ORDER BY libelle`);
            return rows.map(row => new Role(row.id_role, row.libelle));
        }catch (e) {
            console.error('Erreur DB dans Role :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}
module.exports =  Role ;