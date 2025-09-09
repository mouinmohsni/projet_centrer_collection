const db = require('../models/db');
const Voiture = require('../models/Voiture');
const User = require("../models/User");
const userRepository =require('./UserRepository')

class VoitureRepository {
    mapRowToModel(row) {
        return row ? new Voiture(row) : null;
    }

    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO voiture (immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.immatriculation, data.capacite, data.refrigerateur, data.km_total, data.km_prochain_vidange, data.etat, data.id_conducteur]
        );
        return result.insertId;
    }

    async findById(id_Voiture) {
        const [rows] = await db.execute(`SELECT * FROM voiture WHERE id_Voiture = ?`, [id_Voiture]);
        return this.mapRowToModel(rows[0]);
    }

    async getAll() {
        const [rows] = await db.execute(`SELECT * FROM voiture ORDER BY immatriculation`);
        return rows.map(this.mapRowToModel);
    }

    async update(id_Voiture, data) {
        const [result] = await db.execute(
            `UPDATE voiture SET immatriculation = ?, capacite = ?, refrigerateur = ?, km_total = ?, km_prochain_vidange = ?, etat = ? WHERE id_Voiture = ?`,
            [data.immatriculation, data.capacite, data.refrigerateur, data.km_total, data.km_prochain_vidange, data.etat, id_Voiture]
        );
        return result.affectedRows > 0;
    }

    async assignUnassignDriverToVehicle (id_Voiture, data) {
        const [result] = await db.execute(
            `UPDATE voiture SET id_conducteur = ? WHERE id_Voiture = ?`,
            [data.id_conducteur, id_Voiture]
        );
        return result.affectedRows > 0;
    }

    async delete(id_Voiture) {
        const [result] = await db.execute(`DELETE FROM voiture WHERE id_Voiture = ?`, [id_Voiture]);
        return result.affectedRows > 0;
    }

    /**
     * Récupère une voiture et les informations de son conducteur associé.
     * @param {number} id_Voiture - L'ID de la voiture.
     * @returns {Promise<{Voiture: Voiture, conducteur: User|null}|null>} Un objet contenant le véhicule et son conducteur, ou null si le véhicule n'est pas trouvé.
     */
    async findWithDriver(id_Voiture) {
        const [rows] = await db.query(
            `SELECT 
                v.*, 
                u.id_user, u.nom, u.email, u.telephone, u.adresse, u.id_role 
             FROM voiture AS v
             LEFT JOIN user AS u ON v.id_conducteur = u.id_user
             WHERE v.id_Voiture = ?`,
            [id_Voiture]
        );
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];

        // Créer l'instance du véhicule
        const voiture = this.mapRowToModel(row)
        // Créer l'instance du conducteur, seulement si un conducteur est associé
        const conducteur = row.id_conducteur ?await  userRepository.findById(row.id_user): null;

        return { voiture, conducteur };
    }
    async addKm(id_Voiture, km_to_add) {
        const [result] = await db.execute(`UPDATE voiture SET km_total = km_total + ? WHERE id_Voiture = ?`, [km_to_add, id_Voiture]);
        return result.affectedRows > 0;
    }
}

module.exports = new VoitureRepository();