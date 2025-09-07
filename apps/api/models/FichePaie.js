
class FichePaie {
    /**
     * @param {object} data
     * @param {number} data.id_fiche
     * @param {number} data.id_user
     * @param {number} data.id_date
     * @param {number} data.salaire_base
     * @param {number} data.prime
     * @param {number} data.retenue
     * @param {number} [data.net_paye] - Le net payé, peut être calculé.
     */
    constructor({ id_fiche, id_user, id_date, salaire_base, prime, retenue, net_paye }) {
        this.id_fiche = id_fiche;
        this.id_user = id_user;
        this.id_date = id_date;
        this.salaire_base = salaire_base;
        this.prime = prime;
        this.retenue = retenue;

        // Le net_paye est soit fourni (depuis la BDD), soit calculé.
        this.net_paye = net_paye !== undefined ? net_paye : this.calculateNetPaye();
    }

    /**
     * Calcule le salaire net à partir des autres propriétés de l'instance.
     * @returns {number}
     */
    calculateNetPaye() {
        return (this.salaire_base || 0) + (this.prime || 0) - (this.retenue || 0);
    }
}

module.exports = FichePaie;
