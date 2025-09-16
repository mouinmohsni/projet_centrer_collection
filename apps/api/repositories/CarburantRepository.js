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
            `INSERT INTO carburant (id_Voiture, id_date, quantite, cout,created_by, updated_by) VALUES (?, ?, ?, ?,?,?)`,
            [data.id_Voiture, data.id_date, data.quantite, data.cout,data.created_by, data.updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupérer un carburant par son ID.
     * @param {number} id_carburant
     * @returns {Promise<Carburant|null>}
     */
    async findById(id_carburant) {
        const [rows] = await db.query(`SELECT * FROM carburant WHERE id_carburant = ?`, [id_carburant]);
        return this.mapRowToModel(rows[0]);
    }

    /**
     * Récupère les détails très complets d'un enregistrement de carburant par son ID.
     * @param {number} id_carburant - L'ID de l'enregistrement de carburant.
     * @returns {Promise<object|null>} Un objet avec tous les détails, ou null si non trouvé.
     */
    async getDetailById(id_carburant) {
        const [rows] = await db.query(`
            SELECT
                ca.*,
                v.immatriculation,
                d.jour,
                d.periode,
                creator.nom AS created_by_nom, -- Qui a créé l'enregistrement
                updater.nom AS updated_by_nom, -- Qui a modifié l'enregistrement
                driver.nom  AS driver_nom      -- Qui conduisait le véhicule
            FROM
                carburant AS ca
                    LEFT JOIN
                voiture AS v ON ca.id_Voiture = v.id_Voiture
                    LEFT JOIN
                dim_date AS d ON ca.id_date = d.id_date
                    LEFT JOIN
                user AS creator ON ca.created_by = creator.id_user -- 1ère jointure sur user
                    LEFT JOIN
                user AS updater ON ca.updated_by = updater.id_user -- 2ème jointure sur user
                    LEFT JOIN
                user AS driver ON v.id_conducteur = driver.id_user  -- 3ème jointure sur user !
            WHERE
                ca.id_carburant = ?
        `, [id_carburant]);

        return rows[0] || null;
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
     * @param {number} id
     * @param {object} data
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id, data) {
        const updatableFields = ['id_Voiture', 'id_date','quantite', 'cout', 'id_carburant', 'updated_by'];

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
        values.push(id); // Ajouter l'ID pour la clause WHERE



        const [result] = await db.execute(
            `UPDATE carburant SET ${setClause} WHERE id_carburant = ?`,
            values
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
     * Calcule la quantité totale de carburant pour une voiture, avec un filtre optionnel par période.
     * @param {number} id_Voiture - L'ID de la voiture.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<number>} La quantité totale de carburant.
     */
    async getTotalQuantiteByVoiture(id_Voiture, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres.
        let sql = `
        SELECT SUM(c.quantite) AS total_quantite 
        FROM carburant AS c
        JOIN dim_date AS d ON c.id_date = d.id_date
        WHERE c.id_Voiture = ?
    `;
        const params = [id_Voiture];

        // 2. On ajoute dynamiquement les filtres de date.
        if (dateDebut) {
            sql += ` AND d.jour >= ?`;
            params.push(dateDebut);
        }
        if (dateFin) {
            sql += ` AND d.jour <= ?`;
            params.push(dateFin);
        }

        // 3. On exécute la requête construite.
        const [rows] = await db.query(sql, params);

        // 4. On retourne le résultat. SUM retourne toujours une seule ligne.
        // Si aucun enregistrement ne correspond, SUM peut retourner NULL, donc on protège avec '|| 0'.
        return rows[0]?.total_quantite || 0;
    }

    /**
     * Calcule le coût total du carburant pour une voiture, avec un filtre optionnel par période.
     * @param {number} id_Voiture - L'ID de la voiture.
     * @param {string} [dateDebut] - La date de début (format 'YYYY-MM-DD'). Optionnelle.
     * @param {string} [dateFin] - La date de fin (format 'YYYY-MM-DD'). Optionnelle.
     * @returns {Promise<Object>} Le coût total du carburant.
     */
    async getTotalCoutByVoiture(id_Voiture, dateDebut, dateFin) {
        // 1. On commence avec la requête de base et les paramètres.
        let sql = `
        SELECT SUM(c.cout) AS total_cout , SUM(c.quantite) AS total_quantite
        FROM carburant AS c
        JOIN dim_date AS d ON c.id_date = d.id_date
        WHERE c.id_Voiture = ?
    `;
        const params = [id_Voiture];

        // 2. On ajoute dynamiquement les filtres de date.
        if (dateDebut) {
            sql += ` AND d.jour >= ?`;
            params.push(dateDebut);
        }
        if (dateFin) {
            sql += ` AND d.jour <= ?`;
            params.push(dateFin);
        }

        // 3. On exécute la requête construite.
        const [rows] = await db.query(sql, params);
        console.log(rows)

        // 4. On retourne le résultat.
        return rows || 0;
    }

    /**
     * Calcule la consommation par conducteur.
     * Si un id_conducteur est fourni, filtre pour ce conducteur uniquement.
     * Sinon, retourne un rapport pour tous les conducteurs.
     * @param {number} [id_conducteur] - L'ID du conducteur à filtrer. Optionnel.
     * @param {string} [dateDebut] - La date de début. Optionnelle.
     * @param {string} [dateFin] - La date de fin. Optionnelle.
     * @returns {Promise<object[]>}
     */
    async getConsumptionByDriver(id_conducteur, dateDebut, dateFin) {
        let sql = `
        SELECT
            d.id_user,
            d.nom AS driver_nom,
            SUM(ca.quantite) AS total_quantite,
            SUM(ca.cout) AS total_cout,
            COUNT(ca.id_carburant) AS nombre_de_pleins
        FROM
            carburant AS ca
        JOIN
            voiture AS v ON ca.id_Voiture = v.id_Voiture
        JOIN
            user AS d ON v.id_conducteur = d.id_user
        JOIN
            dim_date AS dt ON ca.id_date = dt.id_date
        WHERE
            v.id_conducteur IS NOT NULL
    `;
        const params = [];

        // --- FILTRES DYNAMIQUES ---
        if (id_conducteur) {
            sql += ` AND d.id_user = ?`;
            params.push(id_conducteur);
        }
        if (dateDebut) {
            sql += ` AND dt.jour >= ?`;
            params.push(dateDebut);
        }
        if (dateFin) {
            sql += ` AND dt.jour <= ?`;
            params.push(dateFin);
        }

        sql += `
        GROUP BY
            d.id_user, d.nom
        ORDER BY
            total_cout DESC
    `;

        const [rows] = await db.query(sql, params);
        return rows;
    }


}

module.exports = new CarburantRepository();
