import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import Category1 from "../Images/avatar1.jpg";
import Category2 from "../Images/avatar2.jpg";
import Category3 from "../Images/avatar3.jpg";
import Category4 from "../Images/avatar4.jpg";
import Category5 from "../Images/avatar5.jpg";
import Category6 from "../Images/avatar5.jpg";
import Logo from "../Images/logo.png";
import { auth } from "../Components/Firebase";
import { db } from '../Components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import PostAuthor from "../Components/PostAuthor";
import Container from 'react-bootstrap/Container';
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(MorphSVGPlugin, Draggable);

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      flexDirection: 'column'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #b19cd9',
          borderRadius: '50%',
          marginBottom: '1rem'
        }}
      />
      <p>Loading content...</p>
    </div>
  );
};

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

// Memoized Post Item Component
const PostItem = React.memo(({ post, onClick }) => {
  const shortDescription = useMemo(() => {
    const text = post.description.replace(/<p>|<\/p>|<br\s*\/?>/g, '');
    return text.length > 150 ? text.substr(0, 150) + "..." : text;
  }, [post.description]);

  const postTitle = useMemo(() =>
    post.title.length > 26 ? post.title.substr(0, 26) + "..." : post.title,
    [post.title]
  );

  return (
    <motion.div
      className="post"
      onClick={() => onClick(post)}
      style={{ cursor: 'pointer' }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="post__thumbnail">
        <img
          src={post.image}
          className="card-img-top"
          alt={post.image}
          loading="lazy"
        />
      </div>
      <div className="post__content">
        <h3
          className="custom-tooltip"
          data-tooltip={post.title}
          style={{ cursor: "pointer" }}
        >
          {postTitle}
        </h3>
        <p>{shortDescription}</p>
        <div className="post__footer">
          <div className="post__author">
            <PostAuthor />
          </div>
          <div className="post__date">
            <p>Published: {post.published_date}</p>
          </div>
          <div className="btn category">{post.category}</div>
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Category Item Component
const CategoryItem = React.memo(({ category, isActive, onClick, count }) => {
  return (
    <motion.div
      className={`Category ${isActive ? 'active' : ''}`}
      onClick={() => onClick(category.name)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
    >
      <div className="category__info">
        <h4 style={{ fontSize: '0.9rem' }}>{category.name}</h4>
        <p>Posts: {count}</p>
      </div>
    </motion.div>
  );
});

const Categories = () => {
  const categoryData = useMemo(() => [
    {
      id: 1,
      avatar: Category1,
      name: "All Posts",
      button: <button key={1}>All Posts</button>
    },
    {
      id: 2,
      avatar: Category2,
      name: "Information",
      button: <button key={2} className="category-button">Information</button>
    },
    {
      id: 3,
      avatar: Category3,
      name: "Gadget",
      button: <button key={3} className="category-button">Gadget</button>
    },
    {
      id: 4,
      avatar: Category4,
      name: "Health",
      button: <button key={4} className="category-button">Health</button>
    },
    {
      id: 5,
      avatar: Category5,
      name: "Wealth",
      button: <button key={5} className="category-button">Wealth</button>
    },
    {
      id: 6,
      avatar: Category6,
      name: "Uncategorized",
      button: <button key={6} className="category-button">Uncategorized</button>
    },
  ], []);

  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [postLists, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 420);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Apply theme
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch posts with real-time updates
  useEffect(() => {
    const postCollectionRef = collection(db, "posts");

    // Use onSnapshot for real-time updates instead of getDocs
    const unsubscribe = onSnapshot(postCollectionRef, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostList(posts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = { "All Posts": postLists.length };
    postLists.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [postLists]);

  // Filter posts based on active category
  const postsToDisplay = useMemo(() => {
    return activeCategory === "All Posts"
      ? postLists
      : postLists.filter((post) => post.category === activeCategory);
  }, [postLists, activeCategory]);

  // Event handlers
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handlePostClick = useCallback((post) => {
    navigate(`/full-size-page/${post.id}`);
  }, [navigate]);

  const filterItems = useCallback((categoryName) => {
    setActiveCategory(categoryName);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("authToken");
      localStorage.removeItem("keepLoggedIn");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  const closeNavHandler = useCallback(() => {
    if (window.innerWidth < 880) {
      setIsNavShowing(false);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // Styles
  const styles = useMemo(() => ({
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
    },
    lightBulb: {
      display: 'flex',
      justifyContent: 'center',
      margin: '5px 0',
      position: "relative",
      right: isMobile ? "390px" : "90px",
    },
    postContainer: {
      padding: "50px 0 0 30px",
    },
  }), [isMobile]);

  return (
    <div>
      <Outlet />
      <header>
        <nav>
          <div className="container nav__container">
            <Link to="/privatepage" className="nav__logo" onClick={closeNavHandler}>
              <img src={Logo} alt="Navbar Logo" />
            </Link>

            <div style={styles.lightBulb} id='lightbulb'>
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

      {/* Categories Section */}
      <section className="categories">
        <style>
          {`
            .categories__container {
              display: flex;
              gap: 20px;
              place-content: center;
            }

            .Category {
              background: #121212;
              padding: 1rem;
              border-radius: var(--radius-3);
              display: inline-block;
              width: 120px;
              height: 40px;
              gap: 1rem;
              transition: all 0.3s ease;
              cursor: pointer;
            }
              
            .Category.active {
              background: #b19cd9;
            }

            .Category:hover {
              box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.07);
              transform: translateY(-0.3rem);
            }

            .category__avatar {
              width: 5rem;
              min-width: 5rem;
              aspect-ratio: 1/1;
              border-radius: 50%;
              border: 0.2rem solid var(--color-bg);
              overflow: hidden;
            }

            .category__avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .category__info {
              display: flex;
              flex-direction: column;
              justify-content: center;
              white-space: nowrap; 
              position: relative;
              right: 10px;
              bottom: 10px;
            }

            .category__info p {
              margin-top: 0.5rem;
              font-size: 0.5rem;
              position: relative;
              bottom: 5px;
            }

            /* Posts styling */
            .posts__container {
              display: grid;
               grid-template-columns: repeat(3 , 2fr);
               gap: 3rem;
             }

            .post {
              background: #121212;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
              padding: 1rem;
              border-radius: var(--radius-4); /*2rem*/
              padding-bottom: 2rem;
              transition: var(--transition); /*all 300ms ease*/
              cursor: default;
            }

            .post:hover {
              transform: translateY(-0.3rem);
            }

            .post__thumbnail img {
              width: 100%;
              height: 200px;
              object-fit: cover;
            }

            .post__content {
            margin-top: 1.5rem;
            }

            .btn.category {
              background: #b19cd9;
              color: white;
              padding: 0.3rem 0.6rem;
              border-radius: 0.3rem;
              font-size: 0.8rem;
            }

            .post__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  position: relative;
}

.post__author {
  width: 150px;
  margin-bottom: 0.2rem;
}

.post__date p {
  font-size: 0.7rem;
  color: #aaa;
  position: absolute;
  top: 40px;  
  right: 140px;
}

.post__category {
  display: flex;
  align-items: center;
  justify-content: center;8 
  padding: 0.4rem 0.8rem;
  background-color: #eee; /* optional styling */
  border-radius: 5px;
  font-size: 0.8rem;
}


.custom-tooltip {
  position: relative;
}

.custom-tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

/* YourComponent.module.css */
@media (max-width: 420px) {
  .categories__container {
    display: grid;
  grid-template-columns: repeat(3, 1fr);
  }

  .posts__section {
  width: 100%;
  max-width: 450px;
  margin-top: -20px;
  }

  .posts__container > * {
  width: 130px;
  border-radius: 10px;
  position: relative;
  right: 10px;
  padding: 10px 10px;
  margin: 5px;
  }

  .posts__container {
  gap: 1px;
  }

  .post__thumbnail {
  height: 100px;
  }

  .post__thumbnail img {
  width: 200px;
  height: 100px;
  object-fit: cover;
  }

  .post {
  height: auto !important;
  }

  .post__content {
  margin-top: 0px;
  }

  .post__content h3 {
  font-size: 13px;
  }

  .post__content p {
  display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Height control */
    height: 2.8em; /* 2 lines * 1.4em line-height */
    line-height: 1.4em;
    
    /* Typography */
    font-size: 10px;
    margin: 5px 0;
    padding: 0;
  }


    .btn.category {

    position: relative;
    bottom: 10px;
    /* Size reduction */
    padding: 2px 6px;
    font-size: 8px;
    
    /* Layout adjustments */
    min-width: 40px;
    max-width: 60px;
    height: 10px;
    line-height: 1;
    
    /* Text control */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Visual styling */
    border-radius: 3px;
    margin: 2px 0;
  }

  .custom-tooltip:hover::after {
  font-size: 10px;
  
  }

  footer {
  margin-top: auto;
  }
}

          `}
        </style>

        {/* Categories Grid */}
        <motion.div
          className="container categories__container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categoryData.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={activeCategory === category.name}
              onClick={filterItems}
              count={categoryCounts[category.name] || 0}
            />
          ))}
        </motion.div>

        {/* Posts Section */}
        <Container>
          <motion.div
            className="posts__section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingSpinner />
                </motion.div>
              ) : (
                <motion.article
                  className="posts__container"
                  style={styles.postContainer}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key="posts-content"
                >
                  {postsToDisplay.map((post) => (
                    <PostItem
                      key={post.id}
                      post={post}
                      onClick={handlePostClick}
                    />
                  ))}
                </motion.article>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>
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
    </div>
  );
};

export default Categories;