const db = require('./db');
class CircuitExecution{
    constructor(id_execution,id_circuit,id_date,id_vehicule,km_parcouru) {
        this.id_execution = id_execution ;
        this.id_circuit = id_circuit ;
        this.id_date = id_date ;
        this.id_vehicule = id_vehicule ;
        this.km_parcouru = km_parcouru ;

    }

    // ➕ Créer une nouvelle exécution
    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO circuit_execution (id_circuit, id_date, id_vehicule, km_parcouru)
           VALUES (?, ?, ?, ?)`,
                [data.id_circuit, data.id_date, data.id_vehicule, data.km_parcouru]
            );
            return result.insertId;

        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer une exécution par ID
    static async getById(id_execution) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_execution WHERE id_execution = ?`,
            [id_execution]
        );
        return rows[0] || null;
    }

    // 📋 Lister toutes les exécutions
    static async getAll() {
        try {

            const [rows] = await db.query(`SELECT * FROM circuit_execution`);
            return rows;
        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📅 Lister toutes les exécutions d’un circuit
    static async getByCircuit(id_circuit) {
        try {

            const [rows] = await db.query(
                `SELECT * FROM circuit_execution WHERE id_circuit = ?`,
                [id_circuit]
            );
            return rows;
        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ✏️ Mettre à jour une exécution
    static async update(id_execution, data) {
        try {

            await db.query(
                `UPDATE circuit_execution
           SET id_circuit = ?, id_date = ?, id_vehicule = ?, km_parcouru = ?
           WHERE id_execution = ?`,
                [
                    data.id_circuit,
                    data.id_date,
                    data.id_vehicule,
                    data.km_parcouru,
                    id_execution
                ]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une exécution
    static async delete(id_execution) {
        try {

            await db.query(
                `DELETE FROM circuit_execution WHERE id_execution = ?`,
                [id_execution]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🚛 Récupérer les infos véhicule + circuit liés à une exécution
    static async getDetails(id_execution) {
        try {

            const [rows] = await db.query(
                `SELECT ce.*, v.immatriculation, c.nom AS nom_circuit
           FROM circuit_execution ce
           JOIN vehicule v ON ce.id_vehicule = v.id_vehicule
           JOIN circuit c ON ce.id_circuit = c.id_circuit
           WHERE ce.id_execution = ?`,
                [id_execution]
            );
            return rows[0] || null;
        }catch (e) {
            console.error('Erreur DB dans circuit exécution :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}
module.exports = CircuitExecution ;