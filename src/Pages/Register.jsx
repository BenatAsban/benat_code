import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Components/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password1) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          Name: name,
          Email: user.email,
        });
      }
      toast.success("User Registered Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
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

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible" className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Create Your Account</h2>
          <p>Start your journey with us</p>
        </div>

        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Create Account
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
          box-shadow: 0 4px 15px rgba(177, 156, 217, 0.3);
        }
        
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(177, 156, 217, 0.4);
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
        
        @media (max-width: 500px) {
          .login-card {
            padding: 30px 20px;
          }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </motion.div>
  );
}

const Header = () => {
  return (
    <header className="header">
      <div
        className="container"
        style={{ position: "relative", left: "560px", bottom: "30px" }}
      >
        <Link
          to="/login"
          className="btn primary"
          style={{ background: "none", border: "none", color: "inherit" }}
        >
          SignIn
        </Link>
      </div>
    </header>
  );
};

export { Header };
export default Register;