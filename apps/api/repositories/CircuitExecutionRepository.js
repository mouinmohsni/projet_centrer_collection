const db = require('../models/db');
const CircuitExecution = require('../models/CircuitExecution');
const BaseRepository = require('../delete/BaseRepository');



class CircuitExecutionRepository extends BaseRepository{

    constructor() {
        super("circuit_execution", "id_execution")

        this.updatableFields = ["id_circuit", "id_date", "id_Voiture", "id_conducteur", "km_parcouru", "statut", "heure_debut_planifiee", "heure_fin_planifiee", "heure_debut_reelle", "heure_fin_reelle", "updated_by"];
    }

    /**
     * Transforme une ligne de la base de données en une instance de CircuitExecution.
     * @param {object} row - La ligne brute de la base de données.
     * @returns {CircuitExecution | null}
     */
    mapRowToModel(row) {
        return row ? new CircuitExecution(row) : null;
    }

    /**
     * ➕ Crée une nouvelle exécution de circuit.
     * @param {object} data - Les données de l'exécution.
     * @returns {Promise<number>} L'ID de la nouvelle exécution.
     */
    async create(data) {
        console.log("data repo : ",data ) ;
        const { id_circuit, id_date, id_voiture,id_conducteur,statut,date_debut_planifiee,date_fin_planifiee, km_parcouru,created_by, updated_by } = data;
        const [result] = await db.query(
            `INSERT INTO circuit_execution (id_circuit, id_date, id_Voiture,id_conducteur,statut,heure_debut_planifiee,heure_fin_planifiee, km_parcouru,created_by, updated_by)
             VALUES (?, ?, ?, ?,?,?,?,?,?,?)`,
            [id_circuit, id_date, id_voiture,id_conducteur,statut,date_debut_planifiee,date_fin_planifiee, km_parcouru,created_by, updated_by]
        );
        return result.insertId;
    }

