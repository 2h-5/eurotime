import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if(email.trim().length==0) {
      window.alert('Please enter an email address!');
      return
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = regex.test(email);

    if(!isValid && email!=='admin') {
      window.alert('Email format error!');
      return
    }

    if(password.trim().length==0) {
      window.alert('Password cannot be empty!');
      return
    }

    if(password.trim().length<6) {
      window.alert('Password must be greater than 6 digits!');
      return
    }

    if (email && password) {
      login(email, password);
    }
  }

  function handleReg(e) {
    e.preventDefault();
    if (email && password) {
      register(email, password);
    }
  }

  function handleReg(e) {
    navigate("/app", { replace: true });
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className={styles.registerLink}>
          <Button type="primary"  onClick={handleSubmit}>Login</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div  className={styles.registerLink}>
          <Link to="/register" className={styles.linkColor}>Do not have an account? Register here!</Link>
        </div>
      </form>
    </main>
  );
}
