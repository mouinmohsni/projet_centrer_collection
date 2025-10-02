import  { useState } from 'react';
import styles from './assets/css/AppLayout.module.css'; // Assurez-vous que le chemin est correct
import TopBar from './components/navigation/TopBar'; // Assurez-vous que le chemin est correct
import IconSidebar from './components/navigation/IconSidebar'; // Assurez-vous que le chemin est correct
import Sidebar from './components/navigation/Sidebar'; // Assurez-vous que le chemin est correct
import ContentData from './components/navigation/ContentData'; // Assurez-vous que le chemin est correct

const AppLayout = () => {
    // --- ÉTATS ---
    const [isSidebarOpen, setSidebarOpen] = useState(true); // 'true' est mieux pour le dev
    const [activeSection, setActiveSection] = useState<string | null>('dashboard'); // Mieux de commencer avec un id
    const [labelSection, setLabelSection] = useState<string | null>('Tableau de Bord');
    const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

    // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
    const handleIconClick = (sectionName: string, label: string) => {
        if (isSidebarOpen && activeSection === sectionName) {
            setSidebarOpen(false);
            setActiveSection(null);
            setLabelSection(null);
        } else {
            setSidebarOpen(true);
            setActiveSection(sectionName);
            setLabelSection(label);
        }
    };

    const handleSubItemClick = (subItemName: string) => {
        setActiveSubItem(subItemName);
    };

    const handleBackToMenu = () => {
        setActiveSubItem(null);
    };

    // --- RENDU DU COMPOSANT ---
    return (
        <div className={styles.pageWrapper}>
            <TopBar
                labelSection={labelSection}
                onBackClick={handleBackToMenu}
                activeSubItem={activeSubItem}
            />

            {/* La classe 'contentVisibleMobile' est ajoutée si un sous-item est actif */}
            <div className={`${styles.appContainer} ${activeSubItem ? styles.contentVisibleMobile : ''}`}>

                {/* --- CONTENEUR DU MENU (visible par défaut sur mobile) --- */}
                <div className={styles.menuContainer}>
                    <div className={styles.iconSidebarWrapper}>
                        <IconSidebar onIconClick={handleIconClick} activeSection={activeSection} />
                    </div>
                    {isSidebarOpen && (
                        <div className={styles.sidebarWrapper}>
                            <Sidebar
                                sectionName={activeSection}
                                labelSection={labelSection}
                                onSubItemClick={handleSubItemClick}
                                activeSubItem={activeSubItem}
                            />
                        </div>
                    )}
                </div>

                {/* --- CONTENEUR DU CONTENU (caché par défaut sur mobile) --- */}
                <main className={styles.pageContent}>
                    <span>  mouin </span>
                    <ContentData activeSubItem={activeSubItem} />
                </main>

            </div>
        </div>
    );
};

export default AppLayout;
