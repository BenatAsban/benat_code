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
  const [loginMethod] = useState('email');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  // Initialize reCAPTCHA
  // useEffect(() => {
  //   try {
  //     recaptchaVerifier.current = new RecaptchaVerifier(
  //       'recaptcha-container',
  //       {
  //         'size': 'invisible',
  //         'callback': (response) => {
  //           // reCAPTCHA solved, allow request
  //         }
  //       },
  //       auth
  //     );
  //   } catch (err) {
  //     console.error("reCAPTCHA initialization error:", err);
  //     setError("Failed to initialize reCAPTCHA. Please refresh the page.");
  //   }

  //   return () => {
  //     if (recaptchaVerifier.current) {
  //       recaptchaVerifier.current.clear();
  //     }
  //   };
  // }, []);

  // const sendOTP = async () => {
  //   setLoading(true);
  //   setError('');
  //   try {
  //     const formattedPhone = `+${phone.replace(/[^\d]/g, '')}`;

  //     if (!recaptchaVerifier.current) {
  //       throw new Error("reCAPTCHA not initialized");
  //     }

  //     const result = await signInWithPhoneNumber(
  //       auth,
  //       formattedPhone,
  //       recaptchaVerifier.current
  //     );
  //     setConfirmationResult(result);
  //   } catch (err) {
  //     setError(err.message);
  //     console.error("OTP send error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const verifyOTP = async () => {
  //   setLoading(true);
  //   setError('');
  //   try {
  //     await confirmationResult.confirm(otp);
  //     navigate('/private');
  //   } catch (err) {
  //     setError("Invalid OTP. Please try again.");
  //     console.error("OTP verification error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



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

      navigate("/Privatepage");
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
    <motion.div variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible" className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Authentication Method Selector */}
        {/*<div className="auth-method-selector">

          <button
            className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
            data-method="phone"
          >
            <i className="fas fa-mobile-alt"></i> Phone
          </button>
          <button
            className={`method-btn ${loginMethod === 'google' ? 'active' : ''}`}
            onClick={handleGoogleSignIn}
          >
            <i className="fab fa-google"></i> Google
          </button>
          <button
            className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            <i className="fas fa-envelope"></i> Email
          </button>
        </div>*/}

        {/* Phone Login Form */}
        {/* Phone Number Form (Shown by default) */}
        {/*{loginMethod === "phone" && !otpSent && (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <i className="fas fa-mobile-alt"></i>
                <input
                  type="text"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phone}  // Fixed: should be phone state variable
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div id="recaptcha-container" />
              </div>
            </div>

            <button
              className="login-btn"
              type="submit"
              onClick={() => {
                sendOTP();
                setOtpSent(true);  // Update state when OTP is sent
              }}
              disabled={loading || !phone}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </Form>
        )}*/}

        {/* OTP Form (Shown only after OTP is sent) */}
        {/*{loginMethod === 'phone' && otpSent && (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>  
        <div className="input-with-icon">
          <i className="fas fa-lock"></i>  
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        className="login-btn"
        type="submit"
        onClick={verifyOTP}
        disabled={loading || otp.length < 6}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </Form>
  )
}*/}


        {/* Email Login Form */}
        {
          loginMethod === 'email' && (
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
                    type={showConfirmPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>
            </form>
          )
        }



        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Social Login Options */}
        <div className="social-login">
          <button className="social-btn google-btn" onClick={handleGoogleSignIn}>
            <FcGoogle size={25} />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div >

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
        
        .auth-method-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }
        
        .method-btn {
          flex: 1;
          padding: 12px 15px;
          border: 2px solid #333;
          border-radius: 10px;
          background: #1e1e1e;
          color: #e1d9d1;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .method-btn:focus {
          border-color: #b19cd9;
          box-shadow: 0 0 0 3px rgba(177, 156, 217, 0.3);
        }

        .method-btn.active {
          background: #b19cd9 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(177, 156, 217, 0.3) !important;
        }

        // .method-btn.google-btn.active {
        //   background: #b19cd9;
        //   background: #fff;
        //   border: 1px solid #dfe4ea;
        // }
        
        // .method-btn.google-btn:focus {
        //   border-color: #b19cd9;
        //   box-shadow: 0 0 0 3px rgba(177, 156, 217, 0.3);
        // }
        
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
        
        .forgot-password {
          text-align: right;
          margin-top: 8px;
        }
        
        .forgot-password a {
          color: #3498db;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .forgot-password a:hover {
          color: #2980b9;
          text-decoration: underline;
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
        
        .otp-resend {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
        }
        
        .otp-resend button {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
        }
        
        .otp-resend button:hover {
          text-decoration: underline;
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
          background: #e0e0e0;
          z-index: 1;
        }
        
        .divider span {
          display: inline-block;
          background: #fff;
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
          border: 1px solid #e0e0e0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        
        .social-btn.google-btn {
          color: #3c4043;
          border: 1px solid #dadce0;
        }
        
        .social-btn.google-btn:hover {
          background: #f8f9fa;
        }
        
        .social-btn i {
          font-size: 20px;
        }
        
        .social-btn.google-btn i {
          color: #4285f4;
        }
        
        .login-footer {
          text-align: center;
          margin-top: 25px;
          color: #7f8c8d;
          font-size: 15px;
        }
        
        .login-footer a {
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
          
          .auth-method-selector {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Font Awesome for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </motion.div >
  );
}

export default Login;