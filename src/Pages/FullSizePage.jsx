import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Components/Firebase';
import PostAuthor from '../Components/PostAuthor';
import Logo from "../Images/logo.png";
import { auth } from "../Components/Firebase";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";



gsap.registerPlugin(MorphSVGPlugin, Draggable);

// Enhanced Light Bulb Toggle Component with GSAP
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

        // Reset animation state after a short delay
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
}

const FullSizePage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);


    const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);
    const navMenuRef = useRef(null);
    const navToggleRef = useRef(null);



    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 430);
            // Auto-close nav on mobile when resizing
            if (width <= 800) {
                setIsNavShowing(false);
            } else {
                setIsNavShowing(true);
            }
        };

        // Set initial values
        handleResize();

        // Add event listener with debounce
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isNavShowing &&
                navMenuRef.current &&
                !navMenuRef.current.contains(event.target) &&
                navToggleRef.current &&
                !navToggleRef.current.contains(event.target)
            ) {
                setIsNavShowing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNavShowing]);


    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });



    useEffect(() => {
        document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
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

    const closeNavHandler = () => {
        if (window.innerWidth < 880) {
            setIsNavShowing(false);
        } else {
            setIsNavShowing(true);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {

                if (!postId) {
                    console.error("Post ID is undefined");
                    return;
                }

                const docRef = doc(db, "posts", postId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [postId]);

    if (!post) return <div>Loading...</div>;





    const styles = {

        navLinks: {
            gap: isMobile ? undefined : "2rem",
            position: isMobile ? undefined : "relative",
            left: isMobile ? "-45px" : "-35px",
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
            left: isMobile ? "-25px" : "5px",
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

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <div>
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



            <motion.section variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible" className="post-detail">
                <style>{`
    @media (max-width: 600px) {
      .post-detail {
        background: #121212;
        width: 450px;
        padding: 2rem;
        margin-bottom: -70px;
      }
    }

     @media (max-width: 430px) {

      #post-bottom {
      margin-top: 1.5rem !important;
      }

      .post-detail {
        width: 350px;
        padding: 1rem;
        margin-bottom: 50px;
      }
      
      .post-content-container {
        height: 300px;
      }
    }
    
    .post-content-container {
      position: relative;
      height: 500px;
      text-align: justify;
      overflow-y: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .post-content-container::-webkit-scrollbar {
      display: none;
    }
  `}</style>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    id="post-bottom"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                    }}
                >
                    <PostAuthor />
                    <div>
                        <span style={{
                            background: '#b19cd9',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                        }}>
                            {post.category}
                        </span>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    style={{ color: '#aaa', marginBottom: '1rem' }}
                >
                    Published: {post.published_date}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    style={{ marginBottom: '1rem' }}
                >
                    {post.title}
                </motion.h1>

                {post.image && (
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                        src={post.image}
                        alt="Post"
                        style={{
                            width: '100%',
                            height: '420px',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}
                    />
                )}

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="post-content-container"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                />
            </motion.section>
        </div>

    );
};

export default FullSizePage;