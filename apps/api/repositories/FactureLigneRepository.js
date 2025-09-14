const db = require('../models/db');

const FactureLigne = require('../models/FactureLigne');

class FactureLigneRepository {

    /**
     * Transforme une ligne de la base de données en une instance de FactureLigne.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {FactureLigne | null}
     */
    mapRowToModel(row) {
        return row ? new FactureLigne(row) : null;
    }

    /**
     * ➕ Crée une nouvelle FactureLigne.
     * Le montant_total sera souvent mis à jour par le service après ajout des lignes.
     * @param {object} data - Les données de la FactureLigne.
     * @returns {Promise<number>} L'ID de la nouvelle FactureLigne.
     */
    async create(data) {
        const { id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by} = data;
        const [result] = await db.query(
            `INSERT INTO facture_ligne (id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by) 
             VALUES (?, ?, ?, ?, ?,?)`,
            [id_facture, id_produit, quantite, prix_unitaire, created_by, updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une FactureLigne par son ID.
     * @param {number} id_ligne
     * @returns {Promise<FactureLigne|null>}
     */
    async findById(id_ligne) {
        const [rows] = await db.query(
            `SELECT * FROM facture_ligne WHERE id_ligne = ?`,
            [id_ligne]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Récupère toutes les FactureLignes.
     * @returns {Promise<FactureLigne[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM facture`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📋 Récupère toutes les FactureLignes d'un client spécifique.
     * @param {number} id_client
     * @returns {Promise<FactureLigne[]>}
     */
    async getByClient(id_client) {
        const [rows] = await db.query(
            `SELECT * FROM facture WHERE id_client = ?`,
            [id_client]
        );
        return rows.map(this.mapRowToModel);
    }



    /**
     * Met à jour une Facture.
     * @param {number} id_ligne - L'ID de la fiche à mettre à jour.
     * @param {object} data - Les nouvelles données.
     * @returns {Promise<boolean>} True si la mise à jour a réussi.
     */
    async update(id_ligne, data) {
        const updatableFields = [ 'id_ligne', 'id_produit', 'quantite', 'prix_unitaire', 'montant', 'updated_by'];

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
        values.push(id_ligne); // Ajouter l'ID pour la clause WHERE



        const [result] = await db.execute(
            `UPDATE facture_ligne SET ${setClause} WHERE id_ligne = ?`,
            values
        );
        return result.affectedRows > 0;
    }


    /**
     * ❌ Supprime une facture.
     * @param {number} id_ligne
     * @returns {Promise<boolean>} True si la suppression a réussi.
     */
    async delete(id_ligne) {
        const [result] = await db.query(`DELETE FROM facture_ligne WHERE id_ligne = ?`, [id_ligne]);
        return result.affectedRows > 0;
    }



}

// On exporte une instance unique (Singleton)
module.exports = new FactureLigneRepository();
