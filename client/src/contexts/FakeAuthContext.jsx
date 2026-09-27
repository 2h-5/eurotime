import { createContext, useContext, useReducer } from "react";
import { getHomeMultidata, updatePwd } from "../service/index";
import { message } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case "logout":
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("pwd");
      sessionStorage.removeItem("isLoggedIn");
      return { ...state, user: null, isAuthenticated: false };

    default:
      throw new Error("UnKnown action");
  }
}

let FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
  let values = {
    username: email,
    password: password
  }
    getHomeMultidata(values).then((res) => {
      if(res != undefined) {
        if (res.meta.status === 200) {
          message.info("Login successful!");
          console.log("Login successful!", res);
          window.alert('Login successful!');
          FAKE_USER = {
            name: res.meta.nickname,
            email: res.meta.username,
            avatar: "",
            id: res.meta.id,
            role: res.meta.role
          };
          sessionStorage.setItem("user", FAKE_USER);
          sessionStorage.setItem("userRole", res.meta.role);
          sessionStorage.setItem("id", res.meta.id);
          sessionStorage.setItem("isLoggedIn", true);
          sessionStorage.setItem("nickname", res.meta.nickname);
          dispatch({ type: "login", payload: FAKE_USER });
        } else if (res.meta.status === 204) {
          window.alert('Your account has been deactivated, please contact administrator!');
        } else {
          window.alert(res.message);
        }
      } else {
        window.alert("Wrong username or password.");
      }
    });

  }


  function updatePwd1(id, opassword, password) {
    let values = {
      id: id,
      password: password,
      opassword:opassword
    }
    updatePwd(values).then((res) => {
      if(res != undefined) {
        debugger
        if (res.success === true) {
          message.info("login success");
          window.alert(res.message);
          window.location.href="/login"
        } else if (res.status === 401) {
          window.alert('Original password not match!');
        } else {
          window.alert(res.message);
        }
      } else {
        window.alert("Original password not match!");
      }
    });

  }

  function register(email, password, nickname, userType, roleType) {
    let values = {
      username: email,
      password: password,
      nickname:nickname,
      userType:userType,
      roleType:roleType
    }

    console.log("Registered send: username", values.username);
    console.log("Registered send, password", values.password);
    axios
        .post("http://localhost:3000/register", {
          username: values.username,
          password: values.password,
          nickname: values.nickname,
          userType:values.userType,
          roleType:values.roleType
        })
        .then((response) => {
          console.log("Registered Return", response);
          if (response.data.success) {
            window.alert("register success, please login");
            window.location.href="/login"; 
          } else {
            window.alert(response.data.message);
          }
        })
        .catch(() => {
          window.alert("register error");
        });

  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updatePwd1 }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext is used outside auth provider");
  return context;
}

export { AuthProvider, useAuth };
