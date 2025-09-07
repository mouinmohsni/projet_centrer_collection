const db = require('../models/db');
class FactureRepository {
    constructor(id_facture,id_client,id_date,montant_total,type,statut) {
        this.id_facture = id_facture ;
        this.id_client = id_client ;
        this.id_date =id_date ;
        this.montant_total = montant_total ;
        this.type = type ;
        this.statut =statut ;
    }

    // ➕ Créer une facture
    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO facture (id_client, id_date, montant_total, type, statut) 
           VALUES (?, ?, ?, ?, ?)`,
                [data.id_client, data.id_date, data.montant_total, data.type, data.statut]
            );
            return result.insertId;
        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer une facture par son ID
    static async getById(id_facture) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM facture WHERE id_facture = ?`,
                [id_facture]
            );
            return rows[0] || null;
        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📋 Récupérer toutes les factures
    static async getAll() {
        try {
            const [rows] = await db.query(`SELECT * FROM facture`);
            return rows;

        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📋 Récupérer toutes les factures d’un client
    static async getByClient(id_client) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM facture WHERE id_client = ?`,
                [id_client]
            );
            return rows;

        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ✏️ Mettre à jour une facture
    static async update(id_facture, data) {
        try {
            await db.query(
                `UPDATE facture 
           SET id_client = ?, id_date = ?, montant_total = ?, type = ?, statut = ?
           WHERE id_facture = ?`,
                [
                    data.id_client,
                    data.id_date,
                    data.montant_total,
                    data.type,
                    data.statut,
                    id_facture,
                ]
            );
            return true;

        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une facture
    static async delete(id_facture) {
        try {
        await db.query(`DELETE FROM facture WHERE id_facture = ?`, [id_facture]);
        return true;

        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 💰 Récupérer le total des factures payées / impayées
    static async getTotalByStatut(statut) {
        try{
            const [rows] = await db.query(
                `SELECT SUM(montant_total) AS total 
           FROM facture WHERE statut = ?`,
                [statut]
            );
            return rows[0]?.total || 0;

        }catch (e) {
            console.error('Erreur DB dans facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}

module.exports = FactureRepository ;