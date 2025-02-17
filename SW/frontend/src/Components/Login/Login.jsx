import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        };
    
    loginUser(newUser, dispatch, navigate);
    };
    
    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleLogin}>
                <label>USERNAME</label>
                <input type="text" placeholder="Enter your username" onChange={(e) => setUserName(e.target.value)}/>
                <label>PASSWORD</label>
                <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit"> Login </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register</Link>
        </section>
     );
}
 
export default Login;