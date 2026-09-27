import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function UpdatePwd() {
  const { updatePwd1, isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [opassword, setOPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if(opassword.trim().length==0) {
      window.alert('Original Password cannot be empty!');
      return
    }

    if(password.trim().length==0) {
      window.alert('New Password cannot be empty!');
      return
    }

    if(opassword.trim().length<6) {
      window.alert('Original Password must be greater than 6 digits!');
      return
    }

    if(password.trim().length<6) {
      window.alert('New Password must be greater than 6 digits!');
      return
    }

    if (opassword && password) {
      updatePwd1(sessionStorage.getItem("id"), opassword, password);
    }
  }


  useEffect(
    function () {
      console.log(isAuthenticated);
      if (isAuthenticated === true) {
        navigate("/app", { replace: true }); 
      }
    },
    [isAuthenticated, navigate]
  );
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="opassword">Original Password</label>
          <input
            type="password"
            id="opassword"
            onChange={(e) => setOPassword(e.target.value)}
            value={opassword}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className={styles.registerLink}>
          <Button type="primary"  onClick={handleSubmit}>Submit</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </form>
    </main>
  );
}
