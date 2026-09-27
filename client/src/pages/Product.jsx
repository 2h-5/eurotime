import styles from "./Product.module.css";
import PageNav from "../components/PageNav";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="background.jpg"
          alt=""
        />
        <div>
          <h2></h2>
          <p>
          </p>
          <p>
          </p>
        </div>
      </section>
    </main>
  );
}
