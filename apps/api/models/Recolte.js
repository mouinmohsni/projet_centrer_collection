const db = require('./db');
class Recolte{
    constructor(id_recolte,id_user,id_produit,id_date, quantite) {
        this.id_recolte =id_recolte ;
        this.id_user = id_user ;
        this.id_produit = id_produit ;
        this.id_date = id_date ;
        this.quantite =quantite ;
    }

    // ➕ Créer une récolte
    static async create(id_user, id_produit, id_date, quantite) {
        try {
            const [result] = await db.execute(
                `INSERT INTO recolte (id_user, id_produit, id_date, quantite)
                 VALUES (?, ?, ?, ?)`,
                [id_user, id_produit, id_date, quantite]
            );
            return new Recolte(result.insertId, id_user, id_produit, id_date, quantite);
        }catch (e) {
            console.error('Erreur DB dans Recolte :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer une récolte par ID
    static async findById(id_recolte) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM recolte WHERE id_recolte = ?`,
                [id_recolte]
            );
            if (!rows.length) return null;
            const row = rows[0];
            return new Recolte(row.id_recolte, row.id_user, row.id_produit, row.id_date, row.quantite);
        }catch (e) {
            console.error('Erreur DB dans Recolte :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour une récolte
    async update(quantite) {
        this.quantite = quantite;
        try {
            await db.execute(
                `UPDATE recolte SET quantite = ? WHERE id_recolte = ?`,
                [this.quantite, this.id_recolte]
            );

        }catch (e) {
            console.error('Erreur DB dans Recolte :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une récolte
    async delete() {
        try {
            await db.execute(
                `DELETE FROM recolte WHERE id_recolte = ?`,
                [this.id_recolte]
            );

        }catch (e) {
            console.error('Erreur DB dans Recolte :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer toutes les récoltes d’un utilisateur
    static async getByUser(id_user) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM recolte WHERE id_user = ? ORDER BY id_date DESC`,
                [id_user]
            );
            return rows.map(row => new Recolte(row.id_recolte, row.id_user, row.id_produit, row.id_date, row.quantite));
        }
        catch (e) {
            console.error('Erreur DB dans Recolte :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

}
module.exports =  Recolte ;