import styles from "./Homepage.module.css";
import {Link, NavLink} from "react-router-dom";
import PageNav from "../components/PageNav";
import SP from "../components/SP.jsx";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          EuroTime
        </h1>
        <h2>
          A mapping application for travellers to access detailed information about European destinations, and also build your own collections and ratings based on your choices.
        </h2>
        <Link to="/login" className="cta">
          Try it out now!
        </Link>
      </section>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink to="/SP">
                Security & Privacy
              </NavLink>
            </li>
            <li>
              <NavLink to="/AUP">
                AUP
              </NavLink>
            </li>
            <li>
              <NavLink to="/DP">
                DMCA Policy
              </NavLink>
            </li>
          </ul>
        </nav>
      </footer>
    </main>
  );
}
