import React, { useState, useEffect, useRef } from "react";
import Hero from "../Components/Hero";
import Posts from "../Components/Posts";
import Categories from "../Components/Categories";
import Logo from "../Images/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../Components/Firebase";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

// Register GSAP plugins
gsap.registerPlugin(MorphSVGPlugin, Draggable);

// Light Bulb Toggle Component (same as in Header)
const LightBulbToggle = ({ theme, handleToggleTheme }) => {
  const audioClickRef = useRef(null);
  const [, setIsAnimating] = useState(false);

  useEffect(() => {
    audioClickRef.current = new Audio("https://assets.codepen.io/605876/click.mp3");
    audioClickRef.current.volume = 0.3;
  }, []);

  const handleClick = () => {
    if (audioClickRef.current) {
      audioClickRef.current.currentTime = 0;
      audioClickRef.current.play();
    }

    setIsAnimating(true);
    handleToggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
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
        style={{ width: "150%", height: "150%", position: "relative", left: "500px" }}
      >
        <defs>
          <marker id="a" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <clipPath id="g" clipPathUnits="userSpaceOnUse">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
          </clipPath>
        </defs>

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

const PrivatePage = ({ onShowBlogs, blogs }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [user, setUser] = useState(null);
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login", { replace: true });
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const closeNavHandler = () => {
    if (window.innerWidth < 880) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("authToken");
      localStorage.removeItem("keepLoggedIn");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 420);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);


  const styles = {

    navLinks: {
      gap: isMobile ? undefined : "2rem",
      position: isMobile ? undefined : "relative",
      left: isMobile ? undefined : "325px",
    },

    logoutButton: {
      width: isMobile ? "160px" : undefined,
      color: "#fff",
      background: "#b19cd9",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: isMobile ? undefined : "0.9rem",
      marginLeft: "auto",
      position: "relative",
      left: isMobile ? "-100px" : "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: isMobile ? undefined : "35px",
      transition: "background-color 0.3s ease",
      ":hover": {
        backgroundColor: "#b19cd9",
      },
    },

    lightBulb: {
      display: 'flex',
      justifyContent: 'center',
      margin: '5px 0',
      position: "relative",
      right: isMobile ? "390px" : "90px",
    }

  }


  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        Verifying credentials...
      </div>
    );
  }

  return (
    <div>
      <Outlet />
      <header>
        <nav>
          <div className="container nav__container">
            <Link to="/privatepage" className="nav__logo" onClick={closeNavHandler}>
              <img src={Logo} alt="Navbar Logo" />
            </Link>

            <div
              style={styles.lightBulb} id='lightbulb'
            >
              <LightBulbToggle theme={theme} handleToggleTheme={handleToggleTheme} />
            </div>

            {isNavShowing && (
              <ul className="nav__menu" style={styles.navLinks}>
                <li className="nav-hover">
                  <Link to="/privatepage" onClick={closeNavHandler}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-hover">
                  <Link to="/category" onClick={closeNavHandler}>
                    Categories
                  </Link>
                </li>
                <li
                  id="logout-button"
                  onClick={handleLogout}
                  style={styles.logoutButton}
                >
                  Logout
                </li>
              </ul>
            )}

            <button
              className="nav__toggle-btn"
              onClick={() => setIsNavShowing(!isNavShowing)}
            >
              {isNavShowing ? <AiOutlineClose /> : <FaBars />}
            </button>
          </div>
        </nav>
      </header>
      <style jsx>{`
    @media (max-width: 320px) {
      #lightbulb {
        position: relative !important;
        right: 410px !important;
      }

      #logout-button {
        position: relative;
        left: -190px !important;
      }
    }
  `}</style>
      <Hero />
      <Posts />
      <Categories />
    </div>
  );
};




export default PrivatePage;