    /**
     * 🔍 Récupère une exécution par son ID.
     * @param {number} id_execution
     * @returns {Promise<CircuitExecution|null>}
     */
    async findById(id_execution) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_execution WHERE id_execution = ?`,
            [id_execution]
        );
        return this.mapRowToModel(rows[0]);
    }

    /**
     * 📋 Liste toutes les exécutions.
     * @returns {Promise<CircuitExecution[]>}
     */
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM circuit_execution`);
        return rows.map(this.mapRowToModel);
    }

    /**
     * 📅 Liste toutes les exécutions d'un circuit donné.
     * @param {number} id_circuit
     * @returns {Promise<CircuitExecution[]>}
     */
    async findByCircuit(id_circuit) {
        const [rows] = await db.query(
            `SELECT * FROM circuit_execution WHERE id_circuit = ?`,
            [id_circuit]
        );
        return rows.map(this.mapRowToModel);
    }



    /** Surcharge de la méthode update pour utiliser la liste de champs prédéfinie.
     * @param {number} id - L'ID de l'exécution.
     * @param {object} data - Les données à mettre à jour.
     * @param  {string[]} [allowedFields=null]
     * @returns {Promise<boolean>}
    */
    
    async update(id, data,allowedFields = null) {

        return super.update(id, data, this.updatableFields);
    }



    /**
     * 🚛 Récupère les infos détaillées (avec jointures).
     * @param {number} id_execution
     * @returns {Promise<object|null>} Un objet enrichi, pas un modèle pur.
     */
    async getDetailById(id_execution) {
        const [rows] = await db.query(
            `SELECT ce.*, v.immatriculation, c.nom AS nom_circuit ,d.jour
             FROM circuit_execution ce
             JOIN voiture v ON ce.id_Voiture = v.id_Voiture
             JOIN circuit c ON ce.id_circuit = c.id_circuit
             JOIN dim_date d on ce.id_date = d.id_date
             WHERE ce.id_execution = ?`,
            [id_execution]
        );
        return rows[0] || null;
    }
    /**
     * Recherche des exécutions de circuit en joignant la table de dimension de date.
     * @param {object} filters - Un objet contenant les filtres.
     * @param {number} [filters.id] - Le id à rechercher.
     * @param {string} [filters.champ]
     * @param {string} [filters.date_debut] - La date de début (YYYY-MM-DD).
     * @param {string} [filters.date_fin] - La date de fin (YYYY-MM-DD).
     * @returns {Promise<CircuitExecution[]>} - Une liste d'exécutions de circuit mappées.
     */
    async findByStatusAndDateRange({champ, id, date_debut, date_fin }) {
        // On sélectionne toutes les colonnes de circuit_execution pour le mapping
        let query = `
            SELECT ce.* ,v.immatriculation, c.nom AS nom_circuit ,dd.jour
            FROM circuit_execution AS ce
        `;
        const conditions = [];
        const params = [];

        // Si un filtre de date est présent, nous devons joindre la table dim_date
        if (date_debut || date_fin) {
            // IMPORTANT: Remplacez 'dim_date' et 'full_date' par les vrais noms
            // de votre table de dimension et de sa colonne de date.
            query += `
            JOIN dim_date AS dd ON ce.id_date = dd.id_date
            JOIN voiture v ON ce.id_Voiture = v.id_Voiture
            JOIN circuit c ON ce.id_circuit = c.id_circuit 
            
            `;

            if (date_debut) {
                conditions.push('dd.jour >= ?');
                params.push(date_debut);
            }
            if (date_fin) {
                conditions.push('dd.jour <= ?');
                params.push(date_fin);
            }
        }

        if (id) {
            // Le nom de la colonne est préfixé par l'alias de la table pour éviter toute ambiguïté
            conditions.push(`ce.${champ} = ?`);
            params.push(id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // On ordonne par la colonne de la table principale
        query += ' ORDER BY ce.id_date DESC';

        const [rows] = await db.query(query, params);
        return rows.map(row => this.mapRowToModel(row));
    }



    /**
     * Recherche des exécutions de circuit avec une combinaison de filtres dynamiques.
     * C'est la méthode UNIVERSELLE pour toutes les recherches.
     * @param {object} filters - Un objet contenant les filtres à appliquer.
     * @param {number} [filters.id_conducteur] - Filtre par ID de conducteur.
     * @param {number} [filters.id_voiture] - Filtre par ID de véhicule.
     * @param {number} [filters.id_date] - Filtre par ID de date (journée/période).
     * @param {string|string[]} [filters.statut] - Filtre par statut (chaîne unique ou tableau).
     * @param {number} [filters.excludeId] - **(AJOUTÉ)** Pour exclure un ID d'exécution des résultats.
     * @returns {Promise<CircuitExecution[]>} Une liste d'exécutions de circuit mappées.
     */
    async find(filters = {}) {
        const {
            id_conducteur,
            id_voiture,
            id_date,
            statut,
            excludeId // On récupère le nouveau filtre
        } = filters;

        let query = `SELECT * FROM ${this.tableName}`;
        const conditions = [];
        const params = [];

        if (id_conducteur) {
            conditions.push('id_conducteur = ?');
            params.push(id_conducteur);
        }
        if (id_voiture) {
            conditions.push('id_voiture = ?');
            params.push(id_voiture);
        }
        if (id_date) {
            conditions.push('id_date = ?');
            params.push(id_date);
        }
        if (statut) {
            if (Array.isArray(statut)) {
                const placeholders = statut.map(() => '?').join(',');
                conditions.push(`statut IN (${placeholders})`);
                params.push(...statut);
            } else {
                conditions.push('statut = ?');
                params.push(statut);
            }
        }

        // --- Voici l'ajout crucial ---
        if (excludeId) {
            conditions.push(`${this.primaryKey} != ?`);
            params.push(excludeId);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY heure_debut_planifiee DESC';

        const [rows] = await db.query(query, params);
        return rows.map(row => this.mapRowToModel(row));
    }



}

// On exporte une instance unique (Singleton)
module.exports = new CircuitExecutionRepository();
