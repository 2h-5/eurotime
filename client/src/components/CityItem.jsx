import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

function CityItem({ city }) {
  const { cityName, emoji, date, id, position, rate } = city;
  const { currentCity, deleteCity } = useCities();

  function handleClick(e) {
    debugger
    window.location.href=`form?lat=${position.lat}&lng=${position.lng}&id=${id}`;
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{rate}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.data}>({date})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          EDIT
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
