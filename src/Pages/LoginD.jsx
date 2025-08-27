import React, { useState } from "react";
import { auth } from "../Components/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const LoginD = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Authentication failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <style>
          {`
                    .login-page {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: #333;
                    }
                    
                    .login-form {
                        background: #1e1e1e;
                        padding: 2.5rem;
                        border-radius: 10px;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
                        width: 100%;
                        max-width: 450px;
                    }
                    
                    .form-title {
                        text-align: center;
                        color: #fff;
                        margin-bottom: 2rem;
                        font-size: 1.8rem;
                        font-weight: 600;
                    }
                    
                    .form-group {
                        margin-bottom: 1.8rem;
                    }
                    
                    .form-group label {
                        display: block;
                        margin-bottom: 0.8rem;
                        color: #e0e0e0;
                        font-weight: 500;
                    }
                    
                    .form-group input {
                        width: 100%;
                        padding: 1rem;
                        background: #2d2d2d;
                        border: 1px solid #444;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 1rem;
                        transition: border 0.3s ease;
                    }
                    
                    .form-group input:focus {
                        outline: none;
                        border-color: #4CAF50;
                    }
                    
                    .login {
                        width: 100%;
                        height: 20%;
                        padding: 1rem;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .login:hover {
                        background: #45a049;
                    }
                    
                    .login:disabled {
                        background: #4CAF50;
                        opacity: 0.7;
                        cursor: not-allowed;
                    }
                    
                    .error-message {
                        color: #f44336;
                        text-align: center;
                        margin-top: 1.5rem;
                        font-size: 0.95rem;
                    }
                    
                    .spinner {
                        width: 20px;
                        height: 20px;
                        border: 3px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top: 3px solid #fff;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
        </style>

        <div className="login-form">
          <h2 className="form-title">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              className="login"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Authenticating...
                </>
              ) : "Login"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default LoginD;