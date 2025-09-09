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
     */

    constructor({ id_Voiture, immatriculation, capacite, refrigerateur, km_total, km_prochain_vidange, etat, id_conducteur }) {
        this.id_Voiture = id_Voiture;
        this.immatriculation = immatriculation;
        this.capacite = capacite;
        this.refrigerateur = refrigerateur;
        this.km_total = km_total;
        this.km_prochain_vidange = km_prochain_vidange;
        this.etat = etat;
        this.id_conducteur = id_conducteur;
    }

    // La logique métier reste dans le modèle !
    needsVidange() {
        return this.km_prochain_vidange !== null && this.km_total >= this.km_prochain_vidange;
    }
}
module.exports = Voiture;
