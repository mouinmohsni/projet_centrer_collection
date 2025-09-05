const db = require('./db');
class Produit{
    constructor(id_produit,nom,unite) {
        this.id_produit = id_produit ;
        this.nom = nom ;
        this.unite = unite ;

    }
    // ➕ Créer un produit
    static async create(nom, unite) {
        try {
            const [result] = await db.execute(
                `INSERT INTO produit (nom, unite) VALUES (?, ?)`,
                [nom, unite]
            );
            return new Produit(result.insertId, nom, unite);
        }catch (e) {
            console.error('Erreur DB dans Produit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un produit par ID
    static async findById(id_produit) {
        try {
        const [rows] = await db.execute(
            `SELECT * FROM produit WHERE id_produit = ?`,
            [id_produit]
        );
        if (!rows.length) return null;
        const row = rows[0];
        return new Produit(row.id_produit, row.nom, row.unite);
        }catch (e) {
            console.error('Erreur DB dans Produit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour un produit
    async update(nom, unite) {
        this.nom = nom;
        this.unite = unite;
        try {
            await db.execute(
                `UPDATE produit SET nom = ?, unite = ? WHERE id_produit = ?`,
                [nom, unite, this.id_produit]
            );
        }catch (e) {
            console.error('Erreur DB dans Produit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un produit
    async delete() {
        try {
            await db.execute(
                `DELETE FROM produit WHERE id_produit = ?`,
                [this.id_produit]
            );
        }catch (e) {
            console.error('Erreur DB dans Produit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer tous les produits
    static async getAll() {
        try{
        const [rows] = await db.execute(`SELECT * FROM produit ORDER BY nom`);
        return rows.map(row => new Produit(row.id_produit, row.nom, row.unite));
        }catch (e) {
            console.error('Erreur DB dans Produit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}

module.exports =  Produit