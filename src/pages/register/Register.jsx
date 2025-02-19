import axios from "axios";
import { useRef, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const handleStart = () => {
    setEmail(emailRef.current.value);
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setPassword(passwordRef.current.value);
    setUsername(usernameRef.current.value);
    try {
      await axios.post(
        "https://backendnetflix-paxc.onrender.com/api/auth/register",
        { email, username, password }
      );
      history.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      // Handle registration error if needed
    }
  };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder="email address" ref={emailRef} />
            <br />

            <button className="registerButton" onClick={handleStart}>
              S'inscrire
            </button>
          </div>
        ) : (
          <form className="input">
            <input type="text" placeholder="username" ref={usernameRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button className="registerButton" onClick={handleFinish}>
              Commencez
            </button>
          </form>
        )}
        <br />
        <br />
        <br />
  
        <button className="logbutton" onClick={handleLogin}>
          Se Connecter
        </button>
      </div>
    </div>
  );
};

export default Register;
