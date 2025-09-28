import React ,{useState} from "react";
import styles from "../../assets/css/Sidebar.module.css";
import ChevronIcon from "../element/ChevronIcon.tsx";


interface Sidebar {
    activePanel : string ;
    children?: React.ReactNode;
}
interface SidebarProps {
    sectionName: string | null; // Il doit accepter un 'string' ou 'null'
}

const menuData = {
    Dashboard: [
        { title: 'Aperçu', items: ['Statistiques', 'Rapports'] },
        { title: 'Activité récente', items: ['Ventes', 'Inscriptions'] },
    ],
    Analytics: [
        { title: 'Trafic', items: ['Visiteurs', 'Sources'] },
        { title: 'Engagement', items: ['Taux de rebond', 'Temps passé'] },
    ],
    Settings: [
        { title: 'Profil', items: ['Mon compte', 'Sécurité'] },
        { title: 'Facturation', items: ['Abonnement', 'Historique'] },
    ],
};

const Sidebar = ({sectionName}:SidebarProps) => {

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
            <h1 className={styles.title}>{sectionName}</h1>



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