const db = require('./db');
class Livraison{
    constructor(id_livraison,id_user,id_produit,id_date,quantite) {
        this.id_livraison = id_livraison ;
        this.id_user = id_user ;
        this.id_produit = id_produit ;
        this.id_date = id_date ;
        this.quantite = quantite ;

    }

    // ➕ Créer une livraison
    static async create(id_user, id_produit, id_date, quantite) {
        try {
            const [result] = await db.execute(
                `INSERT INTO livraison (id_user, id_produit, id_date, quantite)
                 VALUES (?, ?, ?, ?)`,
                [id_user, id_produit, id_date, quantite]
            );
            return new Livraison(result.insertId, id_user, id_produit, id_date, quantite);

        }catch (e) {
            console.error('Erreur DB dans livraison :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer une livraison par ID
    static async findById(id_livraison) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM livraison WHERE id_livraison = ?`,
                [id_livraison]
            );
            if (!rows.length) return null;
            const row = rows[0];
            return new Livraison(row.id_livraison, row.id_user, row.id_produit, row.id_date, row.quantite);

        }catch (e) {
            console.error('Erreur DB dans livraison :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour une livraison
    async update(quantite) {
        this.quantite = quantite;
        try {
            await db.execute(
                `UPDATE livraison SET quantite = ? WHERE id_livraison = ?`,
                [this.quantite, this.id_livraison]
            );

        }catch (e) {
            console.error('Erreur DB dans livraison :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une livraison
    async delete() {
        try {
            await db.execute(
                `DELETE FROM livraison WHERE id_livraison = ?`,
                [this.id_livraison]
            );

        }catch (e) {
            console.error('Erreur DB dans livraison :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer toutes les livraisons d’un utilisateur
    static async getByUser(id_user) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM livraison WHERE id_user = ? ORDER BY id_date DESC`,
                [id_user]
            );
            return rows.map(row => new Livraison(row.id_livraison, row.id_user, row.id_produit, row.id_date, row.quantite));

        }catch (e) {
            console.error('Erreur DB dans livraison :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}

module.exports = Livraison ;