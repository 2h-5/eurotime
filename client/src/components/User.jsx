import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";
import {Nav, NavDropdown, Dropdown} from 'react-bootstrap';
import React, {useState} from "react";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const nickname = sessionStorage.getItem("nickname")

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function handleClick() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("nickname");
    logout();
    navigate("/");
  }

  function renderPwd () {
    window.location.href = "/updatePwd"
  }

  return (
    <div className={styles.user}>
      <span onClick={toggleDropdown}>Welcome, {nickname}</span>
      <button onClick={handleClick}>Logout</button>
      {isOpen && (
          <ul className={styles.dropdownmenu}>
            <li onClick={renderPwd}>Update Password</li>
          </ul>
      )}
    </div>
  );
}

export default User;
