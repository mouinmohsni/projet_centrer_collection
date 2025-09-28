import * as React from "react";
import styles from "./assets/css/AppLayout.module.css";
import  IconSidebar from "./components/navigation/IconSidebar.tsx";
import  Sidebar from "./components/navigation/Sidebar.tsx";
import ContentData from "./components/navigation/ContentData.tsx";
import {useState} from "react";



interface AppLayout  {
    children?: React.ReactNode;
}

const AppLayout = () => {

    const [isSidebarOpen,setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>('Dashboard');

    // const toggelSidebar=()=>{
    //     setSidebarOpen(!isSidebarOpen) ;
    //
    // };

    const handleIconClick= (sectionName : string) =>{
        if(isSidebarOpen && activeSection === sectionName){
            setSidebarOpen(false);
            setActiveSection(null);
        }else {
            setSidebarOpen(true);
            setActiveSection(sectionName);
        }

    }


    return (
        <div className={styles.appContainer}>
            <div className={styles.iconSidebarWrapper}>
                <IconSidebar  onIconClick={handleIconClick}
                              activeSection={activeSection}  />
            </div>


            {isSidebarOpen && (
                <div className={styles.sidebarWrapper}>
                    <Sidebar sectionName={activeSection} />
                </div>
            )}

            <main className={styles.mainContent}>
                <ContentData />
            </main>
        </div>
    );
};

export default AppLayout;