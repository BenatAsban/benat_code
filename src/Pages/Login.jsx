import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Components/Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the token and login status in localStorage
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("keepLoggedIn", JSON.stringify(true));

      navigate("/privatepage");
      const userData = { email };
      onLogin(userData);

      toast.success("User Login Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("keepLoggedIn", JSON.stringify(true));

      navigate("/privatepage");
      onLogin({ email: user.email });

      toast.success("Google login successful!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      className="login-container"
    >
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Email Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="email">Email Address</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Social Login Options */}
        <div className="social-login">
          <button className="social-btn google-btn" onClick={handleGoogleSignIn}>
            <FcGoogle className="google-icon" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>

        <div className="owner-login">
          <button onClick={() => navigate("/loginD")} className="owner-btn">
            Owner Login
          </button>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          margin-top: 100px;
          overflow: hidden;
        }
        
        .login-card {
          background: #121212;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 450px;
          padding: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .login-header h2 {
          color: #e1d9d1;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .login-header p {
          color: #7f8c8d;
          font-size: 16px;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #e1d9d1;
          font-weight: 600;
          font-size: 14px;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
          font-size: 18px;
        }
        
        .input-with-icon input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border: 2px solid #333;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
          background: #1e1e1e;
          color: #e1d9d1;
        }
        
        .input-with-icon input:focus {
          border-color: #b19cd9;
          box-shadow: 0 0 0 3px rgba(177, 156, 217, 0.3);
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #b19cd9 0%, #b19cd9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(37, 117, 252, 0.3);
        }
        
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 117, 252, 0.4);
        }
        
        .divider {
          position: relative;
          margin: 30px 0;
          text-align: center;
        }
        
        .divider:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #333;
          z-index: 1;
        }
        
        .divider span {
          display: inline-block;
          background: #121212;
          padding: 0 15px;
          position: relative;
          z-index: 2;
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .social-login {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .social-btn {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #333;
          background: #1e1e1e;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #e1d9d1;
        }
        
        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          background: #2a2a2a;
        }
        
        .social-btn.google-btn {
          border: 1px solid #333;
        }
        
        .social-btn.google-btn:hover {
          background: #2a2a2a;
        }
        
        .google-icon {
          font-size: 20px;
        }
        
        .login-footer {
          text-align: center;
          margin-top: 25px;
          color: #7f8c8d;
          font-size: 15px;
        }
        
        .login-footer a {
          color: #b19cd9;
          text-decoration: none;
          font-weight: 600;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }

        .owner-login {
          margin-top: 20px;
          text-align: center;
        }

        .owner-btn {
          background: none;
          border: none;
          color: #b19cd9;
          font-size: 13px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;
          text-decoration: underline;
        }

        .owner-btn:hover {
          opacity: 1;
          color: #d0b8ff;
        }

        @media screen and (max-width: 480px) {
          .login-container {
            margin-top: 50px;
            padding: 15px;
          }
          
          .login-card {
            padding: 30px 25px;
          }
          
          .login-header h2 {
            font-size: 28px;
          }
          
          .login-header p {
            font-size: 14px;
          }
        }

        @media screen and (max-width: 320px) {
          .login-header h2 {
            font-size: 24px;
          }

          .login-header p {
            font-size: 12px;
          }

          #email::placeholder,
          #password::placeholder {
            font-size: 12px;
          }

          .input-with-icon i {
            font-size: 14px;
          }

          .login-btn {
            padding: 12px;
            font-size: 16px;
          }

          .social-btn {
            padding: 10px;
            font-size: 14px;
          }

          .google-icon {
            font-size: 18px;
          }

          .login-footer {
            font-size: 14px;
          }
        }
      `}</style>

      {/* Font Awesome for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </motion.div>
  );
}

export default Login;