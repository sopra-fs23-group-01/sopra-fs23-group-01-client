import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/Login.scss';
import PropTypes from "prop-types";
import LoginPic from 'styles/image/Pics4login/LoginPic.png';
import HideIcon from "../../styles/image/Icons/HideIcon.png";
import ShowIcon from "../../styles/image/Icons/ShowIcon.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import PasswordIcon from "../../styles/image/Icons/PasscodeIcon.png";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => +props.onChange(e.target.value)}
      />
    </div>
  );
};

//Difine an area to input the password
const PasswordField = props => {
  const [showPassword, setShowPassword] = useState(false);
  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>

      <input type={showPassword ? 'text' : 'password'} 
        className="login input"
        placeholder="enter here..."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
        <img className="login nameicon" src={NameIcon} alt="Username" />
        <img className="login passwordicon" src={PasswordIcon} alt="Password" />
        <div onClick={toggleShowPassword }>{showPassword ? <img className="login showicon" src={HideIcon} alt="LoginIllustration" /> : <img className="login showicon" src={ShowIcon} alt="LoginIllustration" /> }</div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users/login', requestBody);
      console.log(response);
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id',user.id);
      localStorage.setItem('username',user.username);
      toast.success("Login successfully!", { autoClose: false });
      // Wait for Toast component to disappear before navigating to leaderboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/leaderboard`);
    } catch (error) {
      toast.error(`Your username or password is incorrect!`);
    }
  };

  return (
      <div className="login container">
        <ToastContainer />
          <img className="login pic" src={LoginPic} alt="LoginIllustration" />
          <div className="login welcomeline1">Welcome Back!</div>
          <div className="login welcomeline2">Detective, we miss u!</div>
            <div className="login form">
              <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={n => setPassword(n)}

              />
              <div className="login button-container">
                <Button
                  disabled={!username || !password || username.trim() ===" " || password.trim() ===" "}
                  width="100%"
                  onClick={() => doLogin()}
                >
                  login
                </Button>
              </div>
              <div className="login tosignup">
                  -Don't have an account?
                <Link to={`/register`}>Sign up</Link>
                  -
              </div>
            </div>
      </div>
  );
};

export default Login;
