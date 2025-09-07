const db = require('./db');

class User{

    /**
     * @param {object} data
     * @param {number} data.id_user
     * @param {string} data.nom
     * @param {string} data.email
     * @param {string} data.mot_de_passe
     * @param {number} data.telephone
     * @param {string} data.adresse
     * @param {number} data.id_role
     * @param {number} data.longitude
     * @param {number} data.latitude
     */
    constructor({id_user,nom,email,mot_de_passe,telephone,adresse,id_role,longitude = null, latitude = null}){
        this.id_user = id_user;
        this.nom = nom ;
        this.email = email ;
        this.mot_de_passe = mot_de_passe ;
        this.telephone = telephone ;
        this.adresse = adresse ;
        this.id_role = id_role ;
        this.longitude = longitude;
        this.latitude = latitude;
    }

}
module.exports =  User ;