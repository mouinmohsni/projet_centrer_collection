import * as React from "react";
import styles from "./assets/css/AppLayout.module.css";
import  IconSidebar from "./components/navigation/IconSidebar.tsx";
import  Sidebar from "./components/navigation/Sidebar.tsx";
import ContentData from "./components/navigation/ContentData.tsx";
import {useState} from "react";
import TopBar from "./components/navigation/TopBar.tsx";



interface AppLayout  {
    children?: React.ReactNode;
}

const AppLayout = () => {

    const [isSidebarOpen,setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>('Dashboard');
    const [labelSection, setLabelSection] = useState<string | null>('Tableau de Bord');


    const handleIconClick= (sectionName : string,label :string ) =>{
        if(isSidebarOpen && activeSection === sectionName){
            setSidebarOpen(false);
            setActiveSection(null);
            setLabelSection(null)
        }else {
            setSidebarOpen(true);
            setActiveSection(sectionName);
            setLabelSection(label)
        }

    }

    return (
        <div className={styles.pageWrapper}>
            <TopBar />

            {/* 2. Le conteneur pour la partie "sous la TopBar" (votre ancien appContainer) */}
            <div className={styles.appContainer}>
                <div className={styles.iconSidebarWrapper}>
                    <IconSidebar onIconClick={handleIconClick} activeSection={activeSection} />
                </div>

                {isSidebarOpen && (
                    <div className={styles.sidebarWrapper}>
                        <Sidebar sectionName={activeSection} labelSection={labelSection} />
                    </div>
                )}

                <main className={styles.pageContent}>
                    <ContentData />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;