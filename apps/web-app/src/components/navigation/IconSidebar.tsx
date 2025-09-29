import styles from "../../assets/css/IconSidebar.module.css";
import Circuits from "../icon/Circuits.tsx"
import Factures from "../icon/Factures.tsx"
import Dashboard from "../icon/Dashboard.tsx";
import Executions from "../icon/Executions.tsx";
import Utilisateurs from "../icon/Utilisateurs.tsx";
import Vehicules from "../icon/Vehicules.tsx";
import Produits from "../icon/Produits.tsx";
import Parametres from "../icon/Parametres.tsx";


interface IconSidebarProps {
    onIconClick: (sectionName: string, labelSection: string) => void,
    activeSection: string | null,

}

const IconSidebar = ({onIconClick, activeSection}: IconSidebarProps) => {

    const sections = [
        // --- OPÉRATIONNEL ---
        {
            id: 'dashboard',
            label: 'Tableau de Bord',
            icon: Dashboard,
            roles: ['admin', 'manager']
        },
        {
            id: 'executions',
            label: 'Gestion des Tournées',
            icon: Executions,
            roles: ['admin', 'manager', 'conducteur']
            // C'est ICI que l'on consultera les récoltes et les livraisons associées à une tournée.
        },

        {
            id: 'Circuits',
            label: 'Gestion des Circuits',
            icon: Circuits,
            roles: ['admin', 'manager', 'conducteur']
            // C'est ICI que l'on consultera les récoltes et les livraisons associées à une tournée.
        },

        {
            id: 'invoices',
            label: 'Facturation',
            icon: Factures,
            roles: ['admin', 'manager']
        },

        // --- GESTION & ADMINISTRATION ---
        {
            id: 'users',
            label: 'Gestion des Utilisateurs',
            icon: Utilisateurs,
            roles: ['admin']
            // C'est ICI que l'on consultera les fiches de paie d'un utilisateur.
        },
        {
            id: 'vehicles',
            label: 'Gestion des Véhicules',
            icon: Vehicules,
            roles: ['admin']
        },
        {
            id: 'catalog', // J'ai ajouté une section pour les données de base
            label: 'Catalogue',
            icon: Produits,
            roles: ['admin']
            // Le panneau contextuel de cette section aura des liens vers "Produits", "Circuits", etc.
        },

        // --- PARAMÈTRES ---
        {
            id: 'settings',
            label: 'Paramètres',
            icon: Parametres,
            roles: ['admin', 'manager', 'conducteur']
        },
    ]


    return (
        <div className={styles.iconSidebarContainer}>
            {/* On commence la boucle sur le tableau */}
            {sections.map((section) => {

                // ÉTAPE 1 : On récupère le composant icône DEPUIS la 'section' actuelle.
                // Cette ligne est maintenant A L'INTÉRIEUR du map, où 'section' existe.
                const IconComponent = section.icon;

                // ÉTAPE 2 : On retourne le JSX pour cette icône spécifique.
                return (
                    <div
                        key={section.id}
                        onClick={() => onIconClick(section.id, section.label)} // J'ai corrigé ici pour passer l'id, pas le label
                        className={`${styles.iconButton} ${activeSection === section.id ? styles.active : ''}`}
                    >

                        <IconComponent className={styles.iconSvg}/>
                    </div>
                );
            })}
        </div>
    );
};

export default IconSidebar;