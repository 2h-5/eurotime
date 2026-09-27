import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";

export default function Login() {
  const { state } = useLocation();
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if(email.trim().length==0) {
      window.alert('Please enter an email address!');
      return
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = regex.test(email);

    if(!isValid) {
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
      register(email, password,nickname,'authenticated','user');
    }
  }

  function handleSubmitWithout(e) {
    e.preventDefault();
    if(email.trim().length==0) {
      window.alert('Please enter an email address!');
      return
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = regex.test(email);

    if(!isValid) {
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
      window.alert('Please verify your email!');
      register(email, password,nickname,'unauthenticated','user');
    }
  }

  function verifyEmail(e) {
    e.preventDefault();
    if(email.trim().length==0) {
      window.alert('Please enter an email address!');
      return
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = regex.test(email);

    if(!isValid) {
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
      navigate("/verifyEmail?email="+email+"&password="+password+"&nickname="+nickname, { replace: false });
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="nickname">Nickname</label>
          <input
              type="input"
              id="Nickname"
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
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
        <div  className={styles.registerLink}>
          <Button type="primary"  onClick={verifyEmail}>VERIFY YOUR EMAIL</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div  className={styles.registerLink}>
          <Link onClick={handleSubmitWithout} className={styles.linkColor}>Continue without verifying your email.</Link>
        </div>
      </form>
    </main>
  );
}
