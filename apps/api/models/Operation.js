/**
 * Représente une opération de collecte ou de livraison.
 */
class Operation {
    /**
     * @param {object} data
     * @param {number} data.id_operation
     * @param {number} data.id_circuit_execution - ID de la tournée associée.
     * @param {'recolte'|'livraison'} data.type - Type d'opération.
     * @param {number} data.id_utilisateur_concerne - ID du client ou du producteur.
     * @param {number} data.id_utilisateur_effectuant - ID du livreur ou du conducteur.
     * @param {number} data.id_produit
     * @param {number} data.id_date
     * @param {number} data.quantite
     * @param {number} [data.created_by]
     * @param {string|Date} [data.created_at]
     * @param {number} [data.updated_by]
     * @param {string|Date} [data.updated_at]
     */
    constructor({
                    id_operation,
                    id_circuit_execution,
                    type,
                    id_utilisateur_concerne,
                    id_utilisateur_effectuant,
                    id_produit,
                    id_date,
                    quantite,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                }) {
        this.id_operation = id_operation;
        this.id_circuit_execution = id_circuit_execution;
        this.type = type;
        this.id_utilisateur_concerne = id_utilisateur_concerne;
        this.id_utilisateur_effectuant = id_utilisateur_effectuant;
        this.id_produit = id_produit;
        this.id_date = id_date;
        this.quantite = quantite;
        // Champs d'audit
        this.created_by = created_by;
        this.created_at = created_at;
        this.updated_by = updated_by;
        this.updated_at = updated_at;
    }
}

module.exports = Operation;
