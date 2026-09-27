import React, {Component, useEffect} from "react";
import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import Map from "../components/Map";
import User from "../components/User";
import Logo from "../components/Logo";

export default class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: true,
            options: [],
            options1: [],
            options2: [],
            p: null,
            p1: null,
            p2: null
        };
    }

    componentDidMount() {
        let userRole = sessionStorage.getItem("userRole");
        let isLogin = sessionStorage.getItem("isLoggedIn");
        if(isLogin) {
            if(userRole !='admin') {
                window.location.href="/login";
            }
        } else {
            window.location.href="/login";
        }
    }
    render() {
        return (
            <div className={styles.app}>
                <Sidebar/>
                <Map/>
                <User/>
            </div>
        );
    }
}
