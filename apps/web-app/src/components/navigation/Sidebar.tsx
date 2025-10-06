import {useState} from "react";
import styles from "../../assets/css/Sidebar.module.css";
import ChevronIcon from "../icon/ChevronIcon.tsx";
import { useNavigate } from 'react-router-dom';


interface SidebarProps {
    sectionName: string | null;
    labelSection: string | null;
    onSubItemClick: (subItemName: string) => void; // Rendre cette prop obligatoire
    activeSubItem: string | null; // Recevoir l'état du parent
}

const menuData = {
    // Clé 'dashboard' correspond à l'id: 'dashboard'
    dashboard: [
        {title: 'Vue d\'ensemble', items: [{label:'Statistiques clés',path: '/' }, {label:'Alertes récentes',path: '/dashboard/alert' }]},
        {title: 'Rapports', items: [{label :'Rapport journalier',path: '/dashboard/jours' }, {label :'Rapport mensuel',path: '/dashboard/rapport/mois' }]},
    ],
    // Clé 'executions' correspond à l'id: 'executions'
    executions: [
        {title: 'Tournées Actives', items: [{label :'Carte en direct',path: '/tournees/live' }, {label :'Statuts des livraisons',path: '/tournees' }]},
        {title: 'Planification', items: [{label :'Créer une tournée',path: '/tournees/ajouter' },{label : 'modifier les trajets',path: '/tournees/update' }]},
    ],
    // Clé 'Circuits' correspond à l'id: 'Circuits'
    Circuits: [
        {
            title: 'Gestion des Circuits',
            items: [{label :'Liste des circuits',path: '/circuits' }, {label :'Ajouter un circuit', path: '/circuit/ajouter' }, {label :'Modifier un circuit', path: '/circuit/modifier' }, {label :'Supprimer un circuit', path: '/circuit/supprimer' }]
        },

    ],
    // Clé 'invoices' correspond à l'id: 'invoices'
    invoices: [
        {title: 'Factures Clients', items: [{label :'En attente', path: '/facture/attente' }, {label :'Payées', path: '/factures/payees' }, {label :'En retard', path: '/facture/retard' }]},
        {title: 'Générer', items: [{label:'Facturation par client', path: '/facture/client' }, {label :'Facturation par période', path: '/facture/periode' }]},
        {
            title: 'Gestion des facture',
            items: [{label :'Ajouter une Facturation', path: '/facture/add' }, {label :'Modifier une Facturation', path: '/facture/update' }, {label :'Supprimer une Facturation', path: 'facture/delete' }]
        },
    ],
    // Clé 'users' correspond à l'id: 'users'
    users: [
        {title: 'Utilisateurs', items: [{label :'Liste des employés', path: '/users' }, {label :'Ajouter un utilisateur', path: '/addUsers' }]},
        {title: 'Rôles & Permissions', items: [{label :'Gérer les rôles', path: '/roles' }]},
    ],
    // Clé 'vehicles' correspond à l'id: 'vehicles'
    vehicles: [
        {title: 'Flotte', items: [{label :'Liste des véhicules', path: '/voitures' }, {label :'Ajouter un véhicule', path: '/voiture/ajouter' }]},
        {title: 'Maintenance', items: [{label :'Planifier une intervention', path: '/voiture/planification' }, {label :'Historique', path: '/voiture/suivie' }]},
    ],
    // Clé 'catalog' correspond à l'id: 'catalog'
    catalog: [
        {title: 'Produits', items: [{label :'Tous les produits', path: '/produits' }, {label :'Ajouter un produit', path: '/produis/add' }]},
        {title: 'Catégories', items: [{label :'Gérer les catégories', path: '/categories' }]},
    ],
    // Clé 'settings' correspond à l'id: 'settings'
    settings: [
        {title: 'Mon Compte', items: [{label :'Profil', path: '/profile' }, {label :'Changer le mot de passe', path: '/password' }]},
        {title: 'Application', items: [{label :'Notifications', path: '/notification' }, {label :'Thème', path: '/theme' }]},
    ],
};

const Sidebar = ({ sectionName, labelSection, onSubItemClick, activeSubItem }: SidebarProps) => {
    const navigate = useNavigate();

    // Un état pour savoir quel accordéon est ouvert. On stocke son titre.
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    // La liste des menus à afficher pour la section active
    const currentMenuItems = sectionName ? menuData[sectionName as keyof typeof menuData] : [];

    const handleAccordionClick = (title: string) => {
        // Si on clique sur l'accordéon déjà ouvert, on le ferme. Sinon, on ouvre le nouveau.
        setOpenAccordion(openAccordion === title ? null : title);
    };

    const handleSubItemClick = (path: string) => {
        navigate(path);
        onSubItemClick(path);
    };
    return (
        <div className={styles.sidebarContainer}>
            <h1 className={styles.title}>{labelSection}</h1>


            <nav className={styles.navigation}>
                {currentMenuItems.map((menu) => (
                    <div key={menu.title} className={styles.accordionItem}>

                        <button
                            className={styles.accordionTitle}
                            onClick={() => handleAccordionClick(menu.title)}
                            aria-expanded={openAccordion === menu.title}
                            aria-controls={menu.title + "-content"}
                        >
                            <ChevronIcon
                                className={`${styles.chevron} ${openAccordion === menu.title ? styles.chevronOpen : ''}`}/>
                            {menu.title}
                        </button>
                        {/* On affiche le contenu seulement si l'accordéon est ouvert */}
                        {openAccordion === menu.title && (
                            <ul id={menu.title + "-content"} className={styles.accordionContent}>
                                {menu.items.map((item) => (
                                    <li
                                        key={item.path}
                                        // 3. Utiliser la prop 'activeSubItem' pour la classe
                                        className={`${styles.subItem} ${activeSubItem === item.path ? styles.subItemActive : ''}`}
                                        // 4. Appeler la fonction du parent au clic

                                            onClick={() => handleSubItemClick(item.path)}
                                    >
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;