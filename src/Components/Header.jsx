import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import Logo from "../Images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

// Register GSAP plugins
gsap.registerPlugin(MorphSVGPlugin, Draggable);

// Enhanced Light Bulb Toggle Component with GSAP
const LightBulbToggle = ({ theme, handleToggleTheme }) => {
  const audioClickRef = useRef(null);

  useEffect(() => {
    audioClickRef.current = new Audio("https://assets.codepen.io/605876/click.mp3");
    audioClickRef.current.volume = 0.3;
  }, []);

  const handleClick = () => {
    if (audioClickRef.current) {
      audioClickRef.current.currentTime = 0;
      audioClickRef.current.play();
    }
    handleToggleTheme();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        width: "40px",
        height: "50px",
        margin: "0 15px",
        cursor: "pointer"
      }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 197.451 481.081"
        style={{ width: "150%", height: "150%", position: "relative", left: "330px" }}
      >
        <g className="toggle-scene__bulb bulb" transform="translate(844.069 -645.213)">
          <path
            className="bulb__cap"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.677"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
            fill={theme === "light" ? "#aaa" : "#888"}
          />
          <path
            className="bulb__cap-outline"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.677"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
            stroke={theme === "light" ? "#666" : "#444"}
          />
          <g className="bulb__filament" fill="none" strokeLinecap="round" strokeWidth="5">
            <path
              d="M-752.914 823.875l-8.858-33.06"
              stroke={theme === "light" ? "#ffbb00" : "#444"}
            />
            <path
              d="M-737.772 823.875l8.858-33.06"
              stroke={theme === "light" ? "#ffbb00" : "#444"}
            />
          </g>
          <path
            className="bulb__bulb"
            strokeLinecap="round"
            strokeWidth="5"
            d="M-783.192 803.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z"
            stroke={theme === "light" ? "#666" : "#444"}
            fill={theme === "light" ? "hsla(45, 80%, 80%, 0.5)" : "hsla(180, 80%, 20%, 0.3)"}
          />
        </g>
      </svg>
    </div>
  );
};

// Header Component
function Header({ isAuthenticated, user, onLogout }) {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Refs for detecting outside clicks
  const navMenuRef = useRef(null);
  const navToggleRef = useRef(null);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Effect to handle clicks outside the navigation
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 880 &&
        isNavShowing &&
        navMenuRef.current &&
        navToggleRef.current &&
        !navMenuRef.current.contains(event.target) &&
        !navToggleRef.current.contains(event.target)) {
        setIsNavShowing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavShowing]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const logout = () => {
    localStorage.clear();
    onLogout();
    navigate("/login");
  };

  const closeNavHandler = () => {
    if (window.innerWidth < 880) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>
        <div id="light-bulb-toggle" style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '5px 0',
        }}>
          <LightBulbToggle theme={theme} handleToggleTheme={handleToggleTheme} />
        </div>

        <style>{`
        .nav-hover::after {
        content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: currentColor;
      transition: all 0.3s ease;
      transform: translateX(-50%);
        }

        .nav-hover:hover::after {
        width: 100%;
        color: #b19cd9;
        }

    .btn-login::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: currentColor;
      transition: all 0.3s ease;
      transform: translateX(-50%);
        }

        .btn-login:hover::after {
        width: 100%;
        color: #b19cd9;
        }

        `}</style>

        {isNavShowing && (
          <ul ref={navMenuRef} className="nav__menu">
            <li className="nav-hover">
              <Link to="/" onClick={closeNavHandler}>
                Dashboard
              </Link>
            </li>
            <li className="nav-hover">
              <Link to="/services" onClick={closeNavHandler}>
                Categories
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-hover">
                  <Link to="/dashboard" onClick={closeNavHandler}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={closeNavHandler}>
                    {user.email}
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="btn-login"
                    onClick={closeNavHandler}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="btn-register"
                    onClick={closeNavHandler}
                    style={styles["btn-register"]}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
        <button
          ref={navToggleRef}
          className="nav__toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default Header;

const styles = {
  "btn-register": {
    backgroundColor: "#b19cd9",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    ":hover": {
      backgroundColor: "#e1d9d1",
    },
  },
};