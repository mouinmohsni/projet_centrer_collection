const db = require('./db');
class FactureLigne{
    constructor(id_ligne,id_facture,id_produit,quantite,prix_unitaire,montant) {
        this.id_ligne = id_ligne;
        this.id_facture = id_facture;
        this.id_produit = id_produit;
        this.quantite = quantite;
        this.prix_unitaire = prix_unitaire;
        this.montant = montant;
    }

    // ➕ Créer une ligne de facture
    static async create(id_facture, id_produit, quantite, prix_unitaire) {
        try {
            const montant = quantite * prix_unitaire;
            const [result] = await db.execute(
                `INSERT INTO facture_ligne (id_facture, id_produit, quantite, prix_unitaire)
                 VALUES (?, ?, ?, ?)`,
                [id_facture, id_produit, quantite, prix_unitaire]
            );
            return new FactureLigne(result.insertId, id_facture, id_produit, quantite, prix_unitaire, montant);

        }catch (e) {
            console.error('Erreur DB dans ligne de facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔍 Récupérer toutes les lignes d'une facture
    static async getByFacture(id_facture) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM facture_ligne WHERE id_facture = ?`,
                [id_facture]
            );
            return rows.map(row => new FactureLigne(...Object.values(row)));

        }catch (e) {
            console.error('Erreur DB dans ligne de facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // 🔄 Mettre à jour une ligne
    async update(quantite, prix_unitaire) {
        this.quantite = quantite;
        this.prix_unitaire = prix_unitaire;
        this.montant = quantite * prix_unitaire;
        try {
            await db.execute(
                `UPDATE facture_ligne SET quantite = ?, prix_unitaire = ?, montant = ? WHERE id_ligne = ?`,
                [this.quantite, this.prix_unitaire, this.montant, this.id_ligne]
            );

        }catch (e) {
            console.error('Erreur DB dans ligne de facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }

    // ❌ Supprimer une ligne
    async delete() {
        try {
            await db.execute(
                `DELETE FROM facture_ligne WHERE id_ligne = ?`,
                [this.id_ligne]
            );

        }catch (e) {
            console.error('Erreur DB dans ligne de facture :', e);
            throw e; // pour que le contrôleur connaisse le problème
        }
    }
}
module.exports = FactureLigne ;