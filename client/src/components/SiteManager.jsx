import React, {Component} from 'react'
import styles from "./SiteManager.module.css";
import {NavLink} from "react-router-dom";
import PageNav from "../components/PageNav";
import Button from "../components/Button.jsx";
import axios from "axios";

export default class SiteManager extends Component {
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
        this.getUserInfo(1)
        this.getUserInfo(2)
        this.getUserInfo(3)
    }

    changeUser = (id, type) => {
        if (id) {
            if (type === 1) {
                this.setState({
                    p: id
                })
            } else if (type === 2) {
                this.setState({
                    p1: id
                })
            } else if (type === 3) {
                this.setState({
                    p2: id
                })
            }
        }
    }
    submitUser = (info) => {
        console.log("submitUser");
        let a = true
        if (info == 1) {
            if ('' === this.state.p || null === this.state.p) {
                a = false
            }
        } else if (info == 2) {
            if ('' === this.state.p1 || null === this.state.p1) {
                a = false
            }
        } else if (info == 3) {
            if ('' === this.state.p2 || null === this.state.p2) {
                a = false
            }
        }
        if (a) {
            axios
                .post("http://localhost:3000/submitUser", {
                    p: this.state.p,
                    p1: this.state.p1,
                    p2: this.state.p2,
                    type: info
                })
                .then((response) => {
                    if (response.data.success === true) {
                        if (info === 1) {
                            window.alert("Grant privilege successfully!");
                            window.location.reload()
                        } else if (info === 2) {
                            window.alert("Deactivate the account successfully!");
                            window.location.reload()
                        } else if (info === 3) {
                            window.alert("Unhide the review successfully!");
                            window.location.reload()
                        }
                    }
                })
                .catch(() => {
                });
        } else {
            window.alert("Select an account first!");
        }
    }
    getUserInfo = (info) => {
        axios
            .post("http://localhost:3000/getUser", {type: info})
            .then((response) => {
                if (response.data.meta.status === 200) {
                    if (info == 1) {
                        this.setState({options: response.data.data.users});
                    } else if (info == 2) {
                        this.setState({options1: response.data.data.users});
                    } else if (info == 3) {
                        this.setState({options2: response.data.data.users});
                    }
                    console.log("Registered Return", this.state.options);
                }
            })
            .catch(() => {
                window.alert("Registration failed, please try again later.");
            });
    }

    render() {
        return (
            <main className={styles.homepage}>
                <PageNav/>
                <section>
                    <ul className={styles.ul}>
                        <li>
                            <h2> Grant Access<br/>
                                Give access to:<br/></h2>
                            <select className={styles.sel} onChange={(e) => {
                                this.changeUser(e.target.value, 1)
                            }}>
                                <option value="">Choose the email</option>
                                {this.state.options.map(item => {
                                    return <option key={item.id} value={item.id}>{item.username}</option>
                                })}
                            </select>
                            <div className={styles.registerLink}>
                                <Button type="primary"
                                        onClick={(e) => {
                                            this.submitUser(1)
                                        }}>Grant</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        </li>
                        <li>
                            <h2> Deactivate Account<br/>
                                Forbid login to:<br/></h2>
                            <select className={styles.sel} onChange={(e) => {
                                this.changeUser(e.target.value, 2)
                            }}>
                                <option value="">Choose the email</option>
                                {this.state.options1.map(item => {
                                    return <option key={item.id} value={item.id}>{item.username}</option>
                                })}
                            </select>
                            <div className={styles.registerLink}>
                                <Button type="primary"
                                        onClick={(e) => {
                                            this.submitUser(2)
                                        }}>Deactivate</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        </li>

                        <li>
                            <h2> Activate Account<br/>
                                Grant login to:<br/></h2>
                            <select className={styles.sel} onChange={(e) => {
                                this.changeUser(e.target.value, 3)
                            }}>
                                <option value="">Choose the email</option>
                                {this.state.options2.map(item => {
                                    return <option key={item.id} value={item.id}>{item.username}</option>
                                })}
                            </select>
                            <div className={styles.registerLink}>
                                <Button type="primary"
                                        onClick={(e) => {
                                            this.submitUser(3)
                                        }}>Activate</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        </li>
                    </ul>
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
}
