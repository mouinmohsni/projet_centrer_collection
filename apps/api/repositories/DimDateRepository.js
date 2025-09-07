const db = require('../models/db');


const DimDate = require('../models/DimDate');

class DimDateRepository {

    /**
     * Transforme une ligne de la base de données en une instance de DimDate.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {DimDate | null}
     */
    mapRowToModel(row) {
        return row ? new DimDate(row) : null;
    }

    /**
     * 🔹 Insère une nouvelle date dans la dimension.
     * @param {object} data - Les données de la date.
     * @returns {Promise<number>} L'ID de la nouvelle date.
     */
    async create(data) {
        const { jour, annee, mois, periode, jour_semaine } = data;
        const [result] = await db.execute(
            'INSERT INTO dim_date (jour, annee, mois, periode, jour_semaine) VALUES (?, ?, ?, ?, ?)',
            [jour, annee, mois, periode, jour_semaine]
        );
        return result.insertId;
    }

    /**
     * 🔹 Récupère une date par son ID.
     * @param {number} id_date
     * @returns {Promise<DimDate|null>}
     */
    async findById(id_date) {
        const [rows] = await db.execute('SELECT * FROM dim_date WHERE id_date = ?', [id_date]);
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 🔹 Récupère toutes les dates.
     * @returns {Promise<DimDate[]>}
     */
    async getAll() {
        const [rows] = await db.execute('SELECT * FROM dim_date');
        return rows.map(this.mapRowToModel);
    }

    /**
     * 🔹 Recherche une date spécifique par jour, mois et année.
     * @param {number} jour
     * @param {number} mois
     * @param {number} annee
     * @returns {Promise<DimDate|null>}
     */
    async findByDayMonthYear(jour, mois, annee) {
        const [rows] = await db.execute(
            'SELECT * FROM dim_date WHERE jour = ? AND mois = ? AND annee = ?',
            [jour, mois, annee]
        );
        return this.mapRowToModel(rows[0]);
    }
}

// On exporte une instance unique (Singleton)
module.exports = new DimDateRepository();
