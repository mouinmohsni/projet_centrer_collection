const db = require('../models/db');
const Carburant = require('../models/Carburant');


class CarburantRepository {

    /**
     * Transforme une ligne de la base de données en une instance de CircuitExecution.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {Carburant | null}
     */
    mapRowToModel(row) {
        return row ? new Carburant(row) : null;
    }


    /**
     * ➕ Créer ajouter.
     * @param {object} data - Les données pour la nouvelle exécution.
     * @returns {Promise<number>} L'ID de l'enregistrement inséré.
     */
    async create(data) {
        const [result] = await db.query(
            `INSERT INTO carburant (id_Voiture, id_date, quantite, cout) VALUES (?, ?, ?, ?)`,
            [data.id_Voiture, data.id_date, data.quantite, data.cout]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupérer un carburant par son ID.
     * @param {number} id_carburant
     * @returns {Promise<Carburant|null>}
     */
    async getById(id_carburant) {
        const [rows] = await db.query(`SELECT * FROM carburant WHERE id_carburant = ?`, [id_carburant]);
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Lister toutes.
     * @returns {Promise<Carburant[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM carburant`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📅 donner tout le carburant d'une voiture.
     * @param {number} id_Voiture
     * @returns {Promise<Carburant[]>}
     */
    async getByVoiture(id_Voiture) {
        const [rows] = await db.query(`SELECT * FROM carburant WHERE id_Voiture = ?`, [id_Voiture]);
        return rows.map(this.mapRowToModel);
    }

    /**
     * ✏️ Mettre à jour.
     * @param {number} id_carburant
     * @param {object} data
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_carburant, data) {
        const [result] = await db.query(
            `UPDATE carburant SET id_Voiture = ?, id_date = ?, quantite = ?, cout = ? WHERE id_carburant = ?`,
            [data.id_Voiture, data.id_date, data.quantite, data.cout, id_carburant]
        );
        return result.affectedRows > 0;
    }

    /**
     * ❌ Supprimer.
     * @param {number} id_carburant
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_carburant) {
        const [result] = await db.query(`DELETE FROM carburant WHERE id_carburant = ?`, [id_carburant]);
        return result.affectedRows > 0;
    }

    /**
     * total carburan d'une voiture.
     * @param {number} id_Voiture
     * @returns {Promise<number>} consommation d'une voiture.
     */
    async getTotalQuantiteByVoiture(id_Voiture) {
        const [rows] = await db.query(`SELECT SUM(quantite) AS total_quantite FROM carburant WHERE id_Voiture = ?`, [id_Voiture]);
        return rows[0]?.total_quantite || 0;
    }

    /**
     * cout total du carburan d'une voiture.
     * @param {number} id_Voiture
     * @returns {Promise<number>}  cout de consommation d'une voiture.
     */
    async getTotalCoutByVoiture(id_Voiture) {
        const [rows] = await db.query(`SELECT SUM(cout) AS total_cout FROM carburant WHERE id_Voiture = ?`, [id_Voiture]);
        return rows[0]?.total_cout || 0;
    }
}

module.exports = new CarburantRepository();
