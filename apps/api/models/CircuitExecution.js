
class CircuitExecution {
    /**
     * @param {object} data
     * @param {number} data.id_execution
     * @param {number} data.id_circuit
     * @param {number} data.id_date
     * @param {number} data.id_Voiture
     * @param {number} data.km_parcouru
     * @param {number} data.id_conducteur
     * @param {string|Date} [data.heure_debut_planifiee]
     * @param {string|Date} [data.heure_fin_planifiee]
     * @param {string|Date} [data.heure_debut_reelle]
     * @param {string|Date} [data.heure_fin_reelle]
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     * @param {string} data.statut
     */
    constructor({ id_execution, id_circuit, id_date, id_Voiture,
                    id_conducteur,heure_debut_planifiee,heure_fin_planifiee ,heure_debut_reelle ,
                    heure_fin_reelle , km_parcouru ,
                    statut,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at }) {
        this.id_execution = id_execution;
        this.id_circuit = id_circuit;
        this.id_date = id_date;
        this.id_Voiture = id_Voiture;
        this.km_parcouru = km_parcouru;
        this.statut = statut ;
        this.id_conducteur = id_conducteur ;
        this.heure_debut_planifiee = heure_debut_planifiee ;
        this.heure_fin_planifiee = heure_fin_planifiee ;
        this.heure_debut_reelle = heure_debut_reelle ;
        this.heure_fin_reelle = heure_fin_reelle ;

        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}
module.exports = CircuitExecution;
