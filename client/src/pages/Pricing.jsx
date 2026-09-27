import styles from "./Product.module.css";
import PageNav from "../components/PageNav";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            <br />
          </h2>
          <p>
          </p>
        </div>
        <img src="background.jpg" alt="" />
      </section>
    </main>
  );
}
