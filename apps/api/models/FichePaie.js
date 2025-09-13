class FichePaie {
    /**
     * @param {object} data
     * @param {number} data.id_fiche
     * @param {number} data.id_user
     * @param {number} data.id_date
     * @param {number} data.salaire_base
     * @param {number} data.prime
     * @param {number} data.retenue
     * @param {number} [data.net_paye]
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({ id_fiche, id_user, id_date, salaire_base, prime, retenue, net_paye,created_by, 
        created_at, 
        updated_by, 
        updated_at  }) {
        this.id_fiche = id_fiche;
        this.id_user = id_user;
        this.id_date = id_date;
        this.salaire_base = salaire_base;
        this.prime = prime;
        this.retenue = retenue;
        this.net_paye = net_paye;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = FichePaie;
