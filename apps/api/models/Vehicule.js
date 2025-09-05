const db = require('./db');

class Vehicule{

    constructor(id_vehicule,immatriculation,capacite,refrigerateur,km_total,km_prochain_vidange,etat,id_conducteur) {
        this.id_vehicule = id_vehicule;
        this.immatriculation = immatriculation;
        this.capacite = capacite ;
        this.refrigerateur = refrigerateur ;
        this.km_total = km_total ;
        this.km_prochain_vidange = km_prochain_vidange ;
        this.etat = etat;
        this.id_conducteur = id_conducteur ;

    }

    // ➕ Créer un véhicule
    static async create({ immatriculation, capacite, refrigerateur = false, km_total = 0, km_prochain_vidange = null, etat = 'en_service', id_conducteur = null }) {
        try {
            const [result] = await db.execute(
                `INSERT INTO vehicule (immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur]
            );
        }catch (e) {
            console.error('Erreur DB dans Vehicule.create :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un véhicule par ID
    static async findById(id_vehicule) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM vehicule WHERE id_vehicule = ?`,
                [id_vehicule]
            );
            if (!rows.length) return null;
            const row = rows[0];
            return new Vehicule(row.id_vehicule, row.immatriculation, row.capacite, row.refrigerateur, row.km_total, row.km_prochain_vidange, row.etat, row.id_conducteur);

        }catch (e) {
            console.error('Erreur DB dans Vehicule.findById :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🔄 Mettre à jour un véhicule
    async update({ immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur }) {
        this.immatriculation = immatriculation ?? this.immatriculation;
        this.capacite = capacite ?? this.capacite;
        this.refrigerateur = refrigerateur ?? this.refrigerateur;
        this.km_total = km_total ?? this.km_total;
        this.km_prochain_vidange = km_prochain_vidange ?? this.km_prochain_vidange;
        this.etat = etat ?? this.etat;
        this.id_conducteur = id_conducteur ?? this.id_conducteur;

        try {
            await db.execute(
                `UPDATE vehicule SET immatriculation = ?, capacite = ?, refrigerateur = ?, km_total = ?, km_prochain_vidange = ?, etat = ?, id_conducteur = ? WHERE id_vehicule = ?`,
                [this.immatriculation, this.capacite, this.refrigerateur, this.km_total, this.km_prochain_vidange, this.etat, this.id_conducteur, this.id_vehicule]
            );
        }catch (e) {
            console.error('Erreur DB dans Vehicule.update :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un véhicule
    async delete() {
        try {
            await db.execute(
                `DELETE FROM vehicule WHERE id_vehicule = ?`,
                [this.id_vehicule]
            );
        }catch (e) {
            console.error('Erreur DB dans Vehicule.delete :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔹 Récupérer tous les véhicules
    static async getAll() {
        try {
            const [rows] = await db.execute(`SELECT * FROM vehicule ORDER BY immatriculation`);
            return rows.map(row => new Vehicule(row.id_vehicule, row.immatriculation, row.capacite, row.refrigerateur, row.km_total, row.km_prochain_vidange, row.etat, row.id_conducteur));
        }catch (e) {
            console.error('Erreur DB dans Vehicule.getAll :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔧 Ajouter du kilométrage
    async addKm(km) {
        this.km_total += km;
        try {
            await db.execute(`UPDATE vehicule SET km_total = ? WHERE id_vehicule = ?`, [this.km_total, this.id_vehicule]);
        }catch (e) {
            console.error('Erreur DB dans Vehicule.addKm :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🚨 Vérifier si vidange nécessaire
    needsVidange() {
        return this.km_prochain_vidange !== null && this.km_total >= this.km_prochain_vidange;
    }
}

module.exports = Vehicule ;