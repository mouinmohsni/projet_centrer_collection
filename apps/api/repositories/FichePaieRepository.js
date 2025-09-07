const db = require('../models/db');

class FichePaieRepository {
    constructor(id_fiche,id_user,id_date,salaire_base,prime,retenue,net_paye) {

        this.id_fiche = id_fiche ;
        this.id_user = id_user ;
        this.id_date = id_date ;
        this.salaire_base = salaire_base ;
        this.prime = prime ;
        this.retenue = retenue;
        this.net_paye = net_paye;
    }

    // ➕ Créer une fiche de paie
    static async create(id_user, id_date, salaire_base, prime = 0, retenue = 0) {
        const net_paye = salaire_base + prime - retenue;
        try {
            const [result] = await db.execute(
                `INSERT INTO fiche_paie (id_user, id_date, salaire_base, prime, retenue)
                 VALUES (?, ?, ?, ?, ?)`,
                [id_user, id_date, salaire_base, prime, retenue]
            );
            return new FichePaieRepository(result.insertId, id_user, id_date, salaire_base, prime, retenue, net_paye);

        }catch (e) {
            console.error('Erreur DB dans paie :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer une fiche par ID
    static async findById(id_fiche) {
        try {
        const [rows] = await db.execute(
            `SELECT * FROM fiche_paie WHERE id_fiche = ?`,
            [id_fiche]
        );
        if (!rows.length) return null;
        const row = rows[0];
        return new FichePaieRepository(row.id_fiche, row.id_date, row.id_date, row.salaire_base, row.prime, row.deductions, row.salaire_net);

        }catch (e) {
            console.error('Erreur DB dans paie :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour une fiche
    async update(salaire_base, prime, retenue) {
        this.salaire_base = salaire_base;
        this.prime = prime;
        this.retenue = retenue;
        this.net_paye = salaire_base + prime - retenue;
        try {
            await db.execute(
                `UPDATE fiche_paie SET salaire_base = ?, prime = ?, retenue = ?, net_paye = ? WHERE id_fiche = ?`,
                [this.salaire_base, this.prime, this.retenue, this.net_paye, this.id_fiche]
            );
        }catch (e) {
            console.error('Erreur DB dans paie :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une fiche
    async delete() {
        try {
            await db.execute(`DELETE FROM fiche_paie WHERE id_fiche = ?`, [this.id_fiche]);
        }catch (e) {
            console.error('Erreur DB dans paie :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer toutes les fiches d’un employé
    static async getByUser(id_user) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM fiche_paie WHERE id_user = ? ORDER BY id_date DESC`,
                [id_user]
            );
            return rows.map(row => new FichePaieRepository(row.id_fiche, row.id_user, row.id_date, row.salaire_base, row.prime, row.retenue, row.net_paye));
        }catch (e) {
            console.error('Erreur DB dans paie :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }



}
module.exports = FichePaieRepository