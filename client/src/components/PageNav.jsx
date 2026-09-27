import {NavLink} from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

function PageNav() {
    return (
        <nav className={styles.nav}>
            <Logo/>
            <ul>
                <li>
                    <NavLink to="/app/cities">
                        Search & Reviews
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/CreateList">
                        Create List
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/SiteManager">
                        Site Manager
                    </NavLink>
                </li>
            </ul>
            <ul>
                <li>
                    <NavLink to="/login" className={styles.ctaLink}>
                        Login
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default PageNav;
