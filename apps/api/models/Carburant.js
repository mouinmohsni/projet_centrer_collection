const db = require('./db');
class Carburant{
    constructor(id_carburant,id_vehicule,id_date,quantite,cout) {
        this.id_carburant = id_carburant ;
        this.id_vehicule = id_vehicule ;
        this.id_date = id_date ;
        this.quantite = quantite ;
        this.cout = cout ;

    }
    // ➕ Ajouter un enregistrement de carburant
    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO carburant (id_vehicule, id_date, quantite, cout) 
           VALUES (?, ?, ?, ?)`,
                [data.id_vehicule, data.id_date, data.quantite, data.cout]
            );
            return result.insertId;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un enregistrement par ID
    static async getById(id_carburant) {
        try {
        const [rows] = await db.query(
            `SELECT * FROM carburant WHERE id_carburant = ?`,
            [id_carburant]
        );
        return rows[0] || null;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📋 Récupérer tout l’historique carburant
    static async getAll() {
        try {

        const [rows] = await db.query(`SELECT * FROM carburant`);
        return rows;
        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📋 Récupérer l’historique carburant d’un véhicule
    static async getByVehicule(id_vehicule) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM carburant WHERE id_vehicule = ?`,
                [id_vehicule]
            );
            return rows;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ✏️ Mettre à jour un enregistrement
    static async update(id_carburant, data) {
        try {
            await db.query(
                `UPDATE carburant 
           SET id_vehicule = ?, id_date = ?, quantite = ?, cout = ?
           WHERE id_carburant = ?`,
                [data.id_vehicule, data.id_date, data.quantite, data.cout, id_carburant]
            );
            return true;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un enregistrement
    static async delete(id_carburant) {
        try {
            await db.query(
                `DELETE FROM carburant WHERE id_carburant = ?`,
                [id_carburant]
            );
            return true;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ⛽ Récupérer la consommation totale d’un véhicule
    static async getTotalQuantiteByVehicule(id_vehicule) {
        try {
        const [rows] = await db.query(
            `SELECT SUM(quantite) AS total_quantite 
       FROM carburant WHERE id_vehicule = ?`,
            [id_vehicule]
        );
        return rows[0]?.total_quantite || 0;

        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 💰 Récupérer le coût total de carburant pour un véhicule
    static async getTotalCoutByVehicule(id_vehicule) {
        try {

            const [rows] = await db.query(
                `SELECT SUM(cout) AS total_cout 
           FROM carburant WHERE id_vehicule = ?`,
                [id_vehicule]
            );
            return rows[0]?.total_cout || 0;
        }catch (e) {
            console.error('Erreur DB dans carburant :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}

module.exports = Carburant ;