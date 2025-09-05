const db = require('./db');

class DimDate {
    constructor(id_date, jour, annee, mois, periode, jour_semaine) {
        this.id_date = id_date;
        this.jour = jour;
        this.annee = annee;
        this.mois = mois;
        this.periode = periode;
        this.jour_semaine = jour_semaine;
    }

    // 🔹 Insérer une nouvelle date
    static async create(jour, annee, mois, periode, jour_semaine) {
        try {
            const [result] = await db.execute(
                'INSERT INTO dim_date (jour, annee, mois, periode, jour_semaine) VALUES (?, ?, ?, ?, ?)',
                [jour, annee, mois, periode, jour_semaine]
            );
            return result.insertId;
        }catch (e) {
            console.error('Erreur DB dans dimdate :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🔹 Récupérer une date par son ID
    static async findById(id_date) {
        try {
            const [rows] = await db.execute('SELECT * FROM dim_date WHERE id_date = ?', [id_date]);
            return rows.length ? new DimDate(...Object.values(rows[0])) : null;
        }catch (e) {
            console.error('Erreur DB dans dimdate :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🔹 Récupérer toutes les dates
    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM dim_date');
            return rows.map(row => new DimDate(...Object.values(row)));
        }catch (e) {
            console.error('Erreur DB dans dimdate :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

    // 🔹 Rechercher une date spécifique
    static async findByDayMonthYear(jour, mois, annee) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM dim_date WHERE jour = ? AND mois = ? AND annee = ?',
                [jour, mois, annee]
            );
            return rows.length ? new DimDate(...Object.values(rows[0])) : null;
        }catch (e) {
            console.error('Erreur DB dans dimdate :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }

    }

}

module.exports = DimDate;
