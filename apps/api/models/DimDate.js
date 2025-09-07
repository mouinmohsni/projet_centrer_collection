
class DimDate {
    /**
     * @param {object} data
     * @param {number} data.id_date
     * @param {number} data.jour
     * @param {number} data.annee
     * @param {number} data.mois
     * @param {string} data.periode
     * @param {string} data.jour_semaine
     */
    constructor({ id_date, jour, annee, mois, periode, jour_semaine }) {
        this.id_date = id_date;
        this.jour = jour;
        this.annee = annee;
        this.mois = mois;
        this.periode = periode;
        this.jour_semaine = jour_semaine;
    }
}

module.exports = DimDate;
