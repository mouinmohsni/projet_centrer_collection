const db = require('./db');
class Circuit{
    constructor(id_circuit,nom,description) {
        this.id_circuit =id_circuit ;
        this.nom = nom ;
        this.description = description ;
    }


    // ➕ Ajouter un circuit
    static async create(data) {
        try {

            const [result] = await db.query(
                `INSERT INTO circuit (nom, description) 
           VALUES (?, ?)`,
                [data.nom, data.description]
            );
            return result.insertId;
        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer un circuit par ID
    static async getById(id_circuit) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM circuit WHERE id_circuit = ?`,
                [id_circuit]
            );
            return rows[0] || null;

        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 📋 Récupérer tous les circuits
    static async getAll() {
        try {
            const [rows] = await db.query(`SELECT * FROM circuit`);
            return rows;

        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ✏️ Mettre à jour un circuit
    static async update(id_circuit, data) {
        try {

            await db.query(
                `UPDATE circuit 
           SET nom = ?, description = ?
           WHERE id_circuit = ?`,
                [data.nom, data.description, id_circuit]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer un circuit
    static async delete(id_circuit) {
        try {

            await db.query(
                `DELETE FROM circuit WHERE id_circuit = ?`,
                [id_circuit]
            );
            return true;
        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 👥 Récupérer les utilisateurs associés à un circuit
    static async getUsers(id_circuit) {
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
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ➕ Associer un utilisateur à un circuit
    static async addUserToCircuit(id_circuit, id_user) {
        try {
            await db.query(
                `INSERT INTO circuit_user (id_circuit, id_user) 
           VALUES (?, ?)`,
                [id_circuit, id_user]
            );
            return true;

        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Retirer un utilisateur d’un circuit
    static async removeUserFromCircuit(id_circuit, id_user) {
        try {
            await db.query(
                `DELETE FROM circuit_user 
           WHERE id_circuit = ? AND id_user = ?`,
                [id_circuit, id_user]
            );
            return true;

        }catch (e) {
            console.error('Erreur DB dans circuit :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}

module.exports = Circuit ;