import styles from "../../assets/css/IconSidebar.module.css";


interface IconSidebarProps   {
    onIconClick: (sectionName: string) => void; // C'est une fonction qui ne retourne rien
    activeSection: string | null;
}

const IconSidebar = ({onIconClick,activeSection}:IconSidebarProps ) => {
    const sections = [
        { id: 'Dashboard', label: 'D' },
        { id: 'Analytics', label: 'A' },
        { id: 'Settings', label: 'S' },
    ];

    return (
        <div className={styles.iconSidebarContainer}>
            {sections.map((section) => (
                <div
                    key={section.id}
                    // On appelle la fonction du parent au clic, en lui passant l'ID de la section
                    onClick={() => onIconClick(section.id)}
                    // On combine les classes : la classe de base + la classe active si la section est sélectionnée
                    className={`${styles.iconButton} ${activeSection === section.id ? styles.active : ''}`}
                >
                    {section.label}
                </div>
            ))}
        </div>
    );
};

export default IconSidebar;