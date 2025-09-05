const db = require('./db');
class CircuitUser{
    constructor(id_circuit,id_user) {
        this.id_circuit = id_circuit ;
        this.id_user = id_user ;
    }
    // ➕ Associer un utilisateur à un circuit
    static async addUserToCircuit(id_circuit, id_user) {
        try {
            await db.query(
                `INSERT INTO circuit_user (id_circuit, id_user) VALUES (?, ?)`,
                [id_circuit, id_user]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit usercircuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // ❌ Supprimer l’association
    static async removeUserFromCircuit(id_circuit, id_user) {
        try {
            await db.query(
                `DELETE FROM circuit_user WHERE id_circuit = ? AND id_user = ?`,
                [id_circuit, id_user]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit usercircuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 📋 Lister tous les utilisateurs d’un circuit
    static async getUsersByCircuit(id_circuit) {
        try {
            const [rows] = await db.query(
                `SELECT u.* 
       FROM circuit_user cu
       JOIN user u ON cu.id_user = u.id_user
       WHERE cu.id_circuit = ?`,
                [id_circuit]
            );
            return rows;
        }catch (e) {
            console.error('Erreur DB dans circuit usercircuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🚛 Lister tous les circuits d’un utilisateur
    static async getCircuitsByUser(id_user) {
        try {
            const [rows] = await db.query(
                `SELECT c.* 
       FROM circuit_user cu
       JOIN circuit c ON cu.id_circuit = c.id_circuit
       WHERE cu.id_user = ?`,
                [id_user]
            );
            return rows;
        }catch (e) {
            console.error('Erreur DB dans circuit usercircuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🔍 Vérifier si un utilisateur est déjà associé à un circuit
    static async exists(id_circuit, id_user) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM circuit_user WHERE id_circuit = ? AND id_user = ?`,
                [id_circuit, id_user]
            );
            return rows.length > 0;
        }catch (e) {
            console.error('Erreur DB dans circuit usercircuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }
}

module.exports = CircuitUser ;