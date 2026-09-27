import styles from "./verifyEmail.module.css";
import { useState, useEffect } from "react";
import {Link, useNavigate, useLocation, useParams} from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import queryString from 'query-string';

export default function Login() {
  const { state } = useLocation();
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  function handleSubmit(e) {
    debugger
    const values = queryString.parse(window.location.search);
    e.preventDefault();
    if(values.email.trim().length==0) {
      window.alert('Please enter an email address!');
      return
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = regex.test(values.email);

    if(!isValid) {
      window.alert('Email format error!');
      return
    }
    if(values.password.trim().length==0) {
      window.alert('Password cannot be empty!');
      return
    }

    if(values.password.trim().length<6) {
      window.alert('Password must be greater than 6 digits!');
      return
    }
    if (values.email && values.password) {
      register(values.email, values.password,values.nickname,'authenticated','user');
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
          Congratulations! Your email has been verified successfully!
        </div>

        <div  className={styles.registerLink}>
          <Button type="primary"  onClick={handleSubmit}>Next</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </form>
    </main>
  );
}
