const db = require('./db');

class Voiture {

    /**
     * @param {object}  data
     * @param {number}  data.id_Voiture
     * @param {number}  data.immatriculation
     * @param {number}  data.capacite
     * @param {boolean} data.refrigerateur
     * @param {number}  data.km_total
     * @param {number}  data.km_prochain_vidange
     * @param {string}  data.etat
     * @param {number}  data.id_conducteur
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */

    constructor({ id_Voiture, immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur,created_by, 
        created_at, 
        updated_by, 
        updated_at }) {
        this.id_Voiture = id_Voiture;
        this.immatriculation = immatriculation;
        this.capacite = capacite;
        this.refrigerateur = refrigerateur;
        this.km_total = km_total;
        this.km_prochain_vidange = km_prochain_vidange;
        this.etat = etat;
        this.id_conducteur = id_conducteur;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }

    // La logique métier reste dans le modèle !
    needsVidange() {
        return this.km_prochain_vidange !== null && this.km_total >= this.km_prochain_vidange;
    }
}
module.exports = Voiture;
