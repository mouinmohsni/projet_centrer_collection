// import * as React from 'react';
import styles from "../../assets/css/TopBar.module.css"

// type Props = {
//
// };
 const TopBar = () => {
    return (
        <div>
            <header className={styles.topBarContainer}>
                <div>
                    <span> titre du page</span>
                </div>
                <div className={styles.profileSection}>
                    <span> nom de l'utilisateur</span>
                </div>
            </header>

        </div>
    );
};

export default TopBar ;