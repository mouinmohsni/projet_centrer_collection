// file: src/repositories/vehicule.repository.js
const db = require('../models/db');
const Vehicule = require('../models/Vehicule');

class VehiculeRepository {
    mapRowToModel(row) {
        return row ? new Vehicule(row) : null;
    }

    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO vehicule (immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.immatriculation, data.capacite, data.refrigerateur, data.km_total, data.km_prochain_vidange, data.etat, data.id_conducteur]
        );
        return result.insertId;
    }

    async findById(id_vehicule) {
        const [rows] = await db.execute(`SELECT * FROM vehicule WHERE id_vehicule = ?`, [id_vehicule]);
        return this.mapRowToModel(rows[0]);
    }

    async getAll() {
        const [rows] = await db.execute(`SELECT * FROM vehicule ORDER BY immatriculation`);
        return rows.map(this.mapRowToModel);
    }

    async update(id_vehicule, data) {
        const [result] = await db.execute(
            `UPDATE vehicule SET immatriculation = ?, capacite = ?, refrigerateur = ?, km_total = ?, km_prochain_vidange = ?, etat = ?, id_conducteur = ? WHERE id_vehicule = ?`,
            [data.immatriculation, data.capacite, data.refrigerateur, data.km_total, data.km_prochain_vidange, data.etat, data.id_conducteur, id_vehicule]
        );
        return result.affectedRows > 0;
    }

    async delete(id_vehicule) {
        const [result] = await db.execute(`DELETE FROM vehicule WHERE id_vehicule = ?`, [id_vehicule]);
        return result.affectedRows > 0;
    }

    async addKm(id_vehicule, km_to_add) {
        const [result] = await db.execute(`UPDATE vehicule SET km_total = km_total + ? WHERE id_vehicule = ?`, [km_to_add, id_vehicule]);
        return result.affectedRows > 0;
    }
}

module.exports = new VehiculeRepository();