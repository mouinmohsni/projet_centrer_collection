const db = require('../models/db');
const FichePaie = require('../models/FichePaie');

class FichePaieRepository {

    /**
     * Mappe une ligne de la base de données à une instance du modèle FichePaie.
     * @private
     * @param {object|undefined} row - La ligne de la base de données.
     * @returns {FichePaie|null}
     */
    mapRowToModel(row) {
        return row ? new FichePaie(row) : null;
    }

    /**
     * Crée une nouvelle fiche de paie.
     * @param {object} data - Les données de la fiche de paie.
     * @param {number} data.id_user
     * @param {number} data.id_date
     * @param {number} data.salaire_base
     * @param {number} data.prime
     * @param {number} data.retenue
     * @param {number} data.created_by
     * @param {number} data.updated_by
     * @returns {Promise<number>} L'ID de la nouvelle fiche de paie.
     */
    async create(data) {
        // On attend les deux champs du service
        const { id_user, id_date, salaire_base, prime, retenue, created_by, updated_by } = data;
        const [result] = await db.execute(
            `INSERT INTO fiche_paie (id_user, id_date, salaire_base, prime, retenue, created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_user, id_date, salaire_base, prime, retenue, created_by, updated_by]
        );
        return result.insertId;
    }


    /**
     * Récupère une fiche de paie par son ID.
     * @param {number} id_fiche
     * @returns {Promise<FichePaie|null>}
     */
    async findById(id_fiche) {
        const [rows] = await db.execute(
            `SELECT  f.id_fiche, f.id_user, u.nom, f.id_date, d.jour, f.salaire_base, f.prime, f.retenue, f.net_paye
                FROM fiche_paie AS f
                LEFT JOIN user u on f.id_user = u.id_user
                LEFT JOIN dim_date d on f.id_date = d.id_date
                WHERE id_fiche = ?`,
            [id_fiche]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * Met à jour une fiche de paie.
     * @param {number} id_fiche - L'ID de la fiche à mettre à jour.
     * @param {object} data - Les nouvelles données.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_fiche, data) {
        const updatableFields = ['salaire_base', 'prime', 'retenue','updated_by'];

        // 2. Filtrer l'objet 'data' pour ne garder que les champs autorisés.
        const dataToUpdate = {};
        Object.keys(data).forEach(key => {
            if (updatableFields.includes(key)) {
                dataToUpdate[key] = data[key];
            }
        });

        // 3. Construire la requête dynamiquement à partir des données filtrées.
        const fields = Object.keys(dataToUpdate);
        const values = Object.values(dataToUpdate);


        if (fields.length === 0) {
            // Le client n'a envoyé aucun champ modifiable.
            return false;
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        values.push(id_fiche); // Ajouter l'ID pour la clause WHERE



        const [result] = await db.execute(
            `UPDATE fiche_paie SET ${setClause} WHERE id_fiche = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    /**
     * Supprime une fiche de paie.
     * @param {number} id_fiche
     * @returns {Promise<boolean>}
     */
    async delete(id_fiche) {
        const [result] = await db.execute(
            `DELETE FROM fiche_paie WHERE id_fiche = ?`,
            [id_fiche]
        );
        return result.affectedRows > 0;
    }

    /**
     * Récupère toutes les fiches de paie d'un employé.
     * @param {number} id_user
     * @returns {Promise<FichePaie[]>}
     */
    async getByUser(id_user) {
        const [rows] = await db.execute(
            `SELECT * FROM fiche_paie WHERE id_user = ? ORDER BY id_date DESC`,
            [id_user]
        );
        return rows.map(row => this.mapRowToModel(row));
    }
}

module.exports = new FichePaieRepository();
