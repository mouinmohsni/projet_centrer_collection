// import * as React from 'react';
import styles from "../../assets/css/TopBar.module.css"
import Utilisateurs from "../icon/Utilisateurs.tsx";

type Props = {
    labelSection: string | null,
    onBackClick?: () => void,
    activeSubItem?: string | null
};
const TopBar = ({labelSection,onBackClick,activeSubItem}: Props) => {
    return (
        <div>
            <header className={styles.topBarContainer}>
                <div className={styles.leftSection}>
                    {/* --- LOGIQUE D'AFFICHAGE CONDITIONNEL --- */}
                    {activeSubItem ? (
                        // Si on est en vue contenu, on affiche un bouton "Retour"
                        <button onClick={onBackClick} className={styles.backButton}>
                            &lt; Retour
                        </button>
                    ) : (
                        // Sinon, on affiche "Bienvenue"
                        <span>Bienvenue</span>
                    )}
                </div>
                {/*<div>*/}
                {/*    <span> {labelSection || 'Bienvenue'} </span>*/}
                {/*</div>*/}
                <div className={styles.centerSection}>
                    {/* On affiche le titre de la page active */}
                    <span>{labelSection || ''}</span>
                </div>

                <div className={styles.profileSection}>
                    <span> utilisateur</span>
                    <Utilisateurs className={styles.iconSvg}/>
                </div>
            </header>

        </div>
    );
};

export default TopBar;