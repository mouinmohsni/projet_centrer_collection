import {useState} from "react";
import styles from "../../assets/css/Sidebar.module.css";
import ChevronIcon from "../icon/ChevronIcon.tsx";



interface SidebarProps {
    sectionName: string | null; // Il doit accepter un 'string' ou 'null'
    labelSection :  string | null;
}

const menuData = {
    // Clé 'dashboard' correspond à l'id: 'dashboard'
    dashboard: [
        { title: 'Vue d\'ensemble', items: ['Statistiques clés', 'Alertes récentes'] },
        { title: 'Rapports', items: ['Rapport journalier', 'Rapport mensuel'] },
    ],
    // Clé 'executions' correspond à l'id: 'executions'
    executions: [
        { title: 'Tournées Actives', items: ['Carte en direct', 'Statuts des livraisons'] },
        { title: 'Planification', items: ['Créer une tournée', 'Optimiser les trajets'] },
    ],
    // Clé 'Circuits' correspond à l'id: 'Circuits'
    Circuits: [
        { title: 'Gestion des Circuits', items: ['Liste des circuits', 'Ajouter un circuit'] },
        { title: 'Points d\'arrêt', items: ['Clients', 'Entrepôts'] },
    ],
    // Clé 'invoices' correspond à l'id: 'invoices'
    invoices: [
        { title: 'Factures Clients', items: ['En attente', 'Payées', 'En retard'] },
        { title: 'Générer', items: ['Facturation par client', 'Facturation par période'] },
    ],
    // Clé 'users' correspond à l'id: 'users'
    users: [
        { title: 'Utilisateurs', items: ['Liste des employés', 'Ajouter un utilisateur'] },
        { title: 'Rôles & Permissions', items: ['Gérer les rôles'] },
    ],
    // Clé 'vehicles' correspond à l'id: 'vehicles'
    vehicles: [
        { title: 'Flotte', items: ['Liste des véhicules', 'Ajouter un véhicule'] },
        { title: 'Maintenance', items: ['Planifier une intervention', 'Historique'] },
    ],
    // Clé 'catalog' correspond à l'id: 'catalog'
    catalog: [
        { title: 'Produits', items: ['Tous les produits', 'Ajouter un produit'] },
        { title: 'Catégories', items: ['Gérer les catégories'] },
    ],
    // Clé 'settings' correspond à l'id: 'settings'
    settings: [
        { title: 'Mon Compte', items: ['Profil', 'Changer le mot de passe'] },
        { title: 'Application', items: ['Notifications', 'Thème'] },
    ],
};

const Sidebar = ({sectionName,labelSection}:SidebarProps) => {
    console.log("labelSection ic",labelSection)

    // Un état pour savoir quel accordéon est ouvert. On stocke son titre.
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [activeSubItem, setActiveSubItem] = useState<string | null>('Statistiques');

    // La liste des menus à afficher pour la section active
    const currentMenuItems = sectionName ? menuData[sectionName as keyof typeof menuData] : [];

    const handleAccordionClick = (title: string) => {
        // Si on clique sur l'accordéon déjà ouvert, on le ferme. Sinon, on ouvre le nouveau.
        setOpenAccordion(openAccordion === title ? null : title);
    };
    return (
        <div className={styles.sidebarContainer}>
            <h1 className={styles.title}>{labelSection}</h1>



            <nav className={styles.navigation}>
                {currentMenuItems.map((menu) => (
                    <div key={menu.title} className={styles.accordionItem }>

                        <button
                            className={styles.accordionTitle}
                            onClick={() => handleAccordionClick(menu.title)}
                            aria-expanded={openAccordion === menu.title}
                            aria-controls={menu.title + "-content"}
                        >
                            <ChevronIcon className={`${styles.chevron} ${openAccordion === menu.title ? styles.chevronOpen : ''}`} />
                            {menu.title}
                        </button>
                        {/* On affiche le contenu seulement si l'accordéon est ouvert */}
                        {openAccordion === menu.title && (
                            <ul  id={menu.title + "-content"} className={styles.accordionContent}>
                                {menu.items.map((item) => (
                                    <li key={item} className={`${styles.subItem} ${activeSubItem === item ? styles.subItemActive : ''}`}
                                        onClick={() => setActiveSubItem(item)}>{item}</li>
